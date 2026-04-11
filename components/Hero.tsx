import Link from "next/link";

const mockProducts = [
  { name: "Premium Yoga Mat",     stock: 12,  days: 4,  risk: "critical", trend: "+34%", loss: "$220", barClass: "bar-6"   },
  { name: "Water Bottle XL",      stock: 34,  days: 11, risk: "high",     trend: "+51%", loss: "$104", barClass: "bar-16"  },
  { name: "Resistance Bands Set", stock: 87,  days: 29, risk: "medium",   trend: "+12%", loss: null,   barClass: "bar-43"  },
];

const riskStyle: Record<string, { pill: string; days: string; bar: string }> = {
  critical: { pill: "text-red-400 bg-red-500/[0.08] border-red-500/20",         days: "text-red-400",    bar: "bg-red-500"     },
  high:     { pill: "text-orange-400 bg-orange-500/[0.08] border-orange-500/20", days: "text-orange-400", bar: "bg-orange-500"  },
  medium:   { pill: "text-yellow-400 bg-yellow-500/[0.08] border-yellow-500/20", days: "text-slate-400",  bar: "bg-yellow-500"  },
};

function orderByLabel() {
  const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function Hero() {
  const orderBy = orderByLabel();
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden grain">
      <div className="absolute inset-0 bg-[#060C0D]" />
      {/* Single very subtle radial — bottom center only */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22C55E]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Two-column asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-center">

          {/* ── Left: Headline + CTAs ── */}
          <div className="flex flex-col items-start">

            {/* Plain text overline — no pill */}
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.18em] mb-7">
              Shopify inventory forecasting
            </p>

            {/* Headline — Instrument Serif, left-aligned, no drop shadow */}
            <h1 className="font-serif text-[58px] sm:text-[72px] lg:text-[80px] xl:text-[90px] leading-[0.93] text-white mb-6">
              Know before
              <br />
              you stock{" "}
              <em className="font-serif-italic text-[#22C55E]">out.</em>
            </h1>

            <p className="text-[17px] text-slate-400 leading-[1.65] max-w-[420px] mb-9">
              Upload your Shopify CSV. Get exact stockout dates, reorder quantities,
              and revenue at risk — in 30 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <Link
                href="/forecast"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#22C55E]/15 hover:shadow-[#22C55E]/25"
              >
                Run free forecast
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/forecast?demo=true"
                className="inline-flex items-center gap-2 text-[15px] text-slate-400 hover:text-white px-7 py-3 rounded-xl border border-white/[0.10] hover:border-white/[0.20] transition-all"
              >
                See live demo
              </Link>
            </div>

            {/* Trust signals — plain text, no icon stamps */}
            <p className="text-[12px] text-slate-600 tracking-tight">
              No credit card · No Shopify install · Results in 30 seconds
            </p>

            {/* Category strip — minimal */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-6">
              <span className="text-[11px] text-slate-700">Used in</span>
              {["Fitness", "Fashion", "Beauty", "Supplements", "Home"].map((cat) => (
                <span key={cat} className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-default">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Product mockup — no browser chrome ── */}
          <div className="relative lg:mt-0 mt-8">
            {/* Soft glow behind the panel */}
            <div className="absolute inset-x-[10%] -top-4 h-8 bg-[#22C55E]/15 blur-3xl pointer-events-none" />

            <div className="rounded-2xl border border-white/[0.08] bg-[#0A1415] overflow-hidden shadow-2xl shadow-black/60">

              {/* Top bar — minimal, no fake browser chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-[#07100F]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-500 font-mono">Forecast report</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-[#22C55E] bg-[#22C55E]/[0.08] border border-[#22C55E]/20 px-2.5 py-1 rounded-full">
                  <span>Live analysis</span>
                </div>
              </div>

              {/* Alert */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/[0.04] border-b border-red-500/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                <span className="text-[12px] text-slate-400 flex-1 min-w-0 truncate">
                  <span className="font-semibold text-red-400">Premium Yoga Mat</span>
                  {" "}— stockout in <span className="font-semibold text-red-300">4 days</span>
                  <span className="text-slate-700 mx-1.5">·</span>
                  <span className="text-red-400">$220 at risk</span>
                </span>
                <span className="text-[11px] font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-lg flex-shrink-0">
                  Order by {orderBy}
                </span>
              </div>

              {/* Health row */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04]">
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-0.5">Health</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-bold text-white tracking-tight tabular-nums">72</span>
                    <span className="text-xs text-slate-600">/100</span>
                  </div>
                </div>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-emerald-400 health-bar-fill-72" />
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />2 critical</span>
                  <span className="flex items-center gap-1 text-[#22C55E]"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />1 safe</span>
                </div>
              </div>

              {/* Product rows */}
              <div className="divide-y divide-white/[0.03]">
                {mockProducts.map((p) => {
                  const s = riskStyle[p.risk];
                  return (
                    <div key={p.name} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-[13px] font-medium text-slate-200 truncate">{p.name}</p>
                          <p className="text-[11px] mt-0.5">
                            <span className="text-slate-600">{p.stock} units · </span>
                            <span className={p.days <= 14 ? s.days + " font-semibold" : "text-slate-600"}>
                              {p.days <= 14 ? `Stockout in ${p.days}d` : `${p.days}d left`}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          {p.loss
                            ? <span className="text-[12px] font-bold text-red-400 hidden sm:block">{p.loss}</span>
                            : <span className="text-[12px] text-[#22C55E] hidden sm:block">Safe</span>}
                          <span className={`text-[11px] font-medium ${p.trend.startsWith("+") ? "text-[#22C55E]" : "text-red-400"}`}>{p.trend}</span>
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${s.pill}`}>{p.risk}</span>
                        </div>
                      </div>
                      <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.bar} opacity-70 ${p.barClass} ${p.risk === "critical" ? "animate-pulse" : ""}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI recommendation footer */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.04] bg-[#22C55E]/[0.02]">
                <div className="w-5 h-5 rounded-md bg-[#22C55E]/15 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-[12px] text-slate-500">
                  Order <span className="text-slate-200 font-semibold">150 units of Yoga Mat</span>
                  <span className="mx-1.5 text-slate-700">→</span>
                  <span className="text-slate-400">covers demand through May 3</span>
                </span>
              </div>
            </div>

            <div className="absolute -bottom-px left-0 right-0 h-16 bg-gradient-to-t from-[#060C0D] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── Stats strip — one line, below the columns ── */}
        <div className="mt-16 pt-8 border-t border-white/[0.05] grid grid-cols-3 gap-6">
          {[
            { value: "87%", label: "forecast accuracy", sub: "across all SKU types" },
            { value: "30s",  label: "to first insight",  sub: "no setup required"   },
            { value: "10×",  label: "cheaper than Prediko", sub: "same-day results" },
          ].map((s) => (
            <div key={s.label}>
              <span className="text-[26px] font-bold text-white tracking-tight tabular-nums">{s.value}</span>
              <p className="text-[12px] text-slate-500 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-[#22C55E]/60 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
