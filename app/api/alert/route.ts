import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendReady = resendKey.startsWith("re_") && resendKey.length > 20;

export async function POST(req: NextRequest) {
  try {
    const { email, analysis } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email required." }, { status: 400 });
    }

    // Always acknowledge — even if Resend isn't configured yet
    if (!resendReady) {
      console.log(`[Alert signup] Email: ${email} — Resend not configured, storing intent.`);
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendKey);

    // Build summary of critical/high products
    const urgent = (analysis?.products ?? [])
      .filter((p: { stockoutRisk: string }) => p.stockoutRisk === "critical" || p.stockoutRisk === "high")
      .slice(0, 5);

    const productRows = urgent.length
      ? urgent.map((p: { productName: string; daysOfStockRemaining: number; estimatedRevenueLoss?: string }) =>
          `• ${p.productName} — stockout in ${p.daysOfStockRemaining} days${p.estimatedRevenueLoss ? ` · ${p.estimatedRevenueLoss} at risk` : ""}`
        ).join("\n")
      : "• No critical items detected";

    await resend.emails.send({
      from: "StockSense AI <alerts@stocksense.ai>",
      to: email,
      subject: `⚠ ${urgent.length} product${urgent.length !== 1 ? "s" : ""} at risk — StockSense AI`,
      text: `Hi there,

Your latest StockSense AI forecast shows ${urgent.length} product${urgent.length !== 1 ? "s" : ""} at risk of stocking out.

AT-RISK PRODUCTS:
${productRows}

Log in to StockSense AI to see full reorder quantities, exact stockout dates, and download your purchase order.

→ https://stocksense.ai/forecast

You're receiving this because you signed up for StockSense AI stockout alerts.
To unsubscribe, reply STOP.

— StockSense AI Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alert email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send alert." }, { status: 500 });
  }
}
