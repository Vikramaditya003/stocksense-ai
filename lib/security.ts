/**
 * Security utilities for API routes.
 * - Guards against missing API keys at startup
 * - Rate limiter: Upstash Redis in production (shared across all serverless instances),
 *   in-memory Maps as fallback for development / single-instance deployments.
 *   Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable distributed limiting.
 * - Sanitized error responses and logs (never leak keys, paths, or stack traces)
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── CORS enforcement ─────────────────────────────────────────────────────────
//
// All API routes are BFF (backend-for-frontend) — they are NOT a public API
// and should only be called from the app's own origin. Cross-origin requests
// from unknown origins are rejected with 403 before any processing.
//
// ALLOWED_ORIGINS: add your production domain and any preview domains.
// In development, localhost is allowed. Origin header is absent for same-origin
// requests (browser doesn't send it) so absent origin is treated as allowed.

const ALLOWED_ORIGINS = new Set([
  "https://getforestock.com",
  "https://www.getforestock.com",
  "https://forestock.app",
  "https://www.forestock.app",
  // Vercel preview deployments
  ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : []),
]);

/**
 * Returns true if the request Origin is from an unknown external domain.
 * Same-origin requests (no Origin header) are always allowed.
 * Localhost is allowed in development.
 */
export function isCrossOriginBlocked(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false; // same-origin request — no Origin header sent by browser

  // Allow localhost in development
  if (
    process.env.NODE_ENV === "development" &&
    (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))
  ) {
    return false;
  }

  // Allow Vercel preview deployments (*.vercel.app)
  if (origin.endsWith(".vercel.app")) return false;

  return !ALLOWED_ORIGINS.has(origin);
}

// ─── API key guard ────────────────────────────────────────────────────────────

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "" || value === `your_${name.toLowerCase()}_here`) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Add it to your .env.local file and restart the server.`
    );
  }
  return value.trim();
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────
//
// Production (Upstash Redis): limits are enforced across ALL serverless instances.
// Development / fallback (in-memory Maps): limits are per-process only — they reset
// on cold starts and are NOT shared across concurrent instances. Do not rely on the
// in-memory fallback as the sole protection in a multi-instance production deployment.

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory fallback stores (used when Upstash is not configured)
const forecastStore = new Map<string, RateLimitEntry>();
const strictStore   = new Map<string, RateLimitEntry>();
const historyStore  = new Map<string, RateLimitEntry>();
const userStore     = new Map<string, RateLimitEntry>();

function checkLimitSync(
  store: Map<string, RateLimitEntry>,
  key: string,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= max) return true;
  entry.count++;
  return false;
}

// Upstash Redis limiters — lazily initialized, null when env vars are absent
type UpstashLimiters = {
  forecast: Ratelimit; // 10 req/min per IP
  strict:   Ratelimit; // 5 req/min per IP  (payment, alert)
  history:  Ratelimit; // 30 req/min per IP (read endpoints)
  user:     Ratelimit; // 20 req/hour per userId
  admin:    Ratelimit; // 30 req/min per IP (admin endpoints)
};

let _upstash: UpstashLimiters | null = null;
let _upstashChecked = false;

function getUpstash(): UpstashLimiters | null {
  if (_upstashChecked) return _upstash;
  _upstashChecked = true;

  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const redis = new Redis({ url, token });
    _upstash = {
      forecast: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "@forestock/forecast" }),
      strict:   new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,  "1 m"), prefix: "@forestock/strict" }),
      history:  new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "@forestock/history" }),
      user:     new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h"), prefix: "@forestock/user" }),
      admin:    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "@forestock/admin" }),
    };
    return _upstash;
  } catch {
    return null;
  }
}

/** Forecast endpoint: 10 requests per minute per IP */
export async function isRateLimited(ip: string): Promise<boolean> {
  const upstash = getUpstash();
  if (upstash) {
    const { success } = await upstash.forecast.limit(ip);
    return !success;
  }
  return checkLimitSync(forecastStore, ip, 10, 60_000);
}

/** Payment/alert endpoints: 5 requests per minute per IP — stricter */
export async function isStrictRateLimited(ip: string): Promise<boolean> {
  const upstash = getUpstash();
  if (upstash) {
    const { success } = await upstash.strict.limit(ip);
    return !success;
  }
  return checkLimitSync(strictStore, ip, 5, 60_000);
}

/** Forecast history endpoints: 30 requests per minute per IP */
export async function isHistoryRateLimited(ip: string): Promise<boolean> {
  const upstash = getUpstash();
  if (upstash) {
    const { success } = await upstash.history.limit(ip);
    return !success;
  }
  return checkLimitSync(historyStore, ip, 30, 60_000);
}

/** Admin endpoints: 30 requests per minute per IP */
export async function isAdminRateLimited(ip: string): Promise<boolean> {
  const upstash = getUpstash();
  if (upstash) {
    const { success } = await upstash.admin.limit(ip);
    return !success;
  }
  return checkLimitSync(strictStore, `admin:${ip}`, 30, 60_000);
}

/** Per-user rate limit: 20 forecasts per hour */
export async function isUserRateLimited(userId: string): Promise<boolean> {
  const upstash = getUpstash();
  if (upstash) {
    const { success } = await upstash.user.limit(userId);
    return !success;
  }
  return checkLimitSync(userStore, `user:${userId}`, 20, 3_600_000);
}

/**
 * Extract real client IP from Next.js request headers.
 *
 * Security note: x-forwarded-for is a comma-separated list where the LEFTMOST
 * entry is set by the client (easily spoofed). On Vercel, x-real-ip is set by
 * the edge and cannot be forged by the client — prefer it.
 * Fallback: use the RIGHTMOST x-forwarded-for entry (added by our proxy, not the client).
 */
export function getClientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    return parts[parts.length - 1].trim();
  }

  return "unknown";
}

// ─── Error sanitizer ──────────────────────────────────────────────────────────

const SENSITIVE_PATTERNS: RegExp[] = [
  // API keys
  /gsk_[a-zA-Z0-9]+/g,
  /AIza[a-zA-Z0-9_-]+/g,
  /sk-ant-[a-zA-Z0-9-]+/g,
  /sk-[a-zA-Z0-9]+/g,
  /re_[a-zA-Z0-9]+/g,
  /rzp_(test|live)_[a-zA-Z0-9]+/g,
  // JSON key-value pairs with sensitive names
  /"(apiKey|api_key|secret|password|token|key)"\s*:\s*"[^"]+"/gi,
  // Supabase / postgres connection strings
  /postgresql:\/\/[^\s"']+/gi,
  /https:\/\/[a-z0-9]+\.supabase\.co[^\s"']*/gi,
  // File paths (expose server directory structure)
  /(?:\/[a-zA-Z0-9._-]+){3,}/g,
  /[A-Za-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)+/g,
];

/** Strip any sensitive tokens, paths, or keys from error messages before sending to client. */
export function sanitizeError(err: unknown): string {
  let message =
    err instanceof Error ? err.message : "An unexpected error occurred.";

  for (const pattern of SENSITIVE_PATTERNS) {
    message = message.replace(pattern, "[REDACTED]");
  }

  if (
    message.includes("fetch failed") ||
    message.includes("ECONNREFUSED") ||
    message.includes("socket hang up") ||
    message.includes("ETIMEDOUT") ||
    message.includes("getaddrinfo")
  ) {
    return "Service temporarily unavailable. Please try again in a moment.";
  }

  return message;
}

/**
 * Safe server-side logger — never logs stack traces or sensitive data in production.
 * In development, logs the full error for easier debugging.
 */
export function logError(context: string, err: unknown): void {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    console.error(`[${context}]`, err);
  } else {
    const safe = sanitizeError(err);
    console.error(`[${context}] ${safe}`);
  }
}

/** Safe warning logger */
export function logWarn(context: string, message: string): void {
  const safe = message.replace(/[\r\n]/g, " ").substring(0, 200);
  console.warn(`[${context}] ${safe}`);
}
