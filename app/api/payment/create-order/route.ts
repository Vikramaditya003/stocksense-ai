import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { isStrictRateLimited, isCrossOriginBlocked, getClientIp, sanitizeError, logError } from "@/lib/security";

const rzpKey = process.env.RAZORPAY_KEY_ID ?? "";
const rzpSecret = process.env.RAZORPAY_KEY_SECRET ?? "";
const rzpReady = rzpKey.startsWith("rzp_") && rzpSecret.length > 10;

// Plan definitions (amount in paise = INR × 100)
const PLANS: Record<string, { amount: number; name: string }> = {
  pro: { amount: 99900, name: "Forestock Pro" }, // ₹999/mo
};

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  // Rate limit — 5 order creation attempts per minute per IP
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  // Must be signed in — we need userId to tie the order to a user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Sign in to upgrade." }, { status: 401 });
  }

  if (!rzpReady) {
    return NextResponse.json(
      { success: false, error: "Payment not configured. Contact support." },
      { status: 503 }
    );
  }

  try {
    const { plan } = await req.json();
    const selected = PLANS[plan];
    if (!selected) {
      return NextResponse.json({ success: false, error: "Invalid plan." }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: rzpKey, key_secret: rzpSecret });

    const order = await razorpay.orders.create({
      amount: selected.amount,
      currency: "INR",
      receipt: `ss_${plan}_${Date.now()}`,
      // Embed userId in notes so verify route can read it back
      notes: { plan, product: selected.name, clerk_user_id: userId },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: selected.amount,
      currency: "INR",
      keyId: rzpKey, // publishable key — safe to send to frontend
      plan,
      planName: selected.name,
    });
  } catch (error) {
    logError("payment/create-order", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
