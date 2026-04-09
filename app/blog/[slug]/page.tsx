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

// ── Section renderers ─────────────────────────────────────────────────────────

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return (
        <h2 key={i} className="text-[16px] font-semibold text-white mt-10 mb-3 tracking-tight">
          {s.text}
        </h2>
      );

    case "subheading":
      return (
        <h3 key={i} className="text-[14px] font-semibold text-slate-200 mt-6 mb-2 tracking-tight">
          {s.text}
        </h3>
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
        tip:     { border: "border-[#22C55E]/20",   bg: "bg-[#22C55E]/[0.04]",   icon: "💡", label: "Tip",     labelColor: "text-[#22C55E]" },
        warning: { border: "border-orange-500/20",   bg: "bg-orange-500/[0.04]",  icon: "⚠",  label: "Warning", labelColor: "text-orange-400" },
        info:    { border: "border-blue-500/20",     bg: "bg-blue-500/[0.04]",    icon: "ℹ",  label: "Note",    labelColor: "text-blue-400"  },
      };
      const c = cfg[s.variant ?? "info"];
      return (
        <div key={i} className={`border rounded-xl px-5 py-4 ${c.border} ${c.bg}`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${c.labelColor}`}>{c.icon} {c.label}</p>
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

// ── Page ──────────────────────────────────────────────────────────────────────

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

      {/* Article */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 pt-28 pb-14">

        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-slate-400 transition-colors mb-8">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          All articles
        </Link>

        {/* Tag + meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${post.tagColor}`}>
            {post.tag}
          </span>
          <span className="text-[11px] text-slate-600">{post.date}</span>
          <span className="text-[11px] text-slate-600">·</span>
          <span className="text-[11px] text-slate-600">{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-white leading-snug tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        <p className="text-[14px] text-slate-400 leading-relaxed mb-10 pb-10 border-b border-white/[0.06]">
          {post.excerpt}
        </p>

        {/* Body */}
        <div className="space-y-5">
          {post.content.map((section, i) => renderSection(section, i))}
        </div>

        {/* CTA */}
        <div className="mt-14 border border-[#22C55E]/15 rounded-2xl p-8 text-center bg-[#22C55E]/[0.02]">
          <p className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest mb-3">Try it free</p>
          <h2 className="text-[18px] font-semibold text-white mb-2 tracking-tight">Ready to stop guessing?</h2>
          <p className="text-[13px] text-slate-500 mb-6 max-w-[360px] mx-auto leading-relaxed">
            Upload your Shopify CSV and see which products are at risk — in 30 seconds.
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
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-[960px] mx-auto px-4 sm:px-6 pb-16">
          <div className="border-t border-white/[0.06] pt-12">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-6">More articles</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block bg-[#0A1415] hover:bg-[#0F1C1E] border border-white/[0.07] hover:border-[#22C55E]/25 rounded-xl p-5 transition-all duration-200"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.tagColor} mb-3 inline-block`}>
                    {p.tag}
                  </span>
                  <h3 className="text-[13px] font-semibold text-white group-hover:text-[#22C55E] transition-colors leading-snug mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-slate-600">{p.date} · {p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
