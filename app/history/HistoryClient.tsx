"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import type { SavedForecast } from "@/lib/db";
import type { ForecastAnalysis } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(date: string) {
  return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function healthColor(score: number) {
  if (score >= 66) return "#4ade80";
  if (score >= 51) return "#facc15";
  return "#f87171";
}
function healthLabel(score: number) {
  if (score >= 81) return "Excellent";
  if (score >= 66) return "Good";
  if (score >= 51) return "Fair";
  if (score >= 26) return "At Risk";
  return "Critical";
}

// ─── Pure SVG Trend Chart ─────────────────────────────────────────────────────

function TrendChart({ forecasts }: { forecasts: Omit<SavedForecast, "analysis" | "clerk_user_id">[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; i: number } | null>(null);
  const W = 800;
  const H = 160;
  const PAD = { top: 16, right: 24, bottom: 36, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  if (forecasts.length < 2) return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <p className="text-slate-500 text-sm">Run at least 2 forecasts to see your trend</p>
      <Link href="/forecast" className="mt-2 text-xs text-[#2DD4BF] hover:underline">Run a forecast →</Link>
    </div>
  );

  // Reverse so oldest is on the left
  const pts = [...forecasts].reverse();
  const xStep = chartW / (pts.length - 1);

  function xOf(i: number) { return PAD.left + i * xStep; }
  function yOf(score: number) { return PAD.top + chartH - (score / 100) * chartH; }

  // Build smooth polyline points
  const linePts = pts.map((f, i) => `${xOf(i)},${yOf(f.health_score)}`).join(" ");

  // Grid lines at 25, 50, 75, 100
  const gridLines = [25, 50, 75, 100];

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 340 }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid lines */}
        {gridLines.map(g => (
          <g key={g}>
            <line
              x1={PAD.left} y1={yOf(g)}
              x2={W - PAD.right} y2={yOf(g)}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1}
            />
            <text x={PAD.left - 6} y={yOf(g) + 4} fontSize={9} fill="#475569" textAnchor="end">{g}</text>
          </g>
        ))}

        {/* Gradient fill under line */}
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <polygon
          points={`${xOf(0)},${PAD.top + chartH} ${linePts} ${xOf(pts.length - 1)},${PAD.top + chartH}`}
          fill="url(#lineGrad)"
        />

        {/* Line */}
        <polyline points={linePts} fill="none" stroke="#2DD4BF" strokeWidth={2} strokeLinejoin="round" />

        {/* Dots + hover targets */}
        {pts.map((f, i) => {
          const cx = xOf(i);
          const cy = yOf(f.health_score);
          const color = healthColor(f.health_score);
          return (
            <g key={f.id}>
              {/* Invisible hover area */}
              <rect
                x={cx - 16} y={PAD.top} width={32} height={chartH}
                fill="transparent"
                onMouseEnter={() => setTooltip({ x: cx, y: cy, i })}
              />
              {/* Critical count bar (below X axis, separate track) */}
              {f.critical_count > 0 && (
                <rect
                  x={cx - 3} y={PAD.top + chartH - 4}
                  width={6} height={Math.min(f.critical_count * 4, 20)}
                  fill="#f87171" opacity={0.5} rx={1}
                />
              )}
              {/* Dot */}
              <circle cx={cx} cy={cy} r={tooltip?.i === i ? 6 : 4} fill={color} stroke="#060C0D" strokeWidth={2} />
              {/* X label */}
              <text x={cx} y={H - 6} fontSize={8} fill="#475569" textAnchor="middle">
                {new Date(f.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip !== null && (
          <g>
            <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3,3" />
            <rect x={Math.min(tooltip.x + 8, W - 140)} y={PAD.top} width={130} height={56} rx={6} fill="#0D1B1D" stroke="rgba(45,212,191,0.2)" strokeWidth={1} />
            <text x={Math.min(tooltip.x + 16, W - 132)} y={PAD.top + 16} fontSize={10} fill="#94a3b8">{fmt(pts[tooltip.i].created_at)}</text>
            <text x={Math.min(tooltip.x + 16, W - 132)} y={PAD.top + 30} fontSize={11} fill={healthColor(pts[tooltip.i].health_score)} fontWeight="bold">
              Health: {pts[tooltip.i].health_score}/100
            </text>
            <text x={Math.min(tooltip.x + 16, W - 132)} y={PAD.top + 44} fontSize={10} fill="#94a3b8">
              {pts[tooltip.i].critical_count} critical · {pts[tooltip.i].sku_count} SKUs
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-[#2DD4BF]" />
          <span className="text-[10px] text-slate-500">Inventory Health Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-red-400/50 rounded-sm" />
          <span className="text-[10px] text-slate-500">Critical SKUs</span>
        </div>
      </div>
    </div>
  );
}

// ─── Compare Panel ─────────────────────────────────────────────────────────────

function ComparePanel({ a, b }: { a: SavedForecast; b: SavedForecast }) {
  const metrics = [
    {
      label: "Health Score",
      aVal: `${a.health_score}/100`,
      bVal: `${b.health_score}/100`,
      aNum: a.health_score,
      bNum: b.health_score,
      higherIsBetter: true,
    },
    {
      label: "Critical SKUs",
      aVal: String(a.critical_count),
      bVal: String(b.critical_count),
      aNum: a.critical_count,
      bNum: b.critical_count,
      higherIsBetter: false,
    },
    {
      label: "SKUs Analyzed",
      aVal: String(a.sku_count),
      bVal: String(b.sku_count),
      aNum: a.sku_count,
      bNum: b.sku_count,
      higherIsBetter: true,
    },
    {
      label: "At Risk Count",
      aVal: String((a.analysis as ForecastAnalysis)?.atRiskCount ?? "—"),
      bVal: String((b.analysis as ForecastAnalysis)?.atRiskCount ?? "—"),
      aNum: (a.analysis as ForecastAnalysis)?.atRiskCount ?? 0,
      bNum: (b.analysis as ForecastAnalysis)?.atRiskCount ?? 0,
      higherIsBetter: false,
    },
    {
      label: "Revenue at Risk",
      aVal: (a.analysis as ForecastAnalysis)?.revenueAtRisk || "—",
      bVal: (b.analysis as ForecastAnalysis)?.revenueAtRisk || "—",
      aNum: (a.analysis as ForecastAnalysis)?.totalRarAmount ?? 0,
      bNum: (b.analysis as ForecastAnalysis)?.totalRarAmount ?? 0,
      higherIsBetter: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 mb-5 border-[#2DD4BF]/15"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">Comparison</h2>
        <p className="text-xs text-slate-500">Select exactly 2 forecasts to compare</p>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div />
        <div className="card-sm p-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Forecast A</p>
          <p className="text-xs font-semibold text-white">{fmt(a.created_at)}</p>
          <p className="text-[10px] text-slate-600">{fmtTime(a.created_at)}</p>
        </div>
        <div className="card-sm p-3 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Forecast B</p>
          <p className="text-xs font-semibold text-white">{fmt(b.created_at)}</p>
          <p className="text-[10px] text-slate-600">{fmtTime(b.created_at)}</p>
        </div>
      </div>

      {/* Metric rows */}
      <div className="space-y-2">
        {metrics.map(m => {
          const aBetter = m.higherIsBetter ? m.aNum >= m.bNum : m.aNum <= m.bNum;
          const bBetter = m.higherIsBetter ? m.bNum > m.aNum : m.bNum < m.aNum;
          return (
            <div key={m.label} className="grid grid-cols-3 gap-3 items-center">
              <p className="text-xs text-slate-500 font-medium">{m.label}</p>
              <div className={`card-sm px-3 py-2 text-center border ${aBetter && m.aNum !== m.bNum ? "border-[#2DD4BF]/25 bg-[#2DD4BF]/[0.04]" : ""}`}>
                <p className={`text-sm font-bold tabular-nums ${aBetter && m.aNum !== m.bNum ? "text-[#2DD4BF]" : "text-slate-300"}`}>{m.aVal}</p>
              </div>
              <div className={`card-sm px-3 py-2 text-center border ${bBetter ? "border-[#2DD4BF]/25 bg-[#2DD4BF]/[0.04]" : ""}`}>
                <p className={`text-sm font-bold tabular-nums ${bBetter ? "text-[#2DD4BF]" : "text-slate-300"}`}>{m.bVal}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delta insight */}
      {(() => {
        const delta = a.health_score - b.health_score;
        if (Math.abs(delta) < 2) return null;
        return (
          <div className={`mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${delta > 0 ? "bg-green-500/[0.06] border border-green-500/15 text-green-400" : "bg-red-500/[0.06] border border-red-500/15 text-red-400"}`}>
            <span>{delta > 0 ? "↑" : "↓"}</span>
            <span>
              Forecast A health is <strong>{Math.abs(delta)} points {delta > 0 ? "better" : "worse"}</strong> than Forecast B
              {a.critical_count !== b.critical_count && ` · ${Math.abs(a.critical_count - b.critical_count)} ${a.critical_count < b.critical_count ? "fewer" : "more"} critical SKUs`}
            </span>
          </div>
        );
      })()}
    </motion.div>
  );
}

// ─── Forecast History Card ─────────────────────────────────────────────────────

function ForecastCard({
  forecast,
  selected,
  compareMode,
  inCompare,
  onToggleCompare,
  onSelect,
}: {
  forecast: Omit<SavedForecast, "analysis" | "clerk_user_id">;
  selected: boolean;
  compareMode: boolean;
  inCompare: boolean;
  onToggleCompare: () => void;
  onSelect: () => void;
}) {
  const color = healthColor(forecast.health_score);
  const label = healthLabel(forecast.health_score);
  const barPct = forecast.health_score;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 cursor-pointer transition-all duration-150 ${
        selected ? "border-[#2DD4BF]/30 bg-[#2DD4BF]/[0.03]" : "hover:border-white/[0.08]"
      } ${inCompare ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/[0.05]" : ""}`}
      onClick={compareMode ? onToggleCompare : onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: date + summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-xs font-semibold text-white">{fmt(forecast.created_at)}</p>
            <span className="text-[10px] text-slate-600">{fmtTime(forecast.created_at)}</span>
            {inCompare && (
              <span className="text-[10px] font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-1.5 py-0.5 rounded">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{forecast.summary}</p>
        </div>

        {/* Right: health score */}
        <div className="flex-shrink-0 text-right">
          <p className="text-xl font-bold tabular-nums" style={{ color }}>{forecast.health_score}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
        </div>
      </div>

      {/* Bottom stats + health bar */}
      <div className="mt-3 space-y-2">
        <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${barPct}%`, background: color }} />
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
            {forecast.sku_count} SKUs
          </span>
          {forecast.critical_count > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              {forecast.critical_count} critical
            </span>
          )}
          {compareMode && (
            <span className="ml-auto text-[#2DD4BF]">{inCompare ? "✓ Selected" : "Click to compare"}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Expanded Forecast Detail ──────────────────────────────────────────────────

function ForecastDetail({ forecast }: { forecast: SavedForecast }) {
  const a = forecast.analysis as ForecastAnalysis;
  if (!a) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="card p-5 mb-3 border-[#2DD4BF]/10">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Health Score", val: `${a.healthScore}/100`, color: healthColor(a.healthScore) },
            { label: "Revenue at Risk", val: a.revenueAtRisk || "—", color: "#f87171" },
            { label: "Critical SKUs", val: String(a.criticalCount), color: a.criticalCount > 0 ? "#f87171" : "#4ade80" },
            { label: "Forecast Confidence", val: `${a.forecastConfidence ?? "—"}%`, color: "#2DD4BF" },
          ].map(k => (
            <div key={k.label} className="card-sm p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-base font-bold tabular-nums" style={{ color: k.color }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* Top products at risk */}
        {a.products?.filter(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high").length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Products needing action</p>
            <div className="space-y-1.5">
              {a.products.filter(p => p.stockoutRisk === "critical" || p.stockoutRisk === "high").slice(0, 5).map(p => (
                <div key={p.sku || p.productName} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.stockoutRisk === "critical" ? "bg-red-400" : "bg-orange-400"}`} />
                    <span className="text-xs font-medium text-slate-200 truncate">{p.productName}</span>
                    {p.sku && <span className="text-[10px] text-slate-600 font-mono hidden sm:block">{p.sku}</span>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-bold tabular-nums ${p.daysOfStockRemaining <= 7 ? "text-red-400" : "text-orange-400"}`}>
                      {p.daysOfStockRemaining}d left
                    </span>
                    {p.estimatedRevenueLoss && (
                      <span className="text-xs text-red-400">{p.estimatedRevenueLoss}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {a.topRecommendations?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Top recommendations</p>
            <ol className="space-y-1.5">
              {a.topRecommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main HistoryClient ────────────────────────────────────────────────────────

export default function HistoryClient() {
  const { isSignedIn, isLoaded } = useUser();
  const [forecasts, setForecasts] = useState<Omit<SavedForecast, "analysis" | "clerk_user_id">[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SavedForecast | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareDetails, setCompareDetails] = useState<SavedForecast[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/forecasts")
      .then(r => r.json())
      .then(d => {
        setForecasts(d.forecasts ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load forecast history.");
        setLoading(false);
      });
  }, [isLoaded, isSignedIn]);

  // Load detail when card selected
  const handleSelect = useCallback(async (id: string) => {
    if (selectedId === id) { setSelectedId(null); setSelectedDetail(null); return; }
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const r = await fetch(`/api/forecasts/${id}`);
      const d = await r.json();
      setSelectedDetail(d.forecast);
    } catch { /* ignore */ }
    setDetailLoading(false);
  }, [selectedId]);

  // Toggle compare selection
  const toggleCompare = useCallback(async (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }, []);

  // Load compare details whenever compareIds changes
  useEffect(() => {
    if (compareIds.length !== 2) { setCompareDetails([]); return; }
    Promise.all(compareIds.map(id =>
      fetch(`/api/forecasts/${id}`).then(r => r.json()).then(d => d.forecast)
    )).then(setCompareDetails).catch(() => {});
  }, [compareIds]);

  // Summary stats
  const avgHealth = forecasts.length
    ? Math.round(forecasts.reduce((s, f) => s + f.health_score, 0) / forecasts.length)
    : 0;
  const best = forecasts.reduce((b, f) => f.health_score > (b?.health_score ?? 0) ? f : b, forecasts[0]);
  const latest = forecasts[0];

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#060C0D] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2DD4BF]/30 border-t-[#2DD4BF] animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#060C0D] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-white font-semibold mb-2">Sign in to view your forecast history</p>
          <Link href="/forecast" className="text-sm text-[#2DD4BF] hover:underline">Go to forecast →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060C0D]">
      {/* Nav */}
      <nav className="border-b border-[#2DD4BF]/10 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-40 bg-[#060C0D]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/forecast" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2DD4BF] flex items-center justify-center shadow-lg shadow-[#2DD4BF]/25">
              <svg className="w-4.5 h-4.5 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14M9 20V8M14 20V11M19 20V4" />
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-white tracking-tight">StockSense<span className="text-[#2DD4BF]">AI</span></span>
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm font-medium text-slate-400">History</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/forecast" className="text-xs font-semibold bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] px-3.5 py-1.5 rounded-lg transition-colors shadow-lg shadow-[#2DD4BF]/20">
            + New Forecast
          </Link>
          <UserButton
            appearance={{
              variables: { colorBackground: "#0D1B1D", colorText: "#e2f4f4", colorTextSecondary: "#94a3b8", colorPrimary: "#e2f4f4", borderRadius: "0.75rem" },
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "!bg-[#0D1B1D] !border !border-[#2DD4BF]/20 !shadow-2xl !rounded-xl",
                userButtonPopoverActionButtonText: "!text-slate-200",
                userButtonPopoverFooter: "!hidden",
                userPreviewMainIdentifier: "!text-white",
                userPreviewSecondaryIdentifier: "!text-slate-500",
              },
            }}
          />
        </div>
      </nav>

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Forecast History</h1>
            <p className="text-xs text-slate-500 mt-0.5">{forecasts.length} forecast{forecasts.length !== 1 ? "s" : ""} saved</p>
          </div>
          <button
            type="button"
            onClick={() => { setCompareMode(m => !m); setCompareIds([]); setCompareDetails([]); }}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all ${
              compareMode
                ? "bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#2DD4BF]"
                : "border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15]"
            }`}
          >
            {compareMode ? "✓ Compare mode on" : "Compare forecasts"}
          </button>
        </div>

        {error && (
          <div className="card p-4 mb-5 border-red-500/20 bg-red-500/[0.05]">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {forecasts.length === 0 ? (
          /* Empty state */
          <div className="card p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-white font-semibold mb-1">No forecasts yet</p>
            <p className="text-slate-500 text-sm mb-4">Upload your first CSV to start tracking your inventory health over time.</p>
            <Link href="/forecast" className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
              Run your first forecast →
            </Link>
          </div>
        ) : (
          <>
            {/* Summary KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                {
                  label: "Total Forecasts",
                  val: String(forecasts.length),
                  sub: "all time",
                  color: "#2DD4BF",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
                },
                {
                  label: "Latest Health",
                  val: latest ? `${latest.health_score}/100` : "—",
                  sub: latest ? healthLabel(latest.health_score) : "",
                  color: latest ? healthColor(latest.health_score) : "#94a3b8",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                },
                {
                  label: "Avg Health",
                  val: `${avgHealth}/100`,
                  sub: "across all forecasts",
                  color: healthColor(avgHealth),
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />,
                },
                {
                  label: "Best Score",
                  val: best ? `${best.health_score}/100` : "—",
                  sub: best ? fmt(best.created_at) : "",
                  color: "#4ade80",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />,
                },
              ].map(k => (
                <div key={k.label} className="card p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{k.label}</p>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${k.color}18` }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: k.color }}>
                        {k.icon}
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums" style={{ color: k.color }}>{k.val}</p>
                    {k.sub && <p className="text-[10px] text-slate-600 mt-0.5">{k.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Trend chart */}
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white">Inventory Health Trend</h2>
                  <p className="text-xs text-slate-500 mt-0.5">How your inventory health has changed over time</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-white/[0.03] border border-white/[0.06] px-2 py-1 rounded-lg">
                  Last {forecasts.length} runs
                </span>
              </div>
              <TrendChart forecasts={forecasts} />
            </div>

            {/* Compare panel */}
            <AnimatePresence>
              {compareMode && compareDetails.length === 2 && (
                <ComparePanel a={compareDetails[0]} b={compareDetails[1]} />
              )}
            </AnimatePresence>
            {compareMode && compareIds.length < 2 && (
              <div className="flex items-center gap-2 text-xs text-[#2DD4BF] bg-[#2DD4BF]/[0.05] border border-[#2DD4BF]/15 px-4 py-2.5 rounded-xl mb-4">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                Select {2 - compareIds.length} more forecast{2 - compareIds.length !== 1 ? "s" : ""} from the list below to compare
              </div>
            )}

            {/* History list */}
            <div className="space-y-2.5">
              {compareMode && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Click forecasts to select for comparison</p>
              )}
              {forecasts.map(f => (
                <div key={f.id}>
                  <ForecastCard
                    forecast={f}
                    selected={selectedId === f.id}
                    compareMode={compareMode}
                    inCompare={compareIds.includes(f.id)}
                    onToggleCompare={() => toggleCompare(f.id)}
                    onSelect={() => handleSelect(f.id)}
                  />
                  <AnimatePresence>
                    {!compareMode && selectedId === f.id && (
                      detailLoading
                        ? <div className="flex justify-center py-6"><div className="w-5 h-5 rounded-full border-2 border-[#2DD4BF]/30 border-t-[#2DD4BF] animate-spin" /></div>
                        : selectedDetail && <ForecastDetail forecast={selectedDetail} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
