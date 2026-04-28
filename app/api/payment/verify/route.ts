import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth, currentUser } from "@clerk/nextjs/server";
import { updateUserPlan, getUserPlan } from "@/lib/db";
import { logError } from "@/lib/security";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;

const apiKey = process.env.DODO_PAYMENTS_API_KEY ?? "";
const dodoReady = apiKey.length > 10;
const isTestMode = process.env.DODO_TEST_MODE === "true" || process.env.NODE_ENV === "development";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ activated: false, error: "Not authenticated." }, { status: 401 });
  }

  // If already pro, return immediately
  const currentPlan = await getUserPlan(userId);
  if (currentPlan === "pro") {
    return NextResponse.json({ activated: true });
  }

  if (!dodoReady) {
    return NextResponse.json({ activated: false, error: "Payment not configured." }, { status: 503 });
  }

  let sessionId: string | undefined;
  try {
    const body = await req.json();
    sessionId = body.session_id;
  } catch {
    // no body — will still try with userId lookup if no session_id
  }

  if (!sessionId) {
    return NextResponse.json({ activated: false, error: "No session ID provided." });
  }

  try {
    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: isTestMode ? "test_mode" : "live_mode",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await client.checkoutSessions.retrieve(sessionId) as any;
    const paymentStatus: string = session?.payment_status ?? session?.status ?? "";
    const metaUserId: string = session?.metadata?.clerk_user_id ?? "";

    // Only activate if payment succeeded AND session belongs to this user
    if (
      (paymentStatus === "succeeded" || paymentStatus === "paid") &&
      metaUserId === userId
    ) {
      const referenceId = session?.payment_id ?? session?.subscription_id ?? sessionId;
      await updateUserPlan(userId, "pro", referenceId);

      // Send Pro confirmation email
      if (resendReady) {
        try {
          const clerkUser = await currentUser();
          const primaryEmailId = clerkUser?.primaryEmailAddressId;
          const email = clerkUser?.emailAddresses.find((e) => e.id === primaryEmailId)?.emailAddress ?? "";
          const firstName = clerkUser?.firstName ?? "";
          if (email) {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Forestock <support@getforestock.com>",
              to: email,
              subject: "You're on Forestock Pro — here's what's unlocked",
              text: [
                `Hi${firstName ? ` ${firstName}` : ""},`,
                "",
                "Your Forestock Pro plan is now active. Here's everything you've unlocked:",
                "",
                "✓ Unlimited forecasts — no 5-run cap",
                "✓ 60 & 90-day demand forecasts",
                "✓ AI ad-spend & promotion correlation",
                "✓ Smart reorder quantities with lead time buffers",
                "✓ Supplier lead time alerts",
                "✓ Priority email support",
                "",
                "→ Go to your dashboard: https://getforestock.com/dashboard",
                "",
                "To use ad-spend correlation: click 'New Forecast', upload your CSV,",
                "and fill in the 'Ad Spend / Upcoming Promotions' field that's now visible.",
                "",
                "Questions? Reply to this email — we respond within 24 hours.",
                "",
                "— The Forestock team",
                "support@getforestock.com",
              ].join("\n"),
            });
          }
        } catch {
          // Don't fail activation if email fails
        }
      }

      return NextResponse.json({ activated: true });
    }

    return NextResponse.json({ activated: false, status: paymentStatus });
  } catch (err) {
    logError("payment/verify", err);
    return NextResponse.json({ activated: false, error: "Verification failed." }, { status: 500 });
  }
}
