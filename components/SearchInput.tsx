"use client";

import { useCallback, useRef } from "react";
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
      }, 400); // 400ms debounce for smoother feel
    },
    [router, searchParams]
  );

  return (
    <div className="relative w-full max-w-[280px] group" role="search">
      <span 
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/40 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors" 
        aria-hidden="true"
      >
        search
      </span>
      <input
        id="product-search"
        type="search"
        name="q"
        defaultValue={currentQuery}
        onChange={handleChange}
        placeholder="Search inventory..."
        autoComplete="off"
        maxLength={100}
        aria-label="Search agricultural products"
        className="h-10 w-full rounded-full border border-outline-variant/30 bg-surface-container-low pl-10 pr-4 text-[13px] font-medium text-on-surface placeholder:text-on-surface/40 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
      />
    </div>
  );
}
