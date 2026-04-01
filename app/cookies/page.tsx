import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — StockSense AI",
  description: "How StockSense AI uses cookies and how you can control them.",
};

const COOKIES = [
  {
    name: "__client_uat, __session",
    provider: "Clerk",
    purpose: "Authentication — keeps you signed in and secures your session",
    duration: "Session / 1 year",
    type: "Necessary",
  },
  {
    name: "sb-*",
    provider: "Supabase",
    purpose: "Secure database session token — links your account to forecast history",
    duration: "Session",
    type: "Necessary",
  },
  {
    name: "__stripe_mid, __stripe_sid",
    provider: "Razorpay / Stripe",
    purpose: "Fraud prevention and payment processing security",
    duration: "Session / 1 year",
    type: "Necessary",
  },
  {
    name: "_vercel_*",
    provider: "Vercel",
    purpose: "Edge network routing and performance",
    duration: "Session",
    type: "Necessary",
  },
  {
    name: "theme",
    provider: "StockSense AI",
    purpose: "Remembers your display preferences",
    duration: "1 year",
    type: "Preference",
  },
];

const BADGE: Record<string, string> = {
  "Necessary": "text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20",
  "Preference": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Analytics": "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      {/* Nav */}
      <nav className="border-b border-[#2DD4BF]/10 px-6 h-16 flex items-center justify-between max-w-[960px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14M9 20V8M14 20V11M19 20V4" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white">StockSense<span className="text-[#2DD4BF]">AI</span></span>
        </Link>
        <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">← Back to home</Link>
      </nav>

      <div className="max-w-[720px] mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-sm text-slate-500 mb-12">
          Effective date: 30 March 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They allow the site to remember information between page loads — such as keeping you signed in or storing your display preferences.</p>
            <p className="mt-3">StockSense AI uses cookies only where necessary to operate the service securely and reliably. We do not use advertising or marketing cookies.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">2. Cookie Categories We Use</h2>
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20">Necessary</span>
                </div>
                <p className="text-slate-400">Required for core functionality — authentication, session security, and payment processing. The service cannot function without these. They cannot be disabled.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">Preference</span>
                </div>
                <p className="text-slate-400">Remembers your display settings (such as theme) across visits so you don't have to reconfigure on every login.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border text-slate-400 bg-slate-500/10 border-slate-500/20">Marketing</span>
                </div>
                <p className="text-slate-400">StockSense AI does <strong className="text-white">not</strong> use marketing or advertising cookies. We do not track you across other websites or build advertising profiles.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">3. Cookies in Detail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-[#475569] uppercase tracking-wider text-left">
                    <th className="pb-3 pr-4 font-semibold">Cookie Name</th>
                    <th className="pb-3 pr-4 font-semibold">Provider</th>
                    <th className="pb-3 pr-4 font-semibold">Purpose</th>
                    <th className="pb-3 pr-4 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} className="bg-white/[0.02] border border-white/[0.04]">
                      <td className="px-3 py-2.5 rounded-l-lg font-mono text-[#2DD4BF]">{c.name}</td>
                      <td className="px-3 py-2.5 text-slate-300">{c.provider}</td>
                      <td className="px-3 py-2.5 text-slate-400 max-w-[200px]">{c.purpose}</td>
                      <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{c.duration}</td>
                      <td className="px-3 py-2.5 rounded-r-lg">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE[c.type] ?? "text-slate-400 border-slate-500/20 bg-slate-500/10"}`}>
                          {c.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">4. How to Control Cookies</h2>
            <p className="mb-3">Your cookie preferences are managed at the browser level. All major browsers allow you to view, block, or delete cookies:</p>
            <div className="space-y-2">
              {[
                { browser: "Chrome", path: "Settings → Privacy and security → Cookies and other site data" },
                { browser: "Firefox", path: "Settings → Privacy & Security → Cookies and Site Data" },
                { browser: "Safari", path: "Preferences → Privacy → Manage Website Data" },
                { browser: "Edge", path: "Settings → Cookies and site permissions → Cookies and site data" },
              ].map(b => (
                <div key={b.browser} className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-2.5">
                  <p className="font-semibold text-slate-300 w-14 flex-shrink-0">{b.browser}</p>
                  <p className="text-slate-500">{b.path}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-slate-500">Note: blocking necessary cookies (especially authentication cookies) will prevent you from signing in to StockSense AI.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">5. Third-Party Cookie Policies</h2>
            <p className="mb-3">Some cookies are set by our service providers. Their policies govern those cookies:</p>
            <div className="space-y-2">
              {[
                { name: "Clerk", url: "https://clerk.com/privacy" },
                { name: "Supabase", url: "https://supabase.com/privacy" },
                { name: "Razorpay", url: "https://razorpay.com/privacy" },
                { name: "Vercel", url: "https://vercel.com/legal/privacy-policy" },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-2.5">
                  <span className="text-slate-300 text-xs font-semibold">{s.name}</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#2DD4BF] hover:underline">Privacy Policy →</a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">6. Updates to This Policy</h2>
            <p>We may update this Cookie Policy as our service evolves or regulations change. When we do, we will update the effective date at the top of this page. Continued use of StockSense AI after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">7. Contact</h2>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-slate-400">
              <p><strong className="text-slate-200">StockSense AI</strong></p>
              <p className="mt-1">Email: <a href="mailto:support@stocksenseai.com" className="text-[#2DD4BF] hover:underline">support@stocksenseai.com</a></p>
              <p>Website: stocksenseai.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
