import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth } from "@clerk/nextjs/server";
import { updateUserPlan, getUserPlan } from "@/lib/db";
import { logError } from "@/lib/security";

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
      return NextResponse.json({ activated: true });
    }

    return NextResponse.json({ activated: false, status: paymentStatus });
  } catch (err) {
    logError("payment/verify", err);
    return NextResponse.json({ activated: false, error: "Verification failed." }, { status: 500 });
  }
}
