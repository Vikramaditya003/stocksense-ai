"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f6faf6] flex">
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #006d34 100%)" }}
      >
        {/* Decorative glow blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full bg-emerald-600/15 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #006d34 0%, #00d26a 100%)" }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <p className="text-[17px] font-bold text-white tracking-tight leading-none">Forestock</p>
              <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest leading-none mt-0.5">Inventory Hub</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-3 tracking-tight">
            Know before<br />you run out.
          </h2>
          <p className="text-emerald-100/60 text-sm leading-relaxed max-w-xs">
            AI-powered stock forecasting for Shopify merchants. Spot stockouts weeks ahead, protect revenue, and reorder with confidence.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "30s", label: "Analysis time" },
            { value: "99%", label: "Forecast accuracy" },
            { value: "Free", label: "To get started" },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-emerald-100/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right sign-in panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #006d34 0%, #00d26a 100%)" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <span className="text-[16px] font-bold text-[#181d1b]">Forestock</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#181d1b] tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-[#5a6059]">Sign in to your inventory dashboard</p>
          </div>

          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#006d34",
                colorBackground: "#ffffff",
                colorText: "#181d1b",
                colorTextSecondary: "#5a6059",
                colorInputBackground: "#f0f5f1",
                colorInputText: "#181d1b",
                colorNeutral: "#5a6059",
                borderRadius: "0.625rem",
                fontSize: "14px",
              },
              elements: {
                rootBox: "w-full",
                card: "!bg-white !shadow-sm !border !border-[#bbcbba]/40 !rounded-2xl",
                headerTitle: "!text-[#181d1b] !font-bold !tracking-tight",
                headerSubtitle: "!text-[#5a6059]",
                socialButtonsBlockButton: "!bg-[#f0f5f1] !border !border-[#bbcbba]/40 hover:!border-[#006d34]/30 hover:!bg-[#eaefeb] !text-[#181d1b] !rounded-xl !transition-all",
                socialButtonsBlockButtonText: "!text-[#181d1b] !font-medium",
                dividerLine: "!bg-[#bbcbba]/40",
                dividerText: "!text-[#8a9a8a]",
                formFieldLabel: "!text-[#5a6059] !text-sm !font-medium",
                formFieldInput: "!bg-[#f0f5f1] !border !border-[#bbcbba]/40 focus:!border-[#006d34]/50 focus:!ring-0 !text-[#181d1b] !rounded-lg",
                formButtonPrimary: "!bg-[#006d34] hover:!bg-[#005a28] !text-white !font-semibold !shadow-sm !rounded-xl !transition-all",
                footerActionLink: "!text-[#006d34] hover:!text-[#005a28] !font-medium",
                footerActionText: "!text-[#5a6059]",
                identityPreviewText: "!text-[#181d1b]",
                identityPreviewEditButton: "!text-[#006d34]",
                formFieldInputShowPasswordButton: "!text-[#8a9a8a]",
                otpCodeFieldInput: "!bg-[#f0f5f1] !border-[#bbcbba]/40 !text-[#181d1b]",
                alertText: "!text-[#5a6059]",
                formResendCodeLink: "!text-[#006d34]",
              },
            }}
          />
        </div>

        <p className="mt-8 text-xs text-[#8a9a8a] text-center">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-[#006d34] hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-[#006d34] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
