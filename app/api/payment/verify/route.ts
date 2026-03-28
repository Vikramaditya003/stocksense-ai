import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const rzpSecret = process.env.RAZORPAY_KEY_SECRET ?? "";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment fields." }, { status: 400 });
    }

    // Verify HMAC signature — prevents tampered payment callbacks
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", rzpSecret)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 400 });
    }

    // TODO: Update user subscription in Supabase
    // await supabase.from("subscriptions").upsert({ user_id, plan, payment_id: razorpay_payment_id, active: true });

    console.log(`[Payment verified] Plan: ${plan} | Payment: ${razorpay_payment_id}`);

    return NextResponse.json({ success: true, plan, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ success: false, error: "Verification error." }, { status: 500 });
  }
}
