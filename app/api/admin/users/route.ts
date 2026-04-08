/**
 * GET /api/admin/users
 *
 * Returns a paginated list of all users and their subscription plans.
 * Restricted to admin role — enforced at both the middleware layer (middleware.ts)
 * and here as defense-in-depth.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/roles";
import { getAllUserPlans } from "@/lib/db";
import { isAdminRateLimited, isCrossOriginBlocked, getClientIp, logError, sanitizeError } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Block cross-origin requests — admin API should never be called from external origins
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (await isAdminRateLimited(ip)) {
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

    // Clamp to prevent accidental bulk exports
    const limit = Math.min(Math.max(limitParam, 1), 100);
    const offset = Math.max(offsetParam, 0);

    const users = await getAllUserPlans(limit, offset);
    return NextResponse.json({ users, limit, offset });
  } catch (err) {
    logError("admin/users", err);
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}
