"use client";
import dynamic from "next/dynamic";

// ── Shimmer primitive ─────────────────────────────────────────────────────────
const S = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />
);

// ── Skeleton that mirrors the real dashboard layout exactly ───────────────────
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#060C0D] flex">

      {/* Sidebar ghost — matches AppSidebar collapsed=false width */}
      <div className="flex-shrink-0 w-[210px] bg-[#07100F] border-r border-[#22C55E]/[0.08] h-screen sticky top-0 flex flex-col p-4 gap-3 overflow-hidden">
        <S className="h-9 w-36 mb-2" />
        <S className="h-8 w-full rounded-xl" />
        <div className="mt-1 space-y-1.5">
          {[...Array(5)].map((_, i) => <S key={i} className="h-9 w-full rounded-xl" />)}
        </div>
        <div className="mt-auto space-y-2">
          <S className="h-3 w-24 rounded" />
          <S className="h-8 w-full rounded-xl" />
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header — h-12 matches the real sticky header */}
        <div className="h-12 border-b border-[#22C55E]/[0.08] flex items-center px-4 gap-4 flex-shrink-0">
          <S className="h-4 w-44" />
          <div className="ml-auto flex items-center gap-2">
            <S className="h-7 w-28 hidden sm:block rounded-lg" />
            <S className="h-7 w-28 rounded-lg" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 space-y-3 overflow-auto">

          {/* 4 KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-3.5">
                <div className="flex items-start justify-between mb-3">
                  <S className="h-2.5 w-24" />
                  <S className="h-7 w-7 rounded-lg" />
                </div>
                <S className="h-7 w-20 mb-2" />
                <div className="flex items-end justify-between">
                  <S className="h-2.5 w-28" />
                  <S className="h-8 w-10 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Two-column main area */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-3">

            {/* Left: action table */}
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <div className="space-y-1.5">
                  <S className="h-4 w-52" />
                  <S className="h-3 w-72" />
                </div>
              </div>
              {/* Table header */}
              <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.04]">
                {[60, 48, 32, 28, 40].map((w, i) => (
                  <S key={i} className={`h-2.5 w-${w === 60 ? "full" : `[${w}px]`}`} />
                ))}
              </div>
              {/* Table rows */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.03]">
                  <S className="h-3.5 w-3.5 rounded flex-shrink-0" />
                  <S className="h-3.5 flex-1" />
                  <S className="h-3.5 w-16 hidden sm:block" />
                  <S className="h-3.5 w-14 hidden md:block" />
                  <S className="h-5 w-20 rounded-lg" />
                </div>
              ))}
            </div>

            {/* Right: panel column */}
            <div className="flex flex-col gap-3">

              {/* Protection score card */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <S className="h-2.5 w-28" />
                  <S className="h-5 w-20 rounded-full" />
                </div>
                {/* Donut ring ghost */}
                <div className="flex items-center justify-center mb-3">
                  <div className="w-24 h-24 rounded-full border-[9px] border-white/[0.06] animate-pulse" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <S className="h-2.5 w-20" />
                      <S className="h-2.5 w-10" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent analyses ghost */}
              <div className="card p-4">
                <S className="h-2.5 w-32 mb-3" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <S className="h-2 w-2 rounded-full flex-shrink-0" />
                      <S className="h-3 flex-1" />
                      <S className="h-3 w-6" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upsell card ghost */}
              <div className="rounded-xl border border-[#22C55E]/[0.12] bg-[#22C55E]/[0.02] p-4">
                <S className="h-2.5 w-24 mb-2" />
                <S className="h-4 w-36 mb-1.5" />
                <S className="h-2.5 w-full mb-3" />
                <S className="h-8 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export default function DashboardShell() {
  return <DashboardClient />;
}
