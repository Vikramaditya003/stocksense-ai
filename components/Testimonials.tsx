import FadeIn from "@/components/FadeIn";

function IconStockAlert() {
  return (
    <svg className="w-6 h-6 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3m0 0v.75M12 13.5h.008v.008H12V13.5z" />
    </svg>
  );
}

function IconCashLocked() {
  return (
    <svg className="w-6 h-6 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function IconMigrate() {
  return (
    <svg className="w-6 h-6 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

const problems = [
  {
    Icon: IconStockAlert,
    title: "Running out mid-season?",
    body: "Most Shopify merchants discover a stockout when orders start failing — not before. Forestock flags your at-risk SKUs weeks early so you can reorder before the damage happens.",
    stat: "3 weeks",
    statLabel: "average early warning",
  },
  {
    Icon: IconCashLocked,
    title: "Cash locked in slow stock?",
    body: "Overstock is just as costly as stockouts. Forestock shows which SKUs have 60+ days of supply sitting idle so you stop reordering what isn't moving and free up working capital.",
    stat: "₹2L+",
    statLabel: "avg. overstock freed",
  },
  {
    Icon: IconMigrate,
    title: "Migrating off Shopify Stocky?",
    body: "Stocky is shutting down August 31, 2026. Forestock works from the same CSV export — upload it and get AI-powered forecasts Stocky never had, in under a minute.",
    stat: "< 60s",
    statLabel: "to first forecast",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#f6faf6] border-t border-[#bbcbba]/40">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <FadeIn className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
        </FadeIn>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <FadeIn key={p.title} delay={(i + 1) as 1 | 2 | 3}>
              <div className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#006d34]/[0.08] border border-[#006d34]/15 flex items-center justify-center mb-4">
                    <p.Icon />
                  </div>
                  <p className="text-[15px] font-semibold text-[#181d1b] mb-2">{p.title}</p>
                  <p className="text-[13px] text-[#5a6059] leading-relaxed">{p.body}</p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#bbcbba]/30">
                  <div className="px-3 py-1.5 rounded-lg bg-[#006d34]/[0.08] border border-[#006d34]/15">
                    <span className="text-[14px] font-bold text-[#006d34] tabular-nums">{p.stat}</span>
                  </div>
                  <span className="text-[11px] text-[#8a9a8a]">{p.statLabel}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn className="mt-10 flex items-center justify-center gap-3">
          <p className="text-[13px] text-[#5a6059]">
            Early access open ·{" "}
            <a href="/forecast" className="text-[#006d34] font-semibold hover:underline">
              Try free — no account needed →
            </a>
          </p>
        </FadeIn>

      </div>
    </section>
  );
}
