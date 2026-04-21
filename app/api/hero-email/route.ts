import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { isStrictRateLimited, isCrossOriginBlocked, getClientIp, sanitizeError, logError } from "@/lib/security";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;
const NOTIFY_RECIPIENT = process.env.HERO_EMAIL_RECIPIENT ?? "support@getforestock.com";

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 320);

    // Reject obvious garbage — requires local@domain.tld format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email." }, { status: 400 });
    }

    // Notify us about the lead
    if (resendReady) {
      const resend = new Resend(resendKey);

      // Send welcome/forecast email to the user
      await resend.emails.send({
        from: "Forestock <support@getforestock.com>",
        to: email,
        subject: "Your Forestock forecast + stockout alerts",
        text: [
          "Hi there,",
          "",
          "Thanks for trying Forestock's instant calculator.",
          "",
          "To run a full forecast on your Shopify store's data:",
          "1. Export your Orders or Inventory CSV from Shopify Admin",
          "2. Upload it at https://getforestock.com/forecast",
          "3. Get exact stockout dates, reorder quantities, and revenue at risk in 30 seconds",
          "",
          "No install required. No credit card needed.",
          "",
          "— The Forestock team",
          "",
          "Unsubscribe: reply to this email with 'unsubscribe'",
        ].join("\n"),
      });

      // Notify ourselves about the new lead
      await resend.emails.send({
        from: "Forestock Leads <support@getforestock.com>",
        to: NOTIFY_RECIPIENT,
        subject: `[Lead] Hero email capture: ${email}`,
        text: `New hero widget email capture.\n\nEmail: ${email}\nIP: ${ip}\nTimestamp: ${new Date().toISOString()}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("hero-email/send", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
