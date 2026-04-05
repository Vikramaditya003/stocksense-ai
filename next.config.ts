import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent DNS prefetching leaking visited subdomains
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Block clickjacking — page cannot be embedded in an iframe on another origin
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't send full URL in Referer header to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable camera, mic, geolocation, payment — we never use them
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Force HTTPS for 1 year, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Content Security Policy — restrict what can load on your pages
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Clerk + Razorpay checkout
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.clerk.accounts.dev https://clerk.forestock.app",
      // Styles: self + inline (needed for Tailwind/framer-motion)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs + Clerk avatar CDN
      "img-src 'self' data: https://img.clerk.com https://*.clerk.accounts.dev",
      // Connections: self + our APIs + Clerk + Supabase + Groq
      "connect-src 'self' https://api.groq.com https://*.supabase.co https://*.clerk.accounts.dev https://clerk.forestock.app",
      // Frames: Razorpay opens in iframe
      "frame-src https://api.razorpay.com https://checkout.razorpay.com",
      // Fonts: self only (we use next/font)
      "font-src 'self'",
      // Block all objects/plugins
      "object-src 'none'",
      // Force HTTPS for all resources
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,

  experimental: {
    // Tree-shake large packages so only the icons/components you actually use are bundled
    optimizePackageImports: ["framer-motion", "@clerk/nextjs"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          // Aggressive caching for static assets (JS, CSS, fonts)
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Don't cache HTML pages — always fresh
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
