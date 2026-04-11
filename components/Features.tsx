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
    tagStyle: "text-red-400 bg-red-500/[0.06] border-red-500/15",
    title: "Exact stockout countdown",
    before: '"Medium risk"',
    after: "Stockout in 5 days → lose $220",
    afterStyle: "text-red-400 bg-red-500/[0.05] border-red-500/12",
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
              <span className="text-[11px] text-gray-400 font-mono">{p.name}</span>
              <span className={`text-[11px] font-semibold tabular-nums ${p.days <= 7 ? "text-red-400" : p.days <= 14 ? "text-orange-400" : "text-yellow-400"}`}>
                {p.days}d left
              </span>
            </div>
            <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${p.color} opacity-75 ${p.barClass}`} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Smart reorder",
    tagStyle: "text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/15",
    title: "Reorder with cover duration",
    before: '"Reorder 120 units"',
    after: "Order 120 units → lasts 18 days",
    afterStyle: "text-emerald-400 bg-emerald-500/[0.05] border-emerald-500/12",
    desc: "Factors in supplier lead time, safety stock, and seasonal demand automatically.",
  },
  {
    tag: "Unique to us",
    tagStyle: "text-cyan-400 bg-cyan-500/[0.06] border-cyan-500/15",
    title: "Ad-spend forecasting",
    formula: ["Ad spend +20%", "→", "Demand +35%", "→", "Stockout 3 days sooner"],
    desc: "No competitor offers this. Stop stocking out the week after your biggest Meta push.",
  },
  {
    tag: "Supplier-aware",
    tagStyle: "text-gray-300 bg-white/[0.04] border-white/[0.10]",
    title: "Lead time planning",
    before: "Lead time: 10d. Days left: 8.",
    after: "Already late — order immediately",
    afterStyle: "text-orange-400 bg-orange-500/[0.05] border-orange-500/12",
    desc: "Input your lead time and get concrete warnings before it's too late to reorder.",
    span: "wide",
    visual: (
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 bg-white/[0.03] rounded-[8px] p-3 border border-white/[0.05]">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 font-mono">Lead time</p>
          <p className="text-[22px] font-bold text-[#fafafa] tabular-nums">10<span className="text-sm font-normal text-gray-500"> days</span></p>
        </div>
        <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="flex-1 bg-orange-500/[0.04] rounded-[8px] p-3 border border-orange-500/15">
          <p className="text-[10px] text-orange-400/60 uppercase tracking-widest mb-1 font-mono">Days left</p>
          <p className="text-[22px] font-bold text-orange-400 tabular-nums">8<span className="text-sm font-normal text-orange-500/50"> days</span></p>
        </div>
      </div>
    ),
  },
  {
    tag: "Cash flow",
    tagStyle: "text-amber-400 bg-amber-500/[0.06] border-amber-500/15",
    title: "Overstock detection",
    before: "203 units in stock",
    after: "~$55 tied up → reduce next order",
    afterStyle: "text-amber-400 bg-amber-500/[0.05] border-amber-500/12",
    desc: "Spot dead stock and free up working capital you can redirect to fast-moving SKUs.",
  },
  {
    tag: "One-click",
    tagStyle: "text-gray-400 bg-white/[0.04] border-white/[0.08]",
    title: "Generate purchase orders",
    before: "Copy-paste into email manually",
    after: "Download formatted PO instantly",
    afterStyle: "text-gray-300 bg-white/[0.04] border-white/[0.08]",
    desc: "One click generates a full purchase order for all urgent reorders, ready to send.",
    span: "full",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#0a0f0a] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-end">
          <div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">
              Why teams switch
            </p>
            <h2 className="text-[48px] sm:text-[60px] font-bold leading-[0.93] tracking-[-0.03em] text-[#fafafa]">
              Decisions,<br />
              not dashboards.
            </h2>
          </div>
          <p className="text-[15px] text-gray-500 leading-relaxed lg:text-right lg:mb-2">
            Most tools show data. Forestock tells you what to do,
            why, and by when — with the revenue impact if you don&apos;t.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-[10px] border border-white/[0.06] bg-[#111614] p-5 transition-colors duration-200 hover:border-white/[0.11] relative overflow-hidden ${
                f.span === "wide" ? "sm:col-span-2 lg:col-span-2" : f.span === "full" ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              {/* Tag — top right */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#fafafa] tracking-tight leading-snug max-w-[200px]">{f.title}</h3>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] border tracking-wide flex-shrink-0 ml-2 ${f.tagStyle}`}>
                  {f.tag}
                </span>
              </div>

              {f.formula && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {f.formula.map((part, j) => (
                    part === "→" ? (
                      <span key={j} className="text-gray-600 text-xs">→</span>
                    ) : (
                      <span key={j} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] border font-mono ${
                        j === 0 ? "text-cyan-400 bg-cyan-500/[0.06] border-cyan-500/15" :
                        j === 2 ? "text-blue-400 bg-blue-500/[0.06] border-blue-500/15" :
                        "text-red-400 bg-red-500/[0.06] border-red-500/15"
                      }`}>{part}</span>
                    )
                  ))}
                </div>
              )}

              {f.before && (
                <div className="space-y-1.5 mb-3">
                  <p className="text-[11px] text-gray-600 line-through font-mono">{f.before}</p>
                  <div className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-[4px] border font-mono ${f.afterStyle}`}>
                    {f.after}
                  </div>
                </div>
              )}

              {f.visual}

              {f.span !== "full" && (
                <p className="text-[12px] text-gray-600 leading-relaxed mt-3">{f.desc}</p>
              )}

              {f.span === "full" && (
                <>
                  <p className="text-[12px] text-gray-600 leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.05]">
                    {[
                      { label: "Supplier", val: "Auto"   },
                      { label: "Units",    val: "120"    },
                      { label: "Delivery", val: "Apr 20" },
                      { label: "Est. cost",val: "$78"    },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-1.5 bg-white/[0.02] rounded-[6px] px-3 py-2 border border-white/[0.05]">
                        <span className="text-[11px] text-gray-600 font-mono">{row.label}:</span>
                        <span className="text-[11px] font-semibold text-gray-300 font-mono">{row.val}</span>
                      </div>
                    ))}
                    <span className="ml-auto text-[11px] font-semibold text-[#00D26A] bg-[#00D26A]/[0.07] border border-[#00D26A]/15 px-3 py-2 rounded-[6px]">
                      Download PO
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── Stat strip ── */}
        <div className="mt-6 rounded-[10px] border border-white/[0.05] bg-[#111614] overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.05]">
            {[
              { value: "87%",   label: "Forecast accuracy"          },
              { value: "30s",   label: "Time to first insight"      },
              { value: "$9",    label: "Per month, cancel anytime"  },
              { value: "2 min", label: "Setup — just upload CSV"    },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5">
                <div className="text-[26px] font-bold text-[#fafafa] tracking-tight tabular-nums">{s.value}</div>
                <div className="text-[11px] text-gray-600 mt-1 font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
