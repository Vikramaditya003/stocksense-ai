"use client";

import React, { useState, useEffect, useCallback, useRef, Fragment } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { SavedForecast } from "@/lib/db";
import type { ForecastAnalysis, ProductForecast } from "@/lib/types";
import AppSidebar from "@/components/AppSidebar";
import { CURRENCIES, formatMoney, detectCurrencyFromCsv, type Currency } from "@/lib/currency";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor(diff / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h >= 1) return `${h}h ago`;
  return `${m}m ago`;
}
function healthColor(s: number) {
  if (s >= 66) return "#16a34a";
  if (s >= 51) return "#ca8a04";
  return "#dc2626";
}

function healthLabel(s: number) {
  if (s >= 81) return "Fully Protected";
  if (s >= 66) return "Mostly Safe";
  if (s >= 51) return "Some Risk";
  if (s >= 26) return "Losing Money";
  return "Act Now";
}

// Profit-first copy helpers
function urgencyLabel(days: number) {
  if (days <= 0)  return "Stocked Out — losing sales now";
  if (days <= 3)  return "Stocks out in 72 hours";
  if (days <= 7)  return "Order this week";
  if (days <= 14) return "Order within 2 weeks";
  return "Monitor";
}

const RISK_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const riskCfg = {
  critical: { bar: "bg-red-500",    text: "text-red-600",    badge: "text-red-700 bg-red-50 border-red-200",           dot: "bg-red-500",    label: "Critical" },
  high:     { bar: "bg-orange-500", text: "text-orange-600", badge: "text-orange-700 bg-orange-50 border-orange-200",   dot: "bg-orange-500", label: "High" },
  medium:   { bar: "bg-yellow-500", text: "text-yellow-600", badge: "text-yellow-700 bg-yellow-50 border-yellow-200",   dot: "bg-yellow-500", label: "Medium" },
  low:      { bar: "bg-green-500",  text: "text-green-700",  badge: "text-green-700 bg-green-50 border-green-200",      dot: "bg-green-500",  label: "Safe" },
};

// ─── SVG Trend Chart — dual series: health line + critical count bars ─────────
function TrendChart({ forecasts }: { forecasts: Omit<SavedForecast, "analysis" | "clerk_user_id">[] }) {
  const [tip, setTip] = useState<{ i: number } | null>(null);
  const W = 900; const H = 180;
  const PAD = { top: 16, right: 24, bottom: 36, left: 42 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  if (forecasts.length < 2) return (
    <div className="flex items-center justify-center h-[180px] text-[#5a6059] text-sm">
      Run at least 2 forecasts to see your health trend
    </div>
  );

  const pts = [...forecasts].reverse();
  const maxCrit = Math.max(...pts.map(f => f.critical_count), 1);
  const xS = pts.length > 1 ? cW / (pts.length - 1) : cW;
  const xOf = (i: number) => PAD.left + i * xS;
  const yHealth = (s: number) => PAD.top + cH - (s / 100) * cH;
  const barH = (c: number) => (c / maxCrit) * (cH * 0.35);
  const linePts = pts.map((f, i) => `${xOf(i)},${yHealth(f.health_score)}`).join(" ");

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[340px]" onMouseLeave={() => setTip(null)}>
        <defs>
          <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines at 25/50/75/100 */}
        {[25, 50, 75, 100].map(g => (
          <g key={g}>
            <line x1={PAD.left} y1={yHealth(g)} x2={W - PAD.right} y2={yHealth(g)}
              stroke="rgba(0,0,0,0.06)" strokeWidth={g === 50 ? 1.5 : 1} />
            <text x={PAD.left - 6} y={yHealth(g) + 3.5} fontSize={9} fill="#8a9a8a" textAnchor="end">{g}</text>
          </g>
        ))}

        {/* Critical count bars (background series) */}
        {pts.map((f, i) => {
          const bh = barH(f.critical_count);
          const bw = Math.max(6, xS * 0.35);
          return (
            <rect key={`bar-${f.id}`}
              x={xOf(i) - bw / 2} y={PAD.top + cH - bh} width={bw} height={bh}
              fill={f.critical_count > 0 ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.15)"}
              rx={2}
            />
          );
        })}

        {/* Health area fill */}
        <polygon
          points={`${xOf(0)},${PAD.top + cH} ${linePts} ${xOf(pts.length - 1)},${PAD.top + cH}`}
          fill="url(#hGrad)"
        />

        {/* Health line */}
        <polyline points={linePts} fill="none" stroke="#22C55E" strokeWidth={2} strokeLinejoin="round" />

        {/* Data point circles + hover hit area */}
        {pts.map((f, i) => {
          const cx = xOf(i); const cy = yHealth(f.health_score);
          const isHover = tip?.i === i;
          return (
            <g key={f.id}>
              <rect x={cx - 16} y={PAD.top} width={32} height={cH}
                fill="transparent" onMouseEnter={() => setTip({ i })} />
              {isHover && (
                <line x1={cx} y1={PAD.top} x2={cx} y2={PAD.top + cH}
                  stroke="rgba(0,0,0,0.08)" strokeWidth={1} strokeDasharray="3,3" />
              )}
              <circle cx={cx} cy={cy} r={isHover ? 5.5 : 3.5}
                fill={healthColor(f.health_score)} stroke="#ffffff" strokeWidth={2} />
              <text x={cx} y={H - 8} fontSize={9} fill="#8a9a8a" textAnchor="middle">
                {new Date(f.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tip !== null && (() => {
          const f = pts[tip.i];
          const cx = xOf(tip.i);
          const tipX = Math.min(cx + 10, W - 148);
          const tipY = PAD.top + 2;
          return (
            <g>
              <rect x={tipX} y={tipY} width={138} height={58} rx={6}
                fill="#ffffff" stroke="rgba(0,109,52,0.20)" strokeWidth={1} />
              <text x={tipX + 10} y={tipY + 16} fontSize={10} fill="#8a9a8a">{fmt(f.created_at)}</text>
              <text x={tipX + 10} y={tipY + 32} fontSize={12} fill={healthColor(f.health_score)} fontWeight="bold">
                {f.health_score}/100 — {healthLabel(f.health_score)}
              </text>
              <text x={tipX + 10} y={tipY + 48} fontSize={10} fill={f.critical_count > 0 ? "#dc2626" : "#16a34a"}>
                {f.critical_count > 0 ? `${f.critical_count} critical` : "No critical"} · {f.sku_count} SKUs
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-[#006d34] rounded-full" />
          <span className="text-[10px] text-[#5a6059]">Stock health score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2.5 rounded-sm bg-red-400/30" />
          <span className="text-[10px] text-[#5a6059]">Critical SKUs</span>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Panel (slide-in) ──────────────────────────────────────────────────
function UploadPanel({ onClose, onResult }: { onClose: () => void; onResult: (a: ForecastAnalysis) => void }) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [leadTime, setLeadTime] = useState("14");
  const [currency, setCurrency] = useState<string>("USD");
  const [autoDetected, setAutoDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { setError("CSV files only."); return; }
    setFileName(file.name);
    const r = new FileReader();
    r.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
      setError(null);
      // Auto-detect currency from CSV content
      const detected = detectCurrencyFromCsv(text);
      setCurrency(detected);
      setAutoDetected(true);
    };
    r.readAsText(file);
  };

  const run = async () => {
    if (!csvText.trim()) { setError("Upload a CSV first."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData: csvText.trim(), leadTimeDays: parseInt(leadTime) || 14, currency }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Forecast failed.");
      onResult(json.analysis);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
      className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-[#bbcbba]/40 z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#bbcbba]/40">
        <div>
          <p className="text-[11px] font-semibold text-[#006d34] uppercase tracking-widest">New Forecast</p>
          <h2 className="text-sm font-semibold text-[#181d1b] mt-0.5">Upload inventory CSV</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-[#8a9a8a] hover:text-[#181d1b] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#006d34] bg-[#006d34]/[0.04]" : fileName ? "border-[#006d34]/40 bg-[#006d34]/[0.03]" : "border-[#bbcbba] hover:border-[#006d34]/40"}`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" aria-label="Upload CSV file" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {fileName ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#006d34]/10 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm font-semibold text-[#006d34]">{fileName}</p>
              <p className="text-xs text-[#5a6059] mt-0.5">Click to replace</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-[#8a9a8a] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <p className="text-sm font-medium text-[#181d1b]">Drop CSV here</p>
              <p className="text-xs text-[#5a6059] mt-0.5">product, sku, date, units_sold, current_stock, price</p>
            </>
          )}
        </div>

        {/* Lead time + Currency — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="panel-lead-time" className="block text-xs font-medium text-[#5a6059] uppercase tracking-wider mb-1.5">Lead Time (days)</label>
            <input id="panel-lead-time" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} min={1} max={180}
              className="w-full bg-[#f0f5f1] border border-[#bbcbba]/40 focus:border-[#006d34]/40 rounded-lg px-3 py-2 text-sm text-[#181d1b] outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="panel-currency" className="block text-xs font-medium text-[#5a6059] uppercase tracking-wider mb-1.5">
              Currency
              {autoDetected && <span className="ml-1.5 text-[10px] text-[#006d34] normal-case font-normal">auto-detected</span>}
            </label>
            <select
              id="panel-currency"
              value={currency}
              onChange={(e) => { setCurrency(e.target.value); setAutoDetected(false); }}
              className="w-full bg-[#f0f5f1] border border-[#bbcbba]/40 focus:border-[#006d34]/40 rounded-lg px-3 py-2 text-sm text-[#181d1b] outline-none transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700">{error}</div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-[#bbcbba]/40">
        <button
          type="button"
          onClick={run} disabled={loading || !csvText}
          className="w-full flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-[#060C0D] font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#22C55E]/20"
        >
          {loading ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing…</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>Run AI Forecast</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
type NavSection = "overview" | "products" | "alerts";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const qParam = searchParams.get("q") ?? "";
  const section: NavSection = (["products", "alerts"].includes(tabParam ?? "") ? tabParam : "overview") as NavSection;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState(qParam);

  // Data
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: histData, isLoading: histLoading, mutate: mutateHistory } = useSWR<{ forecasts: Omit<SavedForecast, "analysis" | "clerk_user_id">[] }>(
    isLoaded ? "/api/forecasts" : null,
    fetcher
  );
  const history = histData?.forecasts ?? [];
  const [activeAnalysis, setActiveAnalysis] = useState<ForecastAnalysis | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Product table filter
  type FilterTab = "all" | "critical" | "high" | "medium" | "low";
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const [safeSectionOpen, setSafeSectionOpen] = useState(false);

  // Sync search from URL ?q= param
  useEffect(() => { setSearch(qParam); }, [qParam]);

  const loadDetail = useCallback(async (id: string, date: string) => {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) return;
    try {
      const r = await fetch(`/api/forecasts/${id}`);
      const d = await r.json();
      if (d.forecast?.analysis) {
        setActiveAnalysis(d.forecast.analysis);
        setActiveDate(date);
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-load the latest forecast's products when history first arrives
  const didAutoLoad = useRef(false);
  useEffect(() => {
    if (!histLoading && history.length && !didAutoLoad.current) {
      didAutoLoad.current = true;
      loadDetail(history[0].id, history[0].created_at);
    }
  }, [histLoading, history, loadDetail]);

  const handleNewForecast = (analysis: ForecastAnalysis) => {
    setActiveAnalysis(analysis);
    setActiveDate(new Date().toISOString());
    router.push("/dashboard");
    mutateHistory();
  };

  // Filtered + searched products
  const allProducts: ProductForecast[] = activeAnalysis?.products
    ? [...activeAnalysis.products].sort((a, b) => (RISK_ORDER[a.stockoutRisk] ?? 9) - (RISK_ORDER[b.stockoutRisk] ?? 9))
    : [];

  const activeCurrency = activeAnalysis?.currency ?? "USD";
  const inventoryValue = activeAnalysis?.products
    ? activeAnalysis.products.reduce((sum, p) => sum + p.currentStock * (p.price ?? 0), 0)
    : 0;
  const fmtInventoryValue = inventoryValue > 0
    ? formatMoney(inventoryValue, activeCurrency)
    : "—";

  const filteredProducts = allProducts.filter(p => {
    const matchesTab =
      filterTab === "all" ? true :
      filterTab === "critical" ? p.stockoutRisk === "critical" :
      filterTab === "high" ? p.stockoutRisk === "high" :
      filterTab === "medium" ? p.stockoutRisk === "medium" :
      p.stockoutRisk === "low";
    const matchesSearch = !search || p.productName.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: allProducts.length,
    critical: allProducts.filter(p => p.stockoutRisk === "critical").length,
    high: allProducts.filter(p => p.stockoutRisk === "high").length,
    medium: allProducts.filter(p => p.stockoutRisk === "medium").length,
    low: allProducts.filter(p => p.stockoutRisk === "low").length,
  };

  const alertProducts = allProducts.filter(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high");

  // ── Delta: compare current vs previous forecast ────────────────────────────
  const prevForecast = history.length >= 2 ? history[1] : null;
  const currForecast = history.length >= 1 ? history[0] : null;
  const delta = (prevForecast && currForecast && activeDate === currForecast.created_at) ? {
    health: currForecast.health_score - prevForecast.health_score,
    critical: currForecast.critical_count - prevForecast.critical_count,
    skus: currForecast.sku_count - prevForecast.sku_count,
    since: fmt(prevForecast.created_at),
  } : null;

  // ── Render sections ──────────────────────────────────────────────────────────

  // Derive urgency numbers for the action banner
  const stockingOutSoon = alertProducts.filter(p => p.daysOfStockRemaining <= 7 && p.daysOfStockRemaining >= 0);
  const alreadyOut      = alertProducts.filter(p => p.daysOfStockRemaining <= 0);

  const renderOverview = () => (
    <div className="space-y-3">

      {/* ── URGENCY BANNER (only when there's an active threat) ── */}
      {activeAnalysis && alertProducts.length > 0 && (
        <div className="rounded-xl border border-red-500/25 bg-gradient-to-r from-red-500/[0.08] to-orange-500/[0.04] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-red-700 leading-tight">
                {alreadyOut.length > 0
                  ? `${alreadyOut.length} product${alreadyOut.length > 1 ? "s" : ""} stocked out — you're losing sales right now`
                  : `${stockingOutSoon.length} product${stockingOutSoon.length > 1 ? "s" : ""} will stock out within 7 days`}
              </p>
              <p className="text-[11px] text-red-700/70 mt-0.5">
                {activeAnalysis.totalRarAmount > 0 ? `${activeAnalysis.revenueAtRisk} in revenue at risk · ` : ""}
                {alertProducts.length} SKUs need reorder action
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard?tab=products")}
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-lg shadow-red-500/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            Fix Now — Order Today
          </button>
        </div>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue at risk */}
        <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-widest mb-3">Revenue at Risk</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-3xl font-bold tabular-nums tracking-tight leading-none ${activeAnalysis?.totalRarAmount ? "text-red-600" : "text-[#8a9a8a]"}`}>
              {activeAnalysis?.totalRarAmount ? activeAnalysis.revenueAtRisk : formatMoney(0, activeCurrency)}
            </p>
            {activeAnalysis?.totalRarAmount && (
              <span className="mb-1 flex items-center gap-0.5 text-xs font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full">Critical</span>
            )}
          </div>
          <p className="text-[11px] text-[#5a6059]">
            {activeAnalysis?.totalRarAmount ? "if you don't reorder now" : "No losses detected"}
          </p>
        </div>

        {/* Stock health */}
        <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-widest mb-3">Stock Health</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-3xl font-bold tabular-nums tracking-tight leading-none ${
              activeAnalysis ? activeAnalysis.healthScore >= 66 ? "text-green-700" : activeAnalysis.healthScore >= 51 ? "text-yellow-700" : "text-red-600" : "text-[#8a9a8a]"
            }`}>
              {activeAnalysis ? activeAnalysis.healthScore : "—"}
              {activeAnalysis && <span className="text-sm font-normal text-[#5a6059] ml-0.5">/100</span>}
            </p>
            {delta && delta.health !== 0 && (
              <span className={`mb-1 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                delta.health > 0 ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
              }`}>
                {delta.health > 0 ? "↑" : "↓"} {delta.health > 0 ? "+" : ""}{delta.health}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-[#5a6059]">{activeAnalysis ? healthLabel(activeAnalysis.healthScore) : "Run a forecast"}</p>
          </div>
          {activeAnalysis && (
            <div className="h-1.5 rounded-full bg-[#eaefeb] overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${activeAnalysis.healthScore >= 66 ? "bg-green-500" : activeAnalysis.healthScore >= 51 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${activeAnalysis.healthScore}%` }} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Critical SKUs */}
        <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5">
          <p className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-widest mb-3">Restock Alerts</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-3xl font-bold tabular-nums tracking-tight leading-none ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "text-[#181d1b]" : "text-[#8a9a8a]"}`}>
              {activeAnalysis ? (activeAnalysis.criticalCount + activeAnalysis.atRiskCount) : "—"}
            </p>
            {(activeAnalysis?.criticalCount ?? 0) > 0 && (
              <span className="mb-1 text-xs font-bold text-red-600">Critical</span>
            )}
            {delta && delta.critical !== 0 && (
              <span className={`mb-1 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                delta.critical > 0 ? "text-red-700 bg-red-50" : "text-green-700 bg-green-50"
              }`}>
                {delta.critical > 0 ? "↑" : "↓"} {delta.critical > 0 ? "+" : ""}{delta.critical}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#5a6059]">
            {activeAnalysis ? `${activeAnalysis.criticalCount} critical · ${activeAnalysis.atRiskCount} high` : "No data yet"}
          </p>
        </div>

        {/* Fulfillment / Inventory value — dark accent card */}
        <div className="bg-emerald-900 rounded-xl shadow-lg p-5 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[11px] font-semibold text-emerald-100/50 uppercase tracking-widest mb-3">Inventory Value</p>
            <p className="text-3xl font-bold tabular-nums tracking-tight leading-none text-white mb-3">{fmtInventoryValue}</p>
            {activeAnalysis && (
              <div className="w-full bg-emerald-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(activeAnalysis.safeCount / Math.max(activeAnalysis.totalSkuCount, 1)) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
            )}
            <p className="text-[11px] text-emerald-100/50 mt-2">
              {activeAnalysis ? `${activeAnalysis.safeCount}/${activeAnalysis.totalSkuCount} SKUs safe` : "No data yet"}
            </p>
          </div>
          <svg className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-800 opacity-30 group-hover:rotate-12 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
      </div>

      {/* ── Main two-column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-4">

        {/* LEFT: action table */}
        <div className="bg-white rounded-2xl border border-[#bbcbba]/20 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#bbcbba]/20 bg-[#f0f5f1]/50 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#181d1b]">
                {activeAnalysis && alertProducts.length > 0 ? "Reorder action required" : "Products overview"}
              </p>
              <p className="text-xs text-[#5a6059] mt-0.5">
                {activeAnalysis
                  ? alertProducts.length > 0
                    ? `${alertProducts.length} SKUs at risk of stocking out`
                    : "All products have safe stock levels"
                  : "Upload a CSV to see your reorder plan"}
              </p>
            </div>
            {activeAnalysis && alertProducts.length > 0 && (
              <button
                type="button"
                onClick={() => router.push("/dashboard?tab=products")}
                className="flex-shrink-0 text-xs font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-3 py-1.5 rounded-lg transition-all"
              >
                View all {allProducts.length}
              </button>
            )}
          </div>

          {/* Empty state — premium onboarding */}
          {!activeAnalysis && !histLoading ? (
            <div className="px-5 py-8">
              <div className="max-w-sm mx-auto text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 to-[#22C55E]/5 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#22C55E]/10">
                  <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                </div>
                <h3 className="text-base font-bold text-[#181d1b] mb-1">Find out which products are costing you money</h3>
                <p className="text-sm text-[#5a6059] leading-relaxed">Upload your Shopify inventory CSV and get exact stockout dates, reorder quantities, and revenue at risk in 30 seconds.</p>
              </div>

              {/* Onboarding steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
                {[
                  { step: "1", label: "Export CSV from Shopify", sub: "Products → Export", done: false },
                  { step: "2", label: "Upload it here", sub: "Takes 5 seconds", done: false },
                  { step: "3", label: "Get your reorder plan", sub: "AI analysis in 30s", done: false },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-2.5 bg-[#f0f5f1] border border-[#bbcbba]/40 rounded-xl p-3">
                    <div className="w-5 h-5 rounded-full bg-[#006d34]/10 border border-[#006d34]/25 text-[#006d34] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#181d1b] leading-tight">{s.label}</p>
                      <p className="text-[10px] text-[#5a6059] mt-0.5">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/25"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  Upload Shopify CSV — Free
                </button>
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center justify-center gap-2 border border-[#bbcbba]/60 hover:border-[#006d34]/30 text-[#5a6059] hover:text-[#181d1b] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
                >
                  Try with sample data
                </button>
              </div>
            </div>
          ) : histLoading ? (
            <div className="px-4 py-4 space-y-2.5">
              {[1,2,3,4].map(i => <div key={i} className="h-10 rounded-xl shimmer" />)}
            </div>
          ) : alertProducts.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[#181d1b] font-bold mb-1">No stockouts predicted — your revenue is protected</p>
              <p className="text-xs text-[#5a6059]">All {activeAnalysis?.totalSkuCount} products have healthy stock levels</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#bbcbba]/30">
                  <th className="text-left text-[11px] font-medium text-[#5a6059] px-4 py-2.5">Product</th>
                  <th className="text-left text-[11px] font-medium text-[#5a6059] px-3 py-2.5">Status</th>
                  <th className="text-left text-[11px] font-medium text-[#5a6059] px-3 py-2.5 hidden sm:table-cell">Days left</th>
                  <th className="text-left text-[11px] font-medium text-[#5a6059] px-3 py-2.5 hidden md:table-cell">Order by</th>
                  <th className="text-left text-[11px] font-medium text-[#5a6059] px-3 py-2.5 pr-4">Revenue at risk</th>
                </tr>
              </thead>
              <tbody>
                {alertProducts.slice(0, 7).map((p, i) => {
                  const cfg = riskCfg[p.stockoutRisk] ?? riskCfg.low;
                  return (
                    <motion.tr
                      key={p.sku || p.productName}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.12, delay: i * 0.025 }}
                      className="border-b border-[#bbcbba]/20 hover:bg-[#f0f5f1] transition-colors cursor-pointer"
                      onClick={() => router.push("/dashboard?tab=products")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-[3px] h-8 rounded-full flex-shrink-0 ${cfg.bar}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#181d1b] truncate max-w-[180px]">{p.productName}</p>
                            {p.sku && <p className="text-[11px] text-[#5a6059] font-mono mt-0.5">{p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        {p.daysOfStockRemaining <= 0 ? (
                          <div>
                            <span className="text-sm font-bold tabular-nums text-red-600">OUT</span>
                            {p.stockoutDate && p.stockoutDate !== "Safe (90+ days)" && (
                              <p className="text-[11px] text-red-600/60 mt-0.5">since {p.stockoutDate}</p>
                            )}
                          </div>
                        ) : (
                          <span className={`text-sm font-bold tabular-nums ${p.daysOfStockRemaining <= 7 ? "text-orange-600" : cfg.text}`}>
                            {p.daysOfStockRemaining}d
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {p.reorderByDate
                          ? <p className="text-sm text-[#181d1b]">{p.reorderByDate}</p>
                          : <span className="text-[#8a9a8a]">—</span>}
                      </td>
                      <td className="px-3 py-3 pr-4">
                        {p.estimatedRevenueLoss
                          ? <span className="text-sm font-bold text-red-600">{p.estimatedRevenueLoss}</span>
                          : <span className="text-[#8a9a8a]">—</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeAnalysis && alertProducts.length > 7 && (
            <div className="px-4 py-2.5 border-t border-[#bbcbba]/30 flex items-center justify-between">
              <p className="text-[11px] text-[#5a6059]">+{alertProducts.length - 7} more products need restocking</p>
              <button type="button" onClick={() => router.push("/dashboard?tab=products")}
                className="text-[11px] font-bold text-[#22C55E] hover:text-[#16A34A] transition-colors">
                See all & export reorder list →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: sticky action panel */}
        <div className="flex flex-col gap-4">

          {/* Protection score */}
          <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5">
            <p className="text-xs font-semibold text-[#5a6059] uppercase tracking-widest mb-3">Stock health</p>
            {activeAnalysis ? (
              <>
                <div className="relative flex items-center justify-center mb-4">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke={activeAnalysis.healthScore >= 66 ? "#16a34a" : activeAnalysis.healthScore >= 51 ? "#ca8a04" : "#dc2626"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(activeAnalysis.healthScore / 100) * 251} 251`}
                      className="gauge-fill"
                      style={{ "--target-offset": `${251 - (activeAnalysis.healthScore / 100) * 251}` } as React.CSSProperties}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className={`text-3xl font-bold tabular-nums leading-none ${activeAnalysis.healthScore >= 66 ? "text-green-700" : activeAnalysis.healthScore >= 51 ? "text-yellow-700" : "text-red-600"}`}>
                      {activeAnalysis.healthScore}
                    </p>
                    <p className="text-xs text-[#5a6059] mt-0.5">{healthLabel(activeAnalysis.healthScore)}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Safe", count: activeAnalysis.safeCount, color: "text-green-700", bg: "bg-green-500" },
                    { label: "At risk", count: activeAnalysis.atRiskCount, color: "text-yellow-700", bg: "bg-yellow-500" },
                    { label: "Critical", count: activeAnalysis.criticalCount, color: "text-red-600", bg: "bg-red-500" },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${d.bg} flex-shrink-0`} />
                        <span className="text-xs text-[#5a6059]">{d.label}</span>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${d.color}`}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-[#5a6059]">Upload a CSV to see your health score</p>
              </div>
            )}
          </div>

          {/* What to do next (AI actions) */}
          {(activeAnalysis?.topRecommendations?.length ?? 0) > 0 && (
            <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5">
              <p className="text-xs font-semibold text-[#5a6059] uppercase tracking-widest mb-3">Action plan</p>
              <ol className="space-y-3">
                {activeAnalysis?.topRecommendations.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 text-[#006d34] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-[#5a6059] leading-relaxed">{r}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Past forecasts */}
          <div className="bg-white rounded-xl border border-[#bbcbba]/20 shadow-sm p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#5a6059] uppercase tracking-widest">Past analyses</p>
              <a href="/history" className="text-xs font-bold text-[#006d34] hover:text-[#005a28] transition-colors">VIEW ALL</a>
            </div>
            {histLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 rounded-lg shimmer" />)}</div>
            ) : history.length === 0 ? (
              <p className="text-xs text-[#5a6059] py-2">No analyses yet</p>
            ) : (
              <div className="space-y-1">
                {history.slice(0, 4).map((f) => (
                  <button key={f.id} type="button" onClick={() => loadDetail(f.id, f.created_at)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-colors ${activeDate === f.created_at ? "bg-[#006d34]/[0.05] border border-[#006d34]/20" : "hover:bg-[#f0f5f1] border border-transparent"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.health_score >= 66 ? "bg-green-500" : f.health_score >= 51 ? "bg-yellow-500" : "bg-red-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#181d1b] leading-tight">{fmt(f.created_at)}</p>
                      <p className="text-[11px] text-[#5a6059] leading-tight mt-0.5">{f.sku_count} SKUs · {f.critical_count} critical</p>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${f.health_score >= 66 ? "text-green-700" : f.health_score >= 51 ? "text-yellow-700" : "text-red-600"}`}>
                      {f.health_score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upsell CTA */}
          <div className="rounded-xl bg-emerald-900 p-5 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Pro · Launching soon</p>
              </div>
              <p className="text-[13px] text-white font-semibold mb-0.5">90-day forecasts · Unlimited SKUs</p>
              <p className="text-[11px] text-emerald-100/50 mb-4">Get notified at launch — early-bird discount included.</p>
              <a
                href="mailto:support@getforestock.com?subject=Notify me when Pro launches&body=Hi, please notify me when the Forestock Pro plan goes live."
                className="bg-emerald-brand block w-full text-center text-[12px] font-bold text-white py-2.5 rounded-xl transition-all"
              >
                Notify me when live →
              </a>
            </div>
            <svg className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-800 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Trend chart ── */}
      {history.length >= 2 && (
        <div className="bg-white rounded-2xl border border-[#bbcbba]/20 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-bold text-[#181d1b]">Inventory Trends</p>
              <p className="text-[11px] text-[#5a6059] mt-0.5">{history.length} analyses · health score + critical SKUs per run</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5a6059] bg-[#eaefeb] border border-[#bbcbba]/40 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
              Last run: {timeAgo(history[0].created_at)}
            </div>
          </div>
          <TrendChart forecasts={history} />
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-2xl border border-[#bbcbba]/20 shadow-sm overflow-hidden">
      {/* Filter tabs + search */}
      <div className="px-5 py-4 border-b border-[#bbcbba]/20 bg-[#f0f5f1]/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "critical", "high", "medium", "low"] as FilterTab[]).map((tab) => {
            const colors: Record<FilterTab, string> = {
              all: "text-[#181d1b] border-[#006d34]",
              critical: "text-red-700 border-red-500",
              high: "text-orange-700 border-orange-500",
              medium: "text-yellow-700 border-yellow-500",
              low: "text-green-700 border-green-500",
            };
            const dots: Record<FilterTab, string> = {
              all: "bg-[#22C55E]",
              critical: "bg-red-500",
              high: "bg-orange-500",
              medium: "bg-yellow-500",
              low: "bg-green-500",
            };
            const labels: Record<FilterTab, string> = {
              all: "All SKUs", critical: "Critical", high: "High", medium: "Medium", low: "Safe"
            };
            const active = filterTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  active
                    ? `${colors[tab]} bg-[#f0f5f1] border-current`
                    : "text-[#5a6059] border-transparent hover:text-[#181d1b] hover:bg-[#f0f5f1]"
                }`}
              >
                {tab !== "all" && <span className={`w-1.5 h-1.5 rounded-full ${active ? dots[tab] : "bg-[#8a9a8a]"}`} />}
                {labels[tab]}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-black/[0.06]" : "bg-[#eaefeb]"}`}>
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#f0f5f1] border border-[#bbcbba]/40 rounded-lg px-3 py-1.5 sm:ml-auto min-w-[180px]">
          <svg className="w-3.5 h-3.5 text-[#8a9a8a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="bg-transparent text-xs text-[#181d1b] placeholder:text-[#8a9a8a] outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[#5a6059]">
          {allProducts.length === 0 ? "Run a forecast to see products" : "No products match this filter"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="sticky top-16 z-10">
              <tr>
                <th className="!pl-4">Product</th>
                <th>Risk</th>
                <th>Days left</th>
                <th>In stock</th>
                <th>Order by</th>
                <th>Revenue at risk</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {/* Render a row — extracted to avoid duplication */}
              {(() => {
                const atRisk = filteredProducts.filter(p => p.stockoutRisk !== "low");
                const safe   = filteredProducts.filter(p => p.stockoutRisk === "low");
                const renderRow = (product: ProductForecast, i: number) => {
                const cfg = riskCfg[product.stockoutRisk] ?? riskCfg.low;
                const daysBarPct = Math.min(100, (product.daysOfStockRemaining / 30) * 100);
                const skuKey = product.sku || product.productName;
                const isOpen = expandedSku === skuKey;
                const trendIcon = product.trend === "growing"
                  ? <span className="text-green-600 text-[11px]">↑ +{product.trendPercent}%</span>
                  : product.trend === "declining"
                  ? <span className="text-red-600 text-[11px]">↓ {product.trendPercent}%</span>
                  : null;
                return (
                  <Fragment key={skuKey}>
                    <motion.tr
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.02 }}
                      onClick={() => setExpandedSku(isOpen ? null : skuKey)}
                      className="cursor-pointer group"
                    >
                      <td className="!pl-0">
                        <div className="flex items-center">
                          <div className={`w-[3px] self-stretch rounded-l-sm mr-3 flex-shrink-0 ${cfg.bar} opacity-80`} />
                          <div className="min-w-0 py-0.5">
                            <p className="font-semibold text-[#181d1b] text-sm leading-tight truncate max-w-[200px]">{product.productName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && <span className="text-[11px] text-[#5a6059] font-mono">{product.sku}</span>}
                              {trendIcon}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1.5">
                          {product.daysOfStockRemaining <= 0 ? (
                            <div>
                              <span className="text-sm font-bold tabular-nums text-red-600">OUT</span>
                              {product.stockoutDate && product.stockoutDate !== "Safe (90+ days)" && (
                                <p className="text-[10px] text-red-600/60 leading-tight">since {product.stockoutDate}</p>
                              )}
                            </div>
                          ) : (
                            <>
                              <span className={`text-sm font-bold tabular-nums ${cfg.text}`}>
                                {product.daysOfStockRemaining}d
                              </span>
                              <div className="w-14 h-[5px] rounded-full bg-[#eaefeb] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${cfg.bar} opacity-80`}
                                  style={{ width: `${daysBarPct}%` }}
                                  aria-hidden="true"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td><span className="tabular-nums text-[#5a6059] text-sm">{product.currentStock.toLocaleString()}</span></td>
                      <td>
                        {product.reorderByDate
                          ? <div><p className="text-sm font-semibold text-[#181d1b]">{product.reorderByDate}</p><p className="text-[11px] text-[#5a6059]">{product.reorderQuantity} units</p></div>
                          : <span className="text-[#8a9a8a]">—</span>
                        }
                      </td>
                      <td>
                        {product.estimatedRevenueLoss
                          ? <div><span className="text-red-600 text-sm font-bold">{product.estimatedRevenueLoss}</span>{product.price && <p className="text-[11px] text-[#5a6059]">{product.avgDailySales.toFixed(1)}/d × {formatMoney(product.price, activeCurrency)}</p>}</div>
                          : <span className="text-[#8a9a8a]">—</span>
                        }
                      </td>
                      <td>
                        <svg className={`w-4 h-4 text-[#8a9a8a] group-hover:text-[#5a6059] transition-all duration-200 ${isOpen ? "rotate-180 !text-[#006d34]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {isOpen && (
                        <tr key={`${skuKey}-detail`}>
                          <td colSpan={7} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }} className="overflow-hidden"
                            >
                              <div className="px-5 py-4 bg-[#f0f5f1] border-t border-[#bbcbba]/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.riskReason && (
                                  <div>
                                    <p className="text-[10px] font-bold text-[#5a6059] uppercase tracking-wider mb-1.5">Why at risk</p>
                                    <p className="text-sm text-[#181d1b] leading-relaxed">{product.riskReason}</p>
                                  </div>
                                )}
                                <div className="bg-[#006d34]/[0.05] border border-[#006d34]/20 rounded-xl p-4">
                                  <p className="text-[10px] font-bold text-[#006d34] uppercase tracking-wider mb-2">Reorder Action</p>
                                  {product.daysOfStockRemaining <= 0 && product.stockoutDate && product.stockoutDate !== "Safe (90+ days)" && (
                                    <p className="text-xs font-bold text-red-700 mb-1.5">Out of stock since {product.stockoutDate}</p>
                                  )}
                                  <p className="text-sm text-[#181d1b] font-medium mb-0.5">Order <span className="font-bold text-[#181d1b]">{product.reorderQuantity} units</span></p>
                                  <p className="text-xs text-[#5a6059] mb-1">Reorder point: {product.reorderPoint} · {product.avgDailySales.toFixed(1)}/day</p>
                                  {product.reorderByDate && <p className="text-xs font-bold text-orange-700">{product.reorderByDate}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                  <p className="text-[10px] font-bold text-[#5a6059] uppercase tracking-wider mb-2">Demand Forecast</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {[{l:"30 Days",v:product.forecast30Days},{l:"60 Days",v:product.forecast60Days},{l:"90 Days",v:product.forecast90Days}].map(f => (
                                      <div key={f.l} className="card-sm p-3 text-center"><p className="text-lg font-bold text-[#181d1b] tabular-nums">{f.v}</p><p className="text-xs text-[#5a6059]">{f.l}</p></div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
                };
                return (
                  <>
                    {atRisk.map((p, i) => renderRow(p, i))}
                    {safe.length > 0 && filterTab === "all" && (
                      <>
                        {/* Safe products divider */}
                        <tr>
                          <td colSpan={7} className="px-4 py-0">
                            <button
                              type="button"
                              onClick={() => setSafeSectionOpen(o => !o)}
                              className="w-full flex items-center gap-3 py-2.5 text-left group"
                            >
                              <div className="flex-1 h-px bg-[#bbcbba]/40" />
                              <span className="flex items-center gap-1.5 text-xs font-medium text-[#5a6059] group-hover:text-[#181d1b] transition-colors flex-shrink-0">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {safe.length} safe product{safe.length !== 1 ? "s" : ""}
                                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${safeSectionOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </span>
                              <div className="flex-1 h-px bg-[#bbcbba]/40" />
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {safeSectionOpen && safe.map((p, i) => renderRow(p, atRisk.length + i))}
                        </AnimatePresence>
                      </>
                    )}
                    {/* When filtering to "low" directly, show them normally */}
                    {filterTab === "low" && safe.map((p, i) => renderRow(p, i))}
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      {alertProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#bbcbba]/20 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-[#181d1b] font-semibold mb-1">No active alerts</p>
          <p className="text-sm text-[#5a6059]">{activeAnalysis ? "All products are safe" : "Run a forecast to check for alerts"}</p>
        </div>
      ) : (
        alertProducts.map(p => {
          const isCrit = p.stockoutRisk === "critical";
          return (
            <div key={p.productName} className={`card p-4 ${isCrit ? "border-red-300/40 bg-red-50/50" : "border-orange-300/40"}`}>
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 animate-pulse ${isCrit ? "bg-red-500" : "bg-orange-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-semibold ${isCrit ? "text-red-700" : "text-orange-700"}`}>{p.productName}</p>
                    {p.sku && <span className="text-[11px] text-[#5a6059] font-mono">{p.sku}</span>}
                  </div>
                  <p className="text-sm text-[#5a6059]">{p.riskReason}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {p.daysOfStockRemaining <= 0 ? (
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                        Out of stock{p.stockoutDate && p.stockoutDate !== "Safe (90+ days)" ? ` since ${p.stockoutDate}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-[#5a6059]">Stockout in <span className={`font-bold ${isCrit ? "text-red-600" : "text-orange-600"}`}>{p.daysOfStockRemaining}d</span></span>
                    )}
                    {p.reorderByDate && <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg">{p.reorderByDate}</span>}
                    {p.estimatedRevenueLoss && <span className="text-xs font-bold text-red-700">{p.estimatedRevenueLoss} at risk</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f6faf6] flex">
      {/* Upload panel overlay */}
      <AnimatePresence>
        {uploadOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setUploadOpen(false)}
            />
            <UploadPanel onClose={() => setUploadOpen(false)} onResult={handleNewForecast} />
          </>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <AppSidebar alertCount={alertProducts.length} />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — white glass, matches mockup */}
        <header className="border-b border-[#bbcbba]/30 bg-white/70 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4 px-6 h-14">
            {/* Search */}
            <div className="relative flex-1 max-w-sm group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9a8a] group-focus-within:text-[#006d34] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, SKUs…"
                className="w-full pl-9 pr-4 py-2 bg-[#f0f5f1] border-none rounded-full text-sm text-[#181d1b] placeholder-[#8a9a8a] outline-none focus:ring-2 focus:ring-[#006d34]/20 transition-all"
              />
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-5">
              {/* Status pills */}
              <div className="hidden md:flex items-center gap-2">
                {activeDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#5a6059] bg-[#eaefeb] border border-[#bbcbba]/40 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
                    {timeAgo(activeDate)}
                  </div>
                )}
                {activeAnalysis && (
                  <div className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
                    activeAnalysis.healthScore >= 66
                      ? "text-green-700 bg-green-50 border-green-200"
                      : activeAnalysis.healthScore >= 51
                      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
                      : "text-red-700 bg-red-50 border-red-200"
                  }`}>
                    Health {activeAnalysis.healthScore}/100
                  </div>
                )}
              </div>

              {/* Icon buttons */}
              <div className="hidden md:flex items-center gap-3 text-[#5a6059]">
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="relative hover:text-[#006d34] transition-colors"
                  aria-label="Upload new forecast"
                  title="New Forecast"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {(alertProducts.length > 0) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#00d26a] rounded-full" />
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="hidden md:block h-7 w-px bg-[#bbcbba]/30" />

              {/* User info + New Forecast CTA */}
              <div className="flex items-center gap-3">
                {activeAnalysis && (
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-semibold text-[#8a9a8a] uppercase tracking-widest leading-none mb-0.5">
                      {section === "overview" ? "Overview" : section === "products" ? "Products" : "Alerts"}
                    </p>
                    <p className="text-[13px] font-bold text-[#181d1b] leading-none">
                      {activeAnalysis.totalSkuCount} SKUs tracked
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="bg-emerald-brand flex items-center gap-1.5 text-[12px] font-bold text-white px-4 py-2 rounded-xl transition-all shadow-md flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  New Forecast
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {section === "overview" && renderOverview()}
              {section === "products" && renderProducts()}
              {section === "alerts" && renderAlerts()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile bottom nav (hidden on md+) ─────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white/95 backdrop-blur-md border-t border-[#bbcbba]/40 z-30">
        <div className="flex items-center h-16">
          {([
            {
              label: "Overview", href: "/dashboard", isActive: section === "overview",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
            },
            {
              label: "Products", href: "/dashboard?tab=products", isActive: section === "products",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
            },
            {
              label: "Alerts", href: "/dashboard?tab=alerts", isActive: section === "alerts", badge: alertProducts.length,
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
            },
            {
              label: "Forecast", href: "/forecast", isActive: false, highlight: true,
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
            },
          ] as { label: string; href: string; isActive: boolean; icon: React.ReactNode; badge?: number; highlight?: boolean }[]).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 h-full relative transition-colors ${
                item.highlight
                  ? "text-[#006d34]"
                  : item.isActive
                  ? "text-[#006d34]"
                  : "text-[#5a6059] hover:text-[#181d1b]"
              }`}
            >
              <span className="relative">
                {item.icon}
                {(item.badge ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {(item.badge ?? 0) > 9 ? "9+" : item.badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-semibold tracking-tight ${item.isActive || item.highlight ? "text-[#006d34]" : "text-[#5a6059]"}`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#006d34] rounded-full" />
              )}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
