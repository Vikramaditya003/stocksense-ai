"use client";

// next/dynamic with ssr:false MUST be called inside a Client Component.
// This shell exists solely to satisfy that constraint — ForecastClient
// (which calls Clerk hooks) is never executed on the server.
import dynamic from "next/dynamic";

const ForecastClient = dynamic(() => import("./ForecastClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#060C0D] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#2DD4BF]/30 border-t-[#2DD4BF] animate-spin" />
    </div>
  ),
});

export default function ForecastShell() {
  return <ForecastClient />;
}
