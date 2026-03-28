/**
 * Security utilities for API routes.
 * - Guards against missing API key at startup
 * - In-memory rate limiter (per IP, sliding window)
 * - Sanitized error responses (never leak key or internals)
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

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000;   // 1 minute window
const MAX_REQUESTS = 10;    // 10 requests per minute per IP

/** Returns true if the request should be blocked. */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

/** Extract IP from Next.js request headers. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ─── Error sanitizer ──────────────────────────────────────────────────────────

const SENSITIVE_PATTERNS = [
  /gsk_[a-zA-Z0-9]+/g,
  /AIza[a-zA-Z0-9_-]+/g,
  /sk-ant-[a-zA-Z0-9-]+/g,
  /sk-[a-zA-Z0-9]+/g,
  /"apiKey"\s*:\s*"[^"]+"/g,
];

/** Strip any API keys or sensitive tokens from error messages before sending to client. */
export function sanitizeError(err: unknown): string {
  let message =
    err instanceof Error ? err.message : "An unexpected error occurred.";

  for (const pattern of SENSITIVE_PATTERNS) {
    message = message.replace(pattern, "[REDACTED]");
  }

  if (
    message.includes("fetch failed") ||
    message.includes("ECONNREFUSED") ||
    message.includes("socket hang up")
  ) {
    return "AI service temporarily unavailable. Please try again in a moment.";
  }

  return message;
}
