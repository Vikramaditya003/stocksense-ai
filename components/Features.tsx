import { type ReactNode } from "react";

const features: {
  tag: string; tagStyle: string;
  title: string;
  before?: string; after?: string; afterStyle?: string;
  formula?: string[];
  desc: string;
  span?: "wide" | "full";
  visual?: ReactNode;
}[] = [
  {
    tag: "Non-negotiable",
    tagStyle: "text-red-700 bg-red-50 border-red-200",
    title: "Exact stockout countdown",
    before: '"Medium risk"',
    after: "Stockout in 5 days → lose $220",
    afterStyle: "text-red-700 bg-red-50 border-red-200",
    desc: "Every product shows a precise countdown and revenue impact — not a vague risk label.",
    span: "wide",
    visual: (
      <div className="mt-5 space-y-2.5">
        {[
          { name: "Yoga Mat Pro",     days: 5,  barClass: "bar-7",  color: "bg-red-500"    },
          { name: "Water Bottle XL",  days: 11, barClass: "bar-16", color: "bg-orange-500" },
          { name: "Resistance Bands", days: 29, barClass: "bar-43", color: "bg-yellow-500" },
        ].map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#5a6059] font-mono">{p.name}</span>
              <span className={`text-[11px] font-semibold tabular-nums ${p.days <= 7 ? "text-red-600" : p.days <= 14 ? "text-orange-600" : "text-yellow-600"}`}>
                {p.days}d left
              </span>
            </div>
            <div className="h-1 bg-[#eaefeb] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${p.color} opacity-75 ${p.barClass}`} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Smart reorder",
    tagStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
    title: "Reorder with cover duration",
    before: '"Reorder 120 units"',
    after: "Order 120 units → lasts 18 days",
    afterStyle: "text-emerald-700 bg-emerald-50 border-emerald-200",
    desc: "Factors in supplier lead time, safety stock, and seasonal demand automatically.",
  },
  {
    tag: "Unique to us",
    tagStyle: "text-cyan-700 bg-cyan-50 border-cyan-200",
    title: "Ad-spend forecasting",
    formula: ["Ad spend +20%", "→", "Demand +35%", "→", "Stockout 3 days sooner"],
    desc: "No competitor offers this. Stop stocking out the week after your biggest Meta push.",
  },
  {
    tag: "Supplier-aware",
    tagStyle: "text-[#5a6059] bg-[#eaefeb] border-[#bbcbba]/60",
    title: "Lead time planning",
    before: "Lead time: 10d. Days left: 8.",
    after: "Already late — order immediately",
    afterStyle: "text-orange-700 bg-orange-50 border-orange-200",
    desc: "Input your lead time and get concrete warnings before it's too late to reorder.",
    span: "wide",
    visual: (
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 bg-[#eaefeb] rounded-[8px] p-3 border border-[#bbcbba]/60">
          <p className="text-[10px] text-[#8a9a8a] uppercase tracking-widest mb-1 font-mono">Lead time</p>
          <p className="text-[22px] font-bold text-[#181d1b] tabular-nums">10<span className="text-sm font-normal text-[#5a6059]"> days</span></p>
        </div>
        <svg className="w-4 h-4 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="flex-1 bg-orange-50 rounded-[8px] p-3 border border-orange-200">
          <p className="text-[10px] text-orange-500 uppercase tracking-widest mb-1 font-mono">Days left</p>
          <p className="text-[22px] font-bold text-orange-600 tabular-nums">8<span className="text-sm font-normal text-orange-400"> days</span></p>
        </div>
      </div>
    ),
  },
  {
    tag: "Cash flow",
    tagStyle: "text-amber-700 bg-amber-50 border-amber-200",
    title: "Overstock detection",
    before: "203 units in stock",
    after: "~$55 tied up → reduce next order",
    afterStyle: "text-amber-700 bg-amber-50 border-amber-200",
    desc: "Spot dead stock and free up working capital you can redirect to fast-moving SKUs.",
  },
  {
    tag: "One-click",
    tagStyle: "text-[#5a6059] bg-[#eaefeb] border-[#bbcbba]/60",
    title: "Generate purchase orders",
    before: "Copy-paste into email manually",
    after: "Download formatted PO instantly",
    afterStyle: "text-[#5a6059] bg-[#eaefeb] border-[#bbcbba]/60",
    desc: "One click generates a full purchase order for all urgent reorders, ready to send.",
    span: "full",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#f6faf6] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-end">
          <div>
            <span className="inline-flex items-center text-[10px] font-bold text-[#006d34] uppercase tracking-[0.18em] bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-1 rounded-full mb-6">
              Why teams switch
            </span>
            <h2 className="text-[48px] sm:text-[60px] font-bold leading-[0.93] tracking-[-0.03em] text-[#181d1b]">
              Decisions,<br />
              not dashboards.
            </h2>
          </div>
          <p className="text-[15px] text-[#5a6059] leading-relaxed lg:text-right lg:mb-2">
            Most tools show data. Forestock tells you what to do,
            why, and by when — with the revenue impact if you don&apos;t.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-[10px] border border-[#bbcbba]/60 bg-white p-5 card-depth transition-all duration-200 hover:border-[#bbcbba] hover:-translate-y-0.5 relative overflow-hidden ${
                f.span === "wide" ? "sm:col-span-2 lg:col-span-2" : f.span === "full" ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              {/* Tag — top right */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#181d1b] tracking-tight leading-snug max-w-[200px]">{f.title}</h3>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] border tracking-wide flex-shrink-0 ml-2 ${f.tagStyle}`}>
                  {f.tag}
                </span>
              </div>

              {f.formula && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {f.formula.map((part, j) => (
                    part === "→" ? (
                      <span key={j} className="text-[#8a9a8a] text-xs">→</span>
                    ) : (
                      <span key={j} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] border font-mono ${
                        j === 0 ? "text-cyan-700 bg-cyan-50 border-cyan-200" :
                        j === 2 ? "text-blue-700 bg-blue-50 border-blue-200" :
                        "text-red-700 bg-red-50 border-red-200"
                      }`}>{part}</span>
                    )
                  ))}
                </div>
              )}

              {f.before && (
                <div className="space-y-1.5 mb-3">
                  <p className="text-[11px] text-[#8a9a8a] line-through font-mono">{f.before}</p>
                  <div className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-[4px] border font-mono ${f.afterStyle}`}>
                    {f.after}
                  </div>
                </div>
              )}

              {f.visual}

              {f.span !== "full" && (
                <p className="text-[12px] text-[#5a6059] leading-relaxed mt-3">{f.desc}</p>
              )}

              {f.span === "full" && (
                <>
                  <p className="text-[12px] text-[#5a6059] leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#bbcbba]/40">
                    {[
                      { label: "Supplier", val: "Auto"   },
                      { label: "Units",    val: "120"    },
                      { label: "Delivery", val: "Apr 20" },
                      { label: "Est. cost",val: "$78"    },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-1.5 bg-[#eaefeb] rounded-[6px] px-3 py-2 border border-[#bbcbba]/60">
                        <span className="text-[11px] text-[#8a9a8a] font-mono">{row.label}:</span>
                        <span className="text-[11px] font-semibold text-[#5a6059] font-mono">{row.val}</span>
                      </div>
                    ))}
                    <span className="ml-auto text-[11px] font-semibold text-[#006d34] bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-2 rounded-[6px]">
                      Download PO
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── Stat strip ── */}
        <div className="mt-6 rounded-[10px] border border-[#bbcbba]/60 bg-white overflow-hidden card-depth">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#bbcbba]/40">
            {[
              { value: "87%",   label: "Forecast accuracy"          },
              { value: "30s",   label: "Time to first insight"      },
              { value: "$9",    label: "Per month, cancel anytime"  },
              { value: "2 min", label: "Setup — just upload CSV"    },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5">
                <div className="text-[26px] font-bold text-[#181d1b] tracking-tight tabular-nums">{s.value}</div>
                <div className="text-[11px] text-[#5a6059] mt-1 font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
