"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { LogoMark } from "@/components/StocksenseLogo";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser, useClerk } from "@clerk/nextjs";
import { X } from "lucide-react";

const _clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_READY =
  (_clerkKey.startsWith("pk_test_") || _clerkKey.startsWith("pk_live_")) &&
  _clerkKey.length > 30;

function UserDropdown() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#bbcbba]/40 bg-white hover:bg-[#f0f5f1] transition-all"
        aria-label="Account menu"
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.imageUrl} alt={name} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-[#006d34] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {initials}
          </span>
        )}
        <span className="text-[13px] font-medium text-[#181d1b] max-w-[120px] truncate hidden sm:block">{name}</span>
        <svg className={`w-3.5 h-3.5 text-[#8a9a8a] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[240px] bg-white border border-[#bbcbba]/40 rounded-xl shadow-xl shadow-black/10 z-50 overflow-hidden">
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-[#bbcbba]/30 flex items-center gap-3">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-[#006d34] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#181d1b] truncate leading-tight">{name}</p>
              {email && <p className="text-[11px] text-[#5a6059] truncate leading-tight mt-0.5">{email}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={() => { openUserProfile(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#181d1b] hover:bg-[#f0f5f1] rounded-lg transition-colors text-left"
            >
              <svg className="w-4 h-4 text-[#5a6059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage account
            </button>
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <>
        <Button size="sm" asChild className="text-[15px] px-5">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <UserDropdown />
      </>
    );
  }
  return (
    <>
      <SignInButton mode="redirect">
        <Button variant="ghost" size="sm" className="text-[15px]">Sign in</Button>
      </SignInButton>
      <SignUpButton mode="redirect">
        <Button size="sm" className="text-[15px] px-5">Get started</Button>
      </SignUpButton>
    </>
  );
}

function MobileAuthButton() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <Button asChild className="w-full">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }
  return (
    <SignUpButton mode="redirect">
      <Button className="w-full">Get started free</Button>
    </SignUpButton>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features",     href: "/#features"     },
    { label: "Pricing",      href: "/#pricing"      },
    { label: "Blog",         href: "/blog"          },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Banner */}
      {bannerVisible && (
        <div className="w-full h-9 flex items-center justify-center bg-[#006d34]/[0.06] border-b border-[#006d34]/15 px-4 relative">
          <p className="relative text-[12px] text-[#3c4a3d] text-center">
            <span className="inline-flex items-center gap-1.5 mr-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              <span className="font-semibold text-amber-700">Shopify Stocky</span>
            </span>
            shuts down August 2026 —{" "}
            <Link href="/sign-up?redirect_url=/forecast" className="font-semibold text-[#006d34] underline underline-offset-2 hover:text-[#005a28] transition-colors">
              migrate free →
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="absolute right-3 text-[#6c7b6c] hover:text-[#3c4a3d] transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-[1000px] flex items-center justify-between px-6 h-16 rounded-2xl transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2 duration-350 fill-mode-both ${
          scrolled
            ? "glass-nav border border-[#bbcbba]/60 ambient-shadow"
            : "bg-white/60 backdrop-blur-xl border border-[#bbcbba]/40"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size={34} />
          <span className="text-[19px] font-extrabold tracking-[-0.03em]">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-underline text-[15px] text-[#5a6059] hover:text-[#181d1b] px-4 py-2 transition-colors duration-150 tracking-tight"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          {CLERK_READY ? (
            <AuthButtons />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-[15px]">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="text-[15px] px-5">
                <Link href="/forecast">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#5a6059] hover:text-[#181d1b] p-2 rounded-xl hover:bg-[#eaefeb] transition-all"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
          </svg>
        </button>
      </nav>
      </div>

      {/* Mobile menu — CSS transition, no framer-motion */}
      <div
        className={`absolute left-4 right-4 bg-white border border-[#bbcbba]/60 rounded-2xl p-3 shadow-xl shadow-black/10 md:hidden transition-all duration-150 origin-top ${
          bannerVisible ? "top-[7.25rem]" : "top-[4.75rem]"
        } ${
          mobileOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-[0.98] pointer-events-none"
        }`}
      >
        <div className="space-y-0.5 mb-3">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="block text-[15px] text-[#5a6059] hover:text-[#181d1b] px-3 py-2.5 rounded-xl hover:bg-[#eaefeb] transition-all tracking-tight">
              {link.label}
            </a>
          ))}
        </div>
        {CLERK_READY ? (
          <MobileAuthButton />
        ) : (
          <Button asChild className="w-full">
            <Link href="/forecast">Get started free</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
