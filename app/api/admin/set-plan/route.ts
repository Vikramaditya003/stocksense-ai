import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/roles";
import { updateUserPlan } from "@/lib/db";
import { isCrossOriginBlocked, getClientIp, isAdminRateLimited, logError } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (await isAdminRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const denied = await requireAdmin();
  if (denied) return denied;

  const { clerk_user_id, plan } = await req.json();
  if (!clerk_user_id || !plan) {
    return NextResponse.json({ error: "clerk_user_id and plan required." }, { status: 400 });
  }

  try {
    await updateUserPlan(clerk_user_id, plan, "manual-admin");
    return NextResponse.json({ success: true, clerk_user_id, plan });
  } catch (err) {
    logError("admin/set-plan", err);
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
