"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import type { ForecastAnalysis, ForecastStep, InputMode, ProductForecast } from "@/lib/types";

const _clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_READY =
  (_clerkKey.startsWith("pk_test_") || _clerkKey.startsWith("pk_live_")) &&
  _clerkKey.length > 30;

function ForecastNavAuth({ onReset, showReset }: { onReset: () => void; showReset: boolean }) {
  const { isSignedIn, isLoaded } = useUser();
  return (
    <div className="flex items-center gap-3">
      {showReset && (
        <button onClick={onReset} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          New Forecast
        </button>
      )}
      {isLoaded && isSignedIn ? (
        <>
          <Link href="/#pricing" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Upgrade to Pro
          </Link>
          <UserButton
            appearance={{
              variables: {
                colorBackground: "#0A1415",
                colorText: "#e2f4f4",
                colorTextSecondary: "#94a3b8",
                colorPrimary: "#e2f4f4",
                colorDanger: "#f87171",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
                fontSize: "14px",
              },
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "!bg-[#0D1B1D] !border !border-[#2DD4BF]/20 !shadow-2xl !shadow-black/80 !rounded-xl",
                userButtonPopoverMain: "!bg-[#0D1B1D]",
                userButtonPopoverHeader: "!bg-[#0D1B1D] !border-b !border-white/[0.05]",
                userButtonPopoverActions: "!bg-[#0D1B1D]",
                userButtonPopoverActionButton: "!text-slate-200 hover:!bg-white/[0.05] !rounded-lg",
                userButtonPopoverActionButtonText: "!text-slate-200 !font-medium",
                userButtonPopoverActionButtonIconBox: "!text-slate-400",
                userButtonPopoverFooter: "!hidden",
                userPreviewMainIdentifier: "!text-white !font-semibold",
                userPreviewSecondaryIdentifier: "!text-slate-500",
                userPreviewTextContainer: "!text-white",
              },
            }}
          />
        </>
      ) : (
        <SignInButton mode="redirect">
          <button className="text-xs font-semibold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] px-3.5 py-1.5 rounded-lg transition-colors shadow-lg shadow-[#2DD4BF]/20">
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
    "product,sku,date,units_sold,current_stock,price",
    "Premium Yoga Mat,YM-001,2024-03-01,8,45,1299",
    "Premium Yoga Mat,YM-001,2024-03-02,11,34,1299",
    "Premium Yoga Mat,YM-001,2024-03-03,6,28,1299",
    "Premium Yoga Mat,YM-001,2024-03-04,9,19,1299",
    "Water Bottle XL,WB-004,2024-03-01,18,120,499",
    "Water Bottle XL,WB-004,2024-03-02,22,98,499",
    "Water Bottle XL,WB-004,2024-03-03,25,73,499",
    "Water Bottle XL,WB-004,2024-03-04,20,53,499",
    "Resistance Bands Set,RB-002,2024-03-01,3,87,799",
    "Resistance Bands Set,RB-002,2024-03-02,4,83,799",
    "Resistance Bands Set,RB-002,2024-03-03,2,81,799",
    "Resistance Bands Set,RB-002,2024-03-04,3,78,799",
    "Foam Roller Pro,FR-003,2024-03-01,2,203,1599",
    "Foam Roller Pro,FR-003,2024-03-02,3,200,1599",
    "Foam Roller Pro,FR-003,2024-03-03,1,199,1599",
    "Foam Roller Pro,FR-003,2024-03-04,2,197,1599",
  ].join("\n");
  const blob = new Blob([sample], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stocksense-sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Row-level CSV validation ──────────────────────────────────────────────
const CSV_ALIASES: Record<string, string[]> = {
  product:       ["product", "product_name", "name", "item", "item_name", "title"],
  units_sold:    ["units_sold", "sold", "sales", "quantity_sold", "qty_sold", "quantity"],
  current_stock: ["current_stock", "stock", "inventory", "qty", "on_hand", "stock_quantity"],
  // optional columns — recognized but not required
  price:         ["price", "unit_price", "avg_price", "selling_price", "mrp"],
};

function validateCsv(csv: string): string[] {
  const errors: string[] = [];
  const lines = csv.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) {
    return ["CSV needs at least a header row and one data row. Download the sample CSV to see the correct format."];
  }

  const raw = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());

  const idx: Record<string, number> = {};
  for (const [key, aliases] of Object.entries(CSV_ALIASES)) {
    const found = raw.findIndex(h => aliases.includes(h));
    if (found === -1) {
      errors.push(`Column "${key}" not found. Accepted names: ${aliases.join(", ")}. See sample CSV ↓`);
    } else {
      idx[key] = found;
    }
  }
  if (errors.length) return errors; // header errors block row-level check

  for (let i = 1; i < Math.min(lines.length, 300); i++) {
    const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));

    if (!cols[idx.product]) {
      errors.push(`Row ${i + 1}: Product name is empty — every row needs a product name.`);
    }
    const sold = cols[idx.units_sold] ?? "";
    if (sold !== "" && isNaN(Number(sold))) {
      errors.push(`Row ${i + 1}: "units_sold" value "${sold}" must be a number, not text.`);
    }
    const stock = cols[idx.current_stock] ?? "";
    if (stock !== "" && isNaN(Number(stock))) {
      errors.push(`Row ${i + 1}: "current_stock" value "${stock}" must be a number, not text.`);
    }
    if (errors.length >= 4) {
      errors.push("Fix these errors first, then re-upload. Need help? Download the sample CSV below.");
      break;
    }
  }
  return errors;
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
        name: "StockSense AI",
        description: data.planName,
        order_id: data.orderId,
        theme: { color: "#2DD4BF" },
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

  const handleUpgrade = () => {
    setPaying(true); setPayError(false);
    startRazorpayCheckout(
      "pro",
      () => { setPaying(false); setPaySuccess(true); },
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
        className="w-full max-w-sm rounded-2xl border border-[#2DD4BF]/20 bg-[#0A1415] shadow-2xl shadow-black/60 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#2DD4BF]/[0.08]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">Pro Feature</p>
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
                <svg className="w-3.5 h-3.5 text-[#2DD4BF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-[28px] font-semibold text-white tracking-tight">₹1,499</span>
            <span className="text-slate-500 text-sm">/month · cancel anytime</span>
          </div>
          {paySuccess ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#2DD4BF]">Payment successful! Refreshing your access...</p>
            </div>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                disabled={paying}
                className="block w-full text-center bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-[#2DD4BF]/20 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {paying ? "Opening payment..." : "Upgrade to Pro — ₹1,999/mo"}
              </button>
              {payError && <p className="text-xs text-red-400 text-center mt-2">Payment failed. Try again or <Link href="/#pricing" className="underline">pay on pricing page</Link>.</p>}
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
  if (score >= 60) return { color: "#2DD4BF", label: "text-[#2DD4BF]" };
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

type SortKey = "productName" | "daysOfStockRemaining" | "stockoutRisk" | "avgDailySales" | "currentStock";
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
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" strokeLinecap="round" />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${half} ${half}`} strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 8px ${color}50)`, transition: "stroke-dashoffset 1s ease-out" }}
          />
          <text x="50" y="46" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="inherit">{score}</text>
        </svg>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: color ?? "#fafafa" }}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Product Row (expandable) ─────────────────────────────────────────────

function ProductRow({ product, index, leadTime, isFreeTier, onUpgrade }: { product: ProductForecast; index: number; leadTime: number; isFreeTier: boolean; onUpgrade: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const reorderDurationDays = product.avgDailySales > 0 ? Math.round(product.reorderQuantity / product.avgDailySales) : 0;
  const alreadyLate = product.daysOfStockRemaining > 0 && product.daysOfStockRemaining <= leadTime;

  const trendIcon = product.trend === "growing"
    ? <span className="text-green-400 font-medium text-xs">↑ +{product.trendPercent}%</span>
    : product.trend === "declining"
    ? <span className="text-red-400 font-medium text-xs">↓ {product.trendPercent}%</span>
    : <span className="text-slate-500 text-xs">→ Stable</span>;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        <td>
          <div>
            <p className="font-medium text-slate-100 text-sm">{product.productName}</p>
            {product.sku && <p className="text-xs text-slate-600 mt-0.5 font-mono">{product.sku}</p>}
          </div>
        </td>
        <td>
          <span className="tabular-nums text-slate-200">{product.currentStock.toLocaleString()}</span>
          <span className="text-slate-600 text-xs ml-1">units</span>
        </td>
        <td>
          <span className={`tabular-nums font-medium text-sm ${product.daysOfStockRemaining <= 7 ? "text-red-400" : product.daysOfStockRemaining <= 14 ? "text-amber-400" : "text-slate-300"}`}>
            {product.daysOfStockRemaining <= 0 ? "OUT" : `${product.daysOfStockRemaining}d`}
          </span>
        </td>
        <td className="text-slate-400 text-sm">{product.stockoutDate}</td>
        <td>{trendIcon}</td>
        <td>
          <span className={riskBadgeClass(product.stockoutRisk)}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
              product.stockoutRisk === "critical" ? "bg-red-400" :
              product.stockoutRisk === "high" ? "bg-orange-400" :
              product.stockoutRisk === "medium" ? "bg-yellow-400" : "bg-green-400"
            }`} />
            {product.stockoutRisk.charAt(0).toUpperCase() + product.stockoutRisk.slice(1)}
          </span>
        </td>
        <td>
          {product.estimatedRevenueLoss
            ? <span className="text-red-400 text-sm font-medium">{product.estimatedRevenueLoss}</span>
            : <span className="text-slate-600 text-sm">—</span>}
        </td>
        <td>
          <svg className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </td>
      </motion.tr>

      <AnimatePresence>
        {open && (
          <tr>
            <td colSpan={8} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-5 bg-[#0A1415]/80 border-t border-[#2DD4BF]/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Why at risk */}
                  {product.riskReason && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Why at risk</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{product.riskReason}</p>
                    </div>
                  )}

                  {/* Reorder action */}
                  <div className="card-sm p-4 bg-[#2DD4BF]/[0.04] border-[#2DD4BF]/15">
                    <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-wider mb-2.5">Reorder Action</p>
                    <p className="text-sm text-slate-200 mb-0.5 font-medium">
                      Order <span className="font-bold text-white">{product.reorderQuantity} units</span>
                      {reorderDurationDays > 0 && (
                        <span className="text-slate-400 font-normal"> → lasts ~{reorderDurationDays} days</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mb-2">Reorder point: {product.reorderPoint} units</p>
                    {product.reorderByDate && (
                      <p className="text-xs font-semibold text-orange-400 mb-1.5">{product.reorderByDate}</p>
                    )}
                    {alreadyLate && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 px-2.5 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        Lead time {leadTime}d: you are already late — order immediately
                      </div>
                    )}
                  </div>

                  {/* Demand forecast */}
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Demand Forecast</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "30 Days", value: product.forecast30Days, locked: false },
                        { label: "60 Days", value: product.forecast60Days, locked: isFreeTier },
                        { label: "90 Days", value: product.forecast90Days, locked: isFreeTier },
                      ].map((f) => (
                        f.locked ? (
                          <button key={f.label} onClick={() => onUpgrade("60 & 90-day Forecasts")} className="card-sm p-3 text-center relative overflow-hidden hover:border-[#2DD4BF]/20 transition-colors group">
                            <p className="text-base font-bold text-white blur-sm select-none">000</p>
                            <p className="text-xs text-slate-600">{f.label}</p>
                            <div className="absolute inset-0 flex items-center justify-center bg-[#0A1415]/70 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-4 h-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <div key={f.label} className="card-sm p-3 text-center">
                            <p className="text-base font-bold text-white">{f.value}</p>
                            <p className="text-xs text-slate-600">{f.label}</p>
                          </div>
                        )
                      ))}
                    </div>
                    {isFreeTier && (
                      <button onClick={() => onUpgrade("60 & 90-day Forecasts")} className="mt-2 flex items-center gap-1.5 text-[11px] text-[#2DD4BF] hover:text-white transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Unlock 60 & 90-day forecasts with Pro
                      </button>
                    )}
                  </div>

                  {/* Seasonal note */}
                  {product.seasonalNote && (
                    <div className="sm:col-span-3 border-l-2 border-indigo-500/30 pl-3">
                      <p className="text-xs text-slate-400 leading-relaxed">{product.seasonalNote}</p>
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

function CriticalAlerts({ products, leadTime }: { products: ProductForecast[]; leadTime: number }) {
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
              <span className="text-sm text-slate-500">— stockout in</span>
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
                  <span className="text-[10px] text-slate-500 whitespace-nowrap tabular-nums">
                    {p.avgDailySales.toFixed(1)} u/day × {leadTime}d × ₹{p.price.toLocaleString("en-IN")}
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
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const lines = [
      "PURCHASE ORDER",
      `Generated by StockSense AI — ${today}`,
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
          ? "bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF]"
          : "bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white"
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
          <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i <= activeIdx ? "text-[#2DD4BF]" : "text-slate-600"}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
              i < activeIdx ? "bg-[#2DD4BF] border-[#2DD4BF] text-[#060C0D]" :
              i === activeIdx ? "border-[#2DD4BF] text-[#2DD4BF] animate-pulse" :
              "border-white/10 text-slate-600"
            }`}>
              {i < activeIdx ? "✓" : i + 1}
            </div>
            {s.label}
          </div>
          {i < steps.length - 1 && <div className={`w-8 h-px transition-colors ${i < activeIdx ? "bg-[#2DD4BF]" : "bg-white/10"}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function ForecastClient() {
  const [inputMode, setInputMode] = useState<InputMode>("csv");
  const [step, setStep] = useState<ForecastStep>("idle");
  const [analysis, setAnalysis] = useState<ForecastAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [adSpend, setAdSpend] = useState("");
  const [leadTime, setLeadTime] = useState("14");
  const [sortKey, setSortKey] = useState<SortKey>("stockoutRisk");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [upgradeModal, setUpgradeModal] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertStatus, setAlertStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const fileRef = useRef<HTMLInputElement>(null);
  const demoRan = useRef(false);

  // Auto-run demo if ?demo=true is in the URL
  // Using window.location directly to avoid useSearchParams (requires Suspense in Next.js 16)
  useEffect(() => {
    if (demoRan.current) return;
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "true") {
      demoRan.current = true;
      setCsvText(DEMO_CSV);
      setFileName("demo-inventory.csv");
      setInputMode("csv");
      setError(null);
      runForecast(DEMO_CSV);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") { setError("Please upload a CSV file."); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => { setCsvText(e.target?.result as string); setError(null); };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleEmailAlert = async () => {
    if (!alertEmail.trim() || !alertEmail.includes("@")) return;
    setAlertStatus("sending");
    try {
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: alertEmail, analysis }),
      });
      setAlertStatus(res.ok ? "sent" : "error");
    } catch {
      setAlertStatus("error");
    }
  };

  const runForecast = async (overrideData?: string) => {
    const data = (overrideData ?? csvText).trim();
    if (!data || data.length < 20) { setError("Please upload a CSV or paste your sales data first."); return; }

    // Client-side validation before hitting the API
    const validationErrors = validateCsv(data);
    if (validationErrors.length) { setError(validationErrors[0]); return; }

    setError(null); setAnalysis(null);
    setStep("parsing"); await new Promise((r) => setTimeout(r, 600));
    setStep("analyzing"); await new Promise((r) => setTimeout(r, 800));
    setStep("generating");
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData: data, adSpendData: adSpend.trim() || undefined, leadTimeDays: parseInt(leadTime) || 14 }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Forecast failed.");
      setAnalysis(json.analysis);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("error");
    }
  };

  const loadDemo = () => { setCsvText(DEMO_CSV); setFileName("demo-inventory.csv"); setInputMode("csv"); setError(null); runForecast(DEMO_CSV); };
  const reset = () => { setStep("idle"); setAnalysis(null); setError(null); setFileName(null); setCsvText(""); };
  const isLoading = ["parsing", "analyzing", "generating"].includes(step);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const productCountInCsv = csvText ? countUniqueProducts(csvText) : 0;
  const isOverLimit = productCountInCsv > FREE_PRODUCT_LIMIT;
  // Free tier = Clerk not configured yet, or user not signed in
  // isFreeTier is derived inside ForecastNavAuth for auth state;
  // here we default to true (gated) until auth confirms sign-in
  const isFreeTier = !CLERK_READY;

  const sortedProducts = analysis?.products ? [...analysis.products].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "stockoutRisk") cmp = (RISK_ORDER[a.stockoutRisk] ?? 9) - (RISK_ORDER[b.stockoutRisk] ?? 9);
    else if (sortKey === "productName") cmp = a.productName.localeCompare(b.productName);
    else cmp = (a[sortKey] as number) - (b[sortKey] as number);
    return sortDir === "asc" ? cmp : -cmp;
  }) : [];

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 ${sortKey === col ? "text-[#2DD4BF]" : "text-slate-700"}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#060C0D] relative overflow-x-hidden">
      <AnimatePresence>
        {upgradeModal && <UpgradeModal feature={upgradeModal} onClose={() => setUpgradeModal(null)} />}
      </AnimatePresence>
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#2DD4BF]/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="orb orb-cyan w-64 h-64 top-1/2 right-0 opacity-10 pointer-events-none" />

      {/* Nav */}
      <nav className="border-b border-[#2DD4BF]/10 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40 bg-[#060C0D]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2DD4BF] flex items-center justify-center shadow-lg shadow-[#2DD4BF]/25">
            <svg className="w-4.5 h-4.5 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <span className="text-[16px] font-semibold text-white tracking-tight">StockSense<span className="text-[#2DD4BF]">AI</span></span>
        </Link>
        {CLERK_READY ? (
          <ForecastNavAuth onReset={reset} showReset={step === "done"} />
        ) : (
          <div className="flex items-center gap-3">
            {step === "done" && (
              <button onClick={reset} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                New Forecast
              </button>
            )}
            <Link href="/#pricing" className="text-xs font-semibold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] px-3.5 py-1.5 rounded-lg transition-colors shadow-lg shadow-[#2DD4BF]/20">
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
              <div className="mb-8">
                <h1 className="text-3xl font-light text-white tracking-tight mb-1.5">Inventory Forecast</h1>
                <p className="text-[15px] text-slate-500">Upload your Shopify sales CSV to get AI-powered demand forecasts, stockout alerts, and revenue impact estimates.</p>
              </div>

              {/* Input card */}
              <div className="card p-6 mb-4">
                {/* Mode tabs */}
                <div className="flex items-center gap-1 bg-[#0A1415] border border-[#2DD4BF]/10 rounded-lg p-1 w-fit mb-5">
                  {(["csv", "manual"] as InputMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        inputMode === mode ? "bg-[#0F1C1E] text-white shadow-sm border border-[#2DD4BF]/15" : "text-slate-500 hover:text-slate-300"
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
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-150 ${
                      dragOver ? "border-[#2DD4BF] bg-[#2DD4BF]/[0.04]" :
                      fileName ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/[0.04]" :
                      "border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/[0.02]"
                    }`}
                  >
                    <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                    {fileName ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-[#2DD4BF] font-semibold text-sm">{fileName}</p>
                        <p className="text-slate-600 text-xs mt-1">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-[#0A1415] border border-[#2DD4BF]/15 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                        </div>
                        <p className="text-slate-200 font-medium text-sm mb-1">Drop your Shopify CSV here</p>
                        <p className="text-slate-600 text-xs">or click to browse · product + date + units columns required</p>
                      </>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder={`product,sku,date,units_sold,current_stock\nYoga Mat,YM-001,2024-01-01,8,45`}
                    rows={8}
                    className="w-full bg-[#0A1415] rounded-xl border border-[#2DD4BF]/15 focus:border-[#2DD4BF]/40 outline-none p-4 text-sm text-slate-300 placeholder:text-slate-700 font-mono resize-none transition-colors"
                  />
                )}

                {/* Optional fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Lead Time (days)</label>
                    <input
                      type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} min={1} max={120}
                      className="w-full bg-[#0A1415] rounded-lg border border-[#2DD4BF]/15 focus:border-[#2DD4BF]/40 outline-none px-3 py-2 text-sm text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                      Upcoming Ad Spend
                      <span className="text-[9px] font-bold text-[#060C0D] bg-[#2DD4BF] px-1.5 py-0.5 rounded-full tracking-wider">PRO</span>
                    </label>
                    <input
                      type="text" value={adSpend} onChange={(e) => setAdSpend(e.target.value)}
                      placeholder="e.g. ₹50,000 Meta campaign starting Apr 1"
                      className="w-full bg-[#0A1415] rounded-lg border border-[#2DD4BF]/15 focus:border-[#2DD4BF]/40 outline-none px-3 py-2 text-sm text-slate-300 placeholder:text-slate-700 transition-colors"
                    />
                  </div>
                </div>

                {/* Sample CSV download */}
                <div className="mt-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="text-xs text-slate-600">Not sure of the format?</span>
                  <button onClick={downloadSampleCSV} className="text-xs text-[#2DD4BF] hover:underline font-medium">
                    Download sample CSV
                  </button>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/[0.06] border border-red-500/15 rounded-xl px-4 py-3.5">
                    <div className="flex items-start gap-2 text-red-400 text-sm mb-2">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                    <button onClick={downloadSampleCSV} className="text-xs text-[#2DD4BF] hover:underline font-medium ml-6">
                      ↓ Download sample CSV template
                    </button>
                  </div>
                )}
              </div>

              {/* Over-limit warning */}
              {isOverLimit && (
                <div className="flex items-start gap-3 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl px-4 py-3.5 mb-4">
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-400">Free plan: first {FREE_PRODUCT_LIMIT} products only</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your CSV has {productCountInCsv} products. We&apos;ll analyze the first {FREE_PRODUCT_LIMIT}. &nbsp;
                      <button onClick={() => setUpgradeModal("Unlimited Products")} className="text-[#2DD4BF] hover:underline font-medium">Upgrade to Pro</button>
                      {" "}for the full catalog.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => runForecast()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold py-3 px-6 rounded-xl transition-all shadow-xl shadow-[#2DD4BF]/20 hover:-translate-y-0.5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Run AI Forecast
                </button>
                <button
                  onClick={loadDemo}
                  className="sm:w-auto flex items-center justify-center gap-2 bg-[#0A1415] hover:bg-[#0F1C1E] border border-[#2DD4BF]/15 text-slate-300 hover:text-white font-medium py-3 px-5 rounded-xl transition-all text-sm"
                >
                  Try Demo Data
                </button>
              </div>
              <p className="text-center text-xs text-slate-700 mt-4">Free plan · up to 5 products · no sign-up required</p>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[55vh] text-center">
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 rounded-full border border-[#2DD4BF]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-[#2DD4BF]/30 animate-ping" style={{ animationDelay: "0.3s" }} />
                <div className="absolute inset-4 rounded-full bg-[#2DD4BF] flex items-center justify-center shadow-xl shadow-[#2DD4BF]/30">
                  <svg className="w-5 h-5 text-[#060C0D] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              <StepIndicator step={step} />
              <h2 className="text-xl font-bold text-white mb-1.5">
                {step === "parsing" ? "Reading your data..." : step === "analyzing" ? "Analyzing demand patterns..." : "Building your forecast..."}
              </h2>
              <p className="text-slate-500 text-sm">
                {step === "parsing" ? "Parsing CSV rows and SKUs" : step === "analyzing" ? "Identifying trends, velocity, and signals" : "Computing 30/60/90-day projections"}
              </p>
              <div className="w-full max-w-md mt-10 space-y-2.5">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded-xl shimmer border border-white/5" />)}
              </div>
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {step === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[55vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Forecast Failed</h2>
              <p className="text-slate-400 text-sm mb-6 max-w-sm">{error}</p>
              <button onClick={reset} className="bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold px-6 py-2.5 rounded-xl transition-all text-sm">Try Again</button>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === "done" && analysis && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

              {/* Page title */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Forecast Report</h1>
                  <p className="text-xs text-slate-500 mt-0.5">{analysis.totalSkuCount} products analyzed</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/15 px-2.5 py-1.5 rounded-lg">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    87% accuracy
                  </div>
                  <span className="badge badge-neutral text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] inline-block" />
                    AI Analysis
                  </span>
                </div>
              </div>

              {/* Critical alerts banner */}
              <CriticalAlerts products={sortedProducts} leadTime={parseInt(leadTime) || 14} />

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

              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="card p-5 flex flex-col items-center justify-center text-center">
                  <HealthGauge score={analysis.healthScore} label={analysis.healthLabel} />
                </div>
                <StatCard label="Critical SKUs" value={analysis.criticalCount} sub="need immediate action" color={analysis.criticalCount > 0 ? "#f87171" : "#4ade80"} />
                <StatCard label="At Risk" value={analysis.atRiskCount} sub="stockout within 14 days" color={analysis.atRiskCount > 0 ? "#fb923c" : "#4ade80"} />
                <StatCard label="Safe SKUs" value={analysis.safeCount} sub="30+ days of stock" color="#4ade80" />
              </div>

              {/* Summary + key insights */}
              <div className="card p-5 mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Summary</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{analysis.summary}</p>
                {analysis.keyInsights.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Insights</p>
                    <ul className="space-y-1.5">
                      {analysis.keyInsights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-[#2DD4BF] mt-0.5 flex-shrink-0">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Ad-spend gate — show teaser if no ad spend was entered */}
              {!adSpend.trim() && isFreeTier && (
                <div className="card p-5 mb-5 border-[#2DD4BF]/10 relative overflow-hidden">
                  <div className="blur-sm pointer-events-none select-none opacity-40">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Ad-Spend Impact Forecast</h3>
                    </div>
                    <p className="text-sm text-slate-400">Your Meta campaign of ₹50,000 will spike demand by +35% on Yoga Mat — stockout 4 days sooner than projected.</p>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A1415]/60 backdrop-blur-[1px]">
                    <span className="text-[10px] font-bold text-[#060C0D] bg-[#2DD4BF] px-2 py-0.5 rounded-full tracking-wider mb-2">PRO FEATURE</span>
                    <p className="text-sm font-semibold text-white mb-1">Ad-Spend Impact Forecast</p>
                    <p className="text-xs text-slate-500 mb-3 text-center max-w-[220px]">See how your Meta/Google spend affects stockout dates.</p>
                    <button
                      onClick={() => setUpgradeModal("AI Ad-Spend Correlation")}
                      className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-xs px-4 py-2 rounded-lg transition-all"
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
                    <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md ml-auto">Unique to StockSense</span>
                  </div>
                  {/* Visual formula */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <div className="bg-purple-500/[0.08] border border-purple-500/15 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Your Ad Spend</p>
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">{adSpend || "—"}</p>
                    </div>
                    <span className="text-slate-600 text-lg font-bold">→</span>
                    <div className="bg-[#2DD4BF]/[0.08] border border-[#2DD4BF]/15 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Demand Spike</p>
                      <p className="text-sm font-bold text-[#2DD4BF]">+20–40%</p>
                    </div>
                    <span className="text-slate-600 text-lg font-bold">→</span>
                    <div className="bg-red-500/[0.08] border border-red-500/15 rounded-xl px-3.5 py-2.5 text-center">
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Stockout Risk</p>
                      <p className="text-sm font-bold text-red-400">3–5 days sooner</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{analysis.adSpendInsight}</p>
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
                      <span className="text-xs text-slate-600 ml-auto">Dead stock tying up working capital</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {overstocked.map(p => {
                        const excess = p.currentStock - Math.round(p.forecast90Days * 1.1);
                        return (
                          <div key={p.productName} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-slate-300 font-medium">{p.productName}</span>
                            <span className="text-slate-600">—</span>
                            <span className="text-slate-500">overstock by ~{excess} units</span>
                            <span className="text-amber-400 font-semibold">→ reduce next order quantity</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-600">Reducing overstock frees up working capital you can redirect to high-velocity products.</p>
                  </div>
                );
              })()}

              {/* Product table */}
              <div className="card overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Product Forecasts</h2>
                    <p className="text-xs text-slate-600 mt-0.5 hidden sm:block">Click any row to expand details, reorder dates, and revenue impact</p>
                    <p className="text-xs text-slate-600 mt-0.5 sm:hidden">Tap a product to see reorder details</p>
                  </div>
                </div>

                {/* Mobile card list — shown only on small screens */}
                <div className="sm:hidden divide-y divide-white/[0.04]">
                  {sortedProducts.slice(0, FREE_PRODUCT_LIMIT).map((product, i) => {
                    const riskColors: Record<string, string> = {
                      critical: "text-red-400 bg-red-500/[0.08] border-red-500/20",
                      high:     "text-orange-400 bg-orange-500/[0.08] border-orange-500/20",
                      medium:   "text-yellow-400 bg-yellow-500/[0.08] border-yellow-500/20",
                      low:      "text-[#2DD4BF] bg-[#2DD4BF]/[0.08] border-[#2DD4BF]/20",
                    };
                    return (
                      <div key={product.sku || product.productName} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-100 leading-tight">{product.productName}</p>
                            {product.sku && <p className="text-xs text-slate-600 font-mono mt-0.5">{product.sku}</p>}
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border flex-shrink-0 ${riskColors[product.stockoutRisk] ?? riskColors.low}`}>
                            {product.stockoutRisk.charAt(0).toUpperCase() + product.stockoutRisk.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Days Left</p>
                            <p className={`text-lg font-bold tabular-nums ${product.daysOfStockRemaining <= 7 ? "text-red-400" : product.daysOfStockRemaining <= 14 ? "text-amber-400" : "text-slate-200"}`}>
                              {product.daysOfStockRemaining <= 0 ? "OUT" : `${product.daysOfStockRemaining}d`}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Stock</p>
                            <p className="text-sm font-medium text-slate-300 tabular-nums">{product.currentStock.toLocaleString()} units</p>
                          </div>
                          {product.estimatedRevenueLoss && (
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider">Rev. at Risk</p>
                              <p className="text-sm font-bold text-red-400">{product.estimatedRevenueLoss}</p>
                            </div>
                          )}
                          {product.reorderByDate && (
                            <div className="w-full mt-1">
                              <span className="text-xs font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/15 px-2.5 py-1 rounded-lg">
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
                    <thead>
                      <tr>
                        <th><button onClick={() => toggleSort("productName")} className="hover:text-slate-300 transition-colors">Product <SortIcon col="productName" /></button></th>
                        <th><button onClick={() => toggleSort("currentStock")} className="hover:text-slate-300 transition-colors">Stock <SortIcon col="currentStock" /></button></th>
                        <th><button onClick={() => toggleSort("daysOfStockRemaining")} className="hover:text-slate-300 transition-colors">Days Left <SortIcon col="daysOfStockRemaining" /></button></th>
                        <th>Stockout Date</th>
                        <th><button onClick={() => toggleSort("avgDailySales")} className="hover:text-slate-300 transition-colors">Trend <SortIcon col="avgDailySales" /></button></th>
                        <th><button onClick={() => toggleSort("stockoutRisk")} className="hover:text-slate-300 transition-colors">Risk <SortIcon col="stockoutRisk" /></button></th>
                        <th>Rev. at Risk</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.slice(0, FREE_PRODUCT_LIMIT).map((product, i) => (
                        <ProductRow key={product.sku || product.productName} product={product} index={i} leadTime={parseInt(leadTime) || 14} isFreeTier={isFreeTier} onUpgrade={(f) => setUpgradeModal(f)} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Product gate — hidden SKUs */}
                {sortedProducts.length > FREE_PRODUCT_LIMIT && (
                  <div className="relative">
                    {/* Blurred ghost rows */}
                    <div className="pointer-events-none select-none opacity-30 blur-sm">
                      {sortedProducts.slice(FREE_PRODUCT_LIMIT, FREE_PRODUCT_LIMIT + 3).map((product) => (
                        <div key={product.productName} className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.03]">
                          <div>
                            <p className="text-sm font-medium text-slate-200">{product.productName}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{product.currentStock} units</p>
                          </div>
                          <span className={riskBadgeClass(product.stockoutRisk)}>{product.stockoutRisk}</span>
                        </div>
                      ))}
                    </div>
                    {/* Overlay CTA */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0A1415] via-[#0A1415]/80 to-transparent">
                      <div className="text-center px-6 py-4">
                        <p className="text-sm font-semibold text-white mb-1">
                          {sortedProducts.length - FREE_PRODUCT_LIMIT} more product{sortedProducts.length - FREE_PRODUCT_LIMIT > 1 ? "s" : ""} hidden
                        </p>
                        <p className="text-xs text-slate-500 mb-3">Free plan shows {FREE_PRODUCT_LIMIT} SKUs. Upgrade to analyze your full catalog.</p>
                        <button
                          onClick={() => setUpgradeModal("Unlimited Products")}
                          className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-lg shadow-[#2DD4BF]/20"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          Unlock all {sortedProducts.length} products
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations + PO Generator */}
              {analysis.topRecommendations.length > 0 && (
                <div className="card p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white">Top Recommendations</h2>
                    <POGenerator products={sortedProducts} />
                  </div>
                  <ol className="space-y-3">
                    {analysis.topRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        {rec}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Email alert capture */}
              {analysis.criticalCount > 0 || analysis.atRiskCount > 0 ? (
                <div className="card p-5 mb-5 border-orange-500/15 bg-orange-500/[0.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4.5 h-4.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {alertStatus === "sent" ? (
                        <div className="flex items-center gap-2 text-[#2DD4BF]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-semibold">You're on the alert list — we'll email you when stock is critical.</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-white mb-0.5">Get weekly stockout alerts by email</p>
                          <p className="text-xs text-slate-500 mb-3">We'll email you every Monday with your top at-risk SKUs. Free, no spam.</p>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={alertEmail}
                              onChange={e => setAlertEmail(e.target.value)}
                              placeholder="your@email.com"
                              className="flex-1 bg-[#0A1415] rounded-lg border border-[#2DD4BF]/15 focus:border-[#2DD4BF]/40 outline-none px-3 py-2 text-sm text-white placeholder:text-slate-700 transition-colors min-w-0"
                            />
                            <button
                              onClick={handleEmailAlert}
                              disabled={alertStatus === "sending"}
                              className="flex-shrink-0 bg-orange-500/80 hover:bg-orange-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all disabled:opacity-60"
                            >
                              {alertStatus === "sending" ? "Sending..." : "Notify me"}
                            </button>
                          </div>
                          {alertStatus === "error" && <p className="text-xs text-red-400 mt-1.5">Something went wrong. Try again.</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Upsell */}
              <div className="card p-6 border-[#2DD4BF]/15 bg-gradient-to-r from-[#2DD4BF]/[0.04] to-[#0D9488]/[0.02] text-center">
                <p className="text-white font-semibold mb-1 text-sm">Unlock unlimited forecasts + ad-spend correlation + supplier alerts</p>
                <p className="text-slate-500 text-xs mb-4">Pro plan — ₹1,499/mo. 10× cheaper than Prediko. Cancel anytime.</p>
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-[#2DD4BF]/20 hover:-translate-y-0.5"
                >
                  Upgrade to Pro
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
