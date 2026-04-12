import Link from "next/link";

export default function MobileStickyCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 bg-white border-t border-[#bbcbba]/60 shadow-lg shadow-black/10">
      <Link
        href="/forecast"
        className="btn-primary btn-gradient flex items-center justify-center gap-2 w-full text-[15px] font-semibold text-white py-3 rounded-[6px]"
      >
        Run free forecast
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
