import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getPost, POSTS, type Section } from "@/lib/blog-posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Forestock Blog`,
    description: post.excerpt,
  };
}

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return (
        <div key={i} className="text-[15px] font-semibold text-white mt-8 mb-2.5 tracking-tight leading-snug">
          {s.text}
        </div>
      );
    case "subheading":
      return (
        <div key={i} className="text-[13px] font-semibold text-slate-200 mt-5 mb-2 tracking-tight">
          {s.text}
        </div>
      );
    case "paragraph":
      return (
        <p key={i} className="text-[13px] text-slate-400 leading-relaxed">
          {s.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="space-y-2">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-[13px] text-slate-400">
              <span className="text-[#22C55E] mt-0.5 flex-shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol key={i} className="space-y-3">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[13px] text-slate-400">
              <span className="w-5 h-5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {j + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "formula":
      return (
        <div key={i} className="bg-[#22C55E]/[0.04] border border-[#22C55E]/20 rounded-xl px-5 py-4 font-mono text-[13px] text-[#22C55E] text-center tracking-tight">
          {s.text}
        </div>
      );
    case "callout": {
      const cfg = {
        tip:     { border: "border-[#22C55E]/20",  bg: "bg-[#22C55E]/[0.04]",  icon: "💡", label: "Tip",     labelColor: "text-[#22C55E]" },
        warning: { border: "border-orange-500/20", bg: "bg-orange-500/[0.04]", icon: "⚠",  label: "Warning", labelColor: "text-orange-400" },
        info:    { border: "border-blue-500/20",   bg: "bg-blue-500/[0.04]",   icon: "ℹ",  label: "Note",    labelColor: "text-blue-400"  },
      };
      const c = cfg[s.variant ?? "info"];
      return (
        <div key={i} className={`border rounded-xl px-5 py-4 ${c.border} ${c.bg}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${c.labelColor}`}>{c.icon} {c.label}</p>
          <p className="text-[13px] text-slate-300 leading-relaxed">{s.text}</p>
        </div>
      );
    }
    case "table":
      return (
        <div key={i} className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-y-1">
            <thead>
              <tr>
                {s.headers?.map((h) => (
                  <th key={h} className="text-left text-slate-600 uppercase tracking-wider font-semibold pb-2 pr-4 text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows?.map((row, j) => (
                <tr key={j} className="bg-white/[0.02]">
                  {row.map((cell, k) => (
                    <td key={k} className={`px-3 py-2.5 text-[12px] text-slate-400 ${k === 0 ? "font-medium text-slate-300 rounded-l-lg" : ""} ${k === row.length - 1 ? "rounded-r-lg" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

          {/* Main article */}
          <article>
            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors mb-7">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All articles
            </Link>

            {/* Meta */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${post.tagColor}`}>{post.tag}</span>
              <span className="text-[11px] text-slate-600">{post.date}</span>
              <span className="text-[11px] text-slate-600">·</span>
              <span className="text-[11px] text-slate-600">{post.readTime}</span>
            </div>

            {/* Title — using div to bypass global h1 CSS */}
            <div className="text-[22px] sm:text-[26px] font-semibold text-white leading-snug tracking-tight mb-4">
              {post.title}
            </div>

            {/* Lead */}
            <p className="text-[14px] text-slate-400 leading-relaxed mb-8 pb-8 border-b border-white/[0.06]">
              {post.excerpt}
            </p>

            {/* Body */}
            <div className="space-y-5">
              {post.content.map((section, i) => renderSection(section, i))}
            </div>

            {/* CTA */}
            <div className="mt-12 border border-[#22C55E]/15 rounded-2xl p-6 bg-[#0A1415] flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-1.5">Try it free</p>
                <div className="text-[16px] font-semibold text-white mb-1 tracking-tight">Ready to stop guessing?</div>
                <p className="text-[12px] text-slate-500 leading-relaxed">Upload your CSV and see which products are at risk in 30 seconds.</p>
              </div>
              <Link
                href="/forecast"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20 whitespace-nowrap"
              >
                Run free forecast →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            {/* More articles */}
            <div className="bg-[#0A1415] border border-white/[0.07] rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">More articles</p>
              <div className="space-y-4">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block"
                  >
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${p.tagColor} mb-1.5 inline-block`}>
                      {p.tag}
                    </span>
                    <p className="text-[12px] font-medium text-slate-300 group-hover:text-[#22C55E] transition-colors leading-snug tracking-tight">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">{p.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-[#0A1415] border border-white/[0.07] rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Quick links</p>
              <div className="space-y-2">
                {[
                  { label: "Run a forecast", href: "/forecast" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Contact us", href: "mailto:support@getforestock.com" },
                ].map(l => (
                  <a key={l.label} href={l.href} className="block text-[12px] text-slate-500 hover:text-white transition-colors">
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          </aside>

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
