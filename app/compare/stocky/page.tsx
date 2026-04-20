import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Stocky Alternative — Forestock | Best Stocky Replacement 2026",
  description:
    "Shopify Stocky is shutting down August 31, 2026. Migrate to Forestock in 60 seconds — upload your Stocky CSV and get AI-powered demand forecasts instantly. Free to start.",
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
  { feature: "AI demand forecasting", us: check, them: cross, note: "Stocky used basic moving averages — no AI predictions" },
  { feature: "Days of stock remaining per SKU", us: check, them: check },
  { feature: "Reorder quantity recommendation", us: check, them: partial, note: "Stocky showed reorder points but not AI-calculated quantities" },
  { feature: "Revenue at risk (₹ / $ impact)", us: check, them: cross, note: "Stocky never showed the money impact of a stockout" },
  { feature: "Stockout date prediction", us: check, them: cross, note: "Forestock gives you the exact date you'll run out" },
  { feature: "30-second results", us: check, them: partial, note: "Stocky required full Shopify sync — no instant analysis" },
  { feature: "Works after August 31, 2026", us: check, them: cross, note: "Stocky is fully shut down on August 31, 2026" },
  { feature: "Import from Stocky CSV export", us: check, them: cross, note: "Upload your Stocky products CSV directly — no reformatting" },
  { feature: "60 & 90-day forecasts", us: check, them: cross },
  { feature: "Ad spend correlation", us: check, them: cross },
  { feature: "Inventory health score", us: check, them: cross },
  { feature: "Confidence score per product", us: check, them: cross },
  { feature: "Works without Shopify install", us: check, them: cross, note: "Forestock works from a CSV — no app permissions needed" },
  { feature: "Free tier", us: check, them: check, note: "Stocky was free; Forestock has a free tier with 5 forecast runs" },
  { feature: "Price", us: <span className="font-bold text-[#22C55E]">₹749/mo Pro</span>, them: <span className="font-bold text-red-400/80">Shutting down</span> },
];

export default function VsStocky() {
  return (
    <main className="min-h-screen bg-[#060C0D]">
      <Navbar />

      {/* Urgency banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-center py-2.5 px-4">
        <p className="text-[13px] text-amber-300 font-medium">
          Shopify Stocky shuts down permanently on{" "}
          <span className="font-bold text-amber-200">August 31, 2026</span>
          {" "}— migrate your data today before it&apos;s gone.
        </p>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#22C55E]/[0.05] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/[0.08] border border-amber-500/20 px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">Stocky Replacement</span>
          </div>
          <h1 className="text-[44px] sm:text-[60px] font-bold text-white tracking-[-0.035em] leading-[1.05] mb-6">
            Stocky is shutting down.<br />
            <span className="text-[#22C55E]">Forestock is your upgrade.</span>
          </h1>
          <p className="text-[18px] text-slate-400 max-w-[560px] mx-auto leading-relaxed mb-4">
            Shopify Stocky was delisted February 2, 2026 and closes August 31, 2026. Forestock picks up where Stocky left off — with AI forecasting Stocky never had.
          </p>
          <p className="text-[14px] text-slate-500 mb-10">
            Upload your Stocky CSV export and see your reorder plan in{" "}
            <span className="text-white font-semibold">60 seconds</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-[15px] px-8 gap-2 shadow-xl shadow-[#22C55E]/20">
              <Link href="/forecast">Import my Stocky data →</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-[15px] px-8 border-white/15 text-slate-300">
              <Link href="/#pricing">See pricing</Link>
            </Button>
          </div>
          <p className="text-[12px] text-slate-600 mt-4">Free to start · No Shopify install required · Results in 30 seconds</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[860px] mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: "Aug 31", label: "Stocky shutdown date — export your data now", color: "text-amber-400" },
            { stat: "60s", label: "to see your first Forestock forecast", color: "text-[#22C55E]" },
            { stat: "Free", label: "to start — same as Stocky was", color: "text-white" },
          ].map(s => (
            <div key={s.stat} className="card p-5 text-center">
              <div className={`text-[40px] font-bold tracking-tight tabular-nums ${s.color}`}>{s.stat}</div>
              <div className="text-[12px] text-slate-500 mt-1.5 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Migration steps */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">Migrate from Stocky in 3 steps</h2>
        <p className="text-slate-500 text-sm mb-8">Before Stocky shuts down, export your data and bring it into Forestock.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Export from Stocky",
              body: "In Shopify Admin → Apps → Stocky → Products → Export CSV. Do this before August 31, 2026 — after that, your data is gone.",
            },
            {
              step: "2",
              title: "Upload to Forestock",
              body: "Go to Forestock → Run Forecast → upload your Stocky products CSV. No reformatting needed — Forestock reads it directly.",
            },
            {
              step: "3",
              title: "Get your AI reorder plan",
              body: "In 30 seconds you'll see stockout dates, reorder quantities, and the exact revenue at risk for every SKU — things Stocky never showed you.",
            },
          ].map(c => (
            <div key={c.step} className="card p-5">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4">
                <span className="text-[13px] font-bold text-[#22C55E]">{c.step}</span>
              </div>
              <p className="text-sm font-semibold text-white mb-2">{c.title}</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">Forestock vs Shopify Stocky</h2>
        <p className="text-slate-500 text-sm mb-6">Stocky was a solid basic tool. Forestock is what Stocky should have been.</p>
        <div className="card overflow-x-auto">
          <div className="min-w-[420px]">
          <div className="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] border-b border-white/[0.06] bg-white/[0.02]">
            <div className="px-4 sm:px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Feature</div>
            <div className="px-3 sm:px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-[#22C55E]">Forestock</span>
            </div>
            <div className="px-3 sm:px-4 py-3.5 text-center">
              <span className="text-[12px] font-bold text-slate-400">Stocky</span>
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={r.feature}
              className={`grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_120px_120px] border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
              <div className="px-5 py-3.5">
                <p className="text-sm text-slate-300">{r.feature}</p>
                {r.note && <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{r.note}</p>}
              </div>
              <div className="px-4 py-3.5 flex items-center justify-center">{r.us}</div>
              <div className="px-4 py-3.5 flex items-center justify-center">{r.them}</div>
            </div>
          ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-700 mt-3">
          ✓ verified · ~ partial / plan-dependent · ✗ not available · Last updated April 2026.
        </p>
      </section>

      {/* What Stocky merchants need */}
      <section className="max-w-[860px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-8 tracking-tight">What Stocky merchants need — and what Forestock delivers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Your stockout dates, not just stock levels",
              body: "Stocky told you how many units you had. Forestock tells you the exact date you'll run out — and the exact date you need to place your order to avoid it.",
            },
            {
              title: "The revenue impact of every stockout",
              body: "Forestock shows you exactly how much money you'll lose if each SKU stocks out for 7 days. Stocky never did this — it left the math to you.",
            },
            {
              title: "AI-powered reorder quantities",
              body: "Forestock accounts for sales velocity, trends, lead times, and a 20% safety buffer. You get a specific unit number to order — not a raw reorder point.",
            },
            {
              title: "No Shopify admin required",
              body: "Since Stocky lived inside Shopify's admin, its shutdown means you lose the tool entirely. Forestock is standalone — it works from a CSV and will never be shut down by Shopify.",
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

      {/* FAQ */}
      <section className="max-w-[720px] mx-auto px-4 mb-20">
        <h2 className="text-[22px] font-bold text-white mb-8 tracking-tight">Common questions from Stocky users</h2>
        <div className="space-y-3">
          {[
            {
              q: "Can I import my Stocky data directly?",
              a: "Yes. Go to Shopify Admin → Apps → Stocky → Products → Export CSV. Then upload that file to Forestock on the forecast page. No reformatting needed.",
            },
            {
              q: "Is Forestock free like Stocky was?",
              a: "Forestock has a free tier with 5 forecast runs — enough to test your full inventory. Pro (₹749/mo) gives you unlimited runs, 60 & 90-day forecasts, and ad-spend correlation.",
            },
            {
              q: "What happens to my Stocky data after August 31?",
              a: "It's gone permanently. Export your Stocky CSV before the shutdown date. Once exported, you can use it in Forestock indefinitely.",
            },
            {
              q: "Does Forestock connect directly to my Shopify store?",
              a: "Currently Forestock works via CSV export — which means it works right now without any install. Direct Shopify API integration is on the roadmap.",
            },
            {
              q: "What did Stocky do that Forestock doesn't?",
              a: "Stocky had native purchase order creation inside Shopify Admin. Forestock focuses on forecasting and reorder recommendations — 1-click PO generation is coming in Pro.",
            },
          ].map(item => (
            <div key={item.q} className="card p-5">
              <p className="text-sm font-semibold text-white mb-2">{item.q}</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[720px] mx-auto px-4 pb-28 text-center">
        <div className="card p-10 border-amber-500/15 bg-gradient-to-b from-amber-500/[0.04] to-transparent">
          <p className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-3">Don&apos;t wait</p>
          <h2 className="text-[32px] font-bold text-white tracking-tight mb-3">
            Export your Stocky data today
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Stocky shuts down August 31, 2026. Upload your export to Forestock and get AI-powered forecasts in 60 seconds — free.
          </p>
          <Button asChild size="lg" className="text-[15px] px-10 gap-2 shadow-xl shadow-[#22C55E]/20">
            <Link href="/forecast">
              Import my Stocky CSV — free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
          <p className="text-[12px] text-slate-600 mt-4">No credit card · No Shopify install · 5 free runs</p>
        </div>
      </section>
    </main>
  );
}
