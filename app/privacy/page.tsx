import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — Forestock",
  description: "How Forestock collects, stores, and protects your inventory and personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      <Navbar />

      <div className="max-w-[720px] mx-auto px-6 pt-28 pb-16">
        <p className="text-xs font-semibold text-[#22C55E] uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-2">Effective date: 30 March 2026</p>
        <p className="text-sm text-slate-500 mb-12">Governing law: Information Technology Act, 2000 (India) &amp; Digital Personal Data Protection Act, 2023</p>

        <div className="space-y-10 text-sm leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">1. Who We Are</h2>
            <p>Forestock (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-powered inventory forecasting service for Shopify merchants, accessible at <strong className="text-slate-200">getforestock.com</strong>. This Privacy Policy explains how we collect, process, store, and protect your information when you use our service.</p>
            <p className="mt-3">By accessing Forestock, you agree to the practices described in this policy. If you do not agree, please do not use the service.</p>
            <div className="mt-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-slate-400">
              <p><strong className="text-slate-200">Data Controller:</strong> Forestock</p>
              <p className="mt-1"><strong className="text-slate-200">Contact:</strong> <a href="mailto:support@getforestock.com" className="text-[#22C55E] hover:underline">support@getforestock.com</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">2. Information We Collect</h2>
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Account Information</p>
                <p className="text-slate-400">Name, email address, and authentication credentials collected via Clerk when you sign up or sign in. We do not store passwords — authentication is handled entirely by Clerk.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Inventory &amp; Sales Data (CSV)</p>
                <p className="text-slate-400">CSV files you upload containing product names, SKUs, sales figures, stock levels, and prices. This data is sent to our AI inference layer (Groq) solely to generate your forecast. Groq does not retain or train on this data. The resulting forecast is stored in your account for history and trend tracking.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Forecast History</p>
                <p className="text-slate-400">Health scores, product analyses, reorder recommendations, and AI summaries generated from your uploads, stored in Supabase under your account ID so you can view trends over time.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Payment Information</p>
                <p className="text-slate-400">Payment transactions are processed by <strong className="text-slate-200">Razorpay</strong>. We never receive, store, or handle your card details. We store only: plan type, payment confirmation ID, and timestamp.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Usage &amp; Technical Data</p>
                <p className="text-slate-400">Server logs (IP address, request timestamps, HTTP status codes) retained for up to 30 days for security monitoring and debugging. No third-party analytics SDK is installed.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2.5">
              {[
                "Generate AI-powered inventory forecasts from your uploaded CSV data",
                "Store your forecast history so you can track trends over time",
                "Process and verify subscription payments via Razorpay",
                "Send transactional emails (e.g. stockout alerts) when you opt in",
                "Monitor for fraud, abuse, and security incidents",
                "Improve service reliability and fix technical issues",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0">→</span>
                  <span className="text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 — KEY: what we don't do */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">4. What We Will Never Do</h2>
            <div className="space-y-2">
              {[
                "Sell, rent, or trade your personal or business data to any third party",
                "Use your inventory or sales data to train AI or machine learning models",
                "Share your data with other merchants or expose it through any API",
                "Send marketing emails without your explicit opt-in consent",
                "Store your raw CSV data after the forecast is generated — only the result is kept",
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 bg-red-500/[0.03] border border-red-500/10 rounded-lg px-4 py-2.5">
                  <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✕</span>
                  <span className="text-slate-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">5. Data Storage &amp; Security</h2>
            <p>Your data is stored in <strong className="text-slate-200">Supabase (PostgreSQL)</strong> hosted on AWS infrastructure. Security measures include:</p>
            <ul className="mt-3 space-y-2">
              {[
                "Row Level Security (RLS) — database policies ensure only you can query your data, even if a bug occurred in application code",
                "AES-256 encryption at rest for all stored data",
                "TLS 1.3 encryption in transit for all connections",
                "Regular automated backups with point-in-time recovery",
                "Service role key (admin access) used only server-side, never exposed to the browser",
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">6. AI &amp; Third-Party Processing</h2>
            <p className="mb-4">When you upload a CSV, the data is transmitted over TLS to <strong className="text-slate-200">Groq</strong> (inference API) for analysis. Groq processes it to generate your forecast and <strong className="text-slate-200">does not retain or train on your data</strong>. The raw CSV is not stored by us — only the AI-generated analysis result is saved to your account.</p>
            <div className="space-y-2">
              {[
                { name: "Clerk", purpose: "Authentication and user management", link: "https://clerk.com/privacy" },
                { name: "Supabase", purpose: "Database — forecast history and account data", link: "https://supabase.com/privacy" },
                { name: "Groq (Meta Llama)", purpose: "AI inference — CSV sent for forecast generation, not stored", link: "https://groq.com/privacy-policy" },
                { name: "Vercel", purpose: "Hosting, edge network, and deployment", link: "https://vercel.com/legal/privacy-policy" },
                { name: "Razorpay", purpose: "Payment processing — card details never reach our servers", link: "https://razorpay.com/privacy" },
                { name: "Resend", purpose: "Transactional email delivery (alerts only)", link: "https://resend.com/privacy" },
              ].map(s => (
                <div key={s.name} className="flex items-start justify-between gap-4 bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-200 text-xs">{s.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.purpose}</p>
                  </div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#22C55E] hover:underline flex-shrink-0 mt-0.5">Privacy →</a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">7. Cookies</h2>
            <p>We use only necessary cookies for authentication (Clerk session tokens), payment security (Razorpay), and database sessions (Supabase). We do not use advertising or tracking cookies. See our full <Link href="/cookies" className="text-[#22C55E] hover:underline">Cookie Policy</Link>.</p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">8. Data Retention</h2>
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Forecast History</p>
                <p className="text-slate-400">Retained for as long as your account is active. Deleted within 30 days of account deletion.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Raw CSV Data</p>
                <p className="text-slate-400">Not stored — the CSV is sent to the AI for processing and discarded. Only the generated forecast result is kept.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Server Logs</p>
                <p className="text-slate-400">Security and access logs retained for 30 days for fraud monitoring and debugging, then automatically deleted.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Payment Records</p>
                <p className="text-slate-400">Payment confirmation IDs and subscription status retained for 7 years to comply with Indian financial regulations.</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">9. Your Rights</h2>
            <p className="mb-3">Under the Digital Personal Data Protection Act, 2023 (India) and general data protection principles, you have the right to:</p>
            <ul className="space-y-2">
              {[
                "Access a copy of the personal data we hold about you",
                "Request correction of inaccurate or incomplete data",
                "Request deletion of your account and all associated data (right to erasure)",
                "Withdraw consent for data processing at any time",
                "Know the third parties your data has been shared with",
                "Nominate a representative to exercise these rights on your behalf",
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-slate-400">To exercise any of these rights, email <a href="mailto:support@getforestock.com" className="text-[#22C55E] hover:underline">support@getforestock.com</a>. We will respond within 30 days.</p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">10. Children&apos;s Privacy</h2>
            <p>Forestock is a business tool intended for adults (18+). We do not knowingly collect data from anyone under 18 years of age. If you believe a minor has provided us with personal data, contact us immediately and we will delete it.</p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy as our service evolves or regulations change. When we make material changes, we will notify you by email (if you have an account) and update the effective date at the top of this page. Continued use after changes constitutes acceptance.</p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-base font-semibold text-white mb-3">12. Contact &amp; Grievance Officer</h2>
            <p className="mb-3">For privacy questions, data requests, or complaints:</p>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-slate-400">
              <p><strong className="text-slate-200">Forestock</strong></p>
              <p className="mt-1">Email: <a href="mailto:support@getforestock.com" className="text-[#22C55E] hover:underline">support@getforestock.com</a></p>
              <p>Subject line: <span className="font-mono text-xs text-slate-300">Privacy Request — [Your Name]</span></p>
              <p className="mt-2 text-xs text-slate-500">Response time: within 30 days of receipt</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
