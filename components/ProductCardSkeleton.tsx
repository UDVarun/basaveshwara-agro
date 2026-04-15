// ─── Loading skeleton — animate-pulse, card-shaped, no shimmer gradients ─────

export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-white"
      aria-hidden="true"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Image placeholder */}
      <div className="aspect-square w-full animate-pulse bg-slate-200" />

      {/* Content placeholders */}
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-1 h-5 w-1/4 animate-pulse rounded bg-slate-200" />
      </div>

      {/* Button placeholder */}
      <div className="px-4 pb-4">
        <div className="h-12 w-full animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

// ─── Grid of skeletons shown during loading ───────────────────────────────────

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
