import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export const metadata: Metadata = {
  title: "The Seed Collection | Sri Basaveshwara Agro Kendra",
  description: "Explore our collection of high-yield, authenticated seasonal seeds for Chikkamagaluru planters. Curated for local soil profiles.",
};

interface ProductsData {
  edges: Array<{
    node: {
      id: string;
      handle: string;
      title: string;
      description: string;
      availableForSale: boolean;
      featuredImage: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      } | null;
      variants: {
        nodes: Array<{
          price: { amount: string; currencyCode: string };
        }>;
      };
      vendor: string;
      productType: string;
    };
  }>;
}

async function fetchSeedProducts(): Promise<ProductsData> {
  const baseUrl = process.env["NEXT_PUBLIC_BASE_URL"] ?? "http://localhost:3000";
  // Filter for seeds specifically
  const params = new URLSearchParams({ first: "48", q: "seed" });

  const res = await fetch(`${baseUrl}/api/v1/products?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to load seeds");
  return res.json() as Promise<ProductsData>;
}

async function SeedGrid() {
  let data: ProductsData;
  try {
    data = await fetchSeedProducts();
  } catch {
    return <div className="p-12 text-center text-agro-muted">Connection to seed warehouse pending...</div>;
  }

  const products = data.edges.map((edge) => edge.node);

  if (products.length === 0) {
    return (
      <div className="bg-agro-surface-low p-24 text-center border border-agro-outline-ghost">
        <p className="text-xl font-serif font-bold text-agro-green">No seasonal seeds currently indexed.</p>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-agro-muted">Check back for upcoming sowing rotations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1 bg-agro-outline-ghost p-[1px] sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as any} />
      ))}
    </div>
  );
}

export default function SeedsPage() {
  return (
    <main className="bg-agro-bg pb-24 font-sans">
      {/* Editorial Header */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 bg-agro-surface-low border-b border-agro-outline-ghost">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="max-w-3xl">
              <span className="text-[10px] font-bold tracking-[0.4em] text-agro-gold uppercase mb-8 block">
                Resource Index 03 / Seeds
              </span>
              <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] text-agro-green tracking-tight">
                Authentic <br /> Grain Legacy.
              </h1>
              <p className="mt-12 text-xl font-medium leading-relaxed text-agro-muted max-w-xl">
                Curating high-performance, legacy seeds with verified germination rates for the unique terrain of the Malnad region.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-6 pb-2">
               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-agro-muted">
                 <span>Batch Verified</span>
                 <span className="h-[1px] w-8 bg-agro-outline-ghost"></span>
                 <span>Germination Guaranteed</span>
               </div>
               <Link 
                 href="/products" 
                 className="text-[11px] font-bold uppercase tracking-widest text-agro-ink border-b-2 border-agro-gold pb-1 hover:text-agro-muted transition-colors"
                >
                 View All Resources &rarr;
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 border-b border-agro-outline-ghost pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted">
              Inventory / Seasonal Sowing
            </p>
            <div className="h-[1px] bg-agro-outline-ghost flex-1 mx-8 hidden sm:block"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-agro-ink">Chikkamagaluru Stock</span>
          </div>
          
          <Suspense fallback={<ProductGridSkeleton count={6} />}>
            <SeedGrid />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
