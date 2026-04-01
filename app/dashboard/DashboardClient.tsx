"use client";

import React, { useState, useEffect, useCallback, useRef, Fragment } from "react";
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
  if (s >= 81) return "Excellent";
  if (s >= 66) return "Good";
  if (s >= 51) return "Fair";
  if (s >= 26) return "At Risk";
  return "Critical";
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
  const [history, setHistory] = useState<Omit<SavedForecast, "analysis" | "clerk_user_id">[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<ForecastAnalysis | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [histLoading, setHistLoading] = useState(true);

  // Product table filter
  type FilterTab = "all" | "critical" | "high" | "medium" | "low";
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [expandedSku, setExpandedSku] = useState<string | null>(null);

  // Sync search from URL ?q= param
  useEffect(() => { setSearch(qParam); }, [qParam]);

  // Load history
  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/forecasts")
      .then(r => r.json())
      .then(d => {
        setHistory(d.forecasts ?? []);
        setHistLoading(false);
        // Auto-load the latest forecast's products
        if (d.forecasts?.length) loadDetail(d.forecasts[0].id, d.forecasts[0].created_at);
      })
      .catch(() => setHistLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

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

  const handleNewForecast = (analysis: ForecastAnalysis) => {
    setActiveAnalysis(analysis);
    setActiveDate(new Date().toISOString());
    router.push("/dashboard");
    // Refresh history list
    fetch("/api/forecasts").then(r => r.json()).then(d => setHistory(d.forecasts ?? []));
  };

  // Filtered + searched products
  const allProducts: ProductForecast[] = activeAnalysis?.products
    ? [...activeAnalysis.products].sort((a, b) => (RISK_ORDER[a.stockoutRisk] ?? 9) - (RISK_ORDER[b.stockoutRisk] ?? 9))
    : [];

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

  const renderOverview = () => (
    <div className="space-y-4">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Revenue at Risk */}
        <div className={`card p-4 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 ${activeAnalysis?.totalRarAmount ? "border-red-500/20" : ""}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Revenue at Risk</p>
              <p className={`text-[26px] font-bold tabular-nums tracking-tight mt-1 leading-none ${activeAnalysis?.totalRarAmount ? "text-red-400" : "text-slate-600"}`}>
                {activeAnalysis?.totalRarAmount ? activeAnalysis.revenueAtRisk : "—"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[11px] text-[#475569]">{activeAnalysis?.totalRarAmount ? "if critical SKUs stock out" : "No critical risk detected"}</p>
            <Sparkline scores={sparkScores.map(s => 100 - s)} color="#f87171" />
          </div>
        </div>

        {/* Inventory Health */}
        <div className="card p-4 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Inventory Health</p>
              <p className={`text-[26px] font-bold tabular-nums tracking-tight mt-1 leading-none ${
                activeAnalysis
                  ? activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"
                  : "text-slate-600"
              }`}>
                {activeAnalysis ? `${activeAnalysis.healthScore}` : "—"}
                {activeAnalysis && <span className="text-[14px] font-normal text-[#475569] ml-0.5">/100</span>}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#475569]">{activeAnalysis ? healthLabel(activeAnalysis.healthScore) : "No data yet"}</p>
              {activeAnalysis && (
                <div className="mt-2 w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${activeAnalysis.healthScore >= 66 ? "bg-green-400" : activeAnalysis.healthScore >= 51 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${activeAnalysis.healthScore}%` }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <Sparkline scores={sparkScores} color="#2DD4BF" />
          </div>
        </div>

        {/* Critical SKUs */}
        <div className={`card p-4 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "border-orange-500/20" : ""}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Critical SKUs</p>
              <p className={`text-[26px] font-bold tabular-nums tracking-tight mt-1 leading-none ${(activeAnalysis?.criticalCount ?? 0) > 0 ? "text-red-400" : "text-green-400"}`}>
                {activeAnalysis?.criticalCount ?? "—"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#475569]">{activeAnalysis ? `+ ${activeAnalysis.atRiskCount} high risk` : "No data yet"}</p>
              {activeAnalysis && (activeAnalysis.criticalCount ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/15 px-1.5 py-0.5 rounded-md">
                  <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                  Action needed
                </span>
              )}
            </div>
            <Sparkline scores={sparkScores.map(s => Math.max(0, 100 - s))} color="#fb923c" />
          </div>
        </div>

        {/* Total SKUs */}
        <div className="card p-4 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Total SKUs</p>
              <p className="text-[26px] font-bold tabular-nums tracking-tight mt-1 leading-none text-slate-100">
                {activeAnalysis?.totalSkuCount ?? "—"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#475569]">{activeAnalysis ? `${activeAnalysis.safeCount} safe · ${activeAnalysis.atRiskCount} at risk` : "No data yet"}</p>
              {activeAnalysis && (
                <div className="flex items-center gap-1 mt-2">
                  {[
                    { count: activeAnalysis.safeCount, color: "bg-green-500" },
                    { count: activeAnalysis.atRiskCount, color: "bg-yellow-500" },
                    { count: activeAnalysis.criticalCount, color: "bg-red-500" },
                  ].map((seg, i) => seg.count > 0 && (
                    <div key={i} className={`h-1 rounded-full ${seg.color}`} style={{ width: `${(seg.count / activeAnalysis.totalSkuCount) * 60}px` }} aria-hidden="true" />
                  ))}
                </div>
              )}
            </div>
            <Sparkline scores={sparkScores.map((_, i) => 45 + (i % 3) * 8)} color="#94a3b8" />
          </div>
        </div>
      </div>

      {/* ── Main content: two-column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">

        {/* LEFT: At-risk products table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Products Needing Action</p>
              <p className="text-[11px] text-[#475569] mt-0.5">
                {activeAnalysis ? `${alertProducts.length} of ${activeAnalysis.totalSkuCount} SKUs need attention` : "Run a forecast to see results"}
              </p>
            </div>
            {activeAnalysis && (
              <a
                href="/dashboard?tab=products"
                className="text-[11px] font-semibold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors flex items-center gap-1"
              >
                View all
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </a>
            )}
          </div>

          {!activeAnalysis && !histLoading ? (
            <div className="px-5 py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              </div>
              <p className="text-white font-semibold mb-1">No forecasts yet</p>
              <p className="text-sm text-[#475569] mb-5">Upload your Shopify inventory CSV to get started</p>
              <button type="button" onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#2DD4BF]/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Run First Forecast
              </button>
            </div>
          ) : histLoading ? (
            <div className="px-5 py-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl shimmer" />)}
            </div>
          ) : alertProducts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-white font-semibold text-sm mb-0.5">All products are safe</p>
              <p className="text-xs text-[#475569]">No critical or high-risk SKUs detected</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-[10px] font-bold text-[#475569] uppercase tracking-widest px-5 py-2.5">Product</th>
                  <th className="text-left text-[10px] font-bold text-[#475569] uppercase tracking-widest px-3 py-2.5">Risk</th>
                  <th className="text-left text-[10px] font-bold text-[#475569] uppercase tracking-widest px-3 py-2.5 hidden sm:table-cell">Days Left</th>
                  <th className="text-left text-[10px] font-bold text-[#475569] uppercase tracking-widest px-3 py-2.5 hidden md:table-cell">Reorder By</th>
                  <th className="text-left text-[10px] font-bold text-[#475569] uppercase tracking-widest px-3 py-2.5 pr-5">Rev. at Risk</th>
                </tr>
              </thead>
              <tbody>
                {alertProducts.slice(0, 6).map((p, i) => {
                  const cfg = riskCfg[p.stockoutRisk] ?? riskCfg.low;
                  return (
                    <motion.tr
                      key={p.sku || p.productName}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => router.push("/dashboard?tab=products")}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-[3px] h-8 rounded-full flex-shrink-0 ${cfg.bar} opacity-70`} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate max-w-[160px]">{p.productName}</p>
                            {p.sku && <p className="text-[10px] text-[#475569] font-mono">{p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${p.stockoutRisk === "critical" ? "animate-pulse" : ""}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className={`text-sm font-bold tabular-nums ${p.daysOfStockRemaining <= 0 ? "text-red-400" : cfg.text}`}>
                          {p.daysOfStockRemaining <= 0 ? "OUT" : `${p.daysOfStockRemaining}d`}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {p.reorderByDate
                          ? <p className="text-xs font-semibold text-orange-300">{p.reorderByDate}</p>
                          : <span className="text-[#475569]">—</span>}
                      </td>
                      <td className="px-3 py-3 pr-5">
                        {p.estimatedRevenueLoss
                          ? <span className="text-sm font-bold text-red-400">{p.estimatedRevenueLoss}</span>
                          : <span className="text-[#475569]">—</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeAnalysis && alertProducts.length > 6 && (
            <div className="px-5 py-3 border-t border-white/[0.04] text-center">
              <a href="/dashboard?tab=products" className="text-xs font-semibold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">
                +{alertProducts.length - 6} more products →
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Health gauge + recent runs + AI summary */}
        <div className="flex flex-col gap-4">

          {/* Health gauge card */}
          <div className="card p-5">
            <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-4">Health Score</p>
            {activeAnalysis ? (
              <>
                {/* Ring gauge */}
                <div className="relative flex items-center justify-center mb-4">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={activeAnalysis.healthScore >= 66 ? "#4ade80" : activeAnalysis.healthScore >= 51 ? "#facc15" : "#f87171"}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(activeAnalysis.healthScore / 100) * 251} 251`}
                      className="gauge-fill"
                      style={{ "--target-offset": `${251 - (activeAnalysis.healthScore / 100) * 251}` } as React.CSSProperties}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className={`text-2xl font-bold tabular-nums leading-none ${activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {activeAnalysis.healthScore}
                    </p>
                    <p className="text-[10px] text-[#475569] mt-0.5">/ 100</p>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className={`text-sm font-semibold ${activeAnalysis.healthScore >= 66 ? "text-green-400" : activeAnalysis.healthScore >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                    {healthLabel(activeAnalysis.healthScore)}
                  </p>
                  <p className="text-[11px] text-[#475569] mt-0.5">{activeAnalysis.totalSkuCount} SKUs analyzed</p>
                </div>
                {/* Distribution pills */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { label: "Safe", count: activeAnalysis.safeCount, cls: "bg-green-500/10 text-green-400 border-green-500/15" },
                    { label: "Risk", count: activeAnalysis.atRiskCount, cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/15" },
                    { label: "Crit", count: activeAnalysis.criticalCount, cls: "bg-red-500/10 text-red-400 border-red-500/15" },
                  ].map(d => (
                    <div key={d.label} className={`rounded-xl py-2 border text-center ${d.cls}`}>
                      <p className="text-base font-bold leading-none">{d.count}</p>
                      <p className="text-[9px] font-semibold uppercase tracking-wider mt-0.5 opacity-70">{d.label}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full border-4 border-white/[0.05] flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-[#475569]">—</span>
                </div>
                <p className="text-xs text-[#475569]">No forecast data</p>
              </div>
            )}
          </div>

          {/* Recent runs */}
          <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">Recent Runs</p>
              <a href="/history" className="text-[10px] font-semibold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">View all →</a>
            </div>
            {histLoading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl shimmer" />)}
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-[#475569] text-center py-4">No runs yet</p>
            ) : (
              <div className="space-y-1.5">
                {history.slice(0, 5).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => loadDetail(f.id, f.created_at)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${activeDate === f.created_at ? "bg-[#2DD4BF]/[0.06] border border-[#2DD4BF]/20" : "hover:bg-white/[0.03] border border-transparent"}`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.health_score >= 66 ? "bg-green-400" : f.health_score >= 51 ? "bg-yellow-400" : "bg-red-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-slate-300 truncate">{fmt(f.created_at)}</p>
                      <p className="text-[10px] text-[#475569]">{f.sku_count} SKUs</p>
                    </div>
                    <span className={`text-[12px] font-bold tabular-nums flex-shrink-0 ${f.health_score >= 66 ? "text-green-400" : f.health_score >= 51 ? "text-yellow-400" : "text-red-400"}`}>
                      {f.health_score}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Summary compact */}
          {(activeAnalysis?.topRecommendations?.length ?? 0) > 0 && (
            <div className="card p-4">
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">AI Recommendations</p>
              <ol className="space-y-2.5">
                {activeAnalysis?.topRecommendations.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* ── Health trend ── (full width, below) */}
      {history.length >= 2 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-white">Inventory Health Trend</p>
              <p className="text-xs text-[#475569] mt-0.5">{history.length} forecast{history.length !== 1 ? "s" : ""} · last run {timeAgo(history[0]?.created_at)}</p>
            </div>
            <span className="text-[10px] font-semibold text-[#475569] bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg">Last {Math.min(history.length, 8)} runs</span>
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
                <th className="!pl-4">Product</th>
                <th>Risk</th>
                <th>Days Left</th>
                <th>Stock</th>
                <th>Reorder By</th>
                <th>Rev. at Risk</th>
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
                          <span className={`text-sm font-bold tabular-nums ${product.daysOfStockRemaining <= 0 ? "text-red-400" : cfg.text}`}>
                            {product.daysOfStockRemaining <= 0 ? "OUT" : `${product.daysOfStockRemaining}d`}
                          </span>
                          <div className="w-14 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${cfg.bar} opacity-80`}
                              style={{ width: `${daysBarPct}%` }}
                              aria-hidden="true"
                            />
                          </div>
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
                    <span className="text-xs text-[#475569]">Stockout in <span className={`font-bold ${isCrit ? "text-red-400" : "text-orange-400"}`}>{p.daysOfStockRemaining}d</span></span>
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

          {/* ── Summary stat strip (Donee-style) — overview only ── */}
          {section === "overview" && activeAnalysis && (
            <div className="flex items-center gap-1 px-5 pb-3 overflow-x-auto">
              {[
                {
                  label: `${alertProducts.filter(p => p.stockoutRisk === "critical").length} Critical SKUs`,
                  dot: "bg-red-400",
                  cls: "text-red-400 bg-red-500/[0.07] border-red-500/15",
                },
                {
                  label: `${alertProducts.length} Need Reorder`,
                  dot: "bg-orange-400",
                  cls: "text-orange-400 bg-orange-500/[0.07] border-orange-500/15",
                },
                {
                  label: `${activeAnalysis.safeCount} Products Safe`,
                  dot: "bg-green-400",
                  cls: "text-green-400 bg-green-500/[0.07] border-green-500/15",
                },
              ].map(s => (
                <span key={s.label} className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${s.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
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
