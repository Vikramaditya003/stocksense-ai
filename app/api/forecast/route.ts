import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { requireEnv, isRateLimited, isUserRateLimited, isCrossOriginBlocked, getClientIp, sanitizeError, logError, logWarn } from "@/lib/security";
import { auth } from "@clerk/nextjs/server";
import { saveForecast, getUserPlan } from "@/lib/db";
import { detectCurrencyFromCsv, formatMoney, currencySymbol } from "@/lib/currency";

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
  "revenueAtRisk": "<formatted total revenue at stake if critical/high products stock out, using the currency symbol from the user message — e.g. '$1,200–$3,500 at risk this week' or '₹45,000–₹1,20,000 at risk this week'>",
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
      "estimatedRevenueLoss": "<formatted estimate if this product stocks out for 7 days, based on avgDailySales × price — use the same currency symbol from the user message, e.g. '$220–$440' or '₹12,000–₹20,000' — or null if low/no risk>"
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

// ── Price extraction ─────────────────────────────────────────────────────────
// Parses the CSV and returns a map of { sku|productName (lowercase) → price }
// so we can compute deterministic RAR without relying on AI price guesses.
function extractPricesFromCsv(csv: string): Map<string, number> {
  const prices = new Map<string, number>();
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return prices;

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));
  const priceIdx = headers.findIndex((h) => h === "price" || h === "unitprice" || h === "avgprice" || h === "sellingprice");
  if (priceIdx === -1) return prices; // no price column — fall back to AI estimates

  const productIdx = headers.findIndex((h) => h.includes("product") || h.includes("name"));
  const skuIdx = headers.findIndex((h) => h === "sku" || h === "skucode" || h === "itemcode");

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const rawPrice = cols[priceIdx]?.replace(/[₹$£€A-Z\s,]/g, "");
    const price = parseFloat(rawPrice);
    if (!price || isNaN(price) || price <= 0) continue;

    const sku = skuIdx >= 0 ? cols[skuIdx]?.toLowerCase() : "";
    const name = productIdx >= 0 ? cols[productIdx]?.toLowerCase() : "";
    if (sku) prices.set(sku, price);
    if (name) prices.set(name, price);
  }
  return prices;
}

// ── Deterministic RAR formula ────────────────────────────────────────────────
// RAR = avgDailySales × leadTime × price
// leadTime is capped at a minimum of 7 days so even fast suppliers show impact.
// formatInr kept as alias; real formatting now goes through formatMoney()
function formatInr(amount: number, currency = "INR"): string {
  return formatMoney(amount, currency);
}

export async function POST(req: NextRequest) {
  if (isCrossOriginBlocked(req)) {
    return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  // Auth required — forecast is the core product; unauthenticated calls would burn Groq quota
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Sign in to run a forecast." },
      { status: 401 }
    );
  }

  // Per-user rate limit: 20 forecasts/hour
  if (await isUserRateLimited(userId)) {
    return NextResponse.json(
      { success: false, error: "Forecast limit reached. Please wait before running another." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { salesData, adSpendData, leadTimeDays, perProductLeadTimes, currency: requestedCurrency } = body;

    if (!salesData || typeof salesData !== "string") {
      return NextResponse.json(
        { success: false, error: "Sales data is required." },
        { status: 400 }
      );
    }

    // Hard cap: 5MB max CSV — prevents memory exhaustion / Groq token abuse
    if (salesData.length > 5_000_000) {
      return NextResponse.json(
        { success: false, error: "CSV file is too large. Maximum size is 5MB." },
        { status: 413 }
      );
    }

    const trimmed = salesData.trim();
    if (trimmed.length < 30) {
      return NextResponse.json(
        { success: false, error: "Sales data is too short to analyze." },
        { status: 400 }
      );
    }

    // ── Server-side CSV structure validation ─────────────────────────────────
    // Ensures the body is actually CSV-shaped, not arbitrary text or script content.
    // Checks: must have at least one comma-separated header row with 2+ columns,
    // and at least one data row. Does NOT reject valid CSVs with unusual characters.
    const firstLine = trimmed.split(/\r?\n/)[0] ?? "";
    if (firstLine.split(",").length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid CSV format. Ensure your file has comma-separated columns with a header row." },
        { status: 400 }
      );
    }

    // ── Server-side plan enforcement ─────────────────────────────────────────
    // Count CSV rows to enforce the free plan SKU limit server-side.
    // Client-side slicing alone is bypassable — this is the authoritative check.
    const FREE_SKU_LIMIT = 5;
    const csvLines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rowCount = Math.max(csvLines.length - 1, 0); // exclude header
    if (rowCount > FREE_SKU_LIMIT) {
      const plan = await getUserPlan(userId);
      if (plan === "free") {
        return NextResponse.json(
          { success: false, error: `Free plan supports up to ${FREE_SKU_LIMIT} products. Upgrade to Pro to analyze your full catalog.`, planLimitReached: true },
          { status: 403 }
        );
      }
    }

    // Clamp leadTime to a sane range — prevents prompt injection via large numbers
    const rawLeadTime = typeof leadTimeDays === "number" ? leadTimeDays : 14;
    const leadTime = Math.min(Math.max(Math.round(rawLeadTime), 1), 180);
    const effectiveLeadTime = Math.max(leadTime, 7); // minimum 7 days for RAR calc
    const today = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    // Detect currency — user-supplied takes priority, then auto-detect from CSV, then USD
    const ALLOWED_CURRENCIES = ["USD","INR","GBP","EUR","AUD","CAD","SGD","AED"];
    const currency = (typeof requestedCurrency === "string" && ALLOWED_CURRENCIES.includes(requestedCurrency))
      ? requestedCurrency
      : detectCurrencyFromCsv(trimmed);
    const sym = currencySymbol(currency);

    // Pre-parse prices from CSV so we can override AI-estimated RAR with deterministic values
    const csvPrices = extractPricesFromCsv(trimmed);
    const hasPriceData = csvPrices.size > 0;

    const adSpend = adSpendData
      ? String(adSpendData).replace(/<[^>]*>/g, "").substring(0, 500)
      : "";

    // Build per-product lead time context for the AI prompt
    const hasPerProductLeadTimes = perProductLeadTimes && typeof perProductLeadTimes === "object" && Object.keys(perProductLeadTimes).length > 0;
    const leadTimeNote = hasPerProductLeadTimes
      ? `Per-product lead times (use these instead of the global default where available):\n${
          Object.entries(perProductLeadTimes as Record<string, number>)
            .map(([p, d]) => `  - ${p}: ${d} days`)
            .join("\n")
        }`
      : `Global lead time: ${leadTime} days (applies to all products)`;

    const userMessage = `Today's date: ${today}
${leadTimeNote}
Currency: ${currency} (use ${sym} as the symbol for all monetary values)
${adSpend ? `Upcoming ad spend: ${adSpend}` : ""}

Analyze this inventory and sales data. Calculate specific stockout dates, reorder-by dates, and estimated revenue loss for each product. Use ${sym} for ALL monetary amounts.

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

    // ── Validate AI response shape — never trust unvalidated AI output ──────
    if (
      typeof analysis.healthScore !== "number" ||
      analysis.healthScore < 0 || analysis.healthScore > 100 ||
      !Array.isArray(analysis.products) ||
      analysis.products.length > 500
    ) {
      throw new Error("Forecast returned unexpected data. Please try again.");
    }
    // Sanitize all string fields in products — strip HTML tags that could cause XSS
    const tagRe = /<[^>]*>/g;
    for (const p of analysis.products) {
      if (typeof p.productName === "string") p.productName = p.productName.replace(tagRe, "").substring(0, 200);
      if (typeof p.sku === "string") p.sku = p.sku.replace(tagRe, "").substring(0, 100);
      if (typeof p.riskReason === "string") p.riskReason = p.riskReason.replace(tagRe, "").substring(0, 500);
      if (typeof p.reorderByDate === "string") p.reorderByDate = p.reorderByDate.replace(tagRe, "").substring(0, 100);
      if (typeof p.stockoutDate === "string") p.stockoutDate = p.stockoutDate.replace(tagRe, "").substring(0, 100);
      if (typeof p.estimatedRevenueLoss === "string") p.estimatedRevenueLoss = p.estimatedRevenueLoss.replace(tagRe, "").substring(0, 50);
      // Clamp numeric fields to sane ranges
      if (typeof p.daysOfStockRemaining === "number") p.daysOfStockRemaining = Math.max(0, Math.min(p.daysOfStockRemaining, 9999));
      if (typeof p.currentStock === "number") p.currentStock = Math.max(0, Math.min(p.currentStock, 9_999_999));
    }
    if (typeof analysis.summary === "string") analysis.summary = analysis.summary.replace(tagRe, "").substring(0, 1000);
    if (typeof analysis.revenueAtRisk === "string") analysis.revenueAtRisk = analysis.revenueAtRisk.replace(tagRe, "").substring(0, 100);
    if (typeof analysis.adSpendInsight === "string") analysis.adSpendInsight = analysis.adSpendInsight.replace(tagRe, "").substring(0, 300);
    if (typeof analysis.healthLabel === "string") {
      const VALID_LABELS = ["critical", "at-risk", "fair", "good", "excellent"];
      if (!VALID_LABELS.includes(analysis.healthLabel)) analysis.healthLabel = "fair";
    }
    // Sanitize array fields — each item is a plain string rendered directly to DOM
    if (Array.isArray(analysis.keyInsights)) {
      analysis.keyInsights = analysis.keyInsights
        .slice(0, 10)
        .map((s: unknown) => typeof s === "string" ? s.replace(tagRe, "").substring(0, 300) : "")
        .filter(Boolean);
    }
    if (Array.isArray(analysis.topRecommendations)) {
      analysis.topRecommendations = analysis.topRecommendations
        .slice(0, 10)
        .map((s: unknown) => typeof s === "string" ? s.replace(tagRe, "").substring(0, 400) : "")
        .filter(Boolean);
    }

    // ── Override RAR with deterministic formula when price data is present ──
    // Formula: RAR = avgDailySales × effectiveLeadTime × price
    let totalRarAmount = 0;
    if (hasPriceData && Array.isArray(analysis.products)) {
      for (const product of analysis.products) {
        const sku = (product.sku ?? "").toLowerCase();
        const name = (product.productName ?? "").toLowerCase();
        const price = csvPrices.get(sku) ?? csvPrices.get(name) ?? null;

        if (price && product.avgDailySales > 0) {
          const rarAmount = Math.round(product.avgDailySales * effectiveLeadTime * price);
          product.rarAmount = rarAmount;
          product.price = price;

          // Only show revenue loss for critical/high risk products
          if (product.stockoutRisk === "critical" || product.stockoutRisk === "high") {
            product.estimatedRevenueLoss = formatInr(rarAmount, currency);
            totalRarAmount += rarAmount;
          } else {
            product.estimatedRevenueLoss = null;
            product.rarAmount = 0;
          }
        } else {
          // No price data for this product — keep AI estimate but zero rarAmount
          product.rarAmount = null;
        }
      }

      // Override the top-level revenueAtRisk if we have deterministic data
      if (totalRarAmount > 0) {
        analysis.revenueAtRisk = `${formatInr(totalRarAmount, currency)} revenue at risk`;
      }
    } else {
      // No price column — set rarAmount null on all products so UI knows it's AI-estimated
      if (Array.isArray(analysis.products)) {
        for (const product of analysis.products) {
          product.rarAmount = null;
          product.price = null;
        }
      }
    }
    analysis.totalRarAmount = totalRarAmount;
    analysis.currency = currency; // attach detected/chosen currency to result

    // Save to DB — best-effort, don't fail the forecast if DB is down
    let savedId: string | null = null;
    try {
      const saved = await saveForecast(userId, analysis);
      savedId = saved?.id ?? null;
    } catch (dbErr) {
      logWarn("forecast/save", `DB save failed for userId=${userId}: ${sanitizeError(dbErr)}`);
    }

    return NextResponse.json({ success: true, analysis, savedId });
  } catch (error) {
    logError("forecast", error);
    return NextResponse.json(
      { success: false, error: sanitizeError(error) },
      { status: 500 }
    );
  }
}
