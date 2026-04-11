/**
 * POST /api/admin/launch-pro
 *
 * One-shot endpoint to email all Pro waitlist users when Pro launches.
 * Call it once from your terminal:
 *   curl -X POST https://getforestock.com/api/admin/launch-pro \
 *     -H "Cookie: <your-admin-session-cookie>"
 *
 * Admin-only — protected by requireAdmin().
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/roles";
import { getAllWaitlist } from "@/lib/db";
import { isAdminRateLimited, isCrossOriginBlocked, getClientIp, logError, sanitizeError } from "@/lib/security";

export const dynamic = "force-dynamic";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

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

  if (!resendReady) {
    return NextResponse.json({ error: "Resend not configured." }, { status: 503 });
  }

  try {
    const waitlist = await getAllWaitlist();
    if (waitlist.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "Waitlist is empty." });
    }

    const resend = new Resend(resendKey);
    let sent = 0;
    const errors: string[] = [];

    for (const user of waitlist) {
      try {
        await resend.emails.send({
          from: "Forestock <support@getforestock.com>",
          to: user.email,
          subject: "Forestock Pro is live — your early-bird discount inside",
          text: `Hi,

You asked us to notify you when Forestock Pro launched — it's here.

Forestock Pro gives you:
• Unlimited products (no 5-SKU cap)
• 60 & 90-day demand forecasts
• AI ad-spend correlation
• Smart reorder quantities
• Supplier lead time alerts
• 1-click purchase orders
• Priority email support

Early-bird price: $9/month (approx ₹749/mo)

→ Get Pro now: ${SITE_URL}/#pricing

Thank you for being an early supporter.

— Forestock Team
support@getforestock.com`,
        });
        sent++;
      } catch (e) {
        errors.push(`${user.email}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }

    return NextResponse.json({ success: true, sent, total: waitlist.length, errors });
  } catch (err) {
    logError("admin/launch-pro", err);
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}
