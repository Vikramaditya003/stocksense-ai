/**
 * Security utilities for API routes.
 * - Guards against missing API key at startup
 * - In-memory rate limiter (per IP, sliding window)
 * - Sanitized error responses and logs (never leak keys, paths, or stack traces)
 */

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

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Separate stores so payment and forecast limits don't share state
const forecastStore = new Map<string, RateLimitEntry>();
const strictStore = new Map<string, RateLimitEntry>();
const historyStore = new Map<string, RateLimitEntry>();

function checkLimit(store: Map<string, RateLimitEntry>, key: string, max: number, windowMs: number): boolean {
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

/** Forecast endpoint: 10 requests per minute per IP */
export function isRateLimited(ip: string): boolean {
  return checkLimit(forecastStore, ip, 10, 60_000);
}

/** Payment/alert endpoints: 5 requests per minute per IP — stricter */
export function isStrictRateLimited(ip: string): boolean {
  return checkLimit(strictStore, ip, 5, 60_000);
}

/** Forecast history endpoints: 30 requests per minute per IP */
export function isHistoryRateLimited(ip: string): boolean {
  return checkLimit(historyStore, ip, 30, 60_000);
}

/** Per-user rate limit (use userId as key): 20 forecasts per hour */
export function isUserRateLimited(userId: string): boolean {
  return checkLimit(forecastStore, `user:${userId}`, 20, 3_600_000);
}

/**
 * Extract real client IP from Next.js request headers.
 *
 * Security note: x-forwarded-for is a comma-separated list where the LEFTMOST
 * entry is set by the client (easily spoofed). On Vercel, x-real-ip is set by
 * the edge and cannot be forged by the client — prefer it.
 * Fallback: use the RIGHTMOST x-forwarded-for entry (added by our proxy, not client).
 */
export function getClientIp(req: Request): string {
  // x-real-ip is set by Vercel's edge infrastructure — unmodifiable by client
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Rightmost x-forwarded-for entry is added by the last trusted proxy, not the client
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
    // Full error in dev — useful for debugging
    console.error(`[${context}]`, err);
  } else {
    // Production: only log a sanitized one-liner, never the stack
    const safe = sanitizeError(err);
    console.error(`[${context}] ${safe}`);
  }
}

/** Safe warning logger */
export function logWarn(context: string, message: string): void {
  // Sanitize in case message contains user-supplied data with injection chars
  const safe = message.replace(/[\r\n]/g, " ").substring(0, 200);
  console.warn(`[${context}] ${safe}`);
}
