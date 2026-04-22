/**
 * Structured logger for production observability.
 *
 * Outputs newline-delimited JSON (NDJSON) so Vercel Log Drains, Datadog,
 * Logtail, and any log aggregator can parse it without configuration.
 *
 * In development, emits a readable prefix instead of raw JSON.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.warn("rate_limit.ip", "Forecast rate limit hit", { ip, path: "/api/forecast" });
 */

export type LogLevel = "info" | "warn" | "error";

export type LogEvent =
  // Auth & access
  | "auth.unauthorized"
  | "auth.forbidden"
  | "auth.rate_limited"
  // Rate limiting
  | "rate_limit.ip"
  | "rate_limit.user"
  | "rate_limit.admin"
  | "rate_limit.strict"
  // CORS
  | "cors.blocked"
  // Payment
  | "payment.created"
  | "payment.verified"
  | "payment.failed"
  | "payment.signature_invalid"
  | "payment.invalid_input"
  // Forecast
  | "forecast.created"
  | "forecast.failed"
  | "forecast.invalid_input"
  // Alert emails
  | "alert.sent"
  | "alert.failed"
  // Database
  | "db.error"
  // Suspicious / anomalous
  | "suspicious.traffic"
  | "suspicious.payload"
  | "suspicious.input"
  // Webhooks
  | "webhook.dodo"
  | "webhook.dodo.invalid_sig"
  | "webhook.dodo.no_user"
  | "webhook.dodo.activated"
  // Generic
  | "api.error"
  | "api.info";

export interface LogEntry {
  ts: string;                            // ISO-8601 timestamp
  level: LogLevel;
  event: LogEvent;
  msg: string;
  ip?: string;                           // Client IP (from x-real-ip / XFF)
  userId?: string;                       // Clerk user ID if authenticated
  path?: string;                         // Request path
  durationMs?: number;                   // Request duration
  statusCode?: number;
  meta?: Record<string, unknown>;        // Any extra structured fields
}

const IS_DEV = process.env.NODE_ENV === "development";

function emit(entry: LogEntry): void {
  const line = IS_DEV
    ? `[${entry.level.toUpperCase()}] [${entry.event}] ${entry.msg}${entry.meta ? " " + JSON.stringify(entry.meta) : ""}`
    : JSON.stringify(entry);

  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn")  console.warn(line);
  else                               console.log(line);
}

type LogCtx = Partial<Omit<LogEntry, "ts" | "level" | "event" | "msg">>;

export const logger = {
  info(event: LogEvent, msg: string, ctx?: LogCtx) {
    emit({ ts: new Date().toISOString(), level: "info", event, msg, ...ctx });
  },
  warn(event: LogEvent, msg: string, ctx?: LogCtx) {
    emit({ ts: new Date().toISOString(), level: "warn", event, msg, ...ctx });
  },
  error(event: LogEvent, msg: string, ctx?: LogCtx) {
    emit({ ts: new Date().toISOString(), level: "error", event, msg, ...ctx });
  },
};
