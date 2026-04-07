/**
 * GET /api/admin/forecasts
 *
 * Returns a paginated list of all forecast records across all users.
 * Useful for monitoring usage, debugging, and abuse detection.
 * Restricted to admin role — enforced at both middleware and route layers.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/roles";
import { getAllForecasts } from "@/lib/db";
import { isStrictRateLimited, getClientIp, logError, sanitizeError } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  // Role check — returns 401 if unauthenticated, 403 if not admin
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const url = new URL(req.url);
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "50", 10);
    const offsetRaw = parseInt(url.searchParams.get("offset") ?? "0", 10);

    // Guard NaN before clamping — parseInt("abc") returns NaN, and Math.max(NaN, 1) === NaN (not 1)
    const limitParam = isNaN(limitRaw) ? 50 : limitRaw;
    const offsetParam = isNaN(offsetRaw) ? 0 : offsetRaw;

    const limit = Math.min(Math.max(limitParam, 1), 100);
    const offset = Math.max(offsetParam, 0);

    const forecasts = await getAllForecasts(limit, offset);
    return NextResponse.json({ forecasts, limit, offset });
  } catch (err) {
    logError("admin/forecasts", err);
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}
