import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { isStrictRateLimited, isCrossOriginBlocked, getClientIp, sanitizeError, logError, logWarn } from "@/lib/security";
import { updateUserPlan, type UserPlan } from "@/lib/db";
import { logger } from "@/lib/logger";

// Allowlist of purchasable plans — never trust the client's plan value
const VALID_PLANS = new Set<UserPlan>(["pro"]);

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  // Rate limit — prevent brute-force signature guessing
  const ip = getClientIp(req);
  if (await isStrictRateLimited(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  // Must be signed in — payment must be tied to a real user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  // Guard: secret must be configured or verification is meaningless
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  if (!rzpSecret || rzpSecret.length < 10) {
    return NextResponse.json({ success: false, error: "Payment not configured." }, { status: 503 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment fields." }, { status: 400 });
    }

    // Validate field types — prevent prototype pollution / injection
    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return NextResponse.json({ success: false, error: "Invalid payment fields." }, { status: 400 });
    }

    // Validate Razorpay ID formats — defense-in-depth alongside HMAC verification.
    // A forged ID won't survive the HMAC check below, but this prevents garbage from
    // ever reaching the DB even if the signature check logic were somehow bypassed.
    const RAZORPAY_ORDER_RE = /^order_[A-Za-z0-9]{14,}$/;
    const RAZORPAY_PAY_RE = /^pay_[A-Za-z0-9]{14,}$/;
    if (!RAZORPAY_ORDER_RE.test(razorpay_order_id) || !RAZORPAY_PAY_RE.test(razorpay_payment_id)) {
      return NextResponse.json({ success: false, error: "Invalid payment fields." }, { status: 400 });
    }

    // Validate plan against allowlist — never use user-supplied plan value blindly
    if (typeof plan !== "string" || !VALID_PLANS.has(plan as UserPlan)) {
      return NextResponse.json({ success: false, error: "Invalid plan." }, { status: 400 });
    }
    const validPlan = plan as UserPlan;

    // Verify HMAC signature — prevents tampered payment callbacks
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", rzpSecret)
      .update(body)
      .digest("hex");

    // Constant-time comparison prevents timing attacks
    const sigBuffer = Buffer.from(razorpay_signature, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    const sigValid =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (!sigValid) {
      const safeOrderId = String(razorpay_order_id).replace(/[^\w_-]/g, "").substring(0, 40);
      logger.warn("payment.signature_invalid", "Invalid Razorpay signature", {
        ip, userId, path: "/api/payment/verify",
        meta: { orderId: safeOrderId },
      });
      return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 400 });
    }

    // Activate user subscription — tied to verified userId, not the client-supplied value
    await updateUserPlan(userId, validPlan, razorpay_payment_id);

    const safePlan = validPlan.replace(/[^\w-]/g, "").substring(0, 20);
    const safePayId = String(razorpay_payment_id).replace(/[^\w_-]/g, "").substring(0, 40);
    logger.info("payment.verified", "Payment verified and plan activated", {
      ip, userId, path: "/api/payment/verify",
      meta: { plan: safePlan, paymentId: safePayId },
    });

    return NextResponse.json({ success: true, plan: validPlan, paymentId: razorpay_payment_id });
  } catch (error) {
    logError("payment/verify", error);
    return NextResponse.json({ success: false, error: sanitizeError(error) }, { status: 500 });
  }
}
