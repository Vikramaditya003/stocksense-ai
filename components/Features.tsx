import FadeIn from "@/components/FadeIn";

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#0d1a10]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <FadeIn className="mb-16 max-w-2xl">
          <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 uppercase tracking-[0.18em] bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-5">
            Why teams switch
          </span>
          <h2 className="text-[42px] sm:text-[52px] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-4">
            Know exactly what to order,<br className="hidden sm:block" /> and when.
          </h2>
          <p className="text-[16px] text-white/50 leading-relaxed">
            Most tools show data. Forestock tells you what to do, why, and by when — with the revenue impact if you don&apos;t.
          </p>
        </FadeIn>

        {/* ── Feature list ── */}
        <div className="space-y-3">

          {/* Row 1 — wide card */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

              {/* Large feature */}
              <div className="lg:col-span-3 card-glass-dark p-7">
                <span className="inline-flex items-center text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full mb-4">
                  Non-negotiable
                </span>
                <h3 className="text-[20px] font-bold text-white tracking-tight mb-2">Exact stockout countdown</h3>
                <p className="text-[14px] text-white/55 leading-relaxed mb-6">
                  Every product shows a precise days-remaining countdown and revenue impact — not a vague &ldquo;medium risk&rdquo; label.
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
                        <span className="text-[13px] font-medium text-white/80">{p.name}</span>
                        <span className={`text-[12px] font-bold tabular-nums ${p.days <= 7 ? "text-red-400" : p.days <= 14 ? "text-orange-400" : "text-yellow-400"}`}>
                          {p.days}d left
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.color} opacity-80 ${p.pct === 7 ? "w-[7%]" : p.pct === 16 ? "w-[16%]" : "w-[43%]"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small feature — dark emerald, looks great on dark bg */}
              <div className="lg:col-span-2 bg-emerald-950 rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden border border-emerald-800/40">
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
          </FadeIn>

          {/* Row 2 — three equal cards */}
          <FadeIn delay={1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="card-glass-dark p-6">
                <span className="inline-flex items-center text-[10px] font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full mb-4">
                  Supplier-aware
                </span>
                <h3 className="text-[16px] font-bold text-white tracking-tight mb-2">Lead time planning</h3>
                <p className="text-[13px] text-white/50 leading-relaxed mb-4">
                  Input your lead time and get concrete warnings before it&apos;s too late to reorder.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-white/40 font-mono uppercase mb-0.5">Lead time</p>
                    <p className="text-[18px] font-bold text-white">10<span className="text-sm font-normal text-white/50">d</span></p>
                  </div>
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <div className="flex-1 bg-orange-500/10 border border-orange-400/20 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-orange-400 font-mono uppercase mb-0.5">Days left</p>
                    <p className="text-[18px] font-bold text-orange-400">8<span className="text-sm font-normal text-orange-400/60">d</span></p>
                  </div>
                </div>
              </div>

              <div className="card-glass-dark p-6">
                <span className="inline-flex items-center text-[10px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full mb-4">
                  Unique to us
                </span>
                <h3 className="text-[16px] font-bold text-white tracking-tight mb-2">Ad-spend forecasting</h3>
                <p className="text-[13px] text-white/50 leading-relaxed mb-4">
                  Stop stocking out the week after your biggest Meta push.
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Ad spend", val: "+20%", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
                    { label: "Demand",   val: "+35%", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
                    { label: "Stockout", val: "3d sooner", color: "text-red-400 bg-red-400/10 border-red-400/20" },
                  ].map((r, i) => (
                    <div key={r.label} className="flex items-center gap-2">
                      {i > 0 && <span className="text-white/30 text-xs ml-1">↓</span>}
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border font-mono ${r.color}`}>{r.label} {r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-glass-dark p-6">
                <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full mb-4">
                  Cash flow
                </span>
                <h3 className="text-[16px] font-bold text-white tracking-tight mb-2">Overstock detection</h3>
                <p className="text-[13px] text-white/50 leading-relaxed mb-4">
                  Spot dead stock and free up working capital for fast-moving SKUs.
                </p>
                <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg p-3">
                  <p className="text-[11px] text-amber-400 font-mono mb-1">203 units · 90d+ supply</p>
                  <p className="text-[13px] font-semibold text-amber-300">~$55 tied up → reduce next order</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Row 3 — full-width stat strip */}
          <FadeIn delay={2}>
            <div className="card-glass-dark overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.07]">
                {[
                  { value: "87%",   label: "Forecast accuracy"       },
                  { value: "30s",   label: "Time to first insight"   },
                  { value: "$10",    label: "Per month, cancel anytime" },
                  { value: "2 min", label: "Setup — just upload CSV" },
                ].map((s) => (
                  <div key={s.label} className="px-6 py-5">
                    <p className="text-[28px] font-bold text-white tracking-tight tabular-nums">{s.value}</p>
                    <p className="text-[11px] text-white/40 mt-1 font-mono">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
