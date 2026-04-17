import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 bg-surface min-h-screen">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-sm bg-surface-container-high" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-sm bg-surface-container-high opacity-50" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-sm bg-surface-container-high" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-60 flex-shrink-0 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-24 animate-pulse rounded-sm bg-surface-container-high mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 w-full animate-pulse rounded-sm bg-surface-container-high opacity-60" />
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <ProductGridSkeleton count={6} />
        </div>
      </div>
    </main>
  );
}
