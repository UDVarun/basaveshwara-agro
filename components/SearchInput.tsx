"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

// ─── Zod validation schema ────────────────────────────────────────────────────
// max 100 chars, strip HTML tags, trim whitespace

const SearchSchema = z
  .string()
  .max(100)
  .transform((val) =>
    val
      .replace(/<[^>]*>/g, "") // strip HTML tags
      .trim()
  );

// ─── SearchInput ─────────────────────────────────────────────────────────────

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuery = searchParams.get("q") ?? "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // Clear previous debounce
      if (timerRef.current) clearTimeout(timerRef.current);

      // Debounce: 300ms
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

        // Push to URL — triggers server component re-fetch
        router.push(`/products?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [router, searchParams]
  );

  return (
    <div className="w-full" role="search">
      <label
        htmlFor="product-search"
        className="mb-1 block text-sm font-semibold text-slate-900"
      >
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        name="q"
        defaultValue={currentQuery}
        onChange={handleChange}
        placeholder="e.g. DAP fertilizer, Coragen, compost..."
        autoComplete="off"
        maxLength={100}
        aria-label="Search agricultural products"
        className="min-h-[48px] w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
      />
    </div>
  );
}
