import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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
      <Search 
        className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-agro-muted group-focus-within:text-agro-green transition-colors" 
        aria-hidden="true"
      />
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
        className="h-10 w-full rounded-full border border-agro-outline-ghost/30 bg-agro-surface-low pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest text-agro-ink placeholder:text-agro-muted/40 focus:border-agro-green focus:bg-white focus:outline-none focus:ring-4 focus:ring-agro-green/5 transition-all"
      />
    </div>
  );
}
