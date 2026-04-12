import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { addToWaitlist } from "@/lib/db";
import { isStrictRateLimited, getClientIp, sanitizeError, logError } from "@/lib/security";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;
const NOTIFY_RECIPIENT = process.env.HERO_EMAIL_RECIPIENT ?? "support@getforestock.com";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Sign in to join the waitlist." }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const primaryEmailId = clerkUser?.primaryEmailAddressId;
  const email =
    clerkUser?.emailAddresses.find((e) => e.id === primaryEmailId)?.emailAddress ?? "";

  if (!email) {
    return NextResponse.json({ success: false, error: "No email on your account." }, { status: 400 });
  }

  try {
    await addToWaitlist(userId, email);

    if (resendReady) {
      const resend = new Resend(resendKey);
      const ip = getClientIp(req);

      await resend.emails.send({
        from: "Forestock <support@getforestock.com>",
        to: email,
        subject: "You're on the Forestock Pro waitlist",
        text: [
          "Hi there,",
          "",
          "You're officially on the Forestock Pro early-access waitlist.",
          "",
          "As an early-access member you'll get:",
          "  • First access when Pro launches on the Shopify App Store",
          "  • Locked-in early-bird pricing — before it raises at launch",
          "  • Priority onboarding support",
          "",
          "We'll email you the moment the launch goes live.",
          "",
          "In the meantime, you can run unlimited free forecasts at:",
          "https://getforestock.com/forecast",
          "",
          "— The Forestock team",
          "",
          "Unsubscribe: reply to this email with 'unsubscribe'",
        ].join("\n"),
      });

      await resend.emails.send({
        from: "Forestock Waitlist <support@getforestock.com>",
        to: NOTIFY_RECIPIENT,
        subject: `[Waitlist] Pro signup: ${email}`,
        text: `New Pro waitlist signup.\n\nEmail: ${email}\nClerk ID: ${userId}\nIP: ${ip}\nTimestamp: ${new Date().toISOString()}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("waitlist/add", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
