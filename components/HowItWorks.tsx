import Link from "next/link";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0d1210] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <div className="mb-20">
          <span className="inline-flex items-center text-[10px] font-bold text-[#00D26A] uppercase tracking-[0.18em] bg-[#00D26A]/[0.07] border border-[#00D26A]/20 px-3 py-1 rounded-full mb-6">
            How it works
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-[48px] sm:text-[60px] font-bold leading-[0.93] tracking-[-0.03em] text-[#fafafa]">
              Forecast in under<br />a minute.
            </h2>
            <p className="text-[15px] text-gray-400 max-w-[280px] sm:text-right leading-relaxed mb-1">
              No Shopify app. No API keys.<br />
              Just your CSV.
            </p>
          </div>
        </div>

        {/* ── Steps ── */}
        <div className="space-y-0">

          {/* Step 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-16 items-center pb-16 border-b border-white/[0.06]">
            <div>
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-mono text-[11px] font-bold text-[#00D26A] tracking-widest">01</span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <h3 className="text-[28px] sm:text-[34px] font-bold text-[#fafafa] leading-tight tracking-tight mb-4">
                Upload your sales data
              </h3>
              <p className="text-[15px] text-gray-400 leading-relaxed max-w-[380px]">
                Export a CSV directly from Shopify — orders, products, or inventory.
                Drop it in. No mapping, no API keys, no 30-minute setup.
              </p>
            </div>
            {/* Visual */}
            <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-5 card-depth transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.14]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-[8px] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-200 truncate">shopify_orders_2024.csv</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-mono">4,231 rows · 6 columns</p>
                </div>
                <span className="text-[10px] font-bold text-[#00D26A] bg-[#00D26A]/10 border border-[#00D26A]/20 px-2 py-0.5 rounded-[4px] flex-shrink-0">Ready</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-full bg-[#00D26A] rounded-full" />
              </div>
              <p className="text-[11px] text-gray-600 mt-2 font-mono">Parsed in 0.3s</p>
            </div>
          </div>

          {/* Step 02 — reversed */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-16 items-center py-16 border-b border-white/[0.06]">
            {/* Visual — left on desktop */}
            <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-5 order-last lg:order-first card-depth transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.14]">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 font-mono">Demand signals</p>
              <div className="space-y-3">
                {[
                  { label: "30-day velocity",  val: "+34%",   barW: "w-[75%]", bar: "bg-[#00D26A]",   text: "text-[#00D26A]"  },
                  { label: "Trend signal",     val: "Rising", barW: "w-[60%]", bar: "bg-sky-500",     text: "text-sky-400"    },
                  { label: "Stockout risk",    val: "High",   barW: "w-[88%]", bar: "bg-red-500",     text: "text-red-400"    },
                  { label: "Seasonality",      val: "Low",    barW: "w-[22%]", bar: "bg-gray-600",    text: "text-gray-500"   },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-600 w-[90px] flex-shrink-0 font-mono">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full opacity-90 ${r.bar} ${r.barW}`} />
                    </div>
                    <span className={`text-[11px] font-bold font-mono w-12 text-right flex-shrink-0 ${r.text}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-mono text-[11px] font-bold text-[#00D26A] tracking-widest">02</span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <h3 className="text-[28px] sm:text-[34px] font-bold text-[#fafafa] leading-tight tracking-tight mb-4">
                AI reads your demand patterns
              </h3>
              <p className="text-[15px] text-gray-400 leading-relaxed max-w-[380px]">
                Sales velocity, seasonal trends, growth signals, ad-spend correlation —
                analysed per SKU in seconds, not hours.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-16 items-center pt-16">
            <div>
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-mono text-[11px] font-bold text-[#00D26A] tracking-widest">03</span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>
              <h3 className="text-[28px] sm:text-[34px] font-bold text-[#fafafa] leading-tight tracking-tight mb-4">
                Get decisions, not dashboards
              </h3>
              <p className="text-[15px] text-gray-400 leading-relaxed max-w-[380px]">
                Exact stockout dates. Reorder quantities with cover duration.
                Revenue at risk. A one-click purchase order ready to send.
              </p>
              <Link
                href="/forecast"
                className="btn-primary btn-gradient inline-flex items-center gap-2 text-[13px] font-semibold text-[#0a0f0a] px-5 py-2.5 rounded-[6px] mt-7"
              >
                Run free forecast
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            {/* Visual */}
            <div className="space-y-2.5">
              <div className="rounded-[10px] border border-[#00D26A]/20 bg-[#00D26A]/[0.04] p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-4 h-4 rounded-[3px] bg-[#00D26A]/10 border border-[#00D26A]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#00D26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#00D26A] uppercase tracking-widest">AI Recommendation</span>
                </div>
                <p className="text-[13px] text-gray-300 leading-relaxed">
                  Order <span className="font-bold text-[#fafafa]">150 units</span> of Yoga Mat by{" "}
                  <span className="font-bold text-[#fafafa]">Apr 16</span> — covers demand through{" "}
                  <span className="text-[#00D26A] font-semibold">May 3</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-3.5">
                  <p className="text-[10px] text-gray-600 mb-1">Revenue at risk</p>
                  <p className="text-[18px] font-bold text-red-400 tabular-nums">$220</p>
                </div>
                <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-3.5">
                  <p className="text-[10px] text-gray-600 mb-1">Days left</p>
                  <p className="text-[18px] font-bold text-orange-400 tabular-nums">4d</p>
                </div>
              </div>
              <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-3 flex items-center justify-between">
                <span className="text-[12px] text-gray-500">Purchase order ready</span>
                <span className="text-[11px] font-semibold text-[#00D26A]">Download PO</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stocky migration strip */}
        <div className="mt-16 rounded-[10px] border border-white/[0.08] bg-[#111614] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-semibold text-[#fafafa] mb-0.5">Shopify Stocky shuts down August 2026.</p>
            <p className="text-[13px] text-gray-400">Switch before your next peak season. Start free, no credit card.</p>
          </div>
          <Link
            href="/forecast"
            className="btn-ghost flex-shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold text-gray-300 border border-white/[0.12] hover:border-white/[0.25] hover:text-[#fafafa] px-5 py-2.5 rounded-[6px]"
          >
            Switch now
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
