import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StockSense AI vs Prediko — Inventory Forecasting Comparison",
  description:
    "Compare StockSense AI vs Prediko for Shopify inventory forecasting. Same AI-powered stockout prevention, 4× cheaper. No setup fee, results in 30 seconds.",
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
  { feature: "AI stockout prediction", us: check, them: check },
  { feature: "Days of stock remaining", us: check, them: check },
  { feature: "Reorder quantity + date", us: check, them: check },
  { feature: "Revenue at risk (₹ impact)", us: check, them: check },
  { feature: "Results in 30 seconds", us: check, them: cross, note: "Prediko requires full Shopify sync (5–15 min setup)" },
  { feature: "No Shopify install required", us: check, them: cross, note: "StockSense AI works from a CSV upload — no OAuth, no permissions" },
  { feature: "Confidence score per forecast", us: check, them: partial, note: "Prediko shows confidence on some plans only" },
  { feature: "Free tier with real forecasts", us: check, them: partial, note: "Prediko free tier is heavily limited — no AI suggestions" },
  { feature: "Health score dashboard", us: check, them: cross },
  { feature: "Delta comparison (vs last forecast)", us: check, them: cross },
  { feature: "Safe products collapse", us: check, them: cross, note: "StockSense AI hides safe SKUs so you focus on what matters" },
  { feature: "Starting price", us: <span className="font-bold text-[#22C55E]">₹999/mo</span>, them: <span className="font-bold text-slate-300">$49/mo (~₹4,100)</span> },
  { feature: "Shopify App Store listing", us: partial, them: check, note: "Coming soon for StockSense AI" },
  { feature: "WooCommerce / other platforms", us: partial, them: cross, note: "Both currently Shopify-focused; CSV import works for any platform" },
];

export default function VsPrediko() {
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
            StockSense AI vs<br />
            <span className="text-[#22C55E]">Prediko</span>
          </h1>
          <p className="text-[18px] text-slate-400 max-w-[540px] mx-auto leading-relaxed mb-10">
            Both tools predict stockouts. StockSense AI does it in <span className="text-white font-semibold">30 seconds</span> with no setup — and costs <span className="text-white font-semibold">4× less</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-[15px] px-8 gap-2 shadow-xl shadow-[#22C55E]/20">
              <Link href="/forecast">Try StockSense AI free →</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-[15px] px-8 border-white/15 text-slate-300">
              <Link href="/#pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Price callout */}
      <section className="max-w-[860px] mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: "4×", label: "cheaper than Prediko's starter plan", color: "text-[#22C55E]" },
            { stat: "30s", label: "to first stockout alert vs 15 min setup", color: "text-white" },
            { stat: "0", label: "Shopify permissions required to start", color: "text-white" },
          ].map(s => (
            <div key={s.stat} className="card p-5 text-center">
              <div className={`text-[40px] font-bold tracking-tight tabular-nums ${s.color}`}>{s.stat}</div>
              <div className="text-[12px] text-slate-500 mt-1.5 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-6 tracking-tight">Feature comparison</h2>
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px] border-b border-white/[0.06] bg-white/[0.02]">
            <div className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Feature</div>
            <div className="px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-[#22C55E]">StockSense AI</span>
            </div>
            <div className="px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-slate-400">Prediko</span>
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={r.feature}
              className={`grid grid-cols-[1fr_120px_120px] border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
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

      {/* Why section */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-8 tracking-tight">When StockSense AI is the better choice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "You want results now, not after setup",
              body: "Prediko requires installing a Shopify app, granting OAuth permissions, and waiting for a full sync. StockSense AI runs from a single CSV export — upload once, get your reorder plan in 30 seconds.",
            },
            {
              title: "Budget is a real constraint",
              body: "Prediko's paid plans start at $49/month (~₹4,100). StockSense AI Pro is ₹999/month — the same AI-powered stockout predictions for a fraction of the cost.",
            },
            {
              title: "You want to see the rupee impact",
              body: "StockSense AI shows you exactly how much revenue is at risk per SKU in ₹, not just risk categories. Every reorder decision is tied to a specific revenue number.",
            },
            {
              title: "You're not fully committed to Shopify",
              body: "Because StockSense AI uses CSV import, it works with any platform — Shopify, WooCommerce, custom systems. No vendor lock-in.",
            },
          ].map(c => (
            <div key={c.title} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {check}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{c.title}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{c.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When Prediko wins */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-4 tracking-tight">When Prediko might be the better choice</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          We believe in honest comparisons. Here&apos;s where Prediko currently has an edge:
        </p>
        <div className="space-y-3">
          {[
            "You need deep Shopify POS / multi-location inventory sync",
            "You want automatic reorder creation directly inside Shopify (native PO flow)",
            "You prefer a longer-established tool with a larger review base",
          ].map(t => (
            <div key={t} className="flex items-center gap-3 text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
              {partial}
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[720px] mx-auto px-4 pb-28 text-center">
        <div className="card p-10 border-[#22C55E]/15 bg-gradient-to-b from-[#22C55E]/[0.04] to-transparent">
          <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-3">Try it free</p>
          <h2 className="text-[32px] font-bold text-white tracking-tight mb-3">
            See your stockouts in 30 seconds
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Upload your Shopify CSV and get an exact reorder plan — before you spend $49/month on Prediko.
          </p>
          <Button asChild size="lg" className="text-[15px] px-10 gap-2 shadow-xl shadow-[#22C55E]/20">
            <Link href="/forecast">
              Analyze your inventory free
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
