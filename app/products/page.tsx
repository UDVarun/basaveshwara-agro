import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import ProductFilters from "@/components/ProductFilters";
import ProductsGrid from "@/components/ProductsGrid";

export const metadata: Metadata = {
  title: "Inventory | Sri Basaveshwara Agro Kendra",
  description: "Browse fertilizers, pesticides, micronutrient blends, and organic compost available at Sri Basaveshwara Agro Kendra, Chikkamagaluru.",
};

interface ProductsPageProps {
  searchParams: Promise<{ 
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q, category, brand } = await searchParams;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-surface min-h-screen">
      {/* Header - Premium Architectural Style */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 pb-8 border-b border-outline-variant/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-secondary"></span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] font-label">Curated Inventory</span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-primary leading-none uppercase">
            Agronomic Assets
          </h1>
          <p className="font-body text-on-surface-variant mt-4 text-base max-w-md leading-relaxed">
            Discover precision-engineered inputs designed for the modern Karnataka harvest.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select className="appearance-none bg-surface-container-low border border-outline-variant/20 text-primary font-bold text-[11px] uppercase tracking-widest py-3 pl-6 pr-12 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none cursor-pointer transition-all hover:border-primary/40 shadow-sm">
              <option>Relevance</option>
              <option>Price: Ascending</option>
              <option>Price: Descending</option>
              <option>New Acquisitions</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-xl" data-icon="expand_more">expand_more</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Filters Sidebar */}
        <Suspense fallback={<div className="w-60 h-96 bg-surface-container-low rounded-3xl animate-pulse" />}>
          <ProductFilters />
        </Suspense>

        <div className="flex-1">
          <Suspense key={`${q}-${category}-${brand}`} fallback={<ProductGridSkeleton count={9} />}>
            <ProductsGrid q={q} category={category} brand={brand} />
          </Suspense>

          {/* Pagination - Minimalists Style */}
          <div className="mt-24 pt-12 border-t border-outline-variant/10 flex justify-between items-center">
            <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest font-label">
              Showing Page 1 of 12
            </div>
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-primary/40 border border-outline-variant/10 bg-surface cursor-not-allowed">
                <span className="material-symbols-outlined text-xl">west</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-on-primary font-bold shadow-md hover:scale-105 transition-transform active:scale-95">
                <span className="material-symbols-outlined text-xl">east</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
