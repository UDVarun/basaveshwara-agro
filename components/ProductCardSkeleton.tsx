export function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg bg-surface-container-lowest border border-outline-variant/15"
      aria-hidden="true"
    >
      <div className="h-64 w-full animate-pulse bg-surface-container-high" />

      <div className="flex flex-col gap-4 p-6">
        <div className="h-3 w-1/4 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-4 w-full animate-pulse rounded-full bg-surface-container-high" />
        
        <div className="mt-8 flex justify-between items-center border-t border-outline-variant/15 pt-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-surface-container-high" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
