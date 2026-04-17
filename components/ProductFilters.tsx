"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = ["Seeds", "Fertilizers", "Pesticides", "Equipment"];
const BRANDS = ["Syngenta", "Bayer", "Pioneer", "Mahyco"];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get(name) === value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`/products?${queryString}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className="w-full lg:w-60 flex-shrink-0 space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-[11px] text-primary uppercase tracking-[0.3em] font-label">Filters</h3>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-headline font-semibold text-xs text-on-surface mb-6 uppercase tracking-wider opacity-40">Category</h4>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const isActive = searchParams.get("category") === cat;
            return (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={isActive}
                    onChange={() => handleFilter("category", cat)}
                  />
                  <div className="w-5 h-5 bg-surface-container-low border border-outline-variant/30 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-primary/50"></div>
                  <span className="material-symbols-outlined absolute text-on-primary text-[16px] left-[2px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" data-icon="check">check</span>
                </div>
                <span className={`text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-outline-variant/10"></div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-headline font-semibold text-xs text-on-surface mb-6 uppercase tracking-wider opacity-40">Brand</h4>
        <div className="space-y-4">
          {BRANDS.map((brand) => {
            const isActive = searchParams.get("brand") === brand;
            return (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={isActive}
                    onChange={() => handleFilter("brand", brand)}
                  />
                  <div className="w-5 h-5 bg-surface-container-low border border-outline-variant/30 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-primary/50"></div>
                  <span className="material-symbols-outlined absolute text-on-primary text-[16px] left-[2px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" data-icon="check">check</span>
                </div>
                <span className={`text-sm font-medium transition-colors ${isActive ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter Placeholder (Visual only for now) */}
      <div className="pt-4">
        <h4 className="font-headline font-semibold text-xs text-on-surface mb-6 uppercase tracking-wider opacity-40">Price Threshold</h4>
        <div className="space-y-5">
          <input 
            type="range" 
            max="10000" 
            min="0" 
            className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer accent-primary" 
          />
          <div className="flex items-center justify-between font-body text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
            <span>₹0</span>
            <span>₹10,000+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
