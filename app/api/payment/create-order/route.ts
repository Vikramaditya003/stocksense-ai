import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const rzpKey = process.env.RAZORPAY_KEY_ID ?? "";
const rzpSecret = process.env.RAZORPAY_KEY_SECRET ?? "";
const rzpReady = rzpKey.startsWith("rzp_") && rzpSecret.length > 10;

// Plan definitions (amount in paise = INR × 100)
const PLANS: Record<string, { amount: number; name: string }> = {
  growth:   { amount:  79900, name: "StockSense AI Growth" },   // ₹799/mo
  pro:      { amount: 199900, name: "StockSense AI Pro" },      // ₹1,999/mo
  business: { amount: 499900, name: "StockSense AI Business" }, // ₹4,999/mo
};

export async function POST(req: NextRequest) {
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
      notes: { plan, product: selected.name },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: selected.amount,
      currency: "INR",
      keyId: rzpKey,
      plan,
      planName: selected.name,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json({ success: false, error: "Payment order failed." }, { status: 500 });
  }
}
