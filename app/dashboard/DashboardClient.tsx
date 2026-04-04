"use client";

import React, { useState, useEffect, useCallback, useRef, Fragment } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { SavedForecast } from "@/lib/db";
import type { ForecastAnalysis, ProductForecast } from "@/lib/types";
import AppSidebar from "@/components/AppSidebar";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
  low:      { bar: "bg-green-500",  text: "text-green-400",  badge: "text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20",  dot: "bg-green-400",  label: "Safe" },
};

// ─── SVG Trend Chart ──────────────────────────────────────────────────────────
function TrendChart({ forecasts }: { forecasts: Omit<SavedForecast, "analysis" | "clerk_user_id">[] }) {
  const [tip, setTip] = useState<{ x: number; y: number; i: number } | null>(null);
  const W = 800; const H = 140;
  const PAD = { top: 12, right: 20, bottom: 32, left: 36 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  if (forecasts.length < 2) return (
    <div className="flex items-center justify-center h-[140px] text-slate-600 text-sm">
      Run at least 2 forecasts to see your health trend
    </div>
  );
  const pts = [...forecasts].reverse();
  const xS = cW / (pts.length - 1);
  const xOf = (i: number) => PAD.left + i * xS;
  const yOf = (s: number) => PAD.top + cH - (s / 100) * cH;
  const linePts = pts.map((f, i) => `${xOf(i)},${yOf(f.health_score)}`).join(" ");
  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]" onMouseLeave={() => setTip(null)}>
        <defs>
          <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map(g => (
          <line key={g} x1={PAD.left} y1={yOf(g)} x2={W - PAD.right} y2={yOf(g)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}
        <polygon points={`${xOf(0)},${PAD.top + cH} ${linePts} ${xOf(pts.length - 1)},${PAD.top + cH}`} fill="url(#tGrad)" />
        <polyline points={linePts} fill="none" stroke="#2DD4BF" strokeWidth={1.5} strokeLinejoin="round" />
        {pts.map((f, i) => {
          const cx = xOf(i); const cy = yOf(f.health_score);
          return (
            <g key={f.id}>
              <rect x={cx - 14} y={PAD.top} width={28} height={cH} fill="transparent" onMouseEnter={() => setTip({ x: cx, y: cy, i })} />
              <circle cx={cx} cy={cy} r={tip?.i === i ? 5 : 3} fill={healthColor(f.health_score)} stroke="#060C0D" strokeWidth={1.5} />
              <text x={cx} y={H - 6} fontSize={8} fill="#475569" textAnchor="middle">
                {new Date(f.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </text>
            </g>
          );
        })}
        {tip !== null && (
          <g>
            <line x1={tip.x} y1={PAD.top} x2={tip.x} y2={PAD.top + cH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3,3" />
            <rect x={Math.min(tip.x + 8, W - 130)} y={PAD.top} width={120} height={52} rx={5} fill="#0D1B1D" stroke="rgba(45,212,191,0.2)" strokeWidth={1} />
            <text x={Math.min(tip.x + 14, W - 124)} y={PAD.top + 14} fontSize={9} fill="#94a3b8">{fmt(pts[tip.i].created_at)}</text>
            <text x={Math.min(tip.x + 14, W - 124)} y={PAD.top + 28} fontSize={11} fill={healthColor(pts[tip.i].health_score)} fontWeight="bold">
              {pts[tip.i].health_score}/100 — {healthLabel(pts[tip.i].health_score)}
            </text>
            <text x={Math.min(tip.x + 14, W - 124)} y={PAD.top + 42} fontSize={9} fill="#94a3b8">
              {pts[tip.i].critical_count} critical · {pts[tip.i].sku_count} SKUs
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── Upload Panel (slide-in) ──────────────────────────────────────────────────
function UploadPanel({ onClose, onResult }: { onClose: () => void; onResult: (a: ForecastAnalysis) => void }) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [leadTime, setLeadTime] = useState("14");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { setError("CSV files only."); return; }
    setFileName(file.name);
    const r = new FileReader();
    r.onload = (e) => { setCsvText(e.target?.result as string); setError(null); };
    r.readAsText(file);
  };

  const run = async () => {
    if (!csvText.trim()) { setError("Upload a CSV first."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesData: csvText.trim(), leadTimeDays: parseInt(leadTime) || 14 }),
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
      className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#0A1415] border-l border-[#2DD4BF]/10 z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-widest">New Forecast</p>
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#2DD4BF] bg-[#2DD4BF]/[0.04]" : fileName ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/[0.03]" : "border-[#2DD4BF]/15 hover:border-[#2DD4BF]/30"}`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" aria-label="Upload CSV file" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {fileName ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm font-semibold text-[#2DD4BF]">{fileName}</p>
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

        {/* Lead time */}
        <div>
          <label htmlFor="panel-lead-time" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Supplier Lead Time (days)</label>
          <input id="panel-lead-time" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} min={1} max={180}
            className="w-full bg-[#060C0D] border border-[#2DD4BF]/15 focus:border-[#2DD4BF]/40 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors" />
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
          className="w-full flex items-center justify-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] disabled:opacity-50 text-[#060C0D] font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#2DD4BF]/20"
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

  const inventoryValue = activeAnalysis?.products
    ? activeAnalysis.products.reduce((sum, p) => sum + p.currentStock * (p.price ?? 0), 0)
    : 0;
  const fmtInventoryValue = inventoryValue > 0
    ? `₹${inventoryValue.toLocaleString("en-IN")}`
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

  // ── Render sections ──────────────────────────────────────────────────────────

  // ── Mini sparkline bars (deterministic from score, no randomness) ────────────
  const Sparkline = ({ scores, color }: { scores: number[]; color: string }) => {
    const max = Math.max(...scores, 1);
    return (
      <div className="flex items-end gap-[2px] h-8">
        {scores.map((s, i) => (
          <div
            key={i}
            className="w-1.5 rounded-sm flex-shrink-0 transition-all"
            style={{ height: `${Math.max(15, (s / max) * 100)}%`, background: color, opacity: i === scores.length - 1 ? 1 : 0.35 + (i / scores.length) * 0.5 }}
          />
        ))}
      </div>
    );
  };

  // Build sparkline data from history health scores (last 8)
  const sparkScores = history.length >= 2
    ? [...history].reverse().slice(-8).map(f => f.health_score)
    : [40, 45, 55, 50, 60, 58, 65, 70]; // placeholder shape

  // Derive urgency numbers for the action banner
  const stockingOutSoon = alertProducts.filter(p => p.daysOfStockRemaining <= 7 && p.daysOfStockRemaining >= 0);
  const alreadyOut      = alertProducts.filter(p => p.daysOfStockRemaining <= 0);

  const renderOverview = () => (
    <div className="space-y-4">

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

      {/* ── KPI row — compact, profit-first labels ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Money at risk */}
        <div className={`card p-3.5 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 ${activeAnalysis?.totalRarAmount ? "border-red-500/20" : ""}`}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest leading-tight">Money You'll Lose</p>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
            </div>
          </div>
          <p className={`text-[24px] font-bold tabular-nums tracking-tight leading-none mb-1 ${activeAnalysis?.totalRarAmount ? "text-red-400" : "text-slate-600"}`}>
            {activeAnalysis?.totalRarAmount ? activeAnalysis.revenueAtRisk : "₹0"}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[10px] text-[#475569]">{activeAnalysis?.totalRarAmount ? "if you don't reorder now" : "No losses detected"}</p>
            <Sparkline scores={sparkScores.map(s => 100 - s)} color="#f87171" />
          </div>
        </div>

        {/* Stock protection score */}
        <div className="card p-3.5 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest leading-tight">Stock Protection</p>
            <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className={`text-[24px] font-bold tabular-nums tracking-tight leading-none mb-1 ${
            activeAnalysis ? activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400" : "text-slate-600"
          }`}>
            {activeAnalysis ? `${activeAnalysis.healthScore}` : "—"}
            {activeAnalysis && <span className="text-[13px] font-normal text-[#475569] ml-0.5">/100</span>}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[10px] text-[#475569]">{activeAnalysis ? healthLabel(activeAnalysis.healthScore) : "Run a forecast"}</p>
            <Sparkline scores={sparkScores} color="#2DD4BF" />
          </div>
          {activeAnalysis && (
            <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${activeAnalysis.healthScore >= 66 ? "bg-green-400" : activeAnalysis.healthScore >= 51 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${activeAnalysis.healthScore}%` }} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Order now count */}
        <div className={`card p-3.5 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "border-orange-500/20" : ""}`}>
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest leading-tight">Order Now</p>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
            </div>
          </div>
          <p className={`text-[24px] font-bold tabular-nums tracking-tight leading-none mb-1 ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "text-red-400" : "text-green-400"}`}>
            {activeAnalysis?.criticalCount ?? "—"}
            {activeAnalysis && <span className="text-[13px] font-normal text-[#475569] ml-1.5">SKUs</span>}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[10px] text-[#475569]">{activeAnalysis ? `+${activeAnalysis.atRiskCount} need restocking soon` : "No data yet"}</p>
            <Sparkline scores={sparkScores.map(s => Math.max(0, 100 - s))} color="#fb923c" />
          </div>
        </div>

        {/* Inventory value */}
        <div className="card p-3.5 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest leading-tight">Inventory Value</p>
            <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            </div>
          </div>
          <p className="text-[24px] font-bold tabular-nums tracking-tight leading-none mb-1 text-slate-100">
            {fmtInventoryValue}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-[10px] text-[#475569]">
              {activeAnalysis ? `${activeAnalysis.totalSkuCount} SKUs · ${activeAnalysis.safeCount} safe` : "No data yet"}
            </p>
            <Sparkline scores={sparkScores.map((_, i) => 45 + (i % 3) * 8)} color="#94a3b8" />
          </div>
          {activeAnalysis && (
            <div className="flex gap-0.5 mt-2 h-1 rounded-full overflow-hidden">
              <div className="bg-green-500 rounded-l-full" style={{ width: `${(activeAnalysis.safeCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
              <div className="bg-yellow-500" style={{ width: `${(activeAnalysis.atRiskCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
              <div className="bg-red-500 rounded-r-full" style={{ width: `${(activeAnalysis.criticalCount / activeAnalysis.totalSkuCount) * 100}%` }} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ── Main two-column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_272px] gap-4">

        {/* LEFT: action table */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">
                {activeAnalysis && alertProducts.length > 0 ? "⚡ Reorder These Today to Protect Revenue" : "Products Overview"}
              </p>
              <p className="text-[11px] text-[#475569] mt-0.5">
                {activeAnalysis
                  ? alertProducts.length > 0
                    ? `${alertProducts.length} products will lose you money if not restocked`
                    : "All products have safe stock levels — great work"
                  : "Upload a CSV to protect your revenue"}
              </p>
            </div>
            {activeAnalysis && alertProducts.length > 0 && (
              <button
                type="button"
                onClick={() => router.push("/dashboard?tab=products")}
                className="flex-shrink-0 text-[11px] font-bold text-[#060C0D] bg-[#2DD4BF] hover:bg-[#14B8A6] px-3 py-1.5 rounded-lg transition-all"
              >
                See all {allProducts.length} →
              </button>
            )}
          </div>

          {/* Empty state — premium onboarding */}
          {!activeAnalysis && !histLoading ? (
            <div className="px-5 py-8">
              <div className="max-w-sm mx-auto text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2DD4BF]/20 to-[#2DD4BF]/5 border border-[#2DD4BF]/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2DD4BF]/10">
                  <svg className="w-8 h-8 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
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
                    <div className="w-5 h-5 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/25 text-[#2DD4BF] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
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
                  className="inline-flex items-center justify-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2DD4BF]/25"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  Upload Shopify CSV — Free
                </button>
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-[#2DD4BF]/30 text-slate-400 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
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
                <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                  <th className="text-left text-[9px] font-black text-[#475569] uppercase tracking-widest px-4 py-2">Product</th>
                  <th className="text-left text-[9px] font-black text-[#475569] uppercase tracking-widest px-3 py-2">Urgency</th>
                  <th className="text-left text-[9px] font-black text-[#475569] uppercase tracking-widest px-3 py-2 hidden sm:table-cell">Days Left</th>
                  <th className="text-left text-[9px] font-black text-[#475569] uppercase tracking-widest px-3 py-2 hidden md:table-cell">Reorder By</th>
                  <th className="text-left text-[9px] font-black text-[#475569] uppercase tracking-widest px-3 py-2 pr-4">You'll Lose</th>
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
                      className="border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors cursor-pointer"
                      onClick={() => router.push("/dashboard?tab=products")}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-[3px] h-7 rounded-full flex-shrink-0 ${cfg.bar}`} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-200 truncate max-w-[160px] leading-tight">{p.productName}</p>
                            {p.sku && <p className="text-[10px] text-[#475569] font-mono leading-tight">{p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className={`text-[11px] font-bold leading-tight ${p.stockoutRisk === "critical" ? "text-red-400" : "text-orange-400"}`}>
                          {urgencyLabel(p.daysOfStockRemaining)}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 hidden sm:table-cell">
                        {p.daysOfStockRemaining <= 0 ? (
                          <div>
                            <span className="text-sm font-black tabular-nums text-red-400">OUT</span>
                            {p.stockoutDate && p.stockoutDate !== "Safe (90+ days)" && (
                              <p className="text-[10px] text-red-400/60 mt-0.5">since {p.stockoutDate}</p>
                            )}
                          </div>
                        ) : (
                          <span className={`text-sm font-black tabular-nums ${p.daysOfStockRemaining <= 7 ? "text-orange-400" : cfg.text}`}>
                            {p.daysOfStockRemaining}d
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 hidden md:table-cell">
                        {p.reorderByDate
                          ? <p className="text-[12px] font-semibold text-orange-300">{p.reorderByDate}</p>
                          : <span className="text-[#475569] text-sm">—</span>}
                      </td>
                      <td className="px-3 py-2.5 pr-4">
                        {p.estimatedRevenueLoss
                          ? <span className="text-[13px] font-black text-red-400">{p.estimatedRevenueLoss}</span>
                          : <span className="text-[#475569] text-sm">—</span>}
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
                className="text-[11px] font-bold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">
                See all & export reorder list →
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: sticky action panel */}
        <div className="flex flex-col gap-3">

          {/* Protection score */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Protection Score</p>
              {activeAnalysis && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  activeAnalysis.healthScore >= 66 ? "text-green-400 bg-green-500/10 border-green-500/15"
                  : activeAnalysis.healthScore >= 51 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/15"
                  : "text-red-400 bg-red-500/10 border-red-500/15"
                }`}>{healthLabel(activeAnalysis.healthScore)}</span>
              )}
            </div>
            {activeAnalysis ? (
              <>
                <div className="relative flex items-center justify-center mb-3">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9" />
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke={activeAnalysis.healthScore >= 66 ? "#4ade80" : activeAnalysis.healthScore >= 51 ? "#facc15" : "#f87171"}
                      strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={`${(activeAnalysis.healthScore / 100) * 251} 251`}
                      className="gauge-fill"
                      style={{ "--target-offset": `${251 - (activeAnalysis.healthScore / 100) * 251}` } as React.CSSProperties}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className={`text-2xl font-black tabular-nums leading-none ${activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {activeAnalysis.healthScore}
                    </p>
                    <p className="text-[9px] text-[#475569]">/ 100</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Safe", count: activeAnalysis.safeCount, cls: "bg-green-500/10 text-green-400 border-green-500/15" },
                    { label: "Risk", count: activeAnalysis.atRiskCount, cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/15" },
                    { label: "Order", count: activeAnalysis.criticalCount, cls: "bg-red-500/10 text-red-400 border-red-500/15" },
                  ].map(d => (
                    <div key={d.label} className={`rounded-lg py-1.5 border text-center ${d.cls}`}>
                      <p className="text-sm font-black leading-none">{d.count}</p>
                      <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-70">{d.label}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-[#475569]">Upload a CSV to see your protection score</p>
              </div>
            )}
          </div>

          {/* What to do next (AI actions) */}
          {(activeAnalysis?.topRecommendations?.length ?? 0) > 0 && (
            <div className="card p-4">
              <p className="text-[10px] font-black text-[#475569] uppercase tracking-widest mb-2.5">Your Action Plan</p>
              <ol className="space-y-2">
                {activeAnalysis?.topRecommendations.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Past forecasts */}
          <div className="card p-4 flex-1">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-black text-[#475569] uppercase tracking-widest">Past Analyses</p>
              <a href="/history" className="text-[10px] font-bold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">All →</a>
            </div>
            {histLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-8 rounded-lg shimmer" />)}</div>
            ) : history.length === 0 ? (
              <p className="text-[11px] text-[#475569] py-2">No analyses yet</p>
            ) : (
              <div className="space-y-1">
                {history.slice(0, 4).map((f) => (
                  <button key={f.id} type="button" onClick={() => loadDetail(f.id, f.created_at)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${activeDate === f.created_at ? "bg-[#2DD4BF]/[0.06] border border-[#2DD4BF]/20" : "hover:bg-white/[0.03] border border-transparent"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.health_score >= 66 ? "bg-green-400" : f.health_score >= 51 ? "bg-yellow-400" : "bg-red-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-slate-300 truncate">{fmt(f.created_at)}</p>
                    </div>
                    <span className={`text-[11px] font-black tabular-nums ${f.health_score >= 66 ? "text-green-400" : f.health_score >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {f.health_score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upsell CTA */}
          <div className="rounded-xl bg-gradient-to-br from-[#2DD4BF]/10 to-[#2DD4BF]/[0.03] border border-[#2DD4BF]/20 p-4">
            <p className="text-[11px] font-black text-[#2DD4BF] uppercase tracking-widest mb-1">Upgrade to Pro</p>
            <p className="text-[12px] text-slate-300 font-semibold mb-0.5">Get 90-day forecasts — ₹999/mo</p>
            <p className="text-[10px] text-[#475569] mb-3">Cancel anytime. 10× cheaper than Prediko.</p>
            <a href="/#pricing"
              className="block w-full text-center text-[12px] font-bold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] py-2 rounded-lg transition-all shadow-md shadow-[#2DD4BF]/20">
              Protect more revenue →
            </a>
          </div>
        </div>
      </div>

      {/* ── Trend chart ── */}
      {history.length >= 2 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">Revenue Protection Over Time</p>
              <p className="text-[11px] text-[#475569] mt-0.5">How your stock health has changed across {history.length} analyses</p>
            </div>
            <span className="text-[10px] font-semibold text-[#475569] bg-white/[0.03] border border-white/[0.06] px-2 py-1 rounded-lg">
              {history.length > 0 ? `Last run: ${timeAgo(history[0].created_at)}` : ""}
            </span>
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
              all: "text-slate-300 border-[#2DD4BF]",
              critical: "text-red-400 border-red-500",
              high: "text-orange-400 border-orange-500",
              medium: "text-yellow-400 border-yellow-500",
              low: "text-green-400 border-green-500",
            };
            const dots: Record<FilterTab, string> = {
              all: "bg-[#2DD4BF]",
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
                <th className="!pl-4">Product / SKU</th>
                <th>Risk Level</th>
                <th>Days Left</th>
                <th>In Stock</th>
                <th>Order By · Qty</th>
                <th>Revenue at Risk</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, i) => {
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
                          ? <div><span className="text-red-400 text-sm font-bold">{product.estimatedRevenueLoss}</span>{product.price && <p className="text-[11px] text-[#475569]">{product.avgDailySales.toFixed(1)}/d × ₹{product.price.toLocaleString("en-IN")}</p>}</div>
                          : <span className="text-[#475569]">—</span>
                        }
                      </td>
                      <td>
                        <svg className={`w-4 h-4 text-[#475569] group-hover:text-slate-400 transition-all duration-200 ${isOpen ? "rotate-180 !text-[#2DD4BF]" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
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
                                <div className="bg-[#2DD4BF]/[0.03] border border-[#2DD4BF]/10 rounded-xl p-4">
                                  <p className="text-[10px] font-bold text-[#2DD4BF] uppercase tracking-wider mb-2">Reorder Action</p>
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
              })}
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
        <header className="border-b border-[#2DD4BF]/[0.08] bg-[#060C0D]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3 px-5 h-16">
            {/* Welcome greeting */}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-white leading-tight">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                <span className="ml-1">👋</span>
              </p>
            </div>

            {/* Last updated pill */}
            {activeDate && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#475569] bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                Updated {timeAgo(activeDate)}
              </div>
            )}

            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] px-3.5 py-1.5 rounded-lg transition-all shadow-lg shadow-[#2DD4BF]/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              New Forecast
            </button>
          </div>

        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6">
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
