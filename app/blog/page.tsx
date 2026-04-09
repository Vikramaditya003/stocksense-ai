import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Forestock",
  description: "Inventory management tips, demand forecasting guides, and Shopify growth strategies from the Forestock team.",
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      <Navbar />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Blog
          </span>
          <h1 className="text-[32px] sm:text-[40px] font-semibold text-white tracking-[-0.025em] leading-tight mt-4 mb-3">
            Inventory Intelligence
          </h1>
          <p className="text-[15px] text-slate-500 max-w-[480px] leading-relaxed">
            Forecasting guides, reorder strategies, and Shopify growth insights from the Forestock team.
          </p>
        </div>

        {/* Featured post */}
        <div className="mb-6">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-[#0A1415] hover:bg-[#0F1C1E] border border-white/[0.07] hover:border-[#22C55E]/25 rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#22C55E]/[0.05]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${featured.tagColor}`}>
                {featured.tag}
              </span>
              <span className="text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full">Featured</span>
            </div>
            <h2 className="text-[20px] font-semibold text-white mb-3 group-hover:text-[#22C55E] transition-colors leading-snug tracking-tight">
              {featured.title}
            </h2>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-5 max-w-[640px]">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-600">
              <span>Forestock Team</span>
              <span>·</span>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
              <span className="ml-auto text-[#22C55E] text-[12px] font-medium group-hover:translate-x-0.5 transition-transform">Read →</span>
            </div>
          </Link>
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#0A1415] hover:bg-[#0F1C1E] border border-white/[0.07] hover:border-[#22C55E]/25 rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#22C55E]/[0.05]"
            >
              <div className="mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${post.tagColor}`}>
                  {post.tag}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2 group-hover:text-[#22C55E] transition-colors leading-snug tracking-tight">
                {post.title}
              </h3>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{post.date} · {post.readTime}</span>
                <span className="text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity text-[12px]">Read →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-[#22C55E]/15 rounded-2xl p-8 text-center bg-[#22C55E]/[0.02]">
          <p className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest mb-3">Try it free</p>
          <h2 className="text-[20px] font-semibold text-white mb-2 tracking-tight">Stop guessing. Start forecasting.</h2>
          <p className="text-[13px] text-slate-500 mb-6 max-w-[400px] mx-auto leading-relaxed">
            Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue-at-risk in 30 seconds.
          </p>
          <Link
            href="/forecast"
            className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[13px] px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20"
          >
            Run a free forecast
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center">
        <p className="text-[11px] text-slate-600">
          &copy; {new Date().getFullYear()} Forestock ·{" "}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>{" "}·{" "}
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>{" "}·{" "}
          <a href="mailto:support@getforestock.com" className="hover:text-white transition-colors">Contact</a>
        </p>
      </footer>
    </div>
  );
}
