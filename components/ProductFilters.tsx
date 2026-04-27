import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Check, Filter, X } from "lucide-react";

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
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
      <div className="flex items-center justify-between pb-6 border-b border-agro-outline-ghost/10">
        <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-agro-green" />
            <h3 className="font-headline font-bold text-[11px] text-agro-ink uppercase tracking-[0.4em]">Filters</h3>
        </div>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 text-[10px] font-bold text-agro-gold uppercase tracking-widest hover:text-agro-green transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-8">
        <h4 className="text-[10px] font-bold text-agro-ink uppercase tracking-[0.3em] opacity-30">Category Index</h4>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const isActive = searchParams.get("category") === cat;
            return (
              <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={isActive}
                    onChange={() => handleFilter("category", cat)}
                  />
                  <div className="w-5 h-5 bg-white border border-agro-outline-ghost/30 rounded-lg peer-checked:bg-agro-green peer-checked:border-agro-green transition-all group-hover:border-agro-green shadow-sm"></div>
                  <Check className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? "text-agro-green" : "text-agro-muted group-hover:text-agro-ink"}`}>
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-agro-outline-ghost/10"></div>

      {/* Brand Filter */}
      <div className="space-y-8">
        <h4 className="text-[10px] font-bold text-agro-ink uppercase tracking-[0.3em] opacity-30">Verified Brands</h4>
        <div className="space-y-4">
          {BRANDS.map((brand) => {
            const isActive = searchParams.get("brand") === brand;
            return (
              <label key={brand} className="flex items-center gap-4 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={isActive}
                    onChange={() => handleFilter("brand", brand)}
                  />
                  <div className="w-5 h-5 bg-white border border-agro-outline-ghost/30 rounded-lg peer-checked:bg-agro-green peer-checked:border-agro-green transition-all group-hover:border-agro-green shadow-sm"></div>
                  <Check className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? "text-agro-green" : "text-agro-muted group-hover:text-agro-ink"}`}>
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
