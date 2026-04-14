export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#f6faf6]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-16 max-w-2xl">
          <span className="inline-flex items-center text-[10px] font-bold text-[#006d34] uppercase tracking-[0.18em] bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-1 rounded-full mb-5">
            Why teams switch
          </span>
          <h2 className="text-[42px] sm:text-[52px] font-bold leading-[1.0] tracking-[-0.03em] text-[#181d1b] mb-4">
            Know exactly what to order,<br className="hidden sm:block" /> and when.
          </h2>
          <p className="text-[16px] text-[#5a6059] leading-relaxed">
            Most tools show data. Forestock tells you what to do, why, and by when — with the revenue impact if you don&apos;t.
          </p>
        </div>

        {/* ── Feature list ── */}
        <div className="space-y-3">

          {/* Row 1 — wide card */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

            {/* Large feature */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#bbcbba]/40 p-7 shadow-sm">
              <span className="inline-flex items-center text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full mb-4">
                Non-negotiable
              </span>
              <h3 className="text-[20px] font-bold text-[#181d1b] tracking-tight mb-2">Exact stockout countdown</h3>
              <p className="text-[14px] text-[#5a6059] leading-relaxed mb-6">
                Every product shows a precise days-remaining countdown and revenue impact — not a vague "medium risk" label.
              </p>
              {/* Product list */}
              <div className="space-y-3">
                {[
                  { name: "Yoga Mat Pro",     days: 5,  pct: 7,   color: "bg-red-500"    },
                  { name: "Water Bottle XL",  days: 11, pct: 16,  color: "bg-orange-500" },
                  { name: "Resistance Bands", days: 29, pct: 43,  color: "bg-yellow-500" },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-[#181d1b]">{p.name}</span>
                      <span className={`text-[12px] font-bold tabular-nums ${p.days <= 7 ? "text-red-600" : p.days <= 14 ? "text-orange-600" : "text-yellow-600"}`}>
                        {p.days}d left
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#eaefeb] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.color} opacity-80 ${p.pct === 7 ? "w-[7%]" : p.pct === 16 ? "w-[16%]" : "w-[43%]"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Small feature */}
            <div className="lg:col-span-2 bg-emerald-950 rounded-2xl p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-900/60 border border-emerald-700/30 px-2 py-0.5 rounded-full mb-4">
                  Smart reorder
                </span>
                <h3 className="text-[20px] font-bold text-white tracking-tight mb-2">Reorder with cover duration</h3>
                <p className="text-[14px] text-emerald-100/60 leading-relaxed mb-6">
                  Factors in lead time, safety stock, and seasonal demand automatically.
                </p>
                <div className="bg-emerald-900/60 border border-emerald-700/30 rounded-xl p-4">
                  <p className="text-[11px] text-emerald-400/60 font-mono uppercase tracking-widest mb-1">Reorder action</p>
                  <p className="text-[15px] font-bold text-white">Order <span className="text-emerald-400">120 units</span> → covers <span className="text-emerald-400">18 days</span></p>
                </div>
              </div>
              <svg className="absolute -right-6 -bottom-6 w-32 h-32 text-emerald-800/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>

          {/* Row 2 — three equal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 shadow-sm">
              <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full mb-4">
                Supplier-aware
              </span>
              <h3 className="text-[16px] font-bold text-[#181d1b] tracking-tight mb-2">Lead time planning</h3>
              <p className="text-[13px] text-[#5a6059] leading-relaxed mb-4">
                Input your lead time and get concrete warnings before it&apos;s too late to reorder.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#eaefeb] rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#8a9a8a] font-mono uppercase mb-0.5">Lead time</p>
                  <p className="text-[18px] font-bold text-[#181d1b]">10<span className="text-sm font-normal text-[#5a6059]">d</span></p>
                </div>
                <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-orange-500 font-mono uppercase mb-0.5">Days left</p>
                  <p className="text-[18px] font-bold text-orange-600">8<span className="text-sm font-normal text-orange-400">d</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 shadow-sm">
              <span className="inline-flex items-center text-[10px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full mb-4">
                Unique to us
              </span>
              <h3 className="text-[16px] font-bold text-[#181d1b] tracking-tight mb-2">Ad-spend forecasting</h3>
              <p className="text-[13px] text-[#5a6059] leading-relaxed mb-4">
                Stop stocking out the week after your biggest Meta push.
              </p>
              <div className="space-y-1.5">
                {[
                  { label: "Ad spend", val: "+20%", color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
                  { label: "Demand",   val: "+35%", color: "text-blue-700 bg-blue-50 border-blue-200" },
                  { label: "Stockout", val: "3d sooner", color: "text-red-700 bg-red-50 border-red-200" },
                ].map((r, i) => (
                  <div key={r.label} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[#8a9a8a] text-xs ml-1">↓</span>}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border font-mono ${r.color}`}>{r.label} {r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 shadow-sm">
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-4">
                Cash flow
              </span>
              <h3 className="text-[16px] font-bold text-[#181d1b] tracking-tight mb-2">Overstock detection</h3>
              <p className="text-[13px] text-[#5a6059] leading-relaxed mb-4">
                Spot dead stock and free up working capital for fast-moving SKUs.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-[11px] text-amber-600 font-mono mb-1">203 units · 90d+ supply</p>
                <p className="text-[13px] font-semibold text-amber-700">~$55 tied up → reduce next order</p>
              </div>
            </div>
          </div>

          {/* Row 3 — full-width stat strip */}
          <div className="bg-white rounded-2xl border border-[#bbcbba]/40 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#bbcbba]/30">
              {[
                { value: "87%",   label: "Forecast accuracy"       },
                { value: "30s",   label: "Time to first insight"   },
                { value: "$9",    label: "Per month, cancel anytime" },
                { value: "2 min", label: "Setup — just upload CSV" },
              ].map((s) => (
                <div key={s.label} className="px-6 py-5">
                  <p className="text-[28px] font-bold text-[#181d1b] tracking-tight tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-[#5a6059] mt-1 font-mono">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
