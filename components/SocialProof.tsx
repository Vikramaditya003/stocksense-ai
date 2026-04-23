const stats = [
  { value: "12,000+", label: "SKUs forecasted" },
  { value: "500+",    label: "merchants active" },
  { value: "87%",     label: "forecast accuracy" },
  { value: "30s",     label: "to first insight" },
];

export default function SocialProof() {
  return (
    <section className="bg-[#181d1b] border-b border-white/5">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest whitespace-nowrap">
            Trusted by Shopify merchants
          </p>
          <div className="flex items-center gap-0 w-full sm:w-auto">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex-1 sm:flex-none text-center px-6 sm:px-8 ${
                  i < stats.length - 1 ? "border-r border-white/10" : ""
                }`}
              >
                <p className="text-[22px] font-bold text-white tracking-tight tabular-nums">{s.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
