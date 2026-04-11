const testimonials = [
  {
    quote: "We were manually tracking reorders in a spreadsheet. Forestock flagged that our best-selling SKU would stock out in 6 days — we had no idea. Saved us from losing at least ₹40,000 that month.",
    name: "Priya M.",
    role: "Founder · wellness brand, Pune",
    metric: "₹40k saved",
    metricLabel: "in one month",
    initials: "PM",
    avatarClass: "bg-[#22C55E]",
  },
  {
    quote: "I used to spend 3 hours every Sunday going through stock levels. Now I upload a CSV and get a full reorder plan in under a minute. The revenue-at-risk numbers alone are worth the subscription.",
    name: "Rahul S.",
    role: "Operations · fashion D2C, Mumbai",
    metric: "3hrs → 60s",
    metricLabel: "weekly review time",
    initials: "RS",
    avatarClass: "bg-[#0D9488]",
  },
  {
    quote: "Switched from Stocky after they announced shutdown. Forestock is honestly better — the 90-day forecast helped us plan for a sale campaign without overstocking. Hasn't failed us yet.",
    name: "Ananya K.",
    role: "E-commerce manager · Bengaluru",
    metric: "0 stockouts",
    metricLabel: "since switching",
    initials: "AK",
    avatarClass: "bg-[#22C55E]",
  },
];

const stats = [
  { value: "30 sec", label: "from CSV upload to full forecast" },
  { value: "90 days", label: "max forecast horizon on Pro" },
  { value: "₹0", label: "to get started, no card needed" },
];

export default function Testimonials() {
  return (
    <section className="py-28 section-alt relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#22C55E]/[0.03] blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both">
          <p className="section-label mb-5">Results</p>
          <h2 className="text-4xl sm:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight mb-4 mt-4">
            Merchants stopped{" "}
            <span className="text-[#22C55E]">guessing</span>
          </h2>
          <p className="text-[16px] text-slate-500 max-w-sm mx-auto leading-relaxed tracking-tight">
            Real feedback from Shopify store owners who switched from spreadsheets and Stocky.
          </p>
        </div>

        {/* Stats strip */}
        <div className="stats-gradient rounded-2xl overflow-hidden border border-[#22C55E]/15 mb-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both">
          <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
            {stats.map((s) => (
              <div key={s.label} className="p-6 sm:p-8 text-center">
                <p className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight tabular-nums mb-1">{s.value}</p>
                <p className="text-[12px] sm:text-[13px] text-slate-500 tracking-tight leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[#22C55E]/10 bg-[#0A1415] p-6 flex flex-col gap-4 hover:border-[#22C55E]/20 hover:shadow-lg hover:shadow-[#22C55E]/[0.05] transition-all duration-200 relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-300 fill-mode-both group"
            >
              {/* Top highlight on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/0 to-transparent group-hover:via-[#22C55E]/30 transition-all duration-300" />

              <span className="absolute top-4 right-5 text-[64px] leading-none font-bold text-[#22C55E]/[0.06] select-none pointer-events-none">&ldquo;</span>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[0,1,2,3,4].map((j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[14px] text-slate-400 leading-relaxed tracking-tight flex-1 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Metric callout */}
              <div className="flex items-center gap-2.5 bg-[#22C55E]/[0.04] border border-[#22C55E]/12 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-[15px] font-bold text-white tracking-tight tabular-nums leading-none">{t.metric}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{t.metricLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-white/[0.04]">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-[#060C0D] flex-shrink-0 ${t.avatarClass}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white tracking-tight">{t.name}</p>
                  <p className="text-[11px] text-slate-600 tracking-tight">{t.role}</p>
                </div>
                {/* Verified badge */}
                <div className="ml-auto flex-shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded-full">
                    <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
