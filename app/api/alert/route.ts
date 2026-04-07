import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isStrictRateLimited, getClientIp, sanitizeError, logError } from "@/lib/security";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;

// Basic email regex — not RFC-complete but catches obvious garbage
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  // Rate limit — 3 alert signups per minute per IP
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  // Auth check — must be signed in to set up alerts
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Sign in to set up alerts." }, { status: 401 });
  }

  // Resolve destination from Clerk — never trust a client-supplied email address.
  // Using the request body email would let any authenticated user send Forestock-branded
  // emails to arbitrary inboxes (abuse / phishing surface).
  const clerkUser = await currentUser();
  const primaryEmailId = clerkUser?.primaryEmailAddressId;
  const email = clerkUser?.emailAddresses
    .find((e) => e.id === primaryEmailId)
    ?.emailAddress ?? "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ success: false, error: "No verified email on your account." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const analysis = body.analysis;

    // Always acknowledge — even if Resend isn't configured yet
    if (!resendReady) {
      console.log(`[Alert signup] userId=${userId} email=${email} — Resend not configured.`);
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendKey);

    // Whitelist only the fields we need — never forward raw user data to email template
    const urgent = (Array.isArray(analysis?.products) ? analysis.products : [])
      .filter((p: { stockoutRisk: string }) => p.stockoutRisk === "critical" || p.stockoutRisk === "high")
      .slice(0, 5)
      .map((p: { productName: unknown; daysOfStockRemaining: unknown; estimatedRevenueLoss?: unknown }) => ({
        name: String(p.productName ?? "").slice(0, 100),
        days: Number(p.daysOfStockRemaining ?? 0),
        loss: typeof p.estimatedRevenueLoss === "string" ? p.estimatedRevenueLoss.slice(0, 30) : null,
      }));

    const productRows = urgent.length
      ? urgent.map((p: { name: string; days: number; loss: string | null }) =>
          `• ${p.name} — stockout in ${p.days} days${p.loss ? ` · ${p.loss} at risk` : ""}`
        ).join("\n")
      : "• No critical items detected";

    await resend.emails.send({
      from: "Forestock <alerts@forestock.app>",
      to: email,
      subject: `⚠ ${urgent.length} product${urgent.length !== 1 ? "s" : ""} at risk — Forestock`,
      text: `Hi there,

Your latest Forestock forecast shows ${urgent.length} product${urgent.length !== 1 ? "s" : ""} at risk of stocking out.

AT-RISK PRODUCTS:
${productRows}

Log in to Forestock to see full reorder quantities, exact stockout dates, and download your purchase order.

→ https://forestock.app/forecast

You're receiving this because you signed up for Forestock stockout alerts.
To unsubscribe, reply STOP.

— Forestock Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("alert/email", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
