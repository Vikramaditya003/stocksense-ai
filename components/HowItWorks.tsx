import Link from "next/link";
import { type ReactNode } from "react";

const steps: {
  step: string;
  title: string;
  description: string;
  icon: ReactNode;
  visual: ReactNode;
}[] = [
  {
    step: "01",
    title: "Upload your sales data",
    description: "Export a CSV from Shopify and drop it in — or paste raw data. No install, no API keys. Under 2 minutes.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    visual: (
      <div className="mt-5 rounded-xl border border-dashed border-[#22C55E]/25 bg-[#22C55E]/[0.02] p-3.5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-white/[0.05] rounded-lg flex items-center justify-center flex-shrink-0 border border-white/[0.07]">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-200 truncate">shopify_orders_2024.csv</p>
            <p className="text-[10px] text-slate-600 mt-0.5">4,231 rows · 6 columns</p>
          </div>
          <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex-shrink-0">✓ Ready</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#22C55E] to-emerald-400 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "AI analyzes demand patterns",
    description: "Sales velocity, seasonal trends, growth signals, stockout risk per SKU — identified in seconds.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    visual: (
      <div className="mt-5 space-y-2.5">
        {[
          { label: "Velocity (30d)", cls: "w-[75%]", val: "+34%", bar: "bg-[#22C55E]",   text: "text-[#22C55E]"  },
          { label: "Trend signal",   cls: "w-[60%]", val: "Rising", bar: "bg-cyan-500",  text: "text-cyan-400"   },
          { label: "Risk score",     cls: "w-[88%]", val: "High",   bar: "bg-red-500",   text: "text-red-400"    },
        ].map(r => (
          <div key={r.label} className="flex items-center gap-2.5">
            <span className="text-[10px] text-slate-600 w-[80px] flex-shrink-0 font-mono tracking-tight">{r.label}</span>
            <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className={`h-full rounded-full opacity-75 ${r.bar} ${r.cls}`} />
            </div>
            <span className={`text-[10px] font-bold font-mono w-10 text-right flex-shrink-0 ${r.text}`}>{r.val}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "03",
    title: "Get precise decisions",
    description: "Not dashboards — decisions. Exact stockout dates, order quantities, revenue at risk, and a one-click PO.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
      </svg>
    ),
    visual: (
      <div className="mt-5 space-y-2">
        <div className="bg-[#22C55E]/[0.04] rounded-xl border border-[#22C55E]/15 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-[#22C55E]/15 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">AI Recommendation</span>
          </div>
          <p className="text-[12px] text-slate-300 leading-relaxed">
            Order <span className="font-bold text-white">150 units</span> of Yoga Mat by{" "}
            <span className="font-bold text-white">Apr 16</span> — covers demand through{" "}
            <span className="text-[#22C55E] font-semibold">May 3</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/[0.03] rounded-lg border border-white/[0.06] px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Revenue at risk</span>
            <span className="text-[11px] font-bold text-red-400">$220</span>
          </div>
          <div className="flex-1 bg-white/[0.03] rounded-lg border border-white/[0.06] px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Days left</span>
            <span className="text-[11px] font-bold text-orange-400">4d</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative section-alt">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">

        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both">
          <p className="section-label mb-5">Process</p>
          <h2 className="text-4xl sm:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight mb-4 mt-4">
            Forecasts in{" "}
            <span className="text-[#22C55E]">under 60 seconds</span>
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed tracking-tight">
            No Shopify app install. No API keys. Just your CSV.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-[#22C55E]/[0.08] bg-[#0A1415] p-6 hover:border-[#22C55E]/22 hover:bg-[#0D1B1E] transition-all duration-200 group animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both overflow-hidden"
            >
              {/* Top highlight on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/0 to-transparent group-hover:via-[#22C55E]/35 transition-all duration-300" />

              {/* Step number + icon row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] group-hover:bg-[#22C55E]/15 group-hover:border-[#22C55E]/30 transition-colors flex-shrink-0">
                  {step.icon}
                </div>
                <span className="text-[42px] font-black text-white/[0.04] leading-none tabular-nums select-none font-mono">
                  {step.step}
                </span>
              </div>

              {/* Connector between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[2.75rem] -right-2 z-10 w-4 h-px bg-[#22C55E]/20" />
              )}

              <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">{step.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed tracking-tight">{step.description}</p>

              {step.visual}
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="rounded-2xl border border-[#22C55E]/15 bg-[#0A1415] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both">
          <div>
            <p className="text-[17px] font-semibold text-white tracking-tight mb-0.5">
              Shopify Stocky shuts down August 2026.
            </p>
            <p className="text-[14px] text-slate-500 tracking-tight">
              Switch before your next peak season. Start free, no credit card.
            </p>
          </div>
          <Link
            href="/forecast"
            className="flex-shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/15"
          >
            Start free
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
