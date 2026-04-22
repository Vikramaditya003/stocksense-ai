import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { updateUserPlan } from "@/lib/db";
import { logger } from "@/lib/logger";
import { logError } from "@/lib/security";

export const dynamic = "force-dynamic";

// Dodo webhook payload shapes we care about
interface DodoPaymentPayload {
  type: string;
  data: {
    payment_id: string;
    status: string;
    metadata?: Record<string, string>;
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET ?? "";
  if (!webhookSecret) {
    logger.error("webhook.dodo", "DODO_WEBHOOK_SECRET not configured", {});
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Could not read body." }, { status: 400 });
  }

  // Verify Standard Webhooks signature
  const wh = new Webhook(webhookSecret);
  try {
    await wh.verify(rawBody, {
      "webhook-id":        req.headers.get("webhook-id") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    });
  } catch {
    logger.warn("webhook.dodo.invalid_sig", "Invalid Dodo webhook signature", {});
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: DodoPaymentPayload;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Only process successful payments
  if (event.type !== "payment.succeeded") {
    return NextResponse.json({ received: true });
  }

  const { payment_id, metadata } = event.data;
  const clerkUserId = metadata?.clerk_user_id;

  if (!clerkUserId || typeof clerkUserId !== "string") {
    logger.warn("webhook.dodo.no_user", "payment.succeeded missing clerk_user_id in metadata", {
      meta: { payment_id },
    });
    return NextResponse.json({ received: true });
  }

  try {
    await updateUserPlan(clerkUserId, "pro", payment_id);
    logger.info("webhook.dodo.activated", "Pro plan activated via Dodo webhook", {
      meta: { payment_id, clerkUserId },
    });
  } catch (err) {
    logError("webhooks/dodo", err);
    // Return 200 so Dodo doesn't retry — plan activation failure is logged for manual review
    return NextResponse.json({ received: true, warning: "Plan activation failed — contact support." });
  }

  return NextResponse.json({ received: true });
}
