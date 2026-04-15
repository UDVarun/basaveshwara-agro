import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow API routes — no need for bots to index these
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://basaveshwaraagro.in/sitemap.xml",
    host: "https://basaveshwaraagro.in",
  };
}
