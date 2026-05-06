"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import type { ForecastAnalysis, ForecastStep, InputMode, ProductForecast } from "@/lib/types";
import { formatMoney, detectCurrencyFromCsv, CURRENCIES } from "@/lib/currency";
import FeedbackPopup from "@/components/FeedbackPopup";
import { LogoMark } from "@/components/StocksenseLogo";

const _clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_READY =
  (_clerkKey.startsWith("pk_test_") || _clerkKey.startsWith("pk_live_")) &&
  _clerkKey.length > 30;

function ForecastNavAuth({ onReset, showReset, userPlan, forecastCount }: { onReset: () => void; showReset: boolean; userPlan: "free" | "pro"; forecastCount: number | null }) {
  const { isSignedIn, isLoaded } = useUser();
  return (
    <div className="flex items-center gap-3">
      {showReset && (
        <button onClick={onReset} className="text-sm text-[#5a6059] hover:text-[#181d1b] transition-colors flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          New Forecast
        </button>
      )}
      {isLoaded && isSignedIn ? (
        <>
          <Link href="/history" className="text-xs font-medium text-[#5a6059] hover:text-[#181d1b] transition-colors">
            History
          </Link>
          {userPlan !== "pro" && (
            <div className="flex items-center gap-2">
              {forecastCount !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                  forecastCount >= 5 ? "bg-red-100 text-red-600 border border-red-200" :
                  forecastCount >= 4 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                  "bg-[#006d34]/[0.08] text-[#006d34] border border-[#006d34]/20"
                }`}>
                  {forecastCount}/5 used
                </span>
              )}
              <Link href="/upgrade" className="text-xs font-semibold text-[#5a6059] hover:text-[#181d1b] transition-colors">
                Upgrade to Pro
              </Link>
            </div>
          )}
          {userPlan === "pro" && (
            <span className="text-[10px] font-bold bg-[#006d34] text-white px-2 py-0.5 rounded-full tracking-wide">PRO</span>
          )}
          <UserButton
            appearance={{
              variables: {
                colorBackground: "#ffffff",
                colorText: "#181d1b",
                colorTextSecondary: "#5a6059",
                colorPrimary: "#006d34",
                colorDanger: "#ef4444",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
                fontSize: "14px",
              },
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "!bg-white !border !border-[#bbcbba]/40 !shadow-xl !shadow-black/10 !rounded-xl",
                userButtonPopoverMain: "!bg-white",
                userButtonPopoverHeader: "!bg-white !border-b !border-[#bbcbba]/40",
                userButtonPopoverActions: "!bg-white",
                userButtonPopoverActionButton: "!text-[#181d1b] hover:!bg-[#f0f5f1] !rounded-lg",
                userButtonPopoverActionButtonText: "!text-[#181d1b] !font-medium",
                userButtonPopoverActionButtonIconBox: "!text-[#5a6059]",
                userButtonPopoverFooter: "!hidden",
                userPreviewMainIdentifier: "!text-[#181d1b] !font-semibold",
                userPreviewSecondaryIdentifier: "!text-[#5a6059]",
                userPreviewTextContainer: "!text-[#181d1b]",
              },
            }}
          />
        </>
      ) : (
        <SignInButton mode="redirect">
          <button className="text-xs font-semibold bg-emerald-brand text-white px-3.5 py-1.5 rounded-lg transition-all hover:opacity-90 shadow-md">
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}

// ─── constants ───────────────────────────────────────────────────────────────

const FREE_PRODUCT_LIMIT = 5;

function countUniqueProducts(csv: string): number {
  const lines = csv.trim().split("\n").slice(1);
  const names = new Set(lines.map((l) => l.split(",")[0]?.trim().toLowerCase()).filter(Boolean));
  return names.size;
}

// ─── Sample CSV download ───────────────────────────────────────────────────
function downloadSampleCSV() {
  const sample = [
    "product,sku,date,units_sold,current_stock,price,lead_time",
    "Premium Yoga Mat,YM-001,2024-03-01,8,45,1299,7",
    "Premium Yoga Mat,YM-001,2024-03-02,11,34,1299,7",
    "Premium Yoga Mat,YM-001,2024-03-03,6,28,1299,7",
    "Premium Yoga Mat,YM-001,2024-03-04,9,19,1299,7",
    "Water Bottle XL,WB-004,2024-03-01,18,120,499,3",
    "Water Bottle XL,WB-004,2024-03-02,22,98,499,3",
    "Water Bottle XL,WB-004,2024-03-03,25,73,499,3",
    "Water Bottle XL,WB-004,2024-03-04,20,53,499,3",
    "Resistance Bands Set,RB-002,2024-03-01,3,87,799,21",
    "Resistance Bands Set,RB-002,2024-03-02,4,83,799,21",
    "Resistance Bands Set,RB-002,2024-03-03,2,81,799,21",
    "Resistance Bands Set,RB-002,2024-03-04,3,78,799,21",
    "Foam Roller Pro,FR-003,2024-03-01,2,203,1599,14",
    "Foam Roller Pro,FR-003,2024-03-02,3,200,1599,14",
    "Foam Roller Pro,FR-003,2024-03-03,1,199,1599,14",
    "Foam Roller Pro,FR-003,2024-03-04,2,197,1599,14",
  ].join("\n");
  const blob = new Blob([sample], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "forestock-sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Proper CSV line parser (handles quoted commas) ───────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

// ─── Shopify native orders export auto-transform ──────────────────────────
// Detects Shopify's own orders CSV (has "Lineitem name" + "Created at") and
// converts it to Forestock's format automatically — no friction for merchants
// who just hit Export in Shopify Admin.
function transformShopifyOrdersCSV(csv: string): string | null {
  const lines = csv.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return null;
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());

  const nameIdx  = headers.findIndex(h => h === "lineitem name");
  const skuIdx   = headers.findIndex(h => h === "lineitem sku");
  const qtyIdx   = headers.findIndex(h => h === "lineitem quantity");
  const priceIdx = headers.findIndex(h => h === "lineitem price");
  const dateIdx  = headers.findIndex(h => h === "created at");
  const statusIdx = headers.findIndex(h => h === "financial status");

  if (nameIdx === -1 || qtyIdx === -1 || dateIdx === -1) return null; // not Shopify orders

  // Aggregate units_sold per product per date
  const map: Record<string, Record<string, { qty: number; price: string; sku: string }>> = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    // Skip refunded / voided orders
    const status = statusIdx >= 0 ? (cols[statusIdx] ?? "").toLowerCase() : "";
    if (status === "voided" || status === "refunded") continue;

    const name = cols[nameIdx]?.trim();
    const rawDate = cols[dateIdx]?.trim() ?? "";
    const date = rawDate.split(" ")[0] || rawDate.split("T")[0]; // "2024-03-15"
    const qty = parseInt(cols[qtyIdx] ?? "0", 10);
    if (!name || !date || isNaN(qty) || qty <= 0) continue;

    if (!map[name]) map[name] = {};
    if (!map[name][date]) map[name][date] = { qty: 0, price: cols[priceIdx] ?? "", sku: cols[skuIdx] ?? "" };
    map[name][date].qty += qty;
  }

  if (Object.keys(map).length === 0) return null;

  const out = ["product,sku,date,units_sold,price"];
  for (const [product, dates] of Object.entries(map)) {
    for (const [date, d] of Object.entries(dates)) {
      out.push(`"${product.replace(/"/g, '""')}",${d.sku},${date},${d.qty},${d.price}`);
    }
  }
  return out.join("\n");
}

// ─── Row-level CSV validation ──────────────────────────────────────────────
const CSV_ALIASES: Record<string, string[]> = {
  product:       ["product", "product_name", "name", "item", "item_name", "title"],
  units_sold:    ["units_sold", "sold", "sales", "quantity_sold", "qty_sold", "quantity"],
  // current_stock is optional — Shopify orders exports don't have it
  current_stock: ["current_stock", "stock", "inventory", "qty", "on_hand", "stock_quantity", "available"],
  price:         ["price", "unit_price", "avg_price", "selling_price", "mrp"],
  // per-product lead time — falls back to global default if column missing
  lead_time:     ["lead_time", "lead_days", "leadtime", "supplier_lead_time", "days_lead", "lt", "days_to_ship"],
};

// Required columns — everything else is optional
const REQUIRED_COLUMNS = ["product", "units_sold"] as const;

function validateCsv(csv: string): string[] {
  const errors: string[] = [];
  const lines = csv.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) {
    return ["File needs at least a header row and one data row. Download the sample CSV to see the correct format."];
  }

  const raw = parseCSVLine(lines[0]).map(h => h.toLowerCase());

  const idx: Record<string, number> = {};
  for (const [key, aliases] of Object.entries(CSV_ALIASES)) {
    const found = raw.findIndex(h => aliases.includes(h));
    if (found !== -1) idx[key] = found;
  }

  // Only require product + units_sold
  for (const key of REQUIRED_COLUMNS) {
    if (idx[key] === undefined) {
      errors.push(`Column "${key}" not found. Accepted names: ${CSV_ALIASES[key].join(", ")}. See sample CSV ↓`);
    }
  }
  if (errors.length) return errors;

  for (let i = 1; i < Math.min(lines.length, 300); i++) {
    const cols = parseCSVLine(lines[i]);
    if (!cols[idx.product]) {
      errors.push(`Row ${i + 1}: Product name is empty — every row needs a product name.`);
    }
    const sold = cols[idx.units_sold] ?? "";
    if (sold !== "" && isNaN(Number(sold))) {
      errors.push(`Row ${i + 1}: units_sold value "${sold}" must be a number.`);
    }
    if (idx.current_stock !== undefined) {
      const stock = cols[idx.current_stock] ?? "";
      if (stock !== "" && isNaN(Number(stock))) {
        errors.push(`Row ${i + 1}: current_stock value "${stock}" must be a number.`);
      }
    }
    if (errors.length >= 4) {
      errors.push("Fix these errors first, then re-upload.");
      break;
    }
  }
  return errors;
}

// ─── Per-product lead time extraction ─────────────────────────────────────
// Returns a map of { productName: leadDays } using the lead_time column.
// Products without a lead_time value fall back to the global default.
function extractPerProductLeadTimes(csv: string, globalDefault: number): Record<string, number> {
  const lines = csv.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return {};
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const productIdx  = headers.findIndex(h => CSV_ALIASES.product.includes(h));
  const leadIdx     = headers.findIndex(h => CSV_ALIASES.lead_time.includes(h));
  if (productIdx === -1 || leadIdx === -1) return {};

  const map: Record<string, number> = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const name = cols[productIdx]?.trim();
    const raw  = cols[leadIdx]?.trim();
    if (!name) continue;
    const days = raw ? parseInt(raw.replace(/[^\d]/g, ""), 10) : NaN;
    if (!isNaN(days) && days > 0 && map[name] === undefined) {
      map[name] = days;
    } else if (map[name] === undefined) {
      map[name] = globalDefault;
    }
  }
  return map;
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

async function startRazorpayCheckout(plan: string, onSuccess: () => void, onError: () => void) {
  try {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (!data.success) { onError(); return; }

    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Forestock",
        description: data.planName,
        order_id: data.orderId,
        theme: { color: "#22C55E" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan }),
          });
          const vData = await verify.json();
          if (vData.success) onSuccess();
          else onError();
        },
      });
      rzp.open();
    };
    document.body.appendChild(script);
  } catch {
    onError();
  }
}

function UpgradeModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const handleUpgrade = () => {
    setPaying(true); setPayError(false);
    startRazorpayCheckout(
      "pro",
      () => { setPaying(false); setPaySuccess(true); setTimeout(() => window.location.reload(), 1500); },
      () => { setPaying(false); setPayError(true); }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-[#22C55E]/20 bg-[#0A1415] shadow-2xl shadow-black/60 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#22C55E]/[0.08]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <button type="button" aria-label="Close" onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest mb-1">Pro Feature</p>
          <h3 className="text-[18px] font-semibold text-white tracking-tight">{feature}</h3>
        </div>

        {/* Features list */}
        <div className="px-6 py-4">
          <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">Upgrade to Pro to unlock this and everything else your catalog needs:</p>
          <ul className="space-y-2.5 mb-5">
            {[
              "Unlimited products (no 5-SKU cap)",
              "60 & 90-day demand forecasts",
              "AI ad-spend correlation",
              "Smart reorder quantities",
              "Supplier lead time alerts",
              "1-click purchase order generation",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-slate-300">
                <svg className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[28px] font-semibold text-white tracking-tight">$10</span>
            <span className="text-slate-500 text-sm">/month · cancel anytime</span>
          </div>
          <p className="text-xs text-slate-600 mb-4">billed monthly · cancel anytime</p>
          {paySuccess ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#22C55E]">Payment successful! Refreshing your access...</p>
            </div>
          ) : isLoaded && !isSignedIn ? (
            <>
              <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-xs text-amber-300">Sign in to your account to purchase a plan.</p>
              </div>
              <SignInButton mode="redirect" fallbackRedirectUrl="/forecast?upgrade=1">
                <button className="block w-full text-center bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-[#22C55E]/20 hover:-translate-y-0.5">
                  Sign in to upgrade
                </button>
              </SignInButton>
              <button onClick={onClose} className="block w-full text-center text-slate-600 hover:text-slate-400 text-xs mt-3 transition-colors">
                Continue with free plan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                disabled={paying}
                className="block w-full text-center bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-[#22C55E]/20 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {paying ? "Opening payment..." : "Upgrade to Pro — $10/mo"}
              </button>
              {payError && <p className="text-xs text-red-400 text-center mt-2">Payment failed. Try again.</p>}
              <button onClick={onClose} className="block w-full text-center text-slate-600 hover:text-slate-400 text-xs mt-3 transition-colors">
                Continue with free plan
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function healthColor(score: number) {
  if (score >= 80) return { color: "#22c55e", label: "text-green-400" };
  if (score >= 60) return { color: "#22C55E", label: "text-[#22C55E]" };
  if (score >= 40) return { color: "#f59e0b", label: "text-amber-400" };
  if (score >= 20) return { color: "#f97316", label: "text-orange-400" };
  return { color: "#ef4444", label: "text-red-400" };
}

function riskBadgeClass(risk: string) {
  const map: Record<string, string> = {
    critical: "badge badge-critical",
    high: "badge badge-high",
    medium: "badge badge-medium",
    low: "badge badge-low",
  };
  return map[risk] ?? "badge badge-neutral";
}

type SortKey = "productName" | "daysOfStockRemaining" | "stockoutRisk" | "avgDailySales" | "currentStock" | "rarAmount";
type SortDir = "asc" | "desc";

const RISK_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const DEMO_CSV = `product,sku,date,units_sold,current_stock
Premium Yoga Mat,YM-001,2024-01-01,8,12
Premium Yoga Mat,YM-001,2024-01-02,11,4
Premium Yoga Mat,YM-001,2024-01-03,6,0
Resistance Bands Set,RB-002,2024-01-01,3,87
Resistance Bands Set,RB-002,2024-01-02,4,83
Resistance Bands Set,RB-002,2024-01-03,2,81
Foam Roller Pro,FR-003,2024-01-01,2,203
Foam Roller Pro,FR-003,2024-01-02,3,200
Foam Roller Pro,FR-003,2024-01-03,1,199
Water Bottle XL,WB-004,2024-01-01,18,34
Water Bottle XL,WB-004,2024-01-02,22,12
Water Bottle XL,WB-004,2024-01-03,25,0`;

// ─── Health Gauge ─────────────────────────────────────────────────────────

function HealthGauge({ score, label }: { score: number; label: string }) {
  const half = Math.PI * 40;
  const offset = half - (score / 100) * half;
  const { color } = healthColor(score);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-20">
        <svg viewBox="0 0 100 54" className="w-full h-full">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="7" strokeLinecap="round" />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${half} ${half}`} strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${color}50)`, transition: "stroke-dashoffset 1s ease-out" }}
          />
          <text x="50" y="46" textAnchor="middle" fill="#181d1b" fontSize="17" fontWeight="800" fontFamily="inherit">{score}</text>
        </svg>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider">{label}</p>
        {icon && <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color ?? "#006d34"}18` }}>{icon}</div>}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight tabular-nums" style={{ color: color ?? "#181d1b" }}>{value}</p>
        {sub && <p className="text-xs text-[#8a9a8a] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Product Row (expandable) ─────────────────────────────────────────────

function ProductRow({ product, index, leadTime, isFreeTier, onUpgrade, currency }: { product: ProductForecast; index: number; leadTime: number; isFreeTier: boolean; onUpgrade: (f: string) => void; currency: string }) {
  const [open, setOpen] = useState(false);
  const reorderDurationDays = product.avgDailySales > 0 ? Math.round(product.reorderQuantity / product.avgDailySales) : 0;
  const alreadyLate = product.daysOfStockRemaining > 0 && product.daysOfStockRemaining <= leadTime;

  const riskConfig = {
    critical: { bar: "bg-red-500",    text: "text-red-600",    badge: "text-red-600 bg-red-50 border-red-200",    dot: "bg-red-500" },
    high:     { bar: "bg-orange-500", text: "text-orange-600", badge: "text-orange-600 bg-orange-50 border-orange-200", dot: "bg-orange-500" },
    medium:   { bar: "bg-yellow-500", text: "text-yellow-700", badge: "text-yellow-700 bg-yellow-50 border-yellow-200", dot: "bg-yellow-500" },
    low:      { bar: "bg-green-500",  text: "text-[#006d34]",  badge: "text-[#006d34] bg-[#006d34]/[0.08] border-[#006d34]/20",  dot: "bg-green-500" },
  };
  const cfg = riskConfig[product.stockoutRisk] ?? riskConfig.low;

  const trendIcon = product.trend === "growing"
    ? <span className="text-green-400 font-medium text-[11px]">↑ +{product.trendPercent}%</span>
    : product.trend === "declining"
    ? <span className="text-red-400 font-medium text-[11px]">↓ {product.trendPercent}%</span>
    : null;

  // Days remaining bar (0-30 day scale, capped)
  const daysBarPct = Math.min(100, (product.daysOfStockRemaining / 30) * 100);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        onClick={() => setOpen(!open)}
        className="cursor-pointer group"
      >
        {/* Color stripe + Product + Trend */}
        <td className="!pl-0">
          <div className="flex items-center gap-0">
            <div className={`w-[3px] self-stretch rounded-l-sm mr-3 flex-shrink-0 ${cfg.bar} opacity-80`} />
            <div className="min-w-0 py-0.5">
              <p className="font-semibold text-[#181d1b] text-sm leading-tight truncate max-w-[180px]">{product.productName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {product.sku && <p className="text-[11px] text-[#8a9a8a] font-mono">{product.sku}</p>}
                {trendIcon}
              </div>
              {alreadyLate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 border border-red-500/40 bg-transparent px-1.5 py-0.5 rounded mt-1">
                  ⚠ ORDER NOW
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Risk badge — moved before Days Left */}
        <td>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {product.stockoutRisk.charAt(0).toUpperCase() + product.stockoutRisk.slice(1)}
          </span>
        </td>

        {/* Days left with thicker bar */}
        <td>
          <div className="flex flex-col gap-1.5">
            <span className={`text-sm font-bold tabular-nums ${product.daysOfStockRemaining <= 0 ? "text-red-400" : cfg.text}`}>
              {product.daysOfStockRemaining <= 0 ? "OUT" : `${product.daysOfStockRemaining}d`}
            </span>
            <div className="w-16 h-[5px] rounded-full bg-[#eaefeb] overflow-hidden">
              <div className={`h-full rounded-full ${cfg.bar} opacity-80`} style={{ width: `${daysBarPct}%` }} />
            </div>
          </div>
        </td>

        {/* Stock — no "u" label */}
        <td>
          <span className="tabular-nums text-[#5a6059] text-sm">{product.currentStock.toLocaleString()}</span>
        </td>

        {/* Reorder action — more prominent */}
        <td>
          {product.reorderByDate ? (
            <div>
              <p className="text-sm font-semibold text-[#181d1b]">{product.reorderByDate}</p>
              <p className="text-[11px] text-[#8a9a8a] mt-0.5">{product.reorderQuantity} units</p>
            </div>
          ) : (
            <span className="text-[#8a9a8a] text-xs">—</span>
          )}
        </td>

        {/* Revenue at risk — more readable formula */}
        <td>
          {product.estimatedRevenueLoss ? (
            <div>
              <span className="text-red-600 text-sm font-bold">{product.estimatedRevenueLoss}</span>
              {product.price && product.rarAmount && (
                <p className="text-[11px] text-[#8a9a8a] mt-0.5 tabular-nums">{product.avgDailySales.toFixed(1)}/d × {leadTime}d × {formatMoney(product.price, currency)}</p>
              )}
            </div>
          ) : (
            <span className="text-[#8a9a8a] text-sm">—</span>
          )}
        </td>

        {/* Expand + hover quick-action */}
        <td onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              className="hidden group-hover:inline-flex items-center text-[11px] font-semibold text-[#006d34] border border-[#006d34]/30 hover:bg-[#006d34]/10 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
            >
              Details
            </button>
            <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="cursor-pointer">
              <svg className={`w-4 h-4 text-[#bbcbba] group-hover:text-[#5a6059] transition-all duration-200 ${open ? "rotate-180 !text-[#006d34]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {open && (
          <tr>
            <td colSpan={7} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-4 bg-[#f0f5f1] border-t border-[#bbcbba]/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Why at risk */}
                  {product.riskReason && (
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-wider mb-1.5">Why at risk</p>
                      <p className="text-sm text-[#5a6059] leading-relaxed">{product.riskReason}</p>
                    </div>
                  )}

                  {/* Reorder action */}
                  <div className="card-sm p-4 bg-[#006d34]/[0.04] border-[#006d34]/15">
                    <p className="text-[10px] font-bold text-[#006d34] uppercase tracking-wider mb-2.5">Reorder Action</p>
                    <p className="text-sm text-[#181d1b] mb-0.5 font-medium">
                      Order <span className="font-bold text-[#181d1b]">{product.reorderQuantity} units</span>
                      {reorderDurationDays > 0 && (
                        <span className="text-[#5a6059] font-normal"> → lasts ~{reorderDurationDays} days</span>
                      )}
                    </p>
                    <p className="text-xs text-[#8a9a8a] mb-2">Reorder point: {product.reorderPoint} units · {product.avgDailySales.toFixed(1)} sold/day</p>
                    {product.reorderByDate && (
                      <p className="text-xs font-bold text-orange-600 mb-1.5">{product.reorderByDate}</p>
                    )}
                    {alreadyLate && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        Lead time {leadTime}d — order immediately
                      </div>
                    )}
                  </div>

                  {/* Demand forecast */}
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-wider mb-2">Demand Forecast</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "30 Days", value: product.forecast30Days, locked: false },
                        { label: "60 Days", value: product.forecast60Days, locked: isFreeTier },
                        { label: "90 Days", value: product.forecast90Days, locked: isFreeTier },
                      ].map((f) => (
                        f.locked ? (
                          <button key={f.label} onClick={() => onUpgrade("60 & 90-day Forecasts")} className="card-sm p-3 text-center relative overflow-hidden hover:border-[#006d34]/20 transition-colors group">
                            <p className="text-base font-bold text-[#181d1b] blur-sm select-none">000</p>
                            <p className="text-xs text-[#8a9a8a]">{f.label}</p>
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            </div>
                          </button>
                        ) : (
                          <div key={f.label} className="card-sm p-3 text-center">
                            <p className="text-lg font-bold text-[#181d1b] tabular-nums">{f.value}</p>
                            <p className="text-xs text-[#8a9a8a]">{f.label}</p>
                          </div>
                        )
                      ))}
                    </div>
                    {isFreeTier && (
                      <button onClick={() => onUpgrade("60 & 90-day Forecasts")} className="mt-2 flex items-center gap-1.5 text-[11px] text-[#006d34] hover:text-[#181d1b] transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        Unlock 60 & 90-day forecasts with Pro
                      </button>
                    )}
                  </div>

                  {/* Seasonal note */}
                  {product.seasonalNote && (
                    <div className="sm:col-span-3 flex items-start gap-2 text-xs text-[#5a6059] bg-[#eaefeb] rounded-lg px-3 py-2.5 border border-[#bbcbba]/40">
                      <svg className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                      {product.seasonalNote}
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Critical Alerts Banner ───────────────────────────────────────────────

function CriticalAlerts({ products, leadTime, currency }: { products: ProductForecast[]; leadTime: number; currency: string }) {
  const urgent = products.filter(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high");
  if (!urgent.length) return null;
  return (
    <div className="space-y-2 mb-5">
      {urgent.map((p) => {
        const isCritical = p.stockoutRisk === "critical";
        const alreadyLate = p.daysOfStockRemaining <= leadTime;
        return (
          <div key={p.productName} className={`flex flex-wrap items-center gap-3 rounded-xl px-4 py-3.5 border ${
            isCritical ? "bg-red-500/[0.06] border-red-500/15" : "bg-orange-500/[0.05] border-orange-500/15"
          }`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${isCritical ? "bg-red-400" : "bg-orange-400"}`} />
            <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className={`text-sm font-semibold ${isCritical ? "text-red-400" : "text-orange-400"}`}>{p.productName}</span>
              <span className="text-sm text-[#5a6059]">— stockout in</span>
              <span className={`text-sm font-bold ${isCritical ? "text-red-300" : "text-orange-300"}`}>{p.daysOfStockRemaining} days</span>
              {alreadyLate && (
                <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded-md">
                  ⚠ Lead time exceeded — ORDER NOW
                </span>
              )}
            </div>
            {p.estimatedRevenueLoss && (
              <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                <span className="text-sm font-bold text-red-400 whitespace-nowrap">
                  {p.estimatedRevenueLoss} at risk
                </span>
                {p.price && p.rarAmount && (
                  <span className="text-[10px] text-[#8a9a8a] whitespace-nowrap tabular-nums">
                    {p.avgDailySales.toFixed(1)} u/day × {leadTime}d × {formatMoney(p.price, currency)}
                  </span>
                )}
              </div>
            )}
            {p.reorderByDate && (
              <span className="text-xs font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/15 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                {p.reorderByDate}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PO Generator ─────────────────────────────────────────────────────────

function POGenerator({ products }: { products: ProductForecast[] }) {
  const [done, setDone] = useState(false);
  const urgent = products.filter(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high");
  if (!urgent.length) return null;

  const handleGenerate = () => {
    const today = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const lines = [
      "PURCHASE ORDER",
      `Generated by Forestock — ${today}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "URGENT REORDERS:",
      "",
      ...urgent.map(p =>
        `${p.productName}${p.sku ? ` (${p.sku})` : ""}\n  Qty: ${p.reorderQuantity} units\n  Deadline: ${p.reorderByDate || "ORDER ASAP"}\n  Reason: ${p.riskReason || "Stockout risk"}\n`
      ),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Note: AI-generated estimates. Verify with supplier before ordering.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase-order-${today.replace(/ /g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <button
      onClick={handleGenerate}
      className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 ${
        done
          ? "bg-[#006d34]/[0.08] border border-[#006d34]/20 text-[#006d34]"
          : "bg-[#f0f5f1] border border-[#bbcbba]/60 text-[#5a6059] hover:bg-[#eaefeb] hover:text-[#181d1b]"
      }`}
    >
      {done ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          PO Downloaded
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Generate Purchase Order
        </>
      )}
    </button>
  );
}

// ─── Results sign-up prompt ───────────────────────────────────────────────

function ResultsSignupPrompt() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded || isSignedIn) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#006d34]/[0.06] border border-[#006d34]/25 rounded-2xl px-5 py-4 mb-5">
      <div className="w-10 h-10 rounded-xl bg-[#006d34]/[0.10] border border-[#006d34]/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.614 0" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#181d1b] tracking-tight">
          You&apos;ve used your 1 free guest run
        </p>
        <p className="text-[12px] text-[#5a6059] mt-0.5">
          Sign up free for 4 more runs, saved forecast history, and stockout email alerts.
        </p>
      </div>

      <SignUpButton mode="redirect">
        <button className="flex-shrink-0 text-[13px] font-semibold text-white bg-emerald-brand hover:opacity-90 px-4 py-2.5 rounded-xl transition-all shadow-lg whitespace-nowrap w-full sm:w-auto text-center">
          Create free account →
        </button>
      </SignUpButton>
    </div>
  );
}

function SignupGateModal({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#006d34]/[0.08] border border-[#006d34]/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h2 className="text-[20px] font-bold text-[#181d1b] tracking-tight mb-2">
          You&apos;ve used your free guest run
        </h2>
        <p className="text-[13px] text-[#5a6059] leading-relaxed mb-6">
          Sign up free to get <span className="font-semibold text-[#181d1b]">4 more forecast runs</span>, saved history, and email alerts 7 days before each stockout.
        </p>

        <SignUpButton mode="redirect">
          <button className="block w-full text-center bg-[#006d34] hover:bg-[#005a2b] text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-[#006d34]/20 hover:-translate-y-0.5 mb-3">
            Create free account →
          </button>
        </SignUpButton>

        <SignInButton mode="redirect">
          <button className="block w-full text-center text-[#5a6059] hover:text-[#181d1b] font-medium text-sm py-2 transition-colors">
            Already have an account? Sign in
          </button>
        </SignInButton>

        <button
          onClick={onDismiss}
          className="mt-3 text-[11px] text-[#8a9a8a] hover:text-[#5a6059] transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────

function StepIndicator({ step }: { step: ForecastStep }) {
  const steps: { key: ForecastStep; label: string }[] = [
    { key: "parsing", label: "Parsing data" },
    { key: "analyzing", label: "Analyzing patterns" },
    { key: "generating", label: "Building forecast" },
  ];
  const activeIdx = steps.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i <= activeIdx ? "text-[#006d34]" : "text-[#8a9a8a]"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              i < activeIdx ? "bg-[#006d34] border-[#006d34] text-white" :
              i === activeIdx ? "border-[#006d34] text-[#006d34] animate-pulse" :
              "border-[#bbcbba]/60 text-[#8a9a8a]"
            }`}>
              {i < activeIdx ? "✓" : i + 1}
            </div>
            {s.label}
          </div>
          {i < steps.length - 1 && <div className={`w-8 h-px transition-colors ${i < activeIdx ? "bg-[#006d34]" : "bg-[#bbcbba]/60"}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function ForecastClient() {
  const { isSignedIn: userIsSignedIn } = useUser();
  const [inputMode, setInputMode] = useState<InputMode>("csv");
  const [step, setStep] = useState<ForecastStep>("idle");
  const [analysis, setAnalysis] = useState<ForecastAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [adSpend, setAdSpend] = useState("");
  const [leadTime, setLeadTime] = useState("14");
  const [currency, setCurrency] = useState("USD");
  const [sortKey, setSortKey] = useState<SortKey>("stockoutRisk");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [upgradeModal, setUpgradeModal] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [detectedFormat, setDetectedFormat] = useState<"shopify-orders" | "standard" | null>(null);

  const [anonRunCount, setAnonRunCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("forestock_anon_runs") ?? "0", 10);
  });
  const [showSignupGate, setShowSignupGate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");
  const [forecastCount, setForecastCount] = useState<number | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const demoRan = useRef(false);

  // Auto-run demo if ?demo=true is in the URL
  // Using window.location directly to avoid useSearchParams (requires Suspense in Next.js 16)
  useEffect(() => {
    if (demoRan.current) return;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    if (params?.get("demo") === "true") {
      demoRan.current = true;
      setCsvText(DEMO_CSV);
      setFileName("demo-inventory.csv");
      setInputMode("csv");
      setError(null);
      runForecast(DEMO_CSV);
    }
    // Auto-open upgrade modal if ?upgrade=1 (e.g. from sidebar "Upgrade to Pro" button)
    if (params?.get("upgrade") === "1") {
      setUpgradeModal("Forestock Pro");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userIsSignedIn) return;
    fetch("/api/user/plan").then(r => r.json()).then(d => {
      if (d.plan === "pro") setUserPlan("pro");
      if (typeof d.forecastCount === "number") setForecastCount(d.forecastCount);
    }).catch(() => {});
  }, [userIsSignedIn]);

  // Show feedback popup once when forecast results arrive, but only if user
  // hasn't already submitted feedback (localStorage gate is inside FeedbackPopup).
  useEffect(() => {
    if (step === "done") setShowFeedback(true);
    else setShowFeedback(false);
  }, [step]);

  const processText = useCallback((text: string) => {
    // Try Shopify native orders format first
    const transformed = transformShopifyOrdersCSV(text);
    if (transformed) {
      setCsvText(transformed);
      setDetectedFormat("shopify-orders");
    } else {
      setCsvText(text);
      setDetectedFormat("standard");
    }
    setError(null);
    setCurrency(detectCurrencyFromCsv(text));
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const name = file.name.toLowerCase();
    const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls");
    const isCsv   = name.endsWith(".csv") || file.type === "text/csv" || file.type === "application/vnd.ms-excel";

    if (!isExcel && !isCsv) {
      setError("Please upload a CSV or Excel (.xlsx / .xls) file.");
      return;
    }

    setFileName(file.name);
    setDetectedFormat(null);

    if (isExcel) {
      try {
        const { read, utils } = await import("xlsx");
        const buf = await file.arrayBuffer();
        const wb  = read(buf);
        const ws  = wb.Sheets[wb.SheetNames[0]];
        const csv = utils.sheet_to_csv(ws);
        processText(csv);
      } catch {
        setError("Could not read the Excel file. Try saving it as CSV and uploading that instead.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => processText(e.target?.result as string);
      reader.readAsText(file);
    }
  }, [processText]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleEmailAlert = async () => {
    setAlertStatus("sending");
    try {
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      setAlertStatus(res.ok ? "sent" : "error");
    } catch {
      setAlertStatus("error");
    }
  };

  const runForecast = async (overrideData?: string) => {
    const data = (overrideData ?? csvText).trim();
    if (!data || data.length < 20) { setError("Please upload a CSV or paste your sales data first."); return; }

    // Gate: anonymous users get 1 free run, then must sign up
    if (!userIsSignedIn && anonRunCount >= 1) {
      setShowSignupGate(true);
      return;
    }

    // Client-side validation before hitting the API
    const validationErrors = validateCsv(data);
    if (validationErrors.length) { setError(validationErrors[0]); return; }

    // Extract per-product lead times if column present — falls back to global default
    const perProductLeadTimes = extractPerProductLeadTimes(data, parseInt(leadTime) || 14);

    setError(null); setAnalysis(null);
    setStep("parsing"); await new Promise((r) => setTimeout(r, 600));
    setStep("analyzing"); await new Promise((r) => setTimeout(r, 800));
    setStep("generating");
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData: data, adSpendData: adSpend.trim() || undefined, leadTimeDays: parseInt(leadTime) || 14, perProductLeadTimes, currency }),
      });
      let json: { success: boolean; error?: string; planLimitReached?: boolean; analysis?: ForecastAnalysis; savedId?: string };
      try {
        json = await res.json();
      } catch {
        throw new Error("Service temporarily unavailable. Please try again in a moment.");
      }
      if (!json.success) {
        // Plan limit hit — show upgrade modal instead of generic error screen
        if (json.planLimitReached) {
          setStep("idle");
          setUpgradeModal("Unlimited forecast runs");
          return;
        }
        throw new Error(json.error || "Forecast failed.");
      }
      setAnalysis(json.analysis ?? null);
      setStep("done");
      if (userPlan !== "pro") setForecastCount(c => c !== null ? Math.min(c + 1, 5) : null);
      if (!userIsSignedIn) {
        const next = anonRunCount + 1;
        setAnonRunCount(next);
        if (typeof window !== "undefined") localStorage.setItem("forestock_anon_runs", String(next));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("error");
    }
  };

  const loadDemo = () => { setCsvText(DEMO_CSV); setFileName("demo-inventory.csv"); setInputMode("csv"); setError(null); setDetectedFormat("standard"); runForecast(DEMO_CSV); };
  const reset = () => { setStep("idle"); setAnalysis(null); setError(null); setFileName(null); setCsvText(""); setDetectedFormat(null); };
  const isLoading = ["parsing", "analyzing", "generating"].includes(step);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const productCountInCsv = csvText ? countUniqueProducts(csvText) : 0;
  const isOverLimit = productCountInCsv > FREE_PRODUCT_LIMIT;
  const isFreeTier = userPlan !== "pro";

  const sortedProducts = analysis?.products ? [...analysis.products].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "stockoutRisk") cmp = (RISK_ORDER[a.stockoutRisk] ?? 9) - (RISK_ORDER[b.stockoutRisk] ?? 9);
    else if (sortKey === "productName") cmp = a.productName.localeCompare(b.productName);
    else cmp = (a[sortKey] as number) - (b[sortKey] as number);
    return sortDir === "asc" ? cmp : -cmp;
  }) : [];

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 ${sortKey === col ? "text-[#006d34]" : "text-[#8a9a8a]"}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#f6faf6] relative overflow-x-hidden">
      <AnimatePresence>
        {upgradeModal && <UpgradeModal feature={upgradeModal} onClose={() => setUpgradeModal(null)} />}
      </AnimatePresence>
      {showSignupGate && <SignupGateModal onDismiss={() => setShowSignupGate(false)} />}
      {showFeedback && (
        <FeedbackPopup
          page="forecast"
          delayMs={5000}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {/* Nav */}
      <nav className="border-b border-[#bbcbba]/30 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-[#006d34]/20 flex-shrink-0">
            <LogoMark size={36} />
          </div>
          <span className="text-[16px] font-semibold text-[#181d1b] tracking-tight">Fore<span className="text-[#006d34]">stock</span></span>
        </Link>
        {CLERK_READY ? (
          <ForecastNavAuth onReset={reset} showReset={step === "done"} userPlan={userPlan} forecastCount={forecastCount} />
        ) : (
          <div className="flex items-center gap-3">
            {step === "done" && (
              <button onClick={reset} className="text-sm text-[#5a6059] hover:text-[#181d1b] transition-colors flex items-center gap-1.5 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                New Forecast
              </button>
            )}
            <Link href="/#pricing" className="text-xs font-semibold bg-emerald-brand text-white px-3.5 py-1.5 rounded-lg transition-all hover:opacity-90 shadow-md">
              Upgrade to Pro
            </Link>
          </div>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <AnimatePresence mode="wait">

          {/* ── IDLE ── */}
          {step === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              {/* Page header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#8a9a8a] uppercase">Inventory</span>
                    <svg className="w-3 h-3 text-[#bbcbba]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <span className="text-[10px] font-bold tracking-widest text-[#006d34] uppercase">Forecast</span>
                  </div>
                  <h1 className="text-3xl font-bold text-[#181d1b] tracking-tight mb-2">Generate Prediction</h1>
                  <p className="text-[15px] text-[#5a6059] max-w-lg">Upload your Shopify orders CSV or Excel file — get stockout dates, reorder quantities, and revenue at risk in 30 seconds.</p>
                </div>
                <button
                  onClick={downloadSampleCSV}
                  className="flex items-center gap-2 bg-white border border-[#bbcbba]/60 text-[#5a6059] hover:text-[#181d1b] hover:bg-[#f0f5f1] font-medium py-2.5 px-4 rounded-xl transition-all text-sm shadow-sm flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Download Sample CSV
                </button>
              </div>

              {/* Sign-in nudge for anonymous users */}
              {CLERK_READY && !userIsSignedIn && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#006d34]/[0.05] border border-[#006d34]/15 rounded-xl px-4 py-3 mb-6">
                  <div>
                    <p className="text-[13px] font-semibold text-[#181d1b]">Get 5 forecast runs free</p>
                    <p className="text-[12px] text-[#5a6059]">Sign up to save history, get stockout email alerts, and run 5 full forecasts — free.</p>
                  </div>
                  <SignUpButton mode="redirect">
                    <button type="button" className="flex-shrink-0 text-[12px] font-semibold text-white bg-emerald-brand px-4 py-2 rounded-xl transition-all hover:opacity-90 whitespace-nowrap shadow-sm">
                      Sign up free →
                    </button>
                  </SignUpButton>
                </div>
              )}

              {/* Main bento grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                {/* ── Left: Upload panel ── */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-2xl border border-[#bbcbba]/40 shadow-sm p-8 relative overflow-hidden group">
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#006d34]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Mode tabs */}
                    <div className="flex items-center gap-1 bg-[#eaefeb] border border-[#bbcbba]/60 rounded-lg p-1 w-fit mb-6">
                      {(["csv", "manual"] as InputMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setInputMode(mode)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            inputMode === mode ? "bg-white text-[#181d1b] shadow-sm border border-[#bbcbba]/60" : "text-[#5a6059] hover:text-[#181d1b]"
                          }`}
                        >
                          {mode === "csv" ? "Upload CSV" : "Paste Data"}
                        </button>
                      ))}
                    </div>

                    {inputMode === "csv" ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`relative z-10 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-14 cursor-pointer transition-all duration-200 ${
                          dragOver ? "border-[#006d34] bg-[#006d34]/[0.05]" :
                          fileName ? "border-[#006d34]/50 bg-[#006d34]/[0.04]" :
                          "border-[#bbcbba]/60 hover:border-[#006d34]/40 hover:bg-[#006d34]/[0.02]"
                        }`}
                      >
                        <input ref={fileRef} id="csv-upload" type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" title="Upload CSV or Excel file" aria-label="Upload inventory CSV or Excel file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                        {fileName ? (
                          <>
                            <div className="w-16 h-16 rounded-full bg-[#006d34]/[0.08] border border-[#006d34]/20 flex items-center justify-center mb-5">
                              <svg className="w-8 h-8 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-[#006d34] font-semibold text-base">{fileName}</p>
                            {detectedFormat === "shopify-orders" && (
                              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006d34] bg-[#006d34]/[0.08] border border-[#006d34]/20 px-2.5 py-1 rounded-full mt-3">
                                ✓ Shopify orders format detected — auto-converted
                              </p>
                            )}
                            <p className="text-[#8a9a8a] text-xs mt-3">Click to replace file</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-[#eaefeb] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                              <svg className="w-8 h-8 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-[#181d1b] mb-1.5">Select files or drag and drop</h4>
                            <p className="text-[#8a9a8a] text-sm text-center max-w-xs mb-6">Supported: CSV, XLSX · Shopify orders exports work directly — no reformatting needed.</p>
                            <div className="flex gap-3">
                              <span className="bg-[#006d34] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md shadow-[#006d34]/20">Browse Files</span>
                              <span className="bg-[#eaefeb] text-[#5a6059] text-sm font-medium px-6 py-2.5 rounded-full">Shopify: Orders → Export</span>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        placeholder={`product,sku,date,units_sold,current_stock\nYoga Mat,YM-001,2024-01-01,8,45`}
                        rows={10}
                        className="w-full bg-[#f0f5f1] rounded-xl border border-[#bbcbba]/60 focus:border-[#006d34]/40 outline-none p-4 text-sm text-[#181d1b] placeholder:text-[#bbcbba] font-mono resize-none transition-colors"
                      />
                    )}

                    {/* Error */}
                    {error && (
                      <div className="mt-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
                        <div className="flex items-start gap-2 text-red-600 text-sm mb-2">
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                          <span className="font-medium">{error}</span>
                        </div>
                        <button onClick={downloadSampleCSV} className="text-xs text-[#006d34] hover:underline font-medium ml-6">↓ Download sample CSV template</button>
                      </div>
                    )}

                  </div>
                </div>

                {/* ── Right: Parameters panel ── */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-[#eaefeb] rounded-2xl p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-6">
                      <svg className="w-4.5 h-4.5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                      <h4 className="text-base font-bold text-[#181d1b]">Forecast Parameters</h4>
                    </div>

                    <div className="space-y-5 flex-1">
                      {/* Lead time */}
                      <div>
                        <label htmlFor="lead-time" className="block text-[10px] font-bold text-[#5a6059] uppercase tracking-widest mb-2">Lead Time (days)</label>
                        <input
                          id="lead-time" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} min={1} max={120}
                          placeholder="14"
                          className="w-full bg-white rounded-xl border border-[#bbcbba]/60 focus:border-[#006d34]/40 outline-none px-4 py-3 text-xl font-bold text-[#181d1b] transition-colors"
                        />
                        <p className="mt-1.5 text-[11px] text-[#8a9a8a] italic">Avg. duration from order to warehouse receipt.</p>
                      </div>

                      {/* Ad spend — Pro only */}
                      <div className={userPlan !== "pro" ? "opacity-60 pointer-events-none select-none" : ""}>
                        <label htmlFor="ad-spend" className="block text-[10px] font-bold text-[#5a6059] uppercase tracking-widest mb-2 flex items-center gap-2">
                          Upcoming Ad Spend
                          <span className="text-[9px] font-bold text-white bg-emerald-brand px-1.5 py-0.5 rounded-full tracking-wider">PRO</span>
                        </label>
                        <input
                          id="ad-spend" type="text" value={adSpend} onChange={(e) => setAdSpend(e.target.value)}
                          disabled={userPlan !== "pro"}
                          placeholder={userPlan === "pro" ? "e.g. ₹50,000 Meta campaign starting Apr 1" : "Upgrade to Pro to use this feature"}
                          className="w-full bg-white rounded-xl border border-[#bbcbba]/60 focus:border-[#006d34]/40 outline-none px-4 py-3 text-sm text-[#181d1b] placeholder:text-[#bbcbba] transition-colors disabled:bg-[#f6faf6] disabled:cursor-not-allowed"
                        />
                        {userPlan !== "pro" && (
                          <p className="mt-1.5 text-[11px] text-[#006d34] italic">
                            <Link href="/upgrade" className="underline font-semibold">Upgrade to Pro</Link> to unlock ad-spend correlation.
                          </p>
                        )}
                        {userPlan === "pro" && (
                          <p className="mt-1.5 text-[11px] text-[#8a9a8a] italic">Adjusts forecast based on planned marketing spend.</p>
                        )}
                      </div>
                    </div>

                    {/* CTA buttons */}
                    <div className="mt-8 space-y-3">
                      <button
                        onClick={() => runForecast()}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-brand text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-[#006d34]/20 hover:opacity-90 hover:-translate-y-0.5 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
                        Run AI Forecast
                      </button>
                      {CLERK_READY && !userIsSignedIn && (
                        <p className="text-center text-[11px] text-[#8a9a8a]">
                          Using your 1 free guest run ·{" "}
                          <SignUpButton mode="redirect">
                            <button type="button" className="text-[#006d34] font-semibold hover:underline">sign up for 5 runs</button>
                          </SignUpButton>
                        </p>
                      )}
                      <button
                        onClick={loadDemo}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#f0f5f1] border border-[#bbcbba]/60 text-[#5a6059] hover:text-[#181d1b] font-medium py-3 px-5 rounded-2xl transition-all text-sm"
                      >
                        Try Demo Data
                      </button>
                    </div>
                  </div>

                  {/* Engine status card */}
                  <div className="bg-[#006d34]/[0.05] border border-[#006d34]/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="w-2 h-2 bg-[#006d34] rounded-full animate-pulse flex-shrink-0" />
                      <span className="text-[10px] font-bold tracking-widest text-[#006d34] uppercase">Engine Ready</span>
                    </div>
                    <p className="text-sm text-[#5a6059] leading-relaxed">AI model is warmed up and ready. Upload your CSV to get stockout dates and reorder quantities instantly.</p>
                  </div>
                </div>
              </div>

              {/* Bottom info strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Avg. Time", value: "~30s", sub: "per forecast run" },
                  { label: "Free Plan", value: "5 runs", sub: "1 free guest run" },
                  { label: "Formats", value: "CSV · XLSX", sub: "Shopify exports included" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#bbcbba]/40 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-base font-bold text-[#181d1b] tabular-nums">{s.value}</p>
                    <p className="text-[11px] text-[#8a9a8a] mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ── LOADING ── */}
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[55vh] text-center">
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 rounded-full border border-[#006d34]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-[#006d34]/30 animate-ping" style={{ animationDelay: "0.3s" }} />
                <div className="absolute inset-4 rounded-full bg-emerald-brand flex items-center justify-center shadow-xl shadow-[#006d34]/20">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              <StepIndicator step={step} />
              <h2 className="text-xl font-bold text-[#181d1b] mb-1.5">
                {step === "parsing" ? "Reading your data..." : step === "analyzing" ? "Analyzing demand patterns..." : "Building your forecast..."}
              </h2>
              <p className="text-[#5a6059] text-sm">
                {step === "parsing" ? "Parsing CSV rows and SKUs" : step === "analyzing" ? "Identifying trends, velocity, and signals" : "Computing 30/60/90-day projections"}
              </p>
              <div className="w-full max-w-md mt-10 space-y-2.5">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded-xl shimmer border border-[#bbcbba]/20" />)}
              </div>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[55vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#181d1b] mb-2">Forecast Failed</h2>
              <p className="text-[#5a6059] text-sm mb-6 max-w-sm">{error}</p>
              <button onClick={reset} className="bg-emerald-brand text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm hover:opacity-90">Try Again</button>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === "done" && analysis && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

              {/* Page title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-[#181d1b] tracking-tight">Forecast Report</h1>
                  <p className="text-xs text-[#5a6059] mt-0.5">{analysis.totalSkuCount} products analyzed</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#006d34] bg-[#006d34]/[0.08] border border-[#006d34]/20 px-2.5 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    87% accuracy
                  </div>
                  <span className="badge text-xs text-[#5a6059] bg-[#eaefeb] border-[#bbcbba]/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] inline-block" />
                    AI Analysis
                  </span>
                </div>
              </div>

              {/* Sign-up prompt — shown to all non-authed users after their run */}
              {CLERK_READY && <ResultsSignupPrompt />}

              {/* Critical alerts banner */}
              <CriticalAlerts products={sortedProducts} leadTime={parseInt(leadTime) || 14} currency={analysis?.currency ?? currency} />

              {/* Revenue at risk */}
              {analysis.revenueAtRisk && !sortedProducts.some(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high") && (
                <div className="flex items-start gap-3 bg-red-500/[0.06] border border-red-500/15 rounded-xl px-5 py-4 mb-5">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-400">Revenue at Risk</p>
                    <p className="text-sm text-red-300/80 mt-0.5">{analysis.revenueAtRisk}</p>
                  </div>
                </div>
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {/* Revenue at Risk */}
                <div className={`card p-4 flex flex-col gap-3 ${analysis.totalRarAmount > 0 ? "border-red-500/20 bg-red-500/[0.02]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider">Revenue at Risk</p>
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold tracking-tight tabular-nums ${analysis.totalRarAmount > 0 ? "text-red-600" : "text-[#8a9a8a]"}`}>
                      {analysis.totalRarAmount > 0 ? analysis.revenueAtRisk : "—"}
                    </p>
                    <p className="text-xs text-[#8a9a8a] mt-0.5">
                      {analysis.totalRarAmount > 0 ? "if critical SKUs stock out" : "No critical risk"}
                    </p>
                  </div>
                </div>

                {/* Health Score */}
                <div className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider">Inventory Health</p>
                    <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-2">
                      <p className={`text-2xl font-bold tracking-tight tabular-nums ${
                        analysis.healthScore >= 66 ? "text-green-400" : analysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"
                      }`}>{analysis.healthScore}<span className="text-sm font-normal text-[#8a9a8a]">/100</span></p>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#eaefeb] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${analysis.healthScore}%`,
                        background: analysis.healthScore >= 66 ? "#4ade80" : analysis.healthScore >= 51 ? "#facc15" : "#f87171"
                      }} />
                    </div>
                  </div>
                </div>

                {/* First Stockout */}
                <div className={`card p-4 flex flex-col gap-3 ${analysis.criticalCount > 0 ? "border-orange-500/20 bg-orange-500/[0.02]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider">Next Stockout</p>
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const first = sortedProducts[0];
                      if (!first || first.stockoutRisk === "low") return (
                        <>
                          <p className="text-2xl font-bold tracking-tight text-green-400">Safe</p>
                          <p className="text-xs text-[#8a9a8a] mt-0.5">All products 30+ days</p>
                        </>
                      );
                      return (
                        <>
                          <p className="text-2xl font-bold tracking-tight text-orange-400 tabular-nums">{first.daysOfStockRemaining}d</p>
                          <p className="text-xs text-[#8a9a8a] mt-0.5 truncate">{first.productName}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Action Required */}
                <div className={`card p-4 flex flex-col gap-3 ${(analysis.criticalCount + analysis.atRiskCount) > 0 ? "border-yellow-500/15" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider">Need Action</p>
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold tracking-tight tabular-nums ${(analysis.criticalCount + analysis.atRiskCount) > 0 ? "text-yellow-400" : "text-green-400"}`}>
                      {analysis.criticalCount + analysis.atRiskCount}
                      <span className="text-sm font-normal text-[#8a9a8a]"> / {analysis.totalSkuCount}</span>
                    </p>
                    <p className="text-xs text-[#8a9a8a] mt-0.5">
                      {analysis.criticalCount > 0 ? `${analysis.criticalCount} critical · ${analysis.atRiskCount} at-risk` : analysis.atRiskCount > 0 ? `${analysis.atRiskCount} at-risk` : "All SKUs safe"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary + key insights */}
              <div className="card p-5 mb-5">
                <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider mb-2">Summary</p>
                <p className="text-sm text-[#5a6059] leading-relaxed mb-4">{analysis.summary}</p>
                {analysis.keyInsights.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-[#8a9a8a] uppercase tracking-wider mb-2">Key Insights</p>
                    <ul className="space-y-1.5">
                      {analysis.keyInsights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#5a6059]">
                          <span className="text-[#006d34] mt-0.5 flex-shrink-0">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Ad-spend gate — show teaser if no ad spend was entered */}
              {!adSpend.trim() && isFreeTier && (
                <div className="card p-5 mb-5 border-[#22C55E]/10 relative overflow-hidden">
                  <div className="blur-sm pointer-events-none select-none opacity-40">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Ad-Spend Impact Forecast</h3>
                    </div>
                    <p className="text-sm text-[#5a6059]">Your Meta campaign of ₹50,000 will spike demand by +35% on Yoga Mat — stockout 4 days sooner than projected.</p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[1px]">
                    <span className="text-[10px] font-bold text-white bg-emerald-brand px-2 py-0.5 rounded-full tracking-wider mb-2">PRO FEATURE</span>
                    <p className="text-sm font-semibold text-[#181d1b] mb-1">Ad-Spend Impact Forecast</p>
                    <p className="text-xs text-[#5a6059] mb-3 text-center max-w-[220px]">See how your Meta/Google spend affects stockout dates.</p>
                    <button
                      onClick={() => setUpgradeModal("AI Ad-Spend Correlation")}
                      className="inline-flex items-center gap-2 bg-emerald-brand text-white font-bold text-xs px-4 py-2 rounded-lg transition-all hover:opacity-90"
                    >
                      Unlock with Pro
                    </button>
                  </div>
                </div>
              )}

              {/* Ad-spend visual panel */}
              {analysis.adSpendInsight && (
                <div className="card p-5 mb-5 border-purple-500/15 bg-purple-500/[0.02]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Ad-Spend Impact Forecast</h3>
                    <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md ml-auto">Unique to Forestock</span>
                  </div>
                  {/* Visual formula */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <div className="bg-purple-500/[0.08] border border-purple-500/15 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-[#8a9a8a] uppercase tracking-widest mb-1">Your Ad Spend</p>
                      <p className="text-sm font-bold text-[#181d1b] truncate max-w-[120px]">{adSpend || "—"}</p>
                    </div>
                    <span className="text-[#8a9a8a] text-lg font-bold">→</span>
                    <div className="bg-[#006d34]/[0.07] border border-[#006d34]/15 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-[#8a9a8a] uppercase tracking-widest mb-1">Demand Spike</p>
                      <p className="text-sm font-bold text-[#006d34]">+20–40%</p>
                    </div>
                    <span className="text-[#8a9a8a] text-lg font-bold">→</span>
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-[#8a9a8a] uppercase tracking-widest mb-1">Stockout Risk</p>
                      <p className="text-sm font-bold text-red-600">3–5 days sooner</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#5a6059] leading-relaxed">{analysis.adSpendInsight}</p>
                </div>
              )}

              {/* Cash flow / overstock section */}
              {(() => {
                const overstocked = sortedProducts.filter(p =>
                  p.currentStock > p.forecast90Days * 1.4 && p.stockoutRisk === "low" && p.forecast90Days > 0
                );
                if (!overstocked.length) return null;
                return (
                  <div className="card p-5 mb-5 border-amber-500/15 bg-amber-500/[0.02]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Cash Flow Optimization</h3>
                      <span className="text-xs text-[#8a9a8a] ml-auto">Dead stock tying up working capital</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {overstocked.map(p => {
                        const excess = p.currentStock - Math.round(p.forecast90Days * 1.1);
                        return (
                          <div key={p.productName} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-[#181d1b] font-medium">{p.productName}</span>
                            <span className="text-[#8a9a8a]">—</span>
                            <span className="text-[#5a6059]">overstock by ~{excess} units</span>
                            <span className="text-amber-400 font-semibold">→ reduce next order quantity</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#8a9a8a]">Reducing overstock frees up working capital you can redirect to high-velocity products.</p>
                  </div>
                );
              })()}

              {/* Product table */}
              <div className="card overflow-hidden mb-5">
                <div className="px-5 py-3.5 border-b border-[#bbcbba]/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <h2 className="text-sm font-semibold text-[#181d1b] flex-shrink-0">Product Forecasts</h2>
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      {analysis.criticalCount > 0 && <span className="text-red-600 font-semibold">{analysis.criticalCount} critical</span>}
                      {analysis.atRiskCount > 0 && <><span className="text-[#8a9a8a]">·</span><span className="text-orange-600 font-semibold">{analysis.atRiskCount} high</span></>}
                      {analysis.safeCount > 0 && <><span className="text-[#8a9a8a]">·</span><span className="text-[#8a9a8a]">{analysis.safeCount} safe</span></>}
                    </div>
                  </div>
                  <p className="text-xs text-[#8a9a8a] hidden sm:block flex-shrink-0">Click row to expand</p>
                </div>

                {/* Mobile card list — shown only on small screens */}
                <div className="sm:hidden divide-y divide-[#eaefeb]">
                  {sortedProducts.map((product, i) => {
                    const riskColors: Record<string, string> = {
                      critical: "text-red-600 bg-red-50 border-red-200",
                      high:     "text-orange-600 bg-orange-50 border-orange-200",
                      medium:   "text-yellow-700 bg-yellow-50 border-yellow-200",
                      low:      "text-[#006d34] bg-[#006d34]/[0.08] border-[#006d34]/20",
                    };
                    return (
                      <div key={product.sku || product.productName} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#181d1b] leading-tight">{product.productName}</p>
                            {product.sku && <p className="text-xs text-[#8a9a8a] font-mono mt-0.5">{product.sku}</p>}
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border flex-shrink-0 ${riskColors[product.stockoutRisk] ?? riskColors.low}`}>
                            {product.stockoutRisk.charAt(0).toUpperCase() + product.stockoutRisk.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p className="text-[10px] text-[#8a9a8a] uppercase tracking-wider">Days Left</p>
                            <p className={`text-lg font-bold tabular-nums ${product.daysOfStockRemaining <= 7 ? "text-red-600" : product.daysOfStockRemaining <= 14 ? "text-amber-600" : "text-[#181d1b]"}`}>
                              {product.daysOfStockRemaining <= 0 ? "OUT" : `${product.daysOfStockRemaining}d`}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#8a9a8a] uppercase tracking-wider">Stock</p>
                            <p className="text-sm font-medium text-[#5a6059] tabular-nums">{product.currentStock.toLocaleString()} units</p>
                          </div>
                          {product.estimatedRevenueLoss && (
                            <div>
                              <p className="text-[10px] text-[#8a9a8a] uppercase tracking-wider">Rev. at Risk</p>
                              <p className="text-sm font-bold text-red-600">{product.estimatedRevenueLoss}</p>
                            </div>
                          )}
                          {product.reorderByDate && (
                            <div className="w-full mt-1">
                              <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                                {product.reorderByDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table — hidden on small screens */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="data-table">
                    <thead className="sticky top-16 z-10">
                      <tr>
                        <th className="!pl-4"><button onClick={() => toggleSort("productName")} className="hover:text-slate-300 transition-colors">Product <SortIcon col="productName" /></button></th>
                        <th><button onClick={() => toggleSort("stockoutRisk")} className="hover:text-slate-300 transition-colors">Risk <SortIcon col="stockoutRisk" /></button></th>
                        <th><button onClick={() => toggleSort("daysOfStockRemaining")} className="hover:text-slate-300 transition-colors">Days Left <SortIcon col="daysOfStockRemaining" /></button></th>
                        <th><button onClick={() => toggleSort("currentStock")} className="hover:text-slate-300 transition-colors">Stock <SortIcon col="currentStock" /></button></th>
                        <th>Reorder By</th>
                        <th><button onClick={() => toggleSort("rarAmount")} className="hover:text-slate-300 transition-colors">Rev. at Risk <SortIcon col="rarAmount" /></button></th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.map((product, i) => (
                        <ProductRow key={product.sku || product.productName} product={product} index={i} leadTime={parseInt(leadTime) || 14} isFreeTier={isFreeTier} onUpgrade={(f) => setUpgradeModal(f)} currency={analysis?.currency ?? currency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations + PO Generator */}
              {analysis.topRecommendations.length > 0 && (
                <div className="card p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[#181d1b]">Top Recommendations</h2>
                    <POGenerator products={sortedProducts} />
                  </div>
                  <ol className="space-y-3">
                    {analysis.topRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#5a6059]">
                        <span className="w-6 h-6 rounded-full bg-[#006d34]/[0.08] border border-[#006d34]/20 text-[#006d34] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        {rec}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Email alert capture */}
              {analysis.criticalCount > 0 || analysis.atRiskCount > 0 ? (
                <div className="card p-5 mb-5 border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4.5 h-4.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {alertStatus === "sent" ? (
                        <div className="flex items-center gap-2 text-[#006d34]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-semibold">You&apos;re on the alert list &mdash; we&apos;ll email you when stock is critical.</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-[#181d1b] mb-0.5">Get weekly stockout alerts by email</p>
                          <p className="text-xs text-[#5a6059] mb-3">We&apos;ll send your top at-risk SKUs to your account email every Monday. Free, no spam.</p>
                          <button
                            onClick={handleEmailAlert}
                            disabled={alertStatus === "sending"}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all disabled:opacity-60"
                          >
                            {alertStatus === "sending" ? "Sending..." : "Notify me"}
                          </button>
                          {alertStatus === "error" && <p className="text-xs text-red-600 mt-1.5">Something went wrong. Try again.</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Upsell — only for free users */}
              {userPlan !== "pro" && (
                <div className="rounded-2xl p-6 bg-emerald-950 text-center">
                  <p className="text-white font-semibold mb-1 text-sm">Unlock unlimited forecasts + ad-spend correlation + supplier alerts</p>
                  <p className="text-emerald-100/50 text-xs mb-4">Pro plan — $10/mo. 5× cheaper than Prediko. Cancel anytime.</p>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 bg-emerald-brand text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm hover:opacity-90 hover:-translate-y-0.5"
                  >
                    Upgrade to Pro
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
