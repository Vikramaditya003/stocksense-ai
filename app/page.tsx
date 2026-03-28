import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />

      {/* Footer */}
      <footer className="border-t border-[#2DD4BF]/10 bg-[#07100F] pt-16 pb-10">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">
          {/* Top: logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center shadow-lg shadow-[#2DD4BF]/30">
                  <svg className="w-4 h-4 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-white tracking-tight">
                  StockSense<span className="text-[#2DD4BF]">AI</span>
                </span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed tracking-tight">
                &copy; {new Date().getFullYear()} StockSense AI.<br />All rights reserved.
              </p>
            </div>

            {/* Column 1 */}
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-2.5">
                {["Home", "Features", "Pricing", "How it works"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-slate-500 hover:text-white transition-colors tracking-tight">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-4">Connect</p>
              <ul className="space-y-2.5">
                {["Instagram", "Twitter"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-slate-500 hover:text-white transition-colors tracking-tight">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-4">Legal</p>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-slate-500 hover:text-white transition-colors tracking-tight">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="border-t border-white/[0.05] pt-6">
            <p className="text-[11px] text-slate-600 tracking-tight text-center">
              Forecasts are AI-generated estimates, not financial guarantees.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
