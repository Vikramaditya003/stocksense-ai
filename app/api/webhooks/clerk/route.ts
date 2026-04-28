import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";
import { logError } from "@/lib/security";

export const dynamic = "force-dynamic";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

interface ClerkUserCreatedEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET ?? "";
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const svixId = req.headers.get("svix-id") ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers." }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Could not read body." }, { status: 400 });
  }

  const wh = new Webhook(webhookSecret);
  let event: ClerkUserCreatedEvent;
  try {
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  if (!resendReady) {
    return NextResponse.json({ received: true });
  }

  try {
    const { email_addresses, primary_email_address_id, first_name } = event.data;
    const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ?? "";
    if (!email) return NextResponse.json({ received: true });

    const firstName = first_name ?? "";
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "Forestock <support@getforestock.com>",
      to: email,
      subject: "Welcome to Forestock — run your first forecast in 60 seconds",
      text: [
        `Hi${firstName ? ` ${firstName}` : ""},`,
        "",
        "Welcome to Forestock — inventory forecasting built for Shopify merchants.",
        "",
        "Here's how to get your first forecast in 60 seconds:",
        "",
        "1. Export your sales data from Shopify Admin",
        "   → Orders › Export › All time › CSV",
        "   (or use Inventory › Export)",
        "",
        "2. Go to your dashboard and click '+ New Forecast'",
        `   → ${SITE_URL}/dashboard`,
        "",
        "3. Upload the CSV — get exact stockout dates, reorder quantities,",
        "   and revenue at risk in about 30 seconds.",
        "",
        "Free plan includes 5 forecasts. Upgrade to Pro for unlimited forecasts,",
        "60 & 90-day demand outlooks, and AI ad-spend correlation.",
        `→ ${SITE_URL}/upgrade`,
        "",
        "Questions? Just reply to this email.",
        "",
        "— The Forestock team",
        "support@getforestock.com",
      ].join("\n"),
    });
  } catch (err) {
    logError("webhooks/clerk", err);
  }

  return NextResponse.json({ received: true });
}
