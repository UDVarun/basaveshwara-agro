import type { MetadataRoute } from "next";
import { getAllProductHandles } from "@/lib/shopify";

const BASE_URL = "https://basaveshwaraagro.in";

// Static pages
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/products`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all product handles for dynamic product pages
  let handles: string[] = [];

  try {
    handles = await getAllProductHandles();
  } catch {
    // If Shopify is unavailable, return static pages only — don't fail the build
    console.error("[sitemap] Could not fetch product handles from Shopify");
  }

  const productPages: MetadataRoute.Sitemap = handles.map((handle) => ({
    url: `${BASE_URL}/products/${handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...STATIC_PAGES, ...productPages];
}
