const problems = [
  {
    icon: "📦",
    title: "Running out mid-season?",
    body: "Most Shopify merchants discover a stockout when orders start failing — not before. Forestock flags your at-risk SKUs weeks early so you can reorder before the damage happens.",
    stat: "3 weeks",
    statLabel: "average early warning",
    color: "bg-emerald-700",
  },
  {
    icon: "💸",
    title: "Cash locked in slow stock?",
    body: "Overstock is just as costly as stockouts. Forestock shows which SKUs have 60+ days of supply sitting idle so you stop reordering what isn't moving and free up working capital.",
    stat: "₹2L+",
    statLabel: "avg. overstock freed",
    color: "bg-violet-700",
  },
  {
    icon: "🔄",
    title: "Migrating off Shopify Stocky?",
    body: "Stocky is shutting down August 31, 2026. Forestock works from the same CSV export — upload it and get AI-powered forecasts Stocky never had, in under a minute.",
    stat: "< 60s",
    statLabel: "to first forecast",
    color: "bg-amber-700",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#f0f5f1] border-t border-[#bbcbba]/40">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006d34] uppercase tracking-[0.15em] mb-3">
              <span className="w-1 h-1 rounded-full bg-[#006d34]" />
              Built for real problems
            </span>
            <h2 className="text-[36px] sm:text-[44px] font-bold leading-[1] tracking-[-0.03em] text-[#181d1b]">
              Sound familiar?<br className="hidden sm:block" /> Forestock fixes this.
            </h2>
          </div>
          <p className="text-[13px] text-[#8a9a8a] max-w-[240px] sm:text-right leading-relaxed">
            The three inventory problems that cost Shopify merchants the most — and how Forestock solves them.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <span className="text-2xl mb-4 block">{p.icon}</span>
                <p className="text-[15px] font-semibold text-[#181d1b] mb-2">{p.title}</p>
                <p className="text-[13px] text-[#3c4a3d] leading-relaxed">{p.body}</p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#bbcbba]/30">
                <div className={`px-3 py-1.5 rounded-lg ${p.color}`}>
                  <span className="text-[14px] font-bold text-white tabular-nums">{p.stat}</span>
                </div>
                <span className="text-[11px] text-[#8a9a8a]">{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <p className="text-[13px] text-[#5a6059]">
            Early access open ·{" "}
            <a href="/forecast" className="text-[#006d34] font-semibold hover:underline">
              Try free — no account needed →
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
