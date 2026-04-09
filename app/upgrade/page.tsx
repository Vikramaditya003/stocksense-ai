"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { LogoMark } from "@/components/StocksenseLogo";
import Link from "next/link";

async function startRazorpayCheckout(onSuccess: () => void, onError: () => void) {
  try {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (!data.success) { onError(); return; }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Forestock",
        description: data.planName,
        order_id: data.orderId,
        theme: { color: "#22C55E" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan: "pro" }),
          });
          const vData = await verify.json();
          if (vData.success) onSuccess();
          else onError();
        },
      });
      rzp.open();
    };
    document.body.appendChild(script);
  } catch {
    onError();
  }
}

const FEATURES = [
  "Unlimited products (no 5-SKU cap)",
  "60 & 90-day demand forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase order generation",
  "Priority support",
];

export default function UpgradePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("checkout") === "1") {
      handleUpgrade();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const handleUpgrade = () => {
    setPaying(true);
    setPayError(false);
    startRazorpayCheckout(
      () => { setPaying(false); setPaySuccess(true); setTimeout(() => window.location.href = "/dashboard", 2000); },
      () => { setPaying(false); setPayError(true); }
    );
  };

  return (
    <div className="min-h-screen bg-[#060C0D] flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] max-w-[1000px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-white">Fore</span><span className="text-[#22C55E]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-[860px] grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">

          {/* Left — plan details */}
          <div className="space-y-5">

            {/* Plan header */}
            <div className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Forestock Pro</p>
                  <h1 className="text-[22px] font-semibold text-white tracking-tight">Upgrade to Pro</h1>
                  <p className="text-[13px] text-slate-500 mt-1">Everything you need to never stock out again.</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-slate-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account info (if signed in) */}
            {isLoaded && isSignedIn && user && (
              <div className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-6">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4">Billed to</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[13px] font-semibold text-[#22C55E]">
                    {(user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-200">
                      {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Your account"}
                    </p>
                    <p className="text-[12px] text-slate-600">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-5 px-1">
              {[
                { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "Secured by Razorpay" },
                { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "End-to-end encrypted" },
                { icon: "M6 18L18 6M6 6l12 12", label: "Cancel anytime" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#22C55E]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-[11px] text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — order summary + CTA */}
          <div className="space-y-4">
            <div className="bg-[#0A1415] border border-[#22C55E]/20 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_20px_50px_-12px_rgba(34,197,94,0.08)]">

              {/* Top green accent line */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#22C55E]/60 to-transparent" />

              <div className="p-6">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4">Order summary</p>

                {/* Plan row */}
                <div className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                  <div>
                    <p className="text-[13px] font-medium text-slate-200">Forestock Pro</p>
                    <p className="text-[11px] text-slate-600">Monthly subscription</p>
                  </div>
                  <span className="text-[13px] font-semibold text-white">$9.00</span>
                </div>

                {/* Billing note */}
                <div className="py-3 border-b border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">Billed in INR</span>
                    <span className="text-[12px] text-slate-500">≈ ₹749</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[12px] text-slate-500">Tax</span>
                    <span className="text-[12px] text-slate-500">Included</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 mb-6">
                  <span className="text-[14px] font-bold text-white">Total</span>
                  <div className="text-right">
                    <span className="text-[22px] font-bold text-white tracking-tight">$9</span>
                    <span className="text-[12px] text-slate-500 ml-1">/month</span>
                  </div>
                </div>

                {/* CTA */}
                {paySuccess ? (
                  <div className="flex flex-col items-center gap-2 py-5">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-[#22C55E]">Payment successful!</p>
                    <p className="text-[12px] text-slate-500">Redirecting to dashboard...</p>
                  </div>
                ) : isLoaded && !isSignedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 bg-amber-500/[0.07] border border-amber-500/15 rounded-xl px-3.5 py-3">
                      <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <p className="text-[12px] text-amber-300 leading-relaxed">Sign in to your account to complete this purchase.</p>
                    </div>
                    <SignInButton mode="redirect" fallbackRedirectUrl="/upgrade?checkout=1">
                      <button type="button" className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold py-3 rounded-xl transition-all text-[13px] shadow-lg shadow-[#22C55E]/20">
                        Sign in to upgrade
                      </button>
                    </SignInButton>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={handleUpgrade}
                      disabled={paying}
                      className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold py-3 rounded-xl transition-all text-[13px] shadow-lg shadow-[#22C55E]/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {paying ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Opening payment...
                        </>
                      ) : "Subscribe — $9/mo"}
                    </button>
                    {payError && (
                      <p className="text-[11px] text-red-400 text-center mt-2">Payment failed. Please try again.</p>
                    )}
                  </div>
                )}

                <p className="text-center text-[11px] text-slate-700 mt-3 leading-relaxed">
                  By subscribing you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-slate-500">Terms</Link>{" "}
                  and{" "}
                  <Link href="/refunds" className="underline hover:text-slate-500">Refund Policy</Link>
                </p>
              </div>
            </div>

            {/* Need help */}
            <div className="bg-[#0A1415] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <p className="text-[12px] text-slate-600">
                Questions?{" "}
                <a href="mailto:support@getforestock.com" className="text-slate-400 hover:text-white transition-colors underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
