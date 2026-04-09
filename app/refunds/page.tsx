import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Forestock",
  description: "Refund and cancellation terms for Forestock subscription plans.",
};

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      <Navbar />

      <div className="max-w-[720px] mx-auto px-6 pt-28 pb-16">
        <p className="text-xs font-semibold text-[#22C55E] uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-white mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-sm text-slate-500 mb-12">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">1. Overview</h2>
            <p>This Refund &amp; Cancellation Policy outlines how Forestock handles subscription cancellations and refund requests. We want you to have a positive experience and will handle all requests fairly and promptly.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">2. Cancellation</h2>
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">How to Cancel</p>
                <p className="text-slate-400">You may cancel your subscription at any time by emailing us at <strong className="text-slate-300">support@getforestock.com</strong> or from your account settings. Cancellations take effect at the end of the current billing period.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Access After Cancellation</p>
                <p className="text-slate-400">You will continue to have full access to the Service until the end of your paid billing period. After that, your account will revert to the free tier (if available) or be deactivated.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">No Partial Refunds for Cancellation</p>
                <p className="text-slate-400">Cancelling mid-cycle does not entitle you to a prorated refund for the unused portion of the billing period, except as described in Section 3 below.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">3. Refunds</h2>
            <div className="space-y-3">
              <div className="bg-[#22C55E]/[0.05] border border-[#22C55E]/20 rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">7-Day Money-Back Guarantee</p>
                <p className="text-slate-400">If you are not satisfied with Forestock, you may request a full refund within <strong className="text-slate-300">7 days of your initial subscription payment</strong>. This applies to first-time subscribers only.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Eligibility for Refund</p>
                <p className="text-slate-400">Refunds are available if:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>You request within 7 days of the first payment</li>
                  <li>You have not exceeded 5 forecast runs on a paid plan</li>
                  <li>The request is for your first subscription (not renewals)</li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                <p className="font-semibold text-slate-200 mb-1">Non-Refundable Cases</p>
                <p className="text-slate-400">We do not offer refunds for:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>Renewal charges (you will be notified before renewal)</li>
                  <li>Requests made after 7 days of payment</li>
                  <li>Accounts terminated for Terms of Service violations</li>
                  <li>Annual plans beyond the 7-day window</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">4. How to Request a Refund</h2>
            <p>To request a refund, email us at <strong className="text-slate-200">support@getforestock.com</strong> with:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-slate-400">
              <li>Your registered email address</li>
              <li>The date of payment</li>
              <li>Reason for the refund request (optional but helpful)</li>
            </ul>
            <p className="mt-3">We will process eligible refunds within <strong className="text-slate-200">5–7 business days</strong>. Refunds are credited back to the original payment method.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">5. Payment Disputes</h2>
            <p>If you believe you have been charged incorrectly, please contact us at support@getforestock.com before filing a chargeback with your bank. We will resolve legitimate billing issues quickly and amicably.</p>
            <p className="mt-3">Filing a chargeback without contacting us first may result in account suspension while the dispute is investigated.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">6. Contact</h2>
            <p>For refund or cancellation requests, contact us at:</p>
            <div className="mt-3 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-slate-400">
              <p><strong className="text-slate-200">Forestock</strong></p>
              <p className="mt-1">Email: support@getforestock.com</p>
              <p>Response time: within 1 business day</p>
              <p>Website: getforestock.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
