import Link from "next/link";
import type { Metadata } from "next";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — StockSense AI",
  description: "Inventory management tips, demand forecasting guides, and Shopify growth strategies from the StockSense AI team.",
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      {/* Nav */}
      <nav className="border-b border-[#2DD4BF]/10 px-6 h-16 flex items-center justify-between max-w-[960px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14M9 20V8M14 20V11M19 20V4" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white">StockSense<span className="text-[#2DD4BF]">AI</span></span>
        </Link>
        <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">← Back to home</Link>
      </nav>

      <div className="max-w-[960px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-3xl font-bold text-white mb-3">Inventory Intelligence</h1>
          <p className="text-slate-500 max-w-[480px]">
            Forecasting guides, reorder strategies, and Shopify growth insights from the StockSense AI team.
          </p>
        </div>

        {/* Featured post */}
        <div className="mb-8">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#2DD4BF]/20 rounded-2xl p-8 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${featured.tagColor}`}>
                {featured.tag}
              </span>
              <span className="text-xs text-[#475569]">Featured</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-colors leading-snug">
              {featured.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-[640px]">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#475569]">
              <span>StockSense AI Team</span>
              <span>·</span>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
              <span className="ml-auto text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform">Read →</span>
            </div>
          </Link>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#2DD4BF]/20 rounded-xl p-6 transition-all"
            >
              <div className="mb-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${post.tagColor}`}>
                  {post.tag}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2 group-hover:text-[#2DD4BF] transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#475569]">
                <span>{post.date} · {post.readTime}</span>
                <span className="text-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity">Read →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 border border-[#2DD4BF]/15 rounded-2xl p-8 text-center bg-[#2DD4BF]/[0.02]">
          <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">Try it free</p>
          <h2 className="text-xl font-bold text-white mb-3">Stop guessing. Start forecasting.</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-[400px] mx-auto">
            Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue-at-risk in 30 seconds.
          </p>
          <Link
            href="/forecast"
            className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#2DD4BF]/20"
          >
            Run a free forecast
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] mt-8 py-8 text-center">
        <p className="text-xs text-[#475569]">
          &copy; {new Date().getFullYear()} StockSense AI ·{" "}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>{" "}·{" "}
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </p>
      </footer>
    </div>
  );
}
