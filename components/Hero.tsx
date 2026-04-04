"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { name: "Premium Yoga Mat", stock: 12, days: 4, risk: "critical", trend: "+34%", loss: "₹18,000" },
  { name: "Water Bottle XL", stock: 34, days: 11, risk: "high", trend: "+51%", loss: "₹8,500" },
  { name: "Resistance Bands Set", stock: 87, days: 29, risk: "medium", trend: "+12%", loss: null },
  { name: "Foam Roller Pro", stock: 203, days: 68, risk: "low", trend: "-5%", loss: null },
];

const riskStyle: Record<string, { pill: string; days: string }> = {
  critical: { pill: "text-red-400 bg-red-500/[0.08] border-red-500/20", days: "text-red-400" },
  high:     { pill: "text-orange-400 bg-orange-500/[0.08] border-orange-500/20", days: "text-orange-400" },
  medium:   { pill: "text-yellow-400 bg-yellow-500/[0.08] border-yellow-500/20", days: "text-slate-400" },
  low:      { pill: "text-[#22C55E] bg-[#22C55E]/[0.08] border-[#22C55E]/20", days: "text-slate-500" },
};

function orderByLabel() {
  const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Hero() {
  const orderBy = orderByLabel();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[#060C0D]" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      {/* Ambient glows */}
      <div className="hidden sm:block absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22C55E]/[0.07] blur-[140px] rounded-full pointer-events-none" />
      <div className="hidden sm:block absolute top-[50%] right-[0%] w-[300px] h-[300px] bg-cyan-500/[0.04] blur-[100px] rounded-full pointer-events-none" />
      <div className="hidden sm:block absolute top-[30%] left-[0%] w-[250px] h-[250px] bg-[#0D9488]/[0.05] blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[900px] mx-auto px-4 sm:px-6">

        {/* Urgency tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-orange-500/[0.1] border border-orange-500/25 px-4 py-1.5 rounded-full mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[12px] font-semibold text-orange-400 tracking-widest uppercase">
            Shopify Stocky shutting down August 2026
          </span>
        </motion.div>

        {/* Headline — bold and impactful */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="text-[60px] sm:text-[80px] lg:text-[100px] font-bold text-white leading-[0.9] tracking-[-0.04em] mb-6"
        >
          Inventory that
          <br />
          <span className="text-[#22C55E]">never runs out</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.1, ease: "easeOut" }}
          className="text-[18px] text-slate-400 max-w-[540px] leading-relaxed mb-10 tracking-tight"
        >
          AI tells you{" "}
          <span className="text-slate-200 font-semibold">
            Stockout in 5 days, order 120 units, you&apos;ll lose ₹18k
          </span>{" "}
          — not just &ldquo;medium risk&rdquo;. Replace Stocky before August 2026.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-5"
        >
          <Button asChild size="lg"
            className="text-[16px] px-8 h-13 gap-2 w-full sm:w-auto font-semibold shadow-xl shadow-[#22C55E]/20 hover:shadow-[#22C55E]/30 transition-shadow">
            <Link href="/forecast">
              Analyze free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg"
            className="text-[16px] px-8 h-13 gap-2 w-full sm:w-auto border-white/15 hover:border-[#22C55E]/40 text-slate-300 hover:text-white">
            <Link href="/forecast?demo=true">
              <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              See live demo
            </Link>
          </Button>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.18 }}
          className="text-[13px] text-slate-600 mb-14"
        >
          No credit card · Results in 30 seconds · Shopify CSV compatible
        </motion.p>

        {/* Stats — competitive positioning */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="flex items-stretch justify-center gap-0 mb-20 rounded-2xl border border-white/[0.07] bg-[#0A1415] overflow-hidden divide-x divide-white/[0.07]"
        >
          {[
            { value: "87%", label: "forecast accuracy", sub: null },
            { value: "4×", label: "cheaper than Prediko", sub: "same features" },
            { value: "30s", label: "to first insight", sub: "vs 10 min avg" },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center px-6 py-5">
              <div className="text-[28px] font-bold text-white tracking-tight tabular-nums">{s.value}</div>
              <div className="text-[12px] text-slate-500 mt-1 tracking-tight">{s.label}</div>
              {s.sub && <div className="text-[10px] text-[#22C55E]/70 mt-0.5">{s.sub}</div>}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dashboard mockup */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[780px] mx-auto px-4 sm:px-6"
      >
        {/* Glow under mockup */}
        <div className="absolute inset-x-[15%] -top-4 h-8 bg-[#22C55E]/20 blur-3xl" />

        <div className="rounded-2xl gradient-border-teal bg-[#0A1415] overflow-hidden shadow-2xl shadow-black/80">
          {/* Browser chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-[#07100F]">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                {["bg-red-500/50","bg-yellow-500/50","bg-[#22C55E]/50"].map(c => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                ))}
              </div>
              <span className="text-[12px] text-slate-600 ml-1 font-mono">stocksenseai.com/forecast</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#22C55E]/[0.1] border border-[#22C55E]/25 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#22C55E]">Live analysis</span>
            </div>
          </div>

          {/* Alert bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex items-center gap-3 px-5 py-3 bg-red-500/[0.05] border-b border-red-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <span className="text-[13px] text-slate-400">
              <span className="font-semibold text-red-400">Premium Yoga Mat</span>
              {" "}— stockout in <span className="font-semibold text-red-300">4 days</span>
              <span className="text-slate-700 mx-2">·</span>
              <span className="text-red-400 font-semibold">lose ₹18,000</span>
            </span>
            <span className="ml-auto text-[12px] font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg flex-shrink-0">
              Order by {orderBy}
            </span>
          </motion.div>

          {/* Health row */}
          <div className="flex items-center gap-5 px-5 py-4 border-b border-white/[0.04] bg-[#07100F]">
            <div>
              <p className="text-[11px] text-slate-600 uppercase tracking-widest mb-1">Health score</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-white tracking-tight">72</span>
                <span className="text-sm text-slate-600">/100</span>
              </div>
            </div>
            <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 1.2, delay: 0.95, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-emerald-400" />
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              {[
                { label: "2 critical", color: "text-red-400", dot: "bg-red-500" },
                { label: "1 at risk", color: "text-orange-400", dot: "bg-orange-500" },
                { label: "1 safe", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
              ].map(s => (
                <span key={s.label} className={`flex items-center gap-1.5 ${s.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Product rows */}
          <div className="divide-y divide-white/[0.03]">
            {mockProducts.map((p, i) => {
              const s = riskStyle[p.risk];
              return (
                <motion.div key={p.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.55 + i * 0.07 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#22C55E]/[0.02] transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-[14px] font-medium text-slate-200 truncate tracking-tight">{p.name}</p>
                    <p className="text-[12px] mt-0.5">
                      <span className="text-slate-600">{p.stock} units · </span>
                      <span className={p.days <= 14 ? s.days + " font-semibold" : "text-slate-600"}>
                        {p.days <= 14 ? `Stockout in ${p.days}d` : `${p.days}d left`}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.loss ? <span className="text-[12px] font-bold text-red-400 hidden sm:block">{p.loss}</span>
                            : <span className="text-[12px] text-[#22C55E] hidden sm:block">Safe</span>}
                    <span className={`text-[12px] font-medium ${p.trend.startsWith("+") ? "text-[#22C55E]" : "text-red-400"}`}>{p.trend}</span>
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-lg border ${s.pill}`}>{p.risk}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* AI footer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex items-center gap-3 px-5 py-3.5 border-t border-white/[0.04] bg-[#22C55E]/[0.03]">
            <div className="w-6 h-6 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-[13px] text-slate-500">
              AI: Order <span className="text-slate-200 font-semibold">150 units of Yoga Mat</span>
              <span className="mx-2 text-slate-700">→</span>
              <span className="text-slate-400">lasts 18 days after lead time</span>
            </span>
          </motion.div>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-28 bg-gradient-to-t from-[#060C0D] to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}
