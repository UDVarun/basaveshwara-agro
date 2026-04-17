"use client";

import { useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const SearchSchema = z
  .string()
  .max(100)
  .transform((val) => val.replace(/<[^>]*>/g, "").trim());

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQuery = searchParams.get("q") ?? "";

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const parsed = SearchSchema.safeParse(raw);
        if (!parsed.success) return;

        const q = parsed.data;
        const params = new URLSearchParams(searchParams.toString());

        if (q) {
          params.set("q", q);
        } else {
          params.delete("q");
        }

        router.push(`/products?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [router, searchParams]
  );

  return (
    <div className="w-full" role="search">
      <label
        htmlFor="product-search"
        className="mb-2 block text-sm font-bold text-stone-950"
      >
        Search products
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        />
        <input
          id="product-search"
          type="search"
          name="q"
          defaultValue={currentQuery}
          onChange={handleChange}
          placeholder="Search fertilizer, insecticide, seed..."
          autoComplete="off"
          maxLength={100}
          aria-label="Search agricultural products"
          className="min-h-12 w-full rounded-lg border border-stone-200 bg-white px-12 py-3 text-sm font-medium text-stone-950 shadow-sm shadow-black/5 placeholder:text-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10"
        />
      </div>
    </div>
  );
}
