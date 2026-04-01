import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — StockSense AI",
  description: "Terms and conditions for using StockSense AI inventory forecasting service.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-12">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using StockSense AI (&quot;Service&quot;) at stocksenseai.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            <p className="mt-3">These Terms apply to all users, including Shopify merchants, businesses, and individuals who access the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">2. Description of Service</h2>
            <p>StockSense AI is an AI-powered inventory forecasting tool that helps Shopify merchants predict stockouts, analyse sales trends, and optimise reorder decisions. The Service is provided on a subscription basis.</p>
            <p className="mt-3">Features include CSV-based data upload, AI-generated forecasts, health scores, reorder recommendations, and forecast history. Feature availability depends on your subscription plan.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">3. Eligibility</h2>
            <p>You must be at least 18 years old and capable of entering into a binding contract to use this Service. By using StockSense AI, you represent that you meet these requirements.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@stocksenseai.com if you suspect unauthorised access.</p>
            <p className="mt-3">You agree not to share your account with others or create accounts on behalf of third parties without authorisation.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">5. Subscription & Payments</h2>
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Billing</p>
                <p className="text-slate-400">Subscriptions are billed in advance on a monthly or annual basis. Payments are processed securely via Razorpay. We do not store your card details.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Auto-Renewal</p>
                <p className="text-slate-400">Subscriptions auto-renew at the end of each billing period. You may cancel anytime from your account settings to prevent future charges.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Price Changes</p>
                <p className="text-slate-400">We may change subscription prices with 30 days&apos; notice. Continued use after the effective date constitutes acceptance of the new price.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">6. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Upload malicious files, scripts, or data intended to harm the Service or other users</li>
              <li>Attempt to gain unauthorised access to other users&apos; data</li>
              <li>Resell, sublicense, or commercially exploit the Service without our written permission</li>
              <li>Use automated tools to scrape or extract data from the Service at scale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">7. Intellectual Property</h2>
            <p>StockSense AI, including its software, design, AI models, and content, is owned by us and protected by applicable intellectual property laws. You retain ownership of any data you upload.</p>
            <p className="mt-3">By uploading data, you grant us a limited licence to process it solely for the purpose of providing the Service to you.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">8. AI-Generated Forecasts — Disclaimer</h2>
            <div className="bg-[#2DD4BF]/[0.05] border border-[#2DD4BF]/20 rounded-xl p-4">
              <p className="text-slate-300">Forecasts generated by StockSense AI are <strong className="text-white">estimates based on historical data</strong> and AI analysis. They are not guaranteed predictions of future inventory needs or sales performance.</p>
              <p className="mt-2 text-slate-400">Purchasing and stocking decisions remain entirely your responsibility. We are not liable for financial losses resulting from reliance on AI-generated forecasts.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, StockSense AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Service.</p>
            <p className="mt-3">Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or non-payment, with or without notice.</p>
            <p className="mt-3">You may terminate your account at any time by contacting us. Upon termination, your access to the Service will cease and your data will be deleted within 30 days per our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">11. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Material changes will be notified via email or an in-app notice at least 14 days before taking effect. Continued use of the Service constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">13. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <div className="mt-3 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-slate-400">
              <p><strong className="text-slate-200">StockSense AI</strong></p>
              <p className="mt-1">Email: support@stocksenseai.com</p>
              <p>Website: stocksenseai.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
