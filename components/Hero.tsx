import Link from "next/link";

const mockProducts = [
  { name: "Premium Yoga Mat",     stock: 12,  days: 4,  risk: "critical", trend: "+34%", loss: "$220", barClass: "bar-6"   },
  { name: "Water Bottle XL",      stock: 34,  days: 11, risk: "high",     trend: "+51%", loss: "$104", barClass: "bar-16"  },
  { name: "Resistance Bands Set", stock: 87,  days: 29, risk: "medium",   trend: "+12%", loss: null,   barClass: "bar-43"  },
  { name: "Foam Roller Pro",      stock: 203, days: 68, risk: "low",      trend: "-5%",  loss: null,   barClass: "bar-100" },
];

const riskStyle: Record<string, { pill: string; days: string; bar: string }> = {
  critical: { pill: "text-red-400 bg-red-500/[0.08] border-red-500/20",         days: "text-red-400",    bar: "bg-red-500"     },
  high:     { pill: "text-orange-400 bg-orange-500/[0.08] border-orange-500/20", days: "text-orange-400", bar: "bg-orange-500"  },
  medium:   { pill: "text-yellow-400 bg-yellow-500/[0.08] border-yellow-500/20", days: "text-slate-400",  bar: "bg-yellow-500"  },
  low:      { pill: "text-[#22C55E] bg-[#22C55E]/[0.08] border-[#22C55E]/20",   days: "text-slate-500",  bar: "bg-[#22C55E]"   },
};

function orderByLabel() {
  const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function Hero() {
  const orderBy = orderByLabel();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[#060C0D]" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="hidden sm:block absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22C55E]/[0.07] blur-[140px] rounded-full pointer-events-none" />
      <div className="hidden sm:block absolute top-[50%] right-[0%] w-[300px] h-[300px] bg-cyan-500/[0.04] blur-[100px] rounded-full pointer-events-none" />
      <div className="hidden sm:block absolute top-[30%] left-[0%] w-[250px] h-[250px] bg-[#0D9488]/[0.05] blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[900px] mx-auto px-4 sm:px-6">

        {/* Label */}
        <div className="flex items-center gap-2 mb-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[11px] font-bold text-slate-500 tracking-[0.14em] uppercase">
            AI-powered inventory forecasting
          </span>
          <span className="hidden sm:inline-block text-slate-700 text-[11px]">·</span>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-[#22C55E]">87% forecast accuracy</span>
        </div>

        {/* Headline */}
        <h1 className="text-[52px] sm:text-[76px] lg:text-[96px] font-extrabold text-white leading-[0.92] tracking-[-0.04em] mb-7 animate-in fade-in-0 slide-in-from-bottom-4 duration-400 delay-75 fill-mode-both">
          Never let a
          <br />
          <span className="text-[#22C55E] drop-shadow-[0_0_40px_rgba(34,197,94,0.25)]">Shopify stockout</span>
          <br />
          catch you off guard
        </h1>

        {/* Sub */}
        <p className="text-[16px] sm:text-[18px] text-slate-400 max-w-[500px] leading-relaxed mb-10 tracking-tight animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-100 fill-mode-both">
          Upload your CSV. 30 seconds later you&apos;ll know exactly{" "}
          <span className="text-slate-200 font-medium">which products run out first, when to reorder, and what revenue is at risk.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-150 fill-mode-both">
          <Link
            href="/forecast"
            className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-8 h-13 rounded-xl w-full sm:w-auto justify-center shadow-xl shadow-[#22C55E]/20 hover:shadow-[#22C55E]/30 transition-all"
          >
            Run free forecast
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/forecast?demo=true"
            className="inline-flex items-center gap-2 text-[16px] px-8 h-13 rounded-xl w-full sm:w-auto justify-center border border-white/15 hover:border-[#22C55E]/40 text-slate-300 hover:text-white bg-transparent transition-all"
          >
            <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            See live demo
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mb-5 animate-in fade-in-0 duration-300 delay-200 fill-mode-both">
          {["No credit card", "No Shopify install", "Results in 30 seconds", "Works with any store"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[12px] text-slate-600">
              <svg className="w-3 h-3 text-[#22C55E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {t}
            </span>
          ))}
        </div>

        {/* Store category trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 animate-in fade-in-0 duration-300 delay-200 fill-mode-both">
          <span className="text-[11px] text-slate-700 font-medium mr-0.5">Used by merchants in</span>
          {["Fitness & Wellness", "Fashion", "Beauty & Skincare", "Home & Lifestyle", "Supplements"].map((cat) => (
            <span
              key={cat}
              className="text-[11px] text-slate-500 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full hover:border-white/[0.12] hover:text-slate-400 transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-stretch justify-center gap-0 mb-20 rounded-2xl border border-white/[0.07] bg-[#0A1415] overflow-hidden divide-x divide-white/[0.07] animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-200 fill-mode-both">
          {[
            { value: "87%", label: "forecast accuracy",    sub: "across all SKU types" },
            { value: "30s", label: "to first insight",     sub: "no setup required"    },
            { value: "10×", label: "cheaper than Prediko", sub: "same-day results"     },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center px-6 py-5">
              <div className="text-[28px] font-bold text-white tracking-tight tabular-nums">{s.value}</div>
              <div className="text-[12px] text-slate-500 mt-1 tracking-tight">{s.label}</div>
              <div className="text-[10px] text-[#22C55E]/70 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative z-10 w-full max-w-[780px] mx-auto px-4 sm:px-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
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
              <span className="text-[12px] text-slate-600 ml-1 font-mono">getforestock.com/forecast</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#22C55E]/[0.1] border border-[#22C55E]/25 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#22C55E]">Live analysis</span>
            </div>
          </div>

          {/* Alert bar */}
          <div className="flex items-center gap-3 px-5 py-3 bg-red-500/[0.05] border-b border-red-500/10 animate-in fade-in-0 duration-300 delay-700 fill-mode-both">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <span className="text-[13px] text-slate-400">
              <span className="font-semibold text-red-400">Premium Yoga Mat</span>
              {" "}— stockout in <span className="font-semibold text-red-300">4 days</span>
              <span className="text-slate-700 mx-2">·</span>
              <span className="text-red-400 font-semibold">lose $220</span>
            </span>
            <span className="ml-auto text-[12px] font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg flex-shrink-0">
              Order by {orderBy}
            </span>
          </div>

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
              <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-emerald-400 health-bar-fill-72" />
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              {[
                { label: "2 critical", color: "text-red-400",    dot: "bg-red-500"    },
                { label: "1 at risk",  color: "text-orange-400", dot: "bg-orange-500" },
                { label: "1 safe",     color: "text-[#22C55E]",  dot: "bg-[#22C55E]"  },
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
            {mockProducts.map((p) => {
              const s = riskStyle[p.risk];
              return (
                <div key={p.name} className="px-5 py-3 hover:bg-[#22C55E]/[0.02] transition-colors animate-in fade-in-0 slide-in-from-right-2 duration-300 delay-500 fill-mode-both">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-[13px] font-medium text-slate-200 truncate tracking-tight">{p.name}</p>
                      <p className="text-[11px] mt-0.5">
                        <span className="text-slate-600">{p.stock} units · </span>
                        <span className={p.days <= 14 ? s.days + " font-semibold" : "text-slate-600"}>
                          {p.days <= 14 ? `Stockout in ${p.days}d` : `${p.days}d left`}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.loss
                        ? <span className="text-[12px] font-bold text-red-400 hidden sm:block">{p.loss}</span>
                        : <span className="text-[12px] text-[#22C55E] hidden sm:block">Safe</span>}
                      <span className={`text-[12px] font-medium ${p.trend.startsWith("+") ? "text-[#22C55E]" : "text-red-400"}`}>{p.trend}</span>
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-lg border ${s.pill}`}>{p.risk}</span>
                    </div>
                  </div>
                  {/* Progress bar — shows days remaining as % of max */}
                  <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar} opacity-70 ${p.barClass} ${p.risk === "critical" ? "animate-pulse" : ""}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI footer */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-t border-white/[0.04] bg-[#22C55E]/[0.03] animate-in fade-in-0 duration-300 delay-1000 fill-mode-both">
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
          </div>
        </div>

        <div className="absolute -bottom-px left-0 right-0 h-28 bg-gradient-to-t from-[#060C0D] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
