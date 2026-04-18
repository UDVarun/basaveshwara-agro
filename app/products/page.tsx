import { Suspense } from "react";
import type { Metadata } from "next";
import type { ShopifyProduct, ShopifyProductConnection } from "@/types/shopify";
import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export const metadata: Metadata = {
  title: "Products - Basaveshwara Agro",
  description: "Browse fertilizers, pesticides, micronutrient blends, and organic compost available at Sri Basaveshwara Agro Kendra, Chikkamagaluru.",
};

interface ProductsData {
  edges: Array<{
    node: ShopifyProduct;
  }>;
}

// Removal of fetchProducts as we now use direct library calls

async function ProductsGrid({ query }: { query?: string }) {
  let data: ShopifyProductConnection;
  try {
    data = await getProducts({
      first: 12,
      query: query || "",
    });
  } catch (error) {
    console.error("[ProductsGrid] Error fetching:", error);
    return <div className="p-12 text-center text-outline">Inventory sync in progress...</div>;
  }

  const products = data.edges.map((edge) => edge.node);

  if (products.length === 0) {
    return <div className="p-12 text-center text-outline text-lg">No products found in this category.</div>;
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 bg-surface min-h-screen">
      {/* Header & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-1">Our Collection</h1>
          <p className="font-body text-outline text-sm opacity-75">Premium essentials for the modern cultivator.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="appearance-none bg-surface-container-high border-none text-on-surface font-body text-xs py-2.5 pl-4 pr-10 rounded-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-lg" data-icon="sort">sort</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-60 flex-shrink-0 space-y-8">
          {/* Category Filter */}
          <div>
            <h3 className="font-headline font-semibold text-base text-on-surface mb-4 uppercase tracking-wider opacity-60">Category</h3>
            <div className="space-y-3 font-body text-on-surface-variant text-sm font-medium">
              {["Seeds", "Fertilizers", "Pesticides", "Equipment"].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      defaultChecked={query?.toLowerCase() === cat.toLowerCase()} 
                    />
                    <div className="w-4.5 h-4.5 bg-surface border border-outline-variant rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <span className="material-symbols-outlined absolute text-on-primary text-[14px] left-[1px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" data-icon="check">check</span>
                  </div>
                  <span className="group-hover:text-primary transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-headline font-semibold text-base text-on-surface mb-4 uppercase tracking-wider opacity-60">Price Range</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                max="10000" 
                min="0" 
                className="w-full h-1 bg-surface-container-high rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
              />
              <div className="flex items-center justify-between font-body text-xs text-outline font-medium">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="font-headline font-semibold text-base text-on-surface mb-4 uppercase tracking-wider opacity-60">Brand</h3>
            <div className="space-y-3 font-body text-on-surface-variant text-sm">
              {["Syngenta", "Bayer", "Pioneer", "Mahyco"].map((brand) => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4.5 h-4.5 bg-surface border border-outline-variant rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <span className="material-symbols-outlined absolute text-on-primary text-[14px] left-[1px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" data-icon="check">check</span>
                  </div>
                  <span className="group-hover:text-primary transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <Suspense key={query} fallback={<ProductGridSkeleton count={6} />}>
            <ProductsGrid query={query} />
          </Suspense>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-outline hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-lg" data-icon="chevron_left">chevron_left</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-sm bg-primary text-on-primary font-headline font-semibold text-xs transition-transform active:scale-95">1</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-on-surface hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container-high font-headline font-medium text-xs">2</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-on-surface hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container-high font-headline font-medium text-xs">3</button>
            <span className="text-outline mx-2 text-xs">...</span>
            <button className="w-9 h-9 flex items-center justify-center rounded-sm text-outline hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-lg" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
