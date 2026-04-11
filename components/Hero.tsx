import Link from "next/link";

const mockProducts = [
  { name: "Premium Yoga Mat",     stock: 12,  days: 4,  risk: "critical", trend: "+34%", loss: "$220", barClass: "bar-6"   },
  { name: "Water Bottle XL",      stock: 34,  days: 11, risk: "high",     trend: "+51%", loss: "$104", barClass: "bar-16"  },
  { name: "Resistance Bands Set", stock: 87,  days: 29, risk: "safe",     trend: "+12%", loss: null,   barClass: "bar-43"  },
];

const riskStyle: Record<string, { pill: string; days: string; bar: string }> = {
  critical: { pill: "text-red-400 bg-red-500/[0.08] border-red-500/20",         days: "text-red-400",    bar: "bg-red-500"     },
  high:     { pill: "text-orange-400 bg-orange-500/[0.08] border-orange-500/20", days: "text-orange-400", bar: "bg-orange-500"  },
  safe:     { pill: "text-gray-400 bg-white/[0.05] border-white/10",             days: "text-gray-500",   bar: "bg-gray-600"    },
};

function orderByLabel() {
  const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function Hero() {
  const orderBy = orderByLabel();
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-[#0a0f0a]">
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Two-column asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-center">

          {/* ── Left: Headline + CTAs ── */}
          <div className="flex flex-col items-start">

            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.18em] mb-7">
              Shopify inventory forecasting
            </p>

            <h1 className="text-[58px] sm:text-[72px] lg:text-[80px] xl:text-[88px] font-bold leading-[0.93] tracking-[-0.03em] text-[#fafafa] mb-6">
              Know before<br />
              you stock out.
            </h1>

            <p className="text-[17px] text-gray-400 leading-[1.65] max-w-[420px] mb-9">
              Upload your Shopify CSV. Get exact stockout dates, reorder quantities,
              and revenue at risk — in 30 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
              <Link
                href="/forecast"
                className="btn-primary inline-flex items-center gap-2 text-[15px] font-semibold text-[#0a0f0a] bg-[#00D26A] px-7 py-3 rounded-[6px]"
              >
                Run free forecast
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="btn-ghost inline-flex items-center gap-2 text-[15px] text-gray-400 hover:text-[#fafafa] px-7 py-3 border border-white/[0.12] hover:border-white/[0.22] rounded-[6px]"
              >
                See how it works
              </a>
            </div>

            <p className="text-[12px] text-gray-600 tracking-tight">
              No credit card · No Shopify install · Results in 30 seconds
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-6">
              <span className="text-[11px] text-gray-700">Used in</span>
              {["Fitness", "Fashion", "Beauty", "Supplements", "Home"].map((cat) => (
                <span key={cat} className="text-[11px] text-gray-600">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Product mockup ── */}
          <div className="relative lg:mt-0 mt-8">
            <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] overflow-hidden shadow-2xl shadow-black/60">

              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-[#0d1210]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                  <span className="text-[11px] font-medium text-gray-500 font-mono">Forecast report</span>
                </div>
                <span className="text-[10px] font-medium text-gray-500 border border-white/[0.08] px-2.5 py-1 rounded-[4px]">
                  Live analysis
                </span>
              </div>

              {/* Alert */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/[0.04] border-b border-red-500/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-[12px] text-gray-400 flex-1 min-w-0 truncate">
                  <span className="font-semibold text-red-400">Premium Yoga Mat</span>
                  {" "}— stockout in <span className="font-semibold text-[#00D26A]">4 days</span>
                  <span className="text-gray-700 mx-1.5">·</span>
                  <span className="text-red-400">$220 at risk</span>
                </span>
                <span className="text-[11px] font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/15 px-2 py-0.5 rounded-[4px] flex-shrink-0">
                  Order by {orderBy}
                </span>
              </div>

              {/* Health row */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04]">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Health</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-bold text-[#fafafa] tracking-tight tabular-nums">72</span>
                    <span className="text-xs text-gray-600">/100</span>
                  </div>
                </div>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#00D26A] health-bar-fill-72" />
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />2 critical</span>
                  <span className="flex items-center gap-1 text-[#00D26A]"><span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />1 safe</span>
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
                          <p className="text-[13px] font-medium text-gray-200 truncate">{p.name}</p>
                          <p className="text-[11px] mt-0.5">
                            <span className="text-gray-600">{p.stock} units · </span>
                            <span className={p.days <= 14 ? s.days + " font-semibold" : "text-gray-600"}>
                              {p.days <= 14 ? `Stockout in ${p.days}d` : `${p.days}d left`}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          {p.loss
                            ? <span className="text-[12px] font-bold text-red-400 hidden sm:block">{p.loss}</span>
                            : <span className="text-[12px] text-[#00D26A] hidden sm:block">Safe</span>}
                          <span className={`text-[11px] font-medium ${p.trend.startsWith("+") ? "text-[#00D26A]" : "text-red-400"}`}>{p.trend}</span>
                          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] border ${s.pill}`}>{p.risk}</span>
                        </div>
                      </div>
                      <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.bar} opacity-70 ${p.barClass}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI recommendation footer */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.04]">
                <div className="w-5 h-5 rounded-[4px] bg-[#00D26A]/10 border border-[#00D26A]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#00D26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-[12px] text-gray-500">
                  Order <span className="text-gray-200 font-semibold">150 units of Yoga Mat</span>
                  <span className="mx-1.5 text-gray-700">→</span>
                  <span className="text-gray-400">covers demand through May 3</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-16 pt-8 border-t border-white/[0.05] grid grid-cols-3 gap-6">
          {[
            { value: "87%", label: "forecast accuracy",     sub: "across all SKU types"  },
            { value: "30s", label: "to first insight",      sub: "no setup required"     },
            { value: "10×", label: "cheaper than Prediko",  sub: "same-day results"      },
          ].map((s) => (
            <div key={s.label}>
              <span className="text-[26px] font-bold text-[#fafafa] tracking-tight tabular-nums">{s.value}</span>
              <p className="text-[12px] text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-gray-700 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
