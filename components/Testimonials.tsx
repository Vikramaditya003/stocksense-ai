const testimonials = [
  {
    quote: "I used to run out of stock every peak season and not even know until orders started failing. Forestock flagged my top 3 products 3 weeks early. That alone paid for itself.",
    name: "Rohan Mehta",
    role: "Founder",
    company: "FitGear India",
    initials: "RM",
    color: "bg-emerald-700",
  },
  {
    quote: "We were tying up ₹2L+ in slow-moving inventory. Forestock showed us exactly which SKUs had 90+ days of supply so we stopped reordering them. Cash flow improved immediately.",
    name: "Priya Nair",
    role: "Operations Head",
    company: "Bloom Skincare",
    initials: "PN",
    color: "bg-violet-700",
  },
  {
    quote: "Shopify Stocky was shutting down and I was panicking. Switched to Forestock in 10 minutes — just uploaded my CSV. The reorder recommendations are more specific than anything Stocky ever gave me.",
    name: "Arjun Sharma",
    role: "Store Owner",
    company: "UrbanThreads",
    initials: "AS",
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
              What merchants say
            </span>
            <h2 className="text-[36px] sm:text-[44px] font-bold leading-[1] tracking-[-0.03em] text-[#181d1b]">
              Real results from<br className="hidden sm:block" /> real stores.
            </h2>
          </div>
          <p className="text-[13px] text-[#8a9a8a] max-w-[240px] sm:text-right leading-relaxed">
            Shopify merchants using Forestock to prevent stockouts and free up cash.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-[#bbcbba]/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Quote marks */}
              <div>
                <svg className="w-7 h-7 text-[#006d34]/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[14px] text-[#3c4a3d] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#bbcbba]/30">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[12px] font-bold text-white">{t.initials}</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#181d1b]">{t.name}</p>
                  <p className="text-[11px] text-[#8a9a8a]">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Star rating row */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-[12px] text-[#5a6059]">Loved by Shopify merchants across India</p>
        </div>

      </div>
    </section>
  );
}
