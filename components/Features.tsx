import { type ReactNode } from "react";

const features: {
  icon: ReactNode;
  tag: string; tagStyle: string;
  iconStyle: string;
  title: string;
  before?: string; after?: string; afterStyle?: string;
  formula?: string[];
  desc: string;
  span?: "wide" | "full";
  visual?: ReactNode;
}[] = [
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tag: "Non-negotiable",
    tagStyle: "text-red-400 bg-red-500/[0.08] border-red-500/20",
    iconStyle: "text-red-400 bg-red-500/[0.07] border-red-500/15",
    title: "Exact stockout countdown",
    before: '"Medium risk"',
    after: "Stockout in 5 days → lose ₹12,000",
    afterStyle: "text-red-400 bg-red-500/[0.06] border-red-500/15",
    desc: "Every product shows a precise countdown and revenue impact — not a vague risk label.",
    span: "wide",
    visual: (
      <div className="mt-4 space-y-2">
        {[
          { name: "Yoga Mat Pro",     days: 5,  barClass: "bar-7",  color: "bg-red-500"    },
          { name: "Water Bottle XL",  days: 11, barClass: "bar-16", color: "bg-orange-500" },
          { name: "Resistance Bands", days: 29, barClass: "bar-43", color: "bg-yellow-500" },
        ].map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-400">{p.name}</span>
              <span className={`text-[11px] font-semibold ${p.days <= 7 ? "text-red-400" : p.days <= 14 ? "text-orange-400" : "text-yellow-400"}`}>
                {p.days}d left
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${p.color} opacity-80 ${p.barClass}`} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" />
      </svg>
    ),
    tag: "Smart reorder",
    tagStyle: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20",
    iconStyle: "text-emerald-400 bg-emerald-500/[0.07] border-emerald-500/15",
    title: "Reorder with duration",
    before: '"Reorder 120 units"',
    after: "Order 120 units → lasts 18 days",
    afterStyle: "text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/15",
    desc: "Factors in supplier lead time, safety stock, and seasonal demand automatically.",
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542" />
      </svg>
    ),
    tag: "Unique to us",
    tagStyle: "text-cyan-400 bg-cyan-500/[0.08] border-cyan-500/20",
    iconStyle: "text-cyan-400 bg-cyan-500/[0.07] border-cyan-500/15",
    title: "Ad-spend forecasting",
    formula: ["Ad spend +20%", "→", "Demand +35%", "→", "Stockout 3 days sooner"],
    desc: "No competitor offers this. Stop stocking out the week after your biggest Meta push.",
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
      </svg>
    ),
    tag: "Supplier-aware",
    tagStyle: "text-[#22C55E] bg-[#22C55E]/[0.08] border-[#22C55E]/20",
    iconStyle: "text-[#22C55E] bg-[#22C55E]/[0.07] border-[#22C55E]/15",
    title: "Lead time planning",
    before: "Lead time: 10d. Days left: 8.",
    after: "⚠ Already late — order immediately",
    afterStyle: "text-orange-400 bg-orange-500/[0.06] border-orange-500/15",
    desc: "Input your lead time and get concrete warnings before it's too late to reorder.",
    span: "wide",
    visual: (
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Lead time</p>
          <p className="text-[22px] font-bold text-white tabular-nums">10<span className="text-sm font-normal text-slate-500"> days</span></p>
        </div>
        <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="flex-1 bg-orange-500/[0.06] rounded-xl p-3 border border-orange-500/20">
          <p className="text-[10px] text-orange-400/70 uppercase tracking-widest mb-1">Days left</p>
          <p className="text-[22px] font-bold text-orange-400 tabular-nums">8<span className="text-sm font-normal text-orange-500/60"> days</span></p>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tag: "Cash flow",
    tagStyle: "text-amber-400 bg-amber-500/[0.08] border-amber-500/20",
    iconStyle: "text-amber-400 bg-amber-500/[0.07] border-amber-500/15",
    title: "Overstock detection",
    before: "203 units in stock",
    after: "~₹4,200 tied up → reduce next order",
    afterStyle: "text-amber-400 bg-amber-500/[0.06] border-amber-500/15",
    desc: "Spot dead stock and free up working capital you can redirect to fast-moving SKUs.",
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    tag: "One-click",
    tagStyle: "text-slate-400 bg-white/[0.05] border-white/10",
    iconStyle: "text-slate-400 bg-white/[0.05] border-white/10",
    title: "Generate purchase orders",
    before: "Copy-paste into email manually",
    after: "Download formatted PO instantly",
    afterStyle: "text-slate-300 bg-white/[0.05] border-white/10",
    desc: "One click generates a full purchase order for all urgent reorders, ready to send.",
    span: "full",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#060C0D] relative overflow-hidden">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both">
          <p className="section-label mb-5">Why teams switch</p>
          <h2 className="text-4xl sm:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight mb-4 mt-4">
            Decisions, not{" "}
            <span className="text-slate-500">dashboards</span>
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed tracking-tight">
            Most tools show data. Forestock tells you what to do, why, and by when — with the revenue impact if you don&apos;t.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group rounded-2xl border border-white/[0.06] bg-[#0A1415] p-5 transition-all duration-200 hover:border-[#22C55E]/30 hover:bg-[#0D1B1E] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#22C55E]/[0.08] animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both relative overflow-hidden ${
                f.span === "wide" ? "sm:col-span-2 lg:col-span-2" : f.span === "full" ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              {/* Subtle top highlight on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/0 to-transparent group-hover:via-[#22C55E]/40 transition-all duration-300" />

              <div className={`flex items-start justify-between mb-4 ${f.span === "full" ? "sm:flex-row" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${f.iconStyle}`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-white tracking-tight">{f.title}</h3>
                    {f.span === "full" && (
                      <p className="text-[12px] text-slate-500 leading-relaxed tracking-tight mt-1">{f.desc}</p>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border tracking-wide flex-shrink-0 ${f.tagStyle}`}>
                  {f.tag}
                </span>
              </div>

              {f.formula && (
                <div className="flex flex-wrap items-center gap-1 mb-3">
                  {f.formula.map((part, j) => (
                    part === "→" ? (
                      <span key={j} className="text-zinc-400 text-xs">→</span>
                    ) : (
                      <span key={j} className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md border ${
                        j === 0 ? "text-cyan-400 bg-cyan-500/[0.08] border-cyan-500/20" :
                        j === 2 ? "text-blue-400 bg-blue-500/[0.08] border-blue-500/20" :
                        "text-red-400 bg-red-500/[0.08] border-red-500/20"
                      }`}>{part}</span>
                    )
                  ))}
                </div>
              )}

              {f.before && (
                <div className="space-y-1.5 mb-3">
                  <p className="text-[11px] text-slate-600 line-through">{f.before}</p>
                  <div className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-md border ${f.afterStyle}`}>
                    {f.after}
                  </div>
                </div>
              )}

              {f.visual && f.visual}

              {f.span !== "full" && (
                <p className="text-[12px] text-slate-500 leading-relaxed tracking-tight mt-3">{f.desc}</p>
              )}

              {f.span === "full" && (
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/[0.05]">
                  {[
                    { label: "Supplier name", val: "Auto" },
                    { label: "Units to order", val: "120" },
                    { label: "Delivery date", val: "Apr 20" },
                    { label: "Est. cost", val: "₹6,000" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
                      <span className="text-[11px] text-slate-600">{row.label}:</span>
                      <span className="text-[11px] font-semibold text-slate-300">{row.val}</span>
                    </div>
                  ))}
                  <span className="ml-auto text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/[0.08] border border-[#22C55E]/20 px-3 py-2 rounded-lg">
                    ↓ Download PO
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="rounded-2xl border border-[#22C55E]/10 bg-[#0A1415] overflow-hidden animate-in fade-in-0 duration-300 fill-mode-both">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.05]">
            {[
              { value: "87%", label: "Forecast accuracy" },
              { value: "30s", label: "Time to first insight" },
              { value: "$9", label: "Per month, cancel anytime" },
              { value: "2 min", label: "Setup — just upload CSV" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5 text-center">
                <div className="text-[28px] font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-[12px] text-slate-500 mt-1 tracking-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
