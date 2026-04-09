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

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Header */}
        <div className="mb-10 border-b border-white/[0.06] pb-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-full mb-4">
            <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
            Blog
          </span>
          <h1 className="!text-[26px] !font-semibold text-white !leading-tight tracking-tight mt-3 mb-2">
            Inventory Intelligence
          </h1>
          <p className="text-[13px] text-slate-500 max-w-[420px] leading-relaxed">
            Forecasting guides, reorder strategies, and Shopify growth insights from the Forestock team.
          </p>
        </div>

        {/* Featured post */}
        <div className="mb-5">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-[1fr_280px] gap-6 bg-[#0A1415] hover:bg-[#0F1C1E] border border-white/[0.07] hover:border-[#22C55E]/20 rounded-2xl p-6 transition-all duration-200"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${featured.tagColor}`}>
                  {featured.tag}
                </span>
                <span className="text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full">Featured</span>
              </div>
              <h2 className="!text-[17px] !font-semibold text-white mb-2.5 group-hover:text-[#22C55E] transition-colors !leading-snug tracking-tight">
                {featured.title}
              </h2>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-4 max-w-[560px]">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <span>Forestock Team</span>
                <span>·</span>
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-end">
              <span className="text-[12px] font-medium text-[#22C55E] group-hover:translate-x-1 transition-transform">Read article →</span>
            </div>
          </Link>
        </div>

        {/* Post grid — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#0A1415] hover:bg-[#0F1C1E] border border-white/[0.07] hover:border-[#22C55E]/20 rounded-xl p-5 transition-all duration-200"
            >
              <div className="mb-2.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${post.tagColor}`}>
                  {post.tag}
                </span>
              </div>
              <h3 className="!text-[13px] !font-semibold text-white mb-2 group-hover:text-[#22C55E] transition-colors !leading-snug tracking-tight">
                {post.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{post.date} · {post.readTime}</span>
                <span className="text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity">Read →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-[#22C55E]/15 rounded-2xl p-8 bg-[#0A1415] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-2">Try it free</p>
            <h2 className="!text-[18px] !font-semibold text-white mb-1.5 tracking-tight">Stop guessing. Start forecasting.</h2>
            <p className="text-[12px] text-slate-500 max-w-[380px] leading-relaxed">
              Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue-at-risk in 30 seconds.
            </p>
          </div>
          <Link
            href="/forecast"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[13px] px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20 whitespace-nowrap"
          >
            Run a free forecast →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-6 text-center">
        <p className="text-[11px] text-slate-600">
          &copy; {new Date().getFullYear()} Forestock ·{" "}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>{" "}·{" "}
          <a href="mailto:support@getforestock.com" className="hover:text-white transition-colors">Contact</a>
        </p>
      </footer>
    </div>
  );
}
