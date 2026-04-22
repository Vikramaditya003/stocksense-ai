"use client";

import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const status = params.get("status");
  const failed = status && status !== "succeeded";

  return (
    <div className="min-h-screen bg-[#f6faf6] flex flex-col">
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#bbcbba]/30 max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[480px] text-center">
          {failed ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">Payment not completed</h1>
              <p className="text-[15px] text-[#5a6059] mb-8">
                Your payment was not processed. No charge was made. Please try again or contact{" "}
                <a href="mailto:support@getforestock.com" className="text-[#006d34] underline">support@getforestock.com</a>.
              </p>
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 bg-emerald-brand hover:opacity-90 text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#006d34]/20"
              >
                Try again
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">Payment received!</h1>
              <p className="text-[15px] text-[#5a6059] mb-2">
                Your Forestock Pro plan is activating. This takes a few seconds.
              </p>
              <p className="text-[13px] text-[#8a9a8a] mb-8">
                A confirmation email is on its way. If you don&apos;t see it, check your spam folder.
              </p>
              <Link
                href="/forecast"
                className="inline-flex items-center gap-2 bg-emerald-brand hover:opacity-90 text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#006d34]/20"
              >
                Go to forecast
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
