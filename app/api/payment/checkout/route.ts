import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isStrictRateLimited, isCrossOriginBlocked, getClientIp, sanitizeError, logError } from "@/lib/security";

const apiKey = process.env.DODO_PAYMENTS_API_KEY ?? "";
const dodoReady = apiKey.length > 10;
const isDev = process.env.NODE_ENV === "development";
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
      environment: isDev ? "test_mode" : "live_mode",
    });

    const payment = await client.payments.create({
      payment_link: true,
      customer: { email, name },
      billing: { country: "IN" },
      product_cart: [{ product_id: PRODUCT_ID_PRO, quantity: 1 }],
      metadata: { clerk_user_id: userId },
      return_url: `${SITE_URL}/upgrade/success`,
    });

    return NextResponse.json({ success: true, checkout_url: payment.payment_link });
  } catch (error) {
    logError("payment/checkout", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
