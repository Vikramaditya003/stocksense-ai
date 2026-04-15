"use client";

// next/dynamic with ssr:false MUST be called inside a Client Component.
// This shell exists solely to satisfy that constraint — ForecastClient
// (which calls Clerk hooks) is never executed on the server.
import dynamic from "next/dynamic";

const ForecastClient = dynamic(() => import("./ForecastClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f6faf6] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#006d34]/30 border-t-[#006d34] animate-spin" />
    </div>
  ),
});

export default function ForecastShell() {
  return <ForecastClient />;
}
