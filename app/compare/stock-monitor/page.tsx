import Link from "next/link";
import { Package, BarChart2, CircleDollarSign, ClipboardList, Bell, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forestock vs Stock Monitor — Shopify Inventory Comparison",
  description:
    "Compare Forestock vs Stock Monitor for Shopify. AI-powered revenue forecasting, reorder dates, and rupee-level impact — not just out-of-stock alerts.",
};

const check = (
  <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const cross = (
  <svg className="w-4 h-4 text-red-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const partial = (
  <svg className="w-4 h-4 text-yellow-400/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const rows: { feature: string; us: React.ReactNode; them: React.ReactNode; note?: string }[] = [
  { feature: "Stockout alerts", us: check, them: check },
  { feature: "Days of stock remaining", us: check, them: check },
  { feature: "Out-of-stock since date", us: check, them: check },
  { feature: "AI demand forecasting", us: check, them: cross, note: "Stock Monitor tracks stock — it does not forecast future demand with AI" },
  { feature: "Revenue at risk (₹ impact)", us: check, them: cross, note: "Stock Monitor shows stock levels; Forestock shows how much money you'll lose" },
  { feature: "Reorder quantity recommendation", us: check, them: cross, note: "Forestock tells you exactly how many units to order" },
  { feature: "Reorder by date", us: check, them: cross, note: "AI-calculated deadline accounting for your supplier lead time" },
  { feature: "90-day demand forecast per SKU", us: check, them: cross },
  { feature: "Health score dashboard", us: check, them: cross },
  { feature: "Confidence score per forecast", us: check, them: cross },
  { feature: "Trend analysis (growing / declining)", us: check, them: cross },
  { feature: "Works from CSV (no install needed)", us: check, them: cross, note: "Stock Monitor requires full Shopify app install" },
  { feature: "Native Shopify alerts / notifications", us: partial, them: check, note: "Forestock Shopify app coming soon" },
  { feature: "Free tier", us: check, them: check },
  { feature: "Pro starting price", us: <span className="font-bold text-[#22C55E]">₹999/mo</span>, them: <span className="font-bold text-slate-300">Free–$9/mo</span> },
];

export default function VsStockMonitor() {
  return (
    <main className="min-h-screen bg-[#060C0D]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#22C55E]/[0.05] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/[0.08] border border-[#22C55E]/20 px-4 py-1.5 rounded-full mb-8">
            <span className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest">Comparison</span>
          </div>
          <h1 className="text-[48px] sm:text-[64px] font-bold text-white tracking-[-0.035em] leading-[1.0] mb-6">
            Forestock vs<br />
            <span className="text-[#22C55E]">Stock Monitor</span>
          </h1>
          <p className="text-[18px] text-slate-400 max-w-[560px] mx-auto leading-relaxed mb-10">
            Stock Monitor tells you <span className="text-white font-semibold">when you ran out</span>.
            Forestock tells you <span className="text-white font-semibold">when you will run out, what to order, and how much revenue you&apos;ll lose if you don&apos;t</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-[15px] px-8 gap-2 shadow-xl shadow-[#22C55E]/20">
              <Link href="/forecast">Try Forestock free →</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-[15px] px-8 border-white/15 text-slate-300">
              <Link href="/#pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core difference callout */}
      <section className="max-w-[860px] mx-auto px-4 mb-12">
        <div className="card p-6 border-[#22C55E]/15 bg-[#22C55E]/[0.03]">
          <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">The key difference</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-1">Stock Monitor</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Reactive — it monitors your current stock levels and notifies you when something hits zero or a threshold you set. No forecasting, no reorder advice, no revenue impact.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#22C55E] mb-1">Forestock</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Proactive — it forecasts when each SKU will run out based on your sales velocity, calculates the exact rupee loss, and tells you the reorder quantity and deadline before it happens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-6 tracking-tight">Feature comparison</h2>
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[1fr_130px_130px] border-b border-white/[0.06] bg-white/[0.02]">
            <div className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Feature</div>
            <div className="px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-[#22C55E]">Forestock</span>
            </div>
            <div className="px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-slate-400">Stock Monitor</span>
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={r.feature}
              className={`grid grid-cols-[1fr_130px_130px] border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
              <div className="px-5 py-3.5">
                <p className="text-sm text-slate-300">{r.feature}</p>
                {r.note && <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{r.note}</p>}
              </div>
              <div className="px-4 py-3.5 flex items-center justify-center">{r.us}</div>
              <div className="px-4 py-3.5 flex items-center justify-center">{r.them}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-700 mt-3">
          ✓ verified · ~ partial / plan-dependent · ✗ not available · Last updated April 2026.
        </p>
      </section>

      {/* Real scenario */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-6 tracking-tight">Same situation. Different outcomes.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-6 border-red-500/15">
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-3">With Stock Monitor</p>
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2.5"><Package className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" /><p>Stock hits 0 on your Yoga Mat SKU.</p></div>
              <div className="flex items-start gap-2.5"><Bell    className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" /><p>You get a notification: <em>&ldquo;Premium Yoga Mat is out of stock.&rdquo;</em></p></div>
              <div className="flex items-start gap-2.5"><HelpCircle className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" /><p>You don&apos;t know how long it&apos;s been out. You don&apos;t know how much you lost. You order reactively.</p></div>
              <p className="text-red-400 font-medium pl-6">You lost ₹18,000 before you even saw the alert.</p>
            </div>
          </div>
          <div className="card p-6 border-[#22C55E]/15 bg-[#22C55E]/[0.02]">
            <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">With Forestock</p>
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2.5"><BarChart2       className="w-4 h-4 text-[#22C55E]/70 flex-shrink-0 mt-0.5" /><p>4 days before stockout, AI flags: <em>&ldquo;Premium Yoga Mat &mdash; 4 days left.&rdquo;</em></p></div>
              <div className="flex items-start gap-2.5"><CircleDollarSign className="w-4 h-4 text-[#22C55E]/70 flex-shrink-0 mt-0.5" /><p>Revenue at risk shown: <strong className="text-white">₹18,000</strong> if you don&apos;t act.</p></div>
              <div className="flex items-start gap-2.5"><ClipboardList   className="w-4 h-4 text-[#22C55E]/70 flex-shrink-0 mt-0.5" /><p>Reorder plan: <strong className="text-white">Order 150 units by Apr 9.</strong></p></div>
              <p className="text-[#22C55E] font-medium pl-6">You order in time. Revenue protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* When Stock Monitor is fine */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-4 tracking-tight">When Stock Monitor might be enough</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Honest answer — if your needs are simple, Stock Monitor is a legitimate choice:
        </p>
        <div className="space-y-3">
          {[
            "You just need a basic alert when something hits zero (no forecasting needed)",
            "You have very few SKUs (<10) and track them manually most of the time",
            "You're on a tight budget and the free tier of Stock Monitor covers you",
          ].map(t => (
            <div key={t} className="flex items-start gap-3 text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
              <span className="text-yellow-400/70 mt-0.5 flex-shrink-0">—</span>
              <span className="ml-2">{t}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          But if you want to <span className="text-white font-semibold">prevent</span> stockouts rather than react to them — and see the rupee impact before it happens — that&apos;s Forestock.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-[720px] mx-auto px-4 pb-28 text-center">
        <div className="card p-10 border-[#22C55E]/15 bg-gradient-to-b from-[#22C55E]/[0.04] to-transparent">
          <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">Stop reacting. Start forecasting.</p>
          <h2 className="text-[32px] font-bold text-white tracking-tight mb-3">
            Know before you run out
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue at risk — in 30 seconds.
          </p>
          <Button asChild size="lg" className="text-[15px] px-10 gap-2 shadow-xl shadow-[#22C55E]/20">
            <Link href="/forecast">
              Get your reorder plan free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
          <p className="text-[12px] text-slate-600 mt-4">No credit card · No Shopify install · 30 seconds</p>
        </div>
      </section>
    </main>
  );
}
