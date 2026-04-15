import { Suspense } from "react";
import type { Metadata } from "next";
import { z } from "zod";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import SearchInput from "@/components/SearchInput";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse fertilizers, pesticides, micronutrient blends, and organic compost available at Sri Basaveshwara Agro Kendra, Chikmagalur.",
};

// ─── Search param validation ──────────────────────────────────────────────────

const SearchParamsSchema = z.object({
  q: z
    .string()
    .max(100)
    .transform((v) => v.replace(/<[^>]*>/g, "").trim())
    .optional(),
  page: z.coerce.number().int().min(1).max(999).optional().default(1),
});

// ─── Data fetching — server-side via API proxy ────────────────────────────────

interface ProductsData {
  edges: Array<{
    cursor: string;
    node: {
      id: string;
      handle: string;
      title: string;
      description: string;
      descriptionHtml: string;
      availableForSale: boolean;
      featuredImage: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      } | null;
      images: { nodes: Array<{ url: string; altText: string | null; width: number; height: number }> };
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
          price: { amount: string; currencyCode: string };
          compareAtPrice: { amount: string; currencyCode: string } | null;
          quantityAvailable: number | null;
        }>;
      };
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
        maxVariantPrice: { amount: string; currencyCode: string };
      };
      tags: string[];
      vendor: string;
      productType: string;
      seo: { title: string | null; description: string | null };
    };
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

async function fetchProducts(query?: string): Promise<ProductsData> {
  const baseUrl = process.env["NEXT_PUBLIC_BASE_URL"] ?? "http://localhost:3000";
  const params = new URLSearchParams({ first: "24" });
  if (query) params.set("q", query);

  const res = await fetch(`${baseUrl}/api/v1/products?${params.toString()}`, {
    // Revalidate every 60 seconds
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to load products");
  }

  return res.json() as Promise<ProductsData>;
}

// ─── Products grid — async server component ───────────────────────────────────

async function ProductsGrid({ query }: { query?: string }) {
  let data: ProductsData;

  try {
    data = await fetchProducts(query);
  } catch {
    return (
      <p
        className="py-16 text-center text-base text-slate-700"
        role="status"
        aria-live="polite"
      >
        We are updating our stock. Please check back shortly.
      </p>
    );
  }

  const products = data.edges.map((e) => e.node);

  if (products.length === 0) {
    return (
      <p
        className="py-16 text-center text-base text-slate-700"
        role="status"
        aria-live="polite"
      >
        {query
          ? `No products found for "${query}". Try a different search term.`
          : "We are updating our stock. Please check back shortly."}
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-slate-700" role="status" aria-live="polite">
        {products.length} product{products.length !== 1 ? "s" : ""} found
        {query ? ` for "${query}"` : ""}
      </p>

      {/* Grid: 1 col mobile → 2 col sm → 3 col lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;

  // Sanitize & validate search params with Zod
  const parsed = SearchParamsSchema.safeParse({
    q: typeof rawParams["q"] === "string" ? rawParams["q"] : undefined,
    page: typeof rawParams["page"] === "string" ? rawParams["page"] : undefined,
  });

  const query = parsed.success ? parsed.data.q : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Agricultural Products
      </h1>
      <p className="mt-2 text-sm text-slate-700">
        Fertilizers, pesticides, micronutrient blends, and compost for farmers in
        Chikmagalur and surrounding Karnataka districts.
      </p>

      {/* Search — wrapped in Suspense because it uses useSearchParams */}
      <div className="mt-6">
        <Suspense fallback={
          <div className="h-12 w-full animate-pulse rounded-md bg-slate-200" />
        }>
          <SearchInput />
        </Suspense>
      </div>

      {/* Products grid — wrapped in Suspense for streaming */}
      <div className="mt-8">
        <Suspense
          key={query} // re-mount when query changes to show skeleton
          fallback={<ProductGridSkeleton count={6} />}
        >
          <ProductsGrid {...(query !== undefined && { query })} />
        </Suspense>
      </div>
    </div>
  );
}
