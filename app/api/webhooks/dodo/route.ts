import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { updateUserPlan } from "@/lib/db";
import { logger } from "@/lib/logger";
import { logError } from "@/lib/security";

export const dynamic = "force-dynamic";

interface DodoEventData {
  payment_id?: string;
  subscription_id?: string;
  status?: string;
  metadata?: Record<string, string>;
}

interface DodoEvent {
  type: string;
  data: DodoEventData;
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

  let event: DodoEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Handle both subscription and one-time payment success events
  const isSuccess =
    event.type === "subscription.active" ||
    event.type === "payment.succeeded";

  if (!isSuccess) {
    return NextResponse.json({ received: true });
  }

  const { metadata, subscription_id, payment_id } = event.data;
  const clerkUserId = metadata?.clerk_user_id;
  const referenceId = subscription_id ?? payment_id ?? "unknown";

  if (!clerkUserId || typeof clerkUserId !== "string") {
    logger.warn("webhook.dodo.no_user", "Dodo webhook missing clerk_user_id in metadata", {
      meta: { event_type: event.type, reference_id: referenceId },
    });
    return NextResponse.json({ received: true });
  }

  try {
    await updateUserPlan(clerkUserId, "pro", referenceId);
    logger.info("webhook.dodo.activated", "Pro plan activated via Dodo webhook", {
      meta: { event_type: event.type, reference_id: referenceId, clerkUserId },
    });
  } catch (err) {
    logError("webhooks/dodo", err);
  }

  return NextResponse.json({ received: true });
}
