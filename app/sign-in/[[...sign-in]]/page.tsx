"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#060C0D] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Teal glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#22C55E]/[0.06] blur-[140px] rounded-full pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-lg shadow-[#22C55E]/25">
          <svg className="w-5 h-5 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <span className="text-[16px] font-semibold text-white tracking-tight">
          Forestock<span className="text-[#22C55E]">AI</span>
        </span>
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#22C55E",
              colorBackground: "#0A1415",
              colorText: "#E2F4F4",
              colorTextSecondary: "#7DB8BC",
              colorInputBackground: "#0F1C1E",
              colorInputText: "#E2F4F4",
              colorNeutral: "#7DB8BC",
              borderRadius: "0.75rem",
              fontSize: "15px",
            },
            elements: {
              rootBox: "w-full max-w-sm mx-auto",
              card: "!bg-[#0A1415] !shadow-2xl !shadow-black/70 !border !border-[#22C55E]/15 !rounded-2xl",
              headerTitle: "!text-white !font-semibold !tracking-tight",
              headerSubtitle: "!text-slate-500",
              socialButtonsBlockButton: "!bg-[#0F1C1E] !border !border-[#22C55E]/15 hover:!border-[#22C55E]/30 !text-slate-300 !rounded-xl",
              socialButtonsBlockButtonText: "!text-slate-300",
              dividerLine: "!bg-[#22C55E]/10",
              dividerText: "!text-slate-600",
              formFieldLabel: "!text-slate-400 !text-sm",
              formFieldInput: "!bg-[#0F1C1E] !border !border-[#22C55E]/15 focus:!border-[#22C55E]/40 !text-white !rounded-xl",
              formButtonPrimary: "!bg-[#22C55E] hover:!bg-[#16A34A] !text-[#060C0D] !font-bold !shadow-lg !shadow-[#22C55E]/20 !rounded-xl",
              footerActionLink: "!text-[#22C55E] hover:!text-white",
              footerActionText: "!text-slate-500",
              identityPreviewText: "!text-slate-300",
              identityPreviewEditButton: "!text-[#22C55E]",
              formFieldInputShowPasswordButton: "!text-slate-400",
              otpCodeFieldInput: "!bg-[#0F1C1E] !border-[#22C55E]/20 !text-white",
              alertText: "!text-slate-300",
              formResendCodeLink: "!text-[#22C55E]",
            },
          }}
        />
      </div>
    </div>
  );
}
