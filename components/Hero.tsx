"use client";

import Link from "next/link";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ParsedRow {
  name: string;
  sold30d: number;
  stock: number;
  leadDays: number;
}

interface ForecastRow extends ParsedRow {
  velocityPerDay: number;
  stockoutDays: number;
  stockoutDate: string;
  reorderQty: number;
  urgency: "critical" | "high" | "safe";
}

// ── Pure forecast math (no backend) ──────────────────────────────────────────
function calcForecast(rows: ParsedRow[]): ForecastRow[] {
  const today = new Date();
  return rows.map((r) => {
    const velocityPerDay = r.sold30d / 30;
    const stockoutDays = velocityPerDay > 0
      ? Math.floor(r.stock / velocityPerDay)
      : 999;

    const stockoutDate = new Date(today);
    stockoutDate.setDate(today.getDate() + stockoutDays);
    const dateLabel = stockoutDays >= 999
      ? "No stockout"
      : stockoutDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Reorder qty = demand for (lead time + 14-day buffer), minus current stock
    const reorderQty = Math.max(
      0,
      Math.ceil(velocityPerDay * (r.leadDays + 14)) - r.stock
    );

    const urgency: ForecastRow["urgency"] =
      stockoutDays <= 7 ? "critical" :
      stockoutDays <= 21 ? "high" :
      "safe";

    return { ...r, velocityPerDay, stockoutDays, stockoutDate: dateLabel, reorderQty, urgency };
  });
}

// ── Parse the textarea ────────────────────────────────────────────────────────
const SAMPLE = `Yoga Mat Pro, 45, 12, 7
Water Bottle XL, 28, 34, 5
Resistance Bands, 18, 87, 10
Protein Powder, 62, 8, 14
Face Serum, 31, 55, 3`;

function parseInput(raw: string): ParsedRow[] | null {
  const lines = raw.trim().split("\n").filter(Boolean);
  const rows: ParsedRow[] = [];
  for (const line of lines) {
    // Skip header-like lines
    if (/product|name|sku/i.test(line) && /sold|units|stock/i.test(line)) continue;
    const parts = line.split(",").map((s) => s.trim());
    if (parts.length < 4) return null;
    const [name, s1, s2, s3] = parts;
    const sold30d = parseInt(s1, 10);
    const stock   = parseInt(s2, 10);
    const lead    = parseInt(s3, 10);
    if (!name || isNaN(sold30d) || isNaN(stock) || isNaN(lead)) return null;
    rows.push({ name, sold30d, stock, leadDays: lead });
  }
  return rows.length > 0 ? rows : null;
}

// ── Urgency styles ────────────────────────────────────────────────────────────
const urgencyStyle = {
  critical: { days: "text-red-600",    badge: "text-red-700 bg-red-50 border-red-200"           },
  high:     { days: "text-orange-600", badge: "text-orange-700 bg-orange-50 border-orange-200"  },
  safe:     { days: "text-[#006d34]",  badge: "text-[#5a6059] bg-[#eaefeb] border-[#bbcbba]/60" },
};

// ── Widget (right column) ─────────────────────────────────────────────────────
function ForecastWidget() {
  const [input, setInput]     = useState(SAMPLE);
  const [results, setResults] = useState<ForecastRow[] | null>(null);
  const [error, setError]     = useState(false);
  const [email, setEmail]         = useState("");
  const [emailState, setEmailState] = useState<"idle" | "loading" | "done" | "error">("idle");

  function handleGenerate() {
    const parsed = parseInput(input);
    if (!parsed) { setError(true); return; }
    setError(false);
    setResults(calcForecast(parsed));
  }

  function handleReset() {
    setResults(null);
    setError(false);
    setEmail("");
    setEmailState("idle");
  }

  return (
    <div className="rounded-[10px] border border-[#bbcbba]/60 bg-white overflow-hidden shadow-xl shadow-black/10">

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#bbcbba]/40 bg-[#f0f5f1]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006d34]" />
          <span className="text-[11px] font-medium text-[#5a6059] font-mono">
            {results ? "Forecast results" : "Live calculator"}
          </span>
        </div>
        {results && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-[#8a9a8a] hover:text-[#5a6059] transition-colors"
          >
            ← Edit data
          </button>
        )}
      </div>

      {!results ? (
        /* ── Input state ── */
        <div className="p-4">
          <p className="text-[11px] font-bold text-[#5a6059] uppercase tracking-widest mb-2">
            Paste your data — 4 columns, comma-separated
          </p>
          <p id="forecast-input-hint" className="text-[10px] text-[#8a9a8a] font-mono mb-3">
            Product name, Units sold (30d), Current stock, Lead time (days)
          </p>
          <label htmlFor="forecast-input" className="sr-only">
            Sales data — product name, units sold last 30 days, current stock, lead time in days
          </label>
          <textarea
            id="forecast-input"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            rows={6}
            spellCheck={false}
            aria-describedby="forecast-input-hint"
            className="w-full bg-[#f6faf6] border border-[#bbcbba]/60 rounded-[6px] px-3 py-2.5 text-[12px] text-[#181d1b] font-mono resize-none focus:outline-none focus:border-[#006d34]/50 transition-colors"
          />
          {error && (
            <p className="text-[11px] text-red-600 mt-1.5">
              Couldn&apos;t parse that. Check format: name, sold30d, stock, leadDays
            </p>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            className="btn-primary btn-gradient mt-3 w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-white py-2.5 rounded-[6px]"
          >
            Generate forecast
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      ) : (
        /* ── Results state ── */
        <div>
          {/* Rows */}
          <div className="divide-y divide-[#bbcbba]/30">
            {results.map((r) => {
              const s = urgencyStyle[r.urgency];
              return (
                <div key={r.name} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-medium text-[#181d1b] truncate mr-3">{r.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] border flex-shrink-0 ${s.badge}`}>
                      {r.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-[#8a9a8a]">
                      Stock: <span className="text-[#5a6059] font-mono">{r.stock}</span>
                    </span>
                    <span className={`font-semibold tabular-nums ${s.days}`}>
                      {r.stockoutDays >= 999 ? "No stockout" : `Stockout ${r.stockoutDate}`}
                    </span>
                    {r.reorderQty > 0 && (
                      <span className="text-[#8a9a8a] font-mono">
                        Reorder: <span className="text-[#5a6059]">{r.reorderQty}u</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="px-4 pt-3 pb-4 border-t border-[#bbcbba]/40">
            <Link
              href="/forecast"
              className="btn-primary btn-gradient flex items-center justify-center gap-2 w-full text-[13px] font-semibold text-white py-2.5 rounded-[6px] mb-3"
            >
              Run full forecast on your CSV
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Optional email capture */}
            {emailState !== "done" ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <label htmlFor="hero-email" className="sr-only">Email address for forecast alerts</label>
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailState("idle"); }}
                    placeholder="Email me this forecast"
                    autoComplete="email"
                    className="flex-1 bg-[#f6faf6] border border-[#bbcbba]/60 rounded-[6px] px-3 py-2 text-[12px] text-[#181d1b] placeholder-[#8a9a8a] focus:outline-none focus:border-[#006d34]/50 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    disabled={emailState === "loading"}
                    onClick={async () => {
                      if (!email.includes("@")) return;
                      setEmailState("loading");
                      try {
                        const res = await fetch("/api/hero-email", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        });
                        const json = await res.json();
                        setEmailState(json.success ? "done" : "error");
                      } catch {
                        setEmailState("error");
                      }
                    }}
                    className="btn-ghost text-[12px] font-semibold text-[#5a6059] hover:text-[#181d1b] border border-[#bbcbba]/60 hover:border-[#bbcbba] px-3 py-2 rounded-[6px] transition-all whitespace-nowrap disabled:opacity-50"
                  >
                    {emailState === "loading" ? "Sending…" : "Send"}
                  </button>
                </div>
                {emailState === "error" && (
                  <p className="text-[11px] text-red-600">Couldn&apos;t send — try again or go to /forecast directly.</p>
                )}
              </div>
            ) : (
              <p className="text-[12px] text-[#006d34] text-center py-1">
                ✓ Check your inbox — forecast + weekly alerts sent to {email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hero (page section) ───────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-[#f6faf6]">
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-center">

          {/* ── Left: Headline + CTAs ── */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center text-[10px] font-bold text-[#006d34] uppercase tracking-[0.18em] bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-1 rounded-full mb-7">
              Shopify inventory forecasting
            </span>

            <h1 className="text-[58px] sm:text-[72px] lg:text-[80px] xl:text-[88px] font-bold leading-[0.93] text-[#181d1b] mb-6">
              Know before<br />
              you stock out.
            </h1>

            <p className="text-[17px] text-[#5a6059] leading-[1.65] max-w-[420px] mb-9">
              Upload your Shopify CSV. Get exact stockout dates, reorder quantities,
              and revenue at risk — in 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <Link
                href="/forecast"
                className="btn-primary btn-gradient inline-flex items-center gap-2 text-[15px] font-semibold text-white px-7 py-3 rounded-[6px]"
              >
                Run free forecast
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="btn-ghost inline-flex items-center gap-2 text-[15px] text-[#5a6059] hover:text-[#181d1b] px-7 py-3 border border-[#bbcbba]/60 hover:border-[#bbcbba] rounded-[6px]"
              >
                See how it works
              </a>
            </div>

            <p className="text-[12px] text-[#8a9a8a] tracking-tight">
              No credit card · No Shopify install · Results in 30 seconds
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-6">
              <span className="text-[11px] text-[#8a9a8a]">Used in</span>
              {["Fitness", "Fashion", "Beauty", "Supplements", "Home"].map((cat) => (
                <span key={cat} className="text-[11px] text-[#5a6059]">{cat}</span>
              ))}
            </div>
          </div>

          {/* ── Right: Interactive widget ── */}
          <div className="lg:mt-0 mt-8">
            <ForecastWidget />
          </div>

        </div>

        {/* ── Stats strip ── */}
        <div className="mt-16 pt-8 border-t border-[#bbcbba]/40 grid grid-cols-3 gap-6">
          {[
            { value: "87%",   label: "forecast accuracy",  sub: "on steady-selling SKUs†" },
            { value: "30s",   label: "to first insight",   sub: "no setup required"        },
            { value: "$9/mo", label: "No per-SKU fees",    sub: "cancel anytime"           },
          ].map((s) => (
            <div key={s.label}>
              <span className="text-[26px] font-bold text-[#181d1b] tracking-tight tabular-nums">{s.value}</span>
              <p className="text-[12px] text-[#5a6059] mt-0.5">{s.label}</p>
              <p className="text-[10px] text-[#8a9a8a] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-[#8a9a8a]">
          † Accuracy measured on products with ≥60 days of consistent sales history.
        </p>

      </div>
    </section>
  );
}
