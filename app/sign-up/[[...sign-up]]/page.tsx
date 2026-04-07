"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#060C0D] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Teal glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#22C55E]/[0.06] blur-[140px] rounded-full pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
        <LogoMark size={36} />
        <span className="text-[16px] font-semibold tracking-tight">
          <span className="text-white">Fore</span><span className="text-[#22C55E]">stock</span>
        </span>
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <SignUp
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
