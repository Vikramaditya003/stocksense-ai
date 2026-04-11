import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/forecast", "/blog", "/compare", "/sign-in", "/sign-up", "/privacy", "/terms"],
        disallow: ["/api/", "/dashboard", "/history", "/upgrade"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
