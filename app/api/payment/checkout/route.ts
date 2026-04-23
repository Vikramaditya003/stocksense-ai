import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isStrictRateLimited, isCrossOriginBlocked, getClientIp, logError } from "@/lib/security";

const apiKey = process.env.DODO_PAYMENTS_API_KEY ?? "";
const dodoReady = apiKey.length > 10;
const isTestMode = process.env.DODO_TEST_MODE === "true" || process.env.NODE_ENV === "development";
const PRODUCT_ID_PRO = process.env.DODO_PRODUCT_ID_PRO ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Sign in to upgrade." }, { status: 401 });
  }

  if (!dodoReady || !PRODUCT_ID_PRO) {
    return NextResponse.json(
      { success: false, error: "Payment not configured. Contact support." },
      { status: 503 }
    );
  }

  try {
    const clerkUser = await currentUser();
    const primaryEmailId = clerkUser?.primaryEmailAddressId;
    const email =
      clerkUser?.emailAddresses.find((e) => e.id === primaryEmailId)?.emailAddress ?? "";
    const name =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || "Customer";

    if (!email) {
      return NextResponse.json({ success: false, error: "No email on your account." }, { status: 400 });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: isTestMode ? "test_mode" : "live_mode",
    });

    // Use checkout sessions — supports both one-time and subscription products
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: PRODUCT_ID_PRO, quantity: 1 }],
      customer: { email, name },
      return_url: `${SITE_URL}/upgrade/success`,
      metadata: { clerk_user_id: userId },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkoutUrl = (session as any).checkout_url ?? (session as any).url ?? (session as any).payment_link;

    if (!checkoutUrl) {
      // Log full response in dev so we can see what field Dodo actually returns
      console.error("[payment/checkout] Dodo session response:", JSON.stringify(session));
      return NextResponse.json({ success: false, error: "Could not get checkout URL. Check server logs." }, { status: 500 });
    }

    return NextResponse.json({ success: true, checkout_url: checkoutUrl });
  } catch (error) {
    logError("payment/checkout", error);
    return NextResponse.json({ success: false, error: "Payment initiation failed. Please try again." }, { status: 500 });
  }
}
