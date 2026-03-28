import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { requireEnv, isRateLimited, getClientIp, sanitizeError } from "@/lib/security";
import { auth } from "@clerk/nextjs/server";
import { saveForecast } from "@/lib/db";

// Lazy client — created on first request so build-time doesn't fail
let groq: Groq | null = null;
function getGroq(): Groq {
  if (!groq) groq = new Groq({ apiKey: requireEnv("GROQ_API_KEY") });
  return groq;
}

const SYSTEM_PROMPT = `You are an expert inventory analyst and demand forecasting specialist helping Shopify merchants make concrete, money-focused decisions. Your job is not to describe data — it is to tell merchants exactly what will happen to their revenue, and exactly what to do about it.

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "healthScore": <number 0-100, higher = healthier>,
  "healthLabel": "critical" | "at-risk" | "fair" | "good" | "excellent",
  "summary": "<2-3 sentence plain-English summary focused on revenue impact, not just stock levels>",
  "revenueAtRisk": "<INR estimate of total revenue at stake if critical/high products stock out, e.g. '₹45,000–₹1,20,000 at risk this week'>",
  "keyInsights": ["<insight 1 — always mention money or days>", "<insight 2>", "<insight 3>"],
  "totalSkuCount": <number>,
  "criticalCount": <number>,
  "atRiskCount": <number>,
  "safeCount": <number>,
  "products": [
    {
      "productName": "<product name>",
      "sku": "<sku or empty string>",
      "currentStock": <number>,
      "avgDailySales": <number — calculated from CSV data>,
      "daysOfStockRemaining": <number>,
      "stockoutDate": "<e.g. 'Apr 3, 2026' — calculate from today + daysOfStockRemaining>",
      "stockoutRisk": "low" | "medium" | "high" | "critical",
      "forecast30Days": <units expected to sell in next 30 days>,
      "forecast60Days": <units>,
      "forecast90Days": <units>,
      "reorderQuantity": <recommended units to order — include lead time buffer + 20% safety stock>,
      "reorderPoint": <stock level at which to trigger reorder>,
      "reorderByDate": "<specific calendar date to place the order to avoid stockout, e.g. 'Order by Mar 28, 2026' — calculate as stockoutDate minus leadTimeDays>",
      "trend": "growing" | "stable" | "declining",
      "trendPercent": <number — positive for growth, negative for decline>,
      "seasonalNote": "<brief seasonal pattern note or empty string>",
      "riskReason": "<WHY this product is at risk — be specific: e.g. 'Sales velocity jumped 34% in last 3 days but stock is nearly depleted' or 'Declining trend + current stock will not cover 30-day forecast'>",
      "estimatedRevenueLoss": "<INR estimate if this product stocks out for 7 days, based on avgDailySales × price estimate — e.g. '₹12,000–₹20,000' — or null if low/no risk>"
    }
  ],
  "topRecommendations": [
    "<recommendation 1 — must include: product name, specific quantity, specific date, and why>",
    "<recommendation 2>",
    "<recommendation 3>"
  ],
  "adSpendInsight": "<if ad spend provided: specific impact like 'Ad spend +20% → demand +35% → Stockout 3 days sooner on [product]' — else empty string>",
  "forecastConfidence": <number 0-100 representing data quality and forecast reliability — higher = more historical data, consistent patterns>
}

Rules:
- healthScore: critical=0-25, at-risk=26-50, fair=51-65, good=66-80, excellent=81-100
- stockoutRisk: critical = <7 days, high = 7-14 days, medium = 14-30 days, low = 30+ days
- reorderByDate = stockoutDate minus leadTimeDays (so merchant can place order in time). Format as "Order by [date]"
- estimatedRevenueLoss: derive from avgDailySales × estimated price per unit × 7 days downtime. If no price data, estimate based on product type
- revenueAtRisk = sum of estimatedRevenueLoss for critical + high risk products
- topRecommendations must be specific and actionable — include product name, exact units, and exact date — like "Reorder 150 units of Yoga Mat by Mar 28 — lasts 18 days after your 14-day lead time"
- riskReason must explain the underlying signal, not just restate the risk level
- adSpendInsight must use the format: "Ad spend [amount] → demand +X% → [product] stocks out [N] days sooner than forecast"
- forecastConfidence: base on data volume (3 days = 50, 30+ days = 90), consistency of patterns, and completeness of data
- Derive all numbers from the actual CSV data provided — do not invent figures`;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { salesData, adSpendData, leadTimeDays } = body;

    if (!salesData || typeof salesData !== "string") {
      return NextResponse.json(
        { success: false, error: "Sales data is required." },
        { status: 400 }
      );
    }

    const trimmed = salesData.trim();
    if (trimmed.length < 30) {
      return NextResponse.json(
        { success: false, error: "Sales data is too short to analyze." },
        { status: 400 }
      );
    }

    const leadTime = typeof leadTimeDays === "number" ? leadTimeDays : 14;
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const userMessage = `Today's date: ${today}
Lead time for restocking: ${leadTime} days
${adSpendData ? `Upcoming ad spend: ${String(adSpendData).substring(0, 500)}` : ""}

Analyze this inventory and sales data. Calculate specific stockout dates, reorder-by dates, and estimated revenue loss for each product.

CSV data:
${trimmed.substring(0, 40000)}`;

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 4096,
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse forecast results. Please try again.");

    const analysis = JSON.parse(jsonMatch[0]);

    // Save to DB if user is signed in (best-effort — don't fail the request if DB is down)
    let savedId: string | null = null;
    try {
      const { userId } = await auth();
      if (userId) {
        const saved = await saveForecast(userId, analysis);
        savedId = saved?.id ?? null;
      }
    } catch (dbErr) {
      console.warn("Failed to save forecast to DB:", dbErr);
    }

    return NextResponse.json({ success: true, analysis, savedId });
  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json(
      { success: false, error: sanitizeError(error) },
      { status: 500 }
    );
  }
}
