const testimonials = [
  {
    quote: "We were manually tracking reorders in a spreadsheet. Forestock flagged that our best-selling SKU would stock out in 6 days — we had no idea. Saved us from losing at least ₹40,000 that month.",
    name: "Priya M.",
    role: "Founder, wellness brand",
    location: "Pune",
    metric: "₹40k saved",
    metricLabel: "in one month",
    initials: "PM",
    avatarBg: "bg-gray-800",
    avatarText: "text-gray-200",
  },
  {
    quote: "I used to spend 3 hours every Sunday going through stock levels. Now I upload a CSV and get a full reorder plan in under a minute. The revenue-at-risk numbers alone are worth the subscription.",
    name: "Rahul S.",
    role: "Operations, fashion D2C",
    location: "Mumbai",
    metric: "3hrs → 60s",
    metricLabel: "weekly review time",
    initials: "RS",
    avatarBg: "bg-gray-700",
    avatarText: "text-gray-200",
  },
  {
    quote: "Switched from Stocky after they announced shutdown. Forestock is honestly better — the 90-day forecast helped us plan for a sale campaign without overstocking. Hasn't failed us yet.",
    name: "Ananya K.",
    role: "E-commerce manager",
    location: "Bengaluru",
    metric: "0 stockouts",
    metricLabel: "since switching",
    initials: "AK",
    avatarBg: "bg-gray-800",
    avatarText: "text-gray-200",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-16">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">
            Customer results
          </p>
          <h2 className="text-[48px] sm:text-[60px] font-bold leading-[0.93] tracking-[-0.03em] text-gray-900">
            Merchants stopped guessing.
          </h2>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[10px] border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Metric */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-[42px] sm:text-[48px] font-bold leading-none text-gray-900 tabular-nums tracking-tight">
                  {t.metric}
                </p>
                <p className="text-[13px] text-gray-500 mt-1">{t.metricLabel}</p>
              </div>

              {/* Quote */}
              <p className="text-[14px] text-gray-600 leading-[1.75] flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${t.avatarBg} ${t.avatarText}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role} · {t.location}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-[4px]">
                    <svg className="w-2.5 h-2.5 text-[#00D26A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className="border-t border-gray-200 pt-10 grid grid-cols-3 gap-8">
          {[
            { value: "30 sec", label: "CSV to full forecast" },
            { value: "90 days", label: "Max forecast horizon on Pro" },
            { value: "$0", label: "To get started" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[28px] sm:text-[36px] font-bold text-gray-900 tracking-tight tabular-nums">{s.value}</p>
              <p className="text-[12px] text-gray-500 mt-1 font-mono leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
