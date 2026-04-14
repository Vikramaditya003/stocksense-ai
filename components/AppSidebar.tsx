"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { LogoMark } from "@/components/StocksenseLogo";

interface AppSidebarProps {
  alertCount?: number;
}

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "New Forecast",
    href: "/forecast",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    highlight: true,
  },
  {
    label: "Products",
    href: "/dashboard?tab=products",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Alerts",
    href: "/dashboard?tab=alerts",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    alertBadge: true,
  },
  {
    label: "History",
    href: "/history",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const BOTTOM_NAV = [
  {
    label: "Blog",
    href: "/blog",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
  },
  {
    label: "Give Feedback",
    href: "mailto:support@getforestock.com?subject=Forestock Feedback&body=Hi, here's my feedback on Forestock:%0A%0AWhat I like:%0A%0AWhat could be better:%0A%0AFeature request:",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    label: "Help",
    href: "mailto:support@getforestock.com",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function AppSidebar({ alertCount = 0 }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  function isActive(href: string) {
    const [base, query] = href.split("?");
    if (pathname !== base) return false;
    if (!query) return !searchParams.get("tab");
    const p = new URLSearchParams(query);
    return searchParams.get("tab") === p.get("tab");
  }

  return (
    <aside
      className={`hidden md:flex flex-shrink-0 ${collapsed ? "w-[60px]" : "w-[220px]"} transition-all duration-200 bg-emerald-950 flex-col h-screen sticky top-0 z-30 overflow-hidden`}
    >
      {/* ── Logo ── */}
      <div className={`h-14 flex items-center gap-3 px-4 flex-shrink-0 ${collapsed ? "justify-center" : ""}`}>
        <Link href="/" className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #006d34 0%, #00d26a 100%)" }}
          >
            <LogoMark size={20} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[15px] font-bold tracking-tight text-white leading-none">Forestock</p>
              <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest leading-none mt-0.5">Inventory Hub</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-900/40 rounded-lg transition-all"
            aria-label="Collapse sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-9 h-9 flex items-center justify-center text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-900/40 rounded-lg transition-all"
            aria-label="Expand sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Search ── */}
      {!collapsed && (
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-800/30 rounded-xl px-3 py-2 group focus-within:border-emerald-600/40 focus-within:bg-emerald-900/60 transition-all">
            <svg className="w-3.5 h-3.5 text-emerald-400/40 group-focus-within:text-emerald-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  router.push(`/dashboard?tab=products&q=${encodeURIComponent(search.trim())}`);
                  setSearch("");
                }
                if (e.key === "Escape") { setSearch(""); searchRef.current?.blur(); }
              }}
              placeholder="Search products…"
              aria-label="Search products"
              className="bg-transparent text-[12px] text-white placeholder:text-emerald-400/40 outline-none w-full"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="text-emerald-400/40 hover:text-emerald-400 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      )}
      {collapsed && (
        <button
          type="button"
          onClick={() => { setCollapsed(false); setTimeout(() => searchRef.current?.focus(), 150); }}
          className="mx-auto mb-2 w-9 h-9 flex items-center justify-center text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-900/40 rounded-xl transition-all flex-shrink-0"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </button>
      )}

      {/* ── Main Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          const alerts = item.alertBadge ? alertCount : 0;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-[13px] transition-all ${
                  active
                    ? "text-white bg-emerald-700/60"
                    : "text-emerald-300 hover:text-white hover:bg-emerald-900/50"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative ${
                active
                  ? "text-emerald-400 font-semibold bg-emerald-900/50"
                  : "text-emerald-100/70 hover:text-white hover:bg-emerald-900/30"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {alerts > 0 && (
                    <span className="flex-shrink-0 ml-auto text-[10px] font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {alerts > 9 ? "9+" : alerts}
                    </span>
                  )}
                </>
              )}
              {collapsed && alerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}

        {/* Support section */}
        <div className="pt-3 mt-2 border-t border-emerald-900/60 space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest px-3 pb-1">Support</p>
          )}
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-emerald-100/50 hover:text-white hover:bg-emerald-900/30 transition-all"
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Upgrade CTA ── */}
      {!collapsed && (
        <div className="px-3 pb-3 flex-shrink-0">
          <Link
            href="/upgrade"
            className="w-full flex items-center justify-center gap-2 text-white font-semibold text-[13px] py-3 rounded-xl shadow-lg hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #006d34 0%, #00d26a 100%)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* ── User profile ── */}
      <div className={`flex-shrink-0 border-t border-emerald-900/60 p-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <UserButton
          appearance={{
            variables: {
              colorBackground: "#022c22",
              colorInputBackground: "#064e3b",
              colorText: "#ecfdf5",
              colorTextSecondary: "#6ee7b7",
              colorPrimary: "#00d26a",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            },
            elements: {
              avatarBox: "w-8 h-8 !ring-1 !ring-emerald-400/20",
              userButtonPopoverCard: "!bg-emerald-950 !border !border-emerald-800/40 !shadow-2xl !shadow-black/80 !rounded-xl",
              userButtonPopoverMain: "!bg-emerald-950",
              userButtonPopoverHeader: "!bg-emerald-950 !border-b !border-emerald-900/60",
              userButtonPopoverActions: "!bg-emerald-950",
              userButtonPopoverActionButton: "!text-emerald-100 hover:!bg-emerald-900/40 !rounded-lg",
              userButtonPopoverActionButtonText: "!text-emerald-100 !font-medium",
              userButtonPopoverActionButtonIcon: "!text-emerald-400/60",
              userButtonPopoverFooter: "!hidden",
              userPreviewMainIdentifier: "!text-white !font-semibold",
              userPreviewSecondaryIdentifier: "!text-emerald-400/60",
              modalContent: "!bg-emerald-950 !border !border-emerald-800/40 !shadow-2xl !shadow-black/80 !rounded-2xl",
              modalCloseButton: "!text-emerald-400/60 hover:!text-white hover:!bg-emerald-900/40 !rounded-lg",
              navbar: "!bg-emerald-950 !border-r !border-emerald-900/60",
              navbarButton: "!text-emerald-100/70 hover:!text-white hover:!bg-emerald-900/30 !rounded-lg !font-medium",
              navbarButtonActive: "!text-emerald-400 !bg-emerald-900/50 !rounded-lg",
              pageScrollBox: "!bg-emerald-950",
              profileSectionTitleText: "!text-white !font-semibold",
              profileSectionTitle: "!border-b !border-emerald-900/60",
              profileSectionPrimaryButton: "!text-emerald-400 hover:!text-emerald-300 !font-medium",
              badge: "!bg-emerald-900/40 !text-emerald-400 !border !border-emerald-700/30 !font-semibold",
              formFieldInput: "!bg-emerald-900/40 !border-emerald-700/30 !text-white focus:!border-emerald-500/50",
              formFieldLabel: "!text-emerald-100/70 !font-medium",
              formButtonPrimary: "!bg-emerald-600 hover:!bg-emerald-500 !text-white !font-semibold",
              formButtonReset: "!text-emerald-400/60 hover:!text-white !border !border-emerald-800/40",
              menuList: "!bg-emerald-950 !border !border-emerald-800/40 !rounded-xl !shadow-xl !shadow-black/60",
              menuItem: "!text-emerald-100/70 hover:!bg-emerald-900/30 hover:!text-white",
              menuItemDestructive: "!text-red-400 hover:!bg-red-500/[0.06]",
            },
          }}
        />
        {!collapsed && user && (
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">
              {user.firstName ?? user.username ?? "User"}
            </p>
            <p className="text-[11px] text-emerald-100/40 truncate">
              {user.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
