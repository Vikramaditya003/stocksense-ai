"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";

export default function SignInPage() {
  return (
    <div className="bg-emerald-signin min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-emerald-400/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-emerald-600/[0.08] blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 relative z-10">
        <div className="bg-emerald-brand w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
          <LogoMark size={24} />
        </div>
        <div>
          <p className="text-[16px] font-bold text-white tracking-tight leading-none">Forestock</p>
          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest leading-none mt-0.5">Inventory Hub</p>
        </div>
      </Link>

      {/* Clerk card */}
      <div className="relative z-10 w-full flex justify-center">
        <SignIn
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#00d26a",
              colorBackground: "#022c22",
              colorText: "#ecfdf5",
              colorTextSecondary: "#6ee7b7",
              colorInputBackground: "#064e3b",
              colorInputText: "#ecfdf5",
              colorNeutral: "#6ee7b7",
              borderRadius: "0.75rem",
              fontSize: "14px",
            },
            elements: {
              rootBox: "w-full max-w-sm mx-auto",
              card: "!bg-emerald-950/80 !backdrop-blur-xl !shadow-2xl !shadow-black/60 !border !border-emerald-800/40 !rounded-2xl",
              headerTitle: "!text-white !font-bold !tracking-tight",
              headerSubtitle: "!text-emerald-100/70",
              socialButtonsBlockButton: "!bg-emerald-900/60 !border !border-emerald-700/30 hover:!border-emerald-500/40 hover:!bg-emerald-900 !text-emerald-100 !rounded-xl !transition-all",
              socialButtonsBlockButtonText: "!text-emerald-100 !font-medium",
              dividerLine: "!bg-emerald-800/40",
              dividerText: "!text-emerald-400/40",
              formFieldLabel: "!text-emerald-100/90 !text-sm !font-medium",
              formFieldInput: "!bg-emerald-900/60 !border !border-emerald-700/30 focus:!border-emerald-500/50 focus:!ring-0 !text-white !rounded-xl !placeholder-emerald-300/60",
              formButtonPrimary: "!font-bold !shadow-lg !rounded-xl !transition-all !text-emerald-950",
              footerActionLink: "!text-emerald-400 hover:!text-emerald-300 !font-medium",
              footerActionText: "!text-emerald-100/40",
              identityPreviewText: "!text-emerald-100",
              identityPreviewEditButton: "!text-emerald-400",
              formFieldInputShowPasswordButton: "!text-emerald-400/60",
              otpCodeFieldInput: "!bg-emerald-900/60 !border-emerald-700/30 !text-white",
              alertText: "!text-emerald-100/70",
              alertTextDanger: "!text-red-400",
              formResendCodeLink: "!text-emerald-400",
              footer: "!bg-transparent",
            },
          }}
        />
      </div>

      {/* Trust note */}
      <p className="mt-6 text-xs text-emerald-100/30 text-center relative z-10">
        Free to start · No credit card required ·{" "}
        <Link href="/privacy" className="text-emerald-400/60 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
      </p>
    </div>
  );
}
