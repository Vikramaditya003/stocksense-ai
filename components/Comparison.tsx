const rows = [
  {
    them: '"Medium risk"',
    us:   "Stockout in 5 days → lose $220",
  },
  {
    them: '"Reorder 120 units"',
    us:   "Order 120 units → covers 18 days of demand",
  },
  {
    them: "No supplier awareness",
    us:   "Lead time 10d, days left 8 — already late",
  },
  {
    them: "Shows you a chart",
    us:   "Tells you exactly what to order and when",
  },
  {
    them: "Requires Shopify app install",
    us:   "Upload a CSV — no install, results in 30s",
  },
];

export default function Comparison() {
  return (
    <section className="py-28 bg-[#f0f5f1]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-medium text-[#6c7b6c] uppercase tracking-[0.18em] mb-4">
            Decisions, not dashboards
          </p>
          <h2 className="text-[48px] sm:text-[56px] font-bold leading-[0.93] tracking-[-0.03em] text-[#181d1b]">
            What other tools show<br />
            vs. what you actually need.
          </h2>
        </div>

        {/* Table */}
        <div className="rounded-[10px] border border-[#bbcbba]/60 overflow-hidden ambient-shadow">
          {/* Column headers */}
          <div className="grid grid-cols-2 border-b border-[#dfe4e0]">
            <div className="px-6 py-4 bg-[#eaefeb] border-r border-[#dfe4e0]">
              <p className="text-[11px] font-bold text-[#6c7b6c] uppercase tracking-widest">Other tools</p>
            </div>
            <div className="px-6 py-4 bg-white">
              <p className="text-[11px] font-bold text-[#006d34] uppercase tracking-widest">Forestock</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${i < rows.length - 1 ? "border-b border-[#dfe4e0]" : ""}`}
            >
              <div className="px-6 py-4 bg-[#f6faf6] border-r border-[#dfe4e0] flex items-center gap-3">
                <svg className="w-3.5 h-3.5 text-[#bbcbba] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-[14px] text-[#6c7b6c] font-mono">{row.them}</span>
              </div>
              <div className="px-6 py-4 bg-white flex items-center gap-3">
                <svg className="w-3.5 h-3.5 text-[#006d34] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[14px] text-[#181d1b] font-medium">{row.us}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
