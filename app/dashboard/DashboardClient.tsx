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
  if (s >= 66) return "#4ade80";
  if (s >= 51) return "#facc15";
  return "#f87171";
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
  critical: { bar: "bg-red-500",    text: "text-red-400",    badge: "text-red-400 bg-red-500/10 border-red-500/20",    dot: "bg-red-400",    label: "Critical" },
  high:     { bar: "bg-orange-500", text: "text-orange-400", badge: "text-orange-400 bg-orange-500/10 border-orange-500/20", dot: "bg-orange-400", label: "High" },
  medium:   { bar: "bg-yellow-500", text: "text-yellow-400", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", dot: "bg-yellow-400", label: "Medium" },
  low:      { bar: "bg-green-500",  text: "text-green-400",  badge: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",  dot: "bg-green-400",  label: "Safe" },
};

// ─── SVG Trend Chart — dual series: health line + critical count bars ─────────
function TrendChart({ forecasts }: { forecasts: Omit<SavedForecast, "analysis" | "clerk_user_id">[] }) {
  const [tip, setTip] = useState<{ i: number } | null>(null);
  const W = 900; const H = 180;
  const PAD = { top: 16, right: 24, bottom: 36, left: 42 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  if (forecasts.length < 2) return (
    <div className="flex items-center justify-center h-[180px] text-slate-600 text-sm">
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
              stroke="rgba(255,255,255,0.04)" strokeWidth={g === 50 ? 1.5 : 1} />
            <text x={PAD.left - 6} y={yHealth(g) + 3.5} fontSize={9} fill="#334155" textAnchor="end">{g}</text>
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
                  stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3,3" />
              )}
              <circle cx={cx} cy={cy} r={isHover ? 5.5 : 3.5}
                fill={healthColor(f.health_score)} stroke="#060C0D" strokeWidth={2} />
              <text x={cx} y={H - 8} fontSize={9} fill="#475569" textAnchor="middle">
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
                fill="#0D1B1D" stroke="rgba(34,197,94,0.25)" strokeWidth={1} />
              <text x={tipX + 10} y={tipY + 16} fontSize={10} fill="#94a3b8">{fmt(f.created_at)}</text>
              <text x={tipX + 10} y={tipY + 32} fontSize={12} fill={healthColor(f.health_score)} fontWeight="bold">
                {f.health_score}/100 — {healthLabel(f.health_score)}
              </text>
              <text x={tipX + 10} y={tipY + 48} fontSize={10} fill={f.critical_count > 0 ? "#f87171" : "#4ade80"}>
                {f.critical_count > 0 ? `${f.critical_count} critical` : "No critical"} · {f.sku_count} SKUs
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-[#22C55E] rounded-full" />
          <span className="text-[10px] text-slate-500">Stock health score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2.5 rounded-sm bg-red-400/30" />
          <span className="text-[10px] text-slate-500">Critical SKUs</span>
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
      className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#0A1415] border-l border-[#22C55E]/10 z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest">New Forecast</p>
          <h2 className="text-sm font-semibold text-white mt-0.5">Upload inventory CSV</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-white transition-colors">
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#22C55E] bg-[#22C55E]/[0.04]" : fileName ? "border-[#22C55E]/40 bg-[#22C55E]/[0.03]" : "border-[#22C55E]/15 hover:border-[#22C55E]/30"}`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" aria-label="Upload CSV file" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {fileName ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm font-semibold text-[#22C55E]">{fileName}</p>
              <p className="text-xs text-slate-600 mt-0.5">Click to replace</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <p className="text-sm font-medium text-slate-300">Drop CSV here</p>
              <p className="text-xs text-slate-600 mt-0.5">product, sku, date, units_sold, current_stock, price</p>
            </>
          )}
        </div>

        {/* Lead time + Currency — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="panel-lead-time" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Lead Time (days)</label>
            <input id="panel-lead-time" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} min={1} max={180}
              className="w-full bg-[#060C0D] border border-[#22C55E]/15 focus:border-[#22C55E]/40 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="panel-currency" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
              Currency
              {autoDetected && <span className="ml-1.5 text-[10px] text-[#22C55E] normal-case font-normal">auto-detected</span>}
            </label>
            <select
              id="panel-currency"
              value={currency}
              onChange={(e) => { setCurrency(e.target.value); setAutoDetected(false); }}
              className="w-full bg-[#060C0D] border border-[#22C55E]/15 focus:border-[#22C55E]/40 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/[0.06] border border-red-500/15 rounded-lg px-3 py-2.5 text-xs text-red-400">{error}</div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
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
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-red-400 leading-tight">
                {alreadyOut.length > 0
                  ? `${alreadyOut.length} product${alreadyOut.length > 1 ? "s" : ""} stocked out — you're losing sales right now`
                  : `${stockingOutSoon.length} product${stockingOutSoon.length > 1 ? "s" : ""} will stock out within 7 days`}
              </p>
              <p className="text-[11px] text-red-400/70 mt-0.5">
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

      {/* ── KPI row — Lifetimely-style: big number + inline delta badge ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">

        {/* Revenue at risk */}
        <div className={`card p-4 border-l-2 ${activeAnalysis?.totalRarAmount ? "border-l-red-500" : "border-l-transparent"}`}>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Revenue at Risk</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-[30px] font-bold tabular-nums tracking-tight leading-none ${activeAnalysis?.totalRarAmount ? "text-red-400" : "text-slate-600"}`}>
              {activeAnalysis?.totalRarAmount ? activeAnalysis.revenueAtRisk : "₹0"}
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            {activeAnalysis?.totalRarAmount ? "if you don't reorder now" : "No losses detected"}
          </p>
        </div>

        {/* Stock health */}
        <div className={`card p-4 border-l-2 ${
          activeAnalysis
            ? activeAnalysis.healthScore >= 66 ? "border-l-green-500" : activeAnalysis.healthScore >= 51 ? "border-l-yellow-500" : "border-l-red-500"
            : "border-l-transparent"
        }`}>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Stock Health</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-[30px] font-bold tabular-nums tracking-tight leading-none ${
              activeAnalysis ? activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400" : "text-slate-600"
            }`}>
              {activeAnalysis ? activeAnalysis.healthScore : "—"}
              {activeAnalysis && <span className="text-sm font-normal text-slate-500 ml-0.5">/100</span>}
            </p>
            {delta && delta.health !== 0 && (
              <span className={`mb-1 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                delta.health > 0 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
              }`}>
                {delta.health > 0 ? "↑" : "↓"} {delta.health > 0 ? "+" : ""}{delta.health}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">{activeAnalysis ? healthLabel(activeAnalysis.healthScore) : "Run a forecast"}</p>
            {delta && <p className="text-[10px] text-slate-600">vs {delta.since}</p>}
          </div>
          {activeAnalysis && (
            <div className="mt-2.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${activeAnalysis.healthScore >= 66 ? "bg-green-400" : activeAnalysis.healthScore >= 51 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${activeAnalysis.healthScore}%` }} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Critical SKUs */}
        <div className={`card p-4 border-l-2 ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "border-l-orange-500" : "border-l-transparent"}`}>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Need Reorder</p>
          <div className="flex items-end gap-2 mb-1">
            <p className={`text-[30px] font-bold tabular-nums tracking-tight leading-none ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "text-orange-400" : "text-slate-600"}`}>
              {activeAnalysis ? (activeAnalysis.criticalCount + activeAnalysis.atRiskCount) : "—"}
              {activeAnalysis && <span className="text-sm font-normal text-slate-500 ml-1">SKUs</span>}
            </p>
            {delta && delta.critical !== 0 && (
              <span className={`mb-1 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                delta.critical > 0 ? "text-red-400 bg-red-500/10" : "text-green-400 bg-green-500/10"
              }`}>
                {delta.critical > 0 ? "↑" : "↓"} {delta.critical > 0 ? "+" : ""}{delta.critical}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              {activeAnalysis ? `${activeAnalysis.criticalCount} critical · ${activeAnalysis.atRiskCount} high` : "No data yet"}
            </p>
            {delta && delta.critical !== 0 && <p className="text-[10px] text-slate-600">vs {delta.since}</p>}
          </div>
        </div>

        {/* Inventory value */}
        <div className="card p-4 border-l-2 border-l-transparent">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Inventory Value</p>
          <div className="flex items-end gap-2 mb-1">
            <p className="text-[30px] font-bold tabular-nums tracking-tight leading-none text-slate-100">
              {fmtInventoryValue}
            </p>
            {delta && delta.skus !== 0 && (
              <span className={`mb-1 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                delta.skus > 0 ? "text-[#22C55E] bg-[#22C55E]/10" : "text-slate-400 bg-white/[0.04]"
              }`}>
                {delta.skus > 0 ? "+" : ""}{delta.skus} SKUs
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {activeAnalysis ? `${activeAnalysis.totalSkuCount} SKUs tracked` : "No data yet"}
          </p>
          {activeAnalysis && (
            <div className="flex gap-0.5 mt-2.5 h-1 rounded-full overflow-hidden">
              <div className="bg-green-500 rounded-l-full" style={{ width: `${(activeAnalysis.safeCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
              <div className="bg-yellow-500" style={{ width: `${(activeAnalysis.atRiskCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
              <div className="bg-red-500 rounded-r-full" style={{ width: `${(activeAnalysis.criticalCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ── Main two-column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-2.5">

        {/* LEFT: action table */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                {activeAnalysis && alertProducts.length > 0 ? "Reorder action required" : "Products overview"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
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
                <h3 className="text-base font-bold text-white mb-1">Find out which products are costing you money</h3>
                <p className="text-sm text-[#475569] leading-relaxed">Upload your Shopify inventory CSV and get exact stockout dates, reorder quantities, and revenue at risk in 30 seconds.</p>
              </div>

              {/* Onboarding steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
                {[
                  { step: "1", label: "Export CSV from Shopify", sub: "Products → Export", done: false },
                  { step: "2", label: "Upload it here", sub: "Takes 5 seconds", done: false },
                  { step: "3", label: "Get your reorder plan", sub: "AI analysis in 30s", done: false },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
                    <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/25 text-[#22C55E] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
                    <div>
                      <p className="text-[12px] font-semibold text-white leading-tight">{s.label}</p>
                      <p className="text-[10px] text-[#475569] mt-0.5">{s.sub}</p>
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
                  className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-[#22C55E]/30 text-slate-400 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
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
              <p className="text-white font-bold mb-1">No stockouts predicted — your revenue is protected</p>
              <p className="text-xs text-[#475569]">All {activeAnalysis?.totalSkuCount} products have healthy stock levels</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left text-[11px] font-medium text-slate-500 px-4 py-2.5">Product</th>
                  <th className="text-left text-[11px] font-medium text-slate-500 px-3 py-2.5">Status</th>
                  <th className="text-left text-[11px] font-medium text-slate-500 px-3 py-2.5 hidden sm:table-cell">Days left</th>
                  <th className="text-left text-[11px] font-medium text-slate-500 px-3 py-2.5 hidden md:table-cell">Order by</th>
                  <th className="text-left text-[11px] font-medium text-slate-500 px-3 py-2.5 pr-4">Revenue at risk</th>
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
                      className="border-b border-white/[0.03] hover:bg-[#22C55E]/[0.02] transition-colors cursor-pointer"
                      onClick={() => router.push("/dashboard?tab=products")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-[3px] h-8 rounded-full flex-shrink-0 ${cfg.bar}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate max-w-[180px]">{p.productName}</p>
                            {p.sku && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{p.sku}</p>}
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
                            <span className="text-sm font-bold tabular-nums text-red-400">OUT</span>
                            {p.stockoutDate && p.stockoutDate !== "Safe (90+ days)" && (
                              <p className="text-[11px] text-red-400/60 mt-0.5">since {p.stockoutDate}</p>
                            )}
                          </div>
                        ) : (
                          <span className={`text-sm font-bold tabular-nums ${p.daysOfStockRemaining <= 7 ? "text-orange-400" : cfg.text}`}>
                            {p.daysOfStockRemaining}d
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {p.reorderByDate
                          ? <p className="text-sm text-slate-300">{p.reorderByDate}</p>
                          : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-3 py-3 pr-4">
                        {p.estimatedRevenueLoss
                          ? <span className="text-sm font-bold text-red-400">{p.estimatedRevenueLoss}</span>
                          : <span className="text-slate-600">—</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeAnalysis && alertProducts.length > 7 && (
            <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
              <p className="text-[11px] text-[#475569]">+{alertProducts.length - 7} more products need restocking</p>
              <button type="button" onClick={() => router.push("/dashboard?tab=products")}
                className="text-[11px] font-bold text-[#22C55E] hover:text-[#16A34A] transition-colors">
                See all & export reorder list →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: sticky action panel */}
        <div className="flex flex-col gap-3">

          {/* Protection score */}
          <div className="card p-4">
            <p className="text-xs font-medium text-slate-500 mb-3">Stock health</p>
            {activeAnalysis ? (
              <>
                <div className="relative flex items-center justify-center mb-4">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke={activeAnalysis.healthScore >= 66 ? "#4ade80" : activeAnalysis.healthScore >= 51 ? "#facc15" : "#f87171"}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(activeAnalysis.healthScore / 100) * 251} 251`}
                      className="gauge-fill"
                      style={{ "--target-offset": `${251 - (activeAnalysis.healthScore / 100) * 251}` } as React.CSSProperties}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className={`text-3xl font-bold tabular-nums leading-none ${activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {activeAnalysis.healthScore}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{healthLabel(activeAnalysis.healthScore)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Safe", count: activeAnalysis.safeCount, color: "text-green-400", bg: "bg-green-500" },
                    { label: "At risk", count: activeAnalysis.atRiskCount, color: "text-yellow-400", bg: "bg-yellow-500" },
                    { label: "Critical", count: activeAnalysis.criticalCount, color: "text-red-400", bg: "bg-red-500" },
                  ].map(d => (
                    <div key={d.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${d.bg} flex-shrink-0`} />
                        <span className="text-xs text-slate-400">{d.label}</span>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${d.color}`}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-500">Upload a CSV to see your health score</p>
              </div>
            )}
          </div>

          {/* What to do next (AI actions) */}
          {(activeAnalysis?.topRecommendations?.length ?? 0) > 0 && (
            <div className="card p-4">
              <p className="text-xs font-medium text-slate-500 mb-3">Action plan</p>
              <ol className="space-y-2.5">
                {activeAnalysis?.topRecommendations.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{r}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Past forecasts */}
          <div className="card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500">Past analyses</p>
              <a href="/history" className="text-xs text-[#22C55E] hover:text-[#16A34A] transition-colors">View all</a>
            </div>
            {histLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 rounded-lg shimmer" />)}</div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No analyses yet</p>
            ) : (
              <div className="space-y-1">
                {history.slice(0, 4).map((f) => (
                  <button key={f.id} type="button" onClick={() => loadDetail(f.id, f.created_at)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${activeDate === f.created_at ? "bg-[#22C55E]/[0.06] border border-[#22C55E]/20" : "hover:bg-white/[0.03] border border-transparent"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.health_score >= 66 ? "bg-green-400" : f.health_score >= 51 ? "bg-yellow-400" : "bg-red-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-300 leading-tight">{fmt(f.created_at)}</p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{f.sku_count} SKUs · {f.critical_count} critical</p>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${f.health_score >= 66 ? "text-green-400" : f.health_score >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {f.health_score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upsell CTA */}
          <div className="rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/[0.03] border border-[#22C55E]/20 p-4">
            <p className="text-[11px] font-black text-[#22C55E] uppercase tracking-widest mb-1">Upgrade to Pro</p>
            <p className="text-[12px] text-slate-300 font-semibold mb-0.5">Get 90-day forecasts — ₹999/mo</p>
            <p className="text-[10px] text-[#475569] mb-3">Cancel anytime. 10× cheaper than Prediko.</p>
            <a href="/#pricing"
              className="block w-full text-center text-[12px] font-bold bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] py-2 rounded-lg transition-all shadow-md shadow-[#22C55E]/20">
              Protect more revenue →
            </a>
          </div>
        </div>
      </div>

      {/* ── Trend chart ── */}
      {history.length >= 2 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-white">Stock Health Over Time</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{history.length} analyses · health score + critical SKUs per run</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Last run: {timeAgo(history[0].created_at)}
            </div>
          </div>
          <TrendChart forecasts={history} />
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="card overflow-hidden">
      {/* Filter tabs + search — Raygun-style */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "critical", "high", "medium", "low"] as FilterTab[]).map((tab) => {
            const colors: Record<FilterTab, string> = {
              all: "text-slate-300 border-[#22C55E]",
              critical: "text-red-400 border-red-500",
              high: "text-orange-400 border-orange-500",
              medium: "text-yellow-400 border-yellow-500",
              low: "text-green-400 border-green-500",
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
                    ? `${colors[tab]} bg-white/[0.04] border-current`
                    : "text-[#475569] border-transparent hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {tab !== "all" && <span className={`w-1.5 h-1.5 rounded-full ${active ? dots[tab] : "bg-[#475569]"}`} />}
                {labels[tab]}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/10" : "bg-white/[0.04]"}`}>
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#060C0D] border border-white/[0.06] rounded-lg px-3 py-1.5 sm:ml-auto min-w-[180px]">
          <svg className="w-3.5 h-3.5 text-[#475569] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="bg-transparent text-xs text-white placeholder:text-[#475569] outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      {filteredProducts.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[#475569]">
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
                  ? <span className="text-green-400 text-[11px]">↑ +{product.trendPercent}%</span>
                  : product.trend === "declining"
                  ? <span className="text-red-400 text-[11px]">↓ {product.trendPercent}%</span>
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
                            <p className="font-semibold text-[#F1F5F9] text-sm leading-tight truncate max-w-[200px]">{product.productName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && <span className="text-[11px] text-[#475569] font-mono">{product.sku}</span>}
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
                              <span className="text-sm font-bold tabular-nums text-red-400">OUT</span>
                              {product.stockoutDate && product.stockoutDate !== "Safe (90+ days)" && (
                                <p className="text-[10px] text-red-400/60 leading-tight">since {product.stockoutDate}</p>
                              )}
                            </div>
                          ) : (
                            <>
                              <span className={`text-sm font-bold tabular-nums ${cfg.text}`}>
                                {product.daysOfStockRemaining}d
                              </span>
                              <div className="w-14 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
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
                      <td><span className="tabular-nums text-[#94A3B8] text-sm">{product.currentStock.toLocaleString()}</span></td>
                      <td>
                        {product.reorderByDate
                          ? <div><p className="text-sm font-semibold text-[#F1F5F9]">{product.reorderByDate}</p><p className="text-[11px] text-[#475569]">{product.reorderQuantity} units</p></div>
                          : <span className="text-[#475569]">—</span>
                        }
                      </td>
                      <td>
                        {product.estimatedRevenueLoss
                          ? <div><span className="text-red-400 text-sm font-bold">{product.estimatedRevenueLoss}</span>{product.price && <p className="text-[11px] text-[#475569]">{product.avgDailySales.toFixed(1)}/d × ₹{product.price.toLocaleString("en-US")}</p>}</div>
                          : <span className="text-[#475569]">—</span>
                        }
                      </td>
                      <td>
                        <svg className={`w-4 h-4 text-[#475569] group-hover:text-slate-400 transition-all duration-200 ${isOpen ? "rotate-180 !text-[#22C55E]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
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
                              <div className="px-5 py-4 bg-[#0A1415]/60 border-t border-white/[0.04] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.riskReason && (
                                  <div>
                                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">Why at risk</p>
                                    <p className="text-sm text-slate-300 leading-relaxed">{product.riskReason}</p>
                                  </div>
                                )}
                                <div className="bg-[#22C55E]/[0.03] border border-[#22C55E]/10 rounded-xl p-4">
                                  <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider mb-2">Reorder Action</p>
                                  {product.daysOfStockRemaining <= 0 && product.stockoutDate && product.stockoutDate !== "Safe (90+ days)" && (
                                    <p className="text-xs font-bold text-red-400 mb-1.5">Out of stock since {product.stockoutDate}</p>
                                  )}
                                  <p className="text-sm text-slate-200 font-medium mb-0.5">Order <span className="font-bold text-white">{product.reorderQuantity} units</span></p>
                                  <p className="text-xs text-[#475569] mb-1">Reorder point: {product.reorderPoint} · {product.avgDailySales.toFixed(1)}/day</p>
                                  {product.reorderByDate && <p className="text-xs font-bold text-orange-400">{product.reorderByDate}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-2">Demand Forecast</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {[{l:"30 Days",v:product.forecast30Days},{l:"60 Days",v:product.forecast60Days},{l:"90 Days",v:product.forecast90Days}].map(f => (
                                      <div key={f.l} className="card-sm p-3 text-center"><p className="text-lg font-bold text-white tabular-nums">{f.v}</p><p className="text-xs text-[#475569]">{f.l}</p></div>
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
                              <div className="flex-1 h-px bg-white/[0.05]" />
                              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {safe.length} safe product{safe.length !== 1 ? "s" : ""}
                                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${safeSectionOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </span>
                              <div className="flex-1 h-px bg-white/[0.05]" />
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
    <div className="space-y-3">
      {alertProducts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-white font-semibold mb-1">No active alerts</p>
          <p className="text-sm text-[#475569]">{activeAnalysis ? "All products are safe" : "Run a forecast to check for alerts"}</p>
        </div>
      ) : (
        alertProducts.map(p => {
          const isCrit = p.stockoutRisk === "critical";
          return (
            <div key={p.productName} className={`card p-4 ${isCrit ? "border-red-500/20 bg-red-500/[0.02]" : "border-orange-500/15"}`}>
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 animate-pulse ${isCrit ? "bg-red-400" : "bg-orange-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-semibold ${isCrit ? "text-red-400" : "text-orange-400"}`}>{p.productName}</p>
                    {p.sku && <span className="text-[11px] text-[#475569] font-mono">{p.sku}</span>}
                  </div>
                  <p className="text-sm text-slate-400">{p.riskReason}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {p.daysOfStockRemaining <= 0 ? (
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">
                        Out of stock{p.stockoutDate && p.stockoutDate !== "Safe (90+ days)" ? ` since ${p.stockoutDate}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-[#475569]">Stockout in <span className={`font-bold ${isCrit ? "text-red-400" : "text-orange-400"}`}>{p.daysOfStockRemaining}d</span></span>
                    )}
                    {p.reorderByDate && <span className="text-xs font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-lg">{p.reorderByDate}</span>}
                    {p.estimatedRevenueLoss && <span className="text-xs font-bold text-red-400">{p.estimatedRevenueLoss} at risk</span>}
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
    <div className="min-h-screen bg-[#060C0D] flex">
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
        {/* Top bar */}
        <header className="border-b border-[#22C55E]/[0.08] bg-[#060C0D]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 h-12">
            {/* Page title + breadcrumb */}
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <p className="text-[13px] font-semibold text-white truncate">
                {section === "overview" ? "Overview" : section === "products" ? "Products" : "Alerts"}
              </p>
              {activeAnalysis && (
                <span className="hidden sm:inline text-[11px] text-slate-600">·</span>
              )}
              {activeAnalysis && (
                <span className="hidden sm:inline text-[11px] text-slate-500 truncate">
                  {activeAnalysis.totalSkuCount} SKUs · {activeAnalysis.criticalCount + activeAnalysis.atRiskCount} need action
                </span>
              )}
            </div>

            {/* Status pills row */}
            <div className="hidden md:flex items-center gap-1.5">
              {activeDate && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/[0.03] border border-white/[0.05] px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  {timeAgo(activeDate)}
                </div>
              )}
              {activeAnalysis?.forecastConfidence != null && (
                <div className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border ${
                  activeAnalysis.forecastConfidence >= 75
                    ? "text-green-400 bg-green-500/[0.06] border-green-500/20"
                    : activeAnalysis.forecastConfidence >= 50
                    ? "text-yellow-400 bg-yellow-500/[0.06] border-yellow-500/20"
                    : "text-slate-400 bg-white/[0.03] border-white/[0.05]"
                }`}>
                  {activeAnalysis.forecastConfidence}% conf.
                </div>
              )}
              {activeAnalysis && (
                <div className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border ${
                  activeAnalysis.healthScore >= 66
                    ? "text-green-400 bg-green-500/[0.06] border-green-500/20"
                    : activeAnalysis.healthScore >= 51
                    ? "text-yellow-400 bg-yellow-500/[0.06] border-yellow-500/20"
                    : "text-red-400 bg-red-500/[0.06] border-red-500/20"
                }`}>
                  Health {activeAnalysis.healthScore}/100
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-[#22C55E]/20 flex-shrink-0"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              New Forecast
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4">
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
    </div>
  );
}
