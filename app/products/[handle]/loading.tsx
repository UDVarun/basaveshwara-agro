export default function ProductDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-surface min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8 opacity-50">
        <div className="h-3 w-12 animate-pulse rounded-sm bg-surface-container-high" />
        <div className="h-3 w-4 animate-pulse rounded-sm bg-surface-container-high" />
        <div className="h-3 w-16 animate-pulse rounded-sm bg-surface-container-high" />
        <div className="h-3 w-4 animate-pulse rounded-sm bg-surface-container-high" />
        <div className="h-3 w-24 animate-pulse rounded-sm bg-surface-container-high" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-surface-container-high shadow-editorial" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-surface-container-high" />
            ))}
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="h-4 w-24 animate-pulse rounded-full bg-primary/10 mb-4" />
            <div className="h-10 w-full animate-pulse rounded-sm bg-surface-container-high mb-2" />
            <div className="h-10 w-2/3 animate-pulse rounded-sm bg-surface-container-high" />
          </div>

          <div className="h-8 w-32 animate-pulse rounded-sm bg-surface-container-high" />

          <div className="space-y-4 pt-6 border-t border-black/5">
            <div className="h-4 w-full animate-pulse rounded-sm bg-surface-container-high" />
            <div className="h-4 w-full animate-pulse rounded-sm bg-surface-container-high" />
            <div className="h-4 w-3/4 animate-pulse rounded-sm bg-surface-container-high" />
          </div>

          {/* Actions Skeleton */}
          <div className="pt-8 space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-32 animate-pulse rounded-xl bg-surface-container-high" />
              <div className="h-12 flex-1 animate-pulse rounded-xl bg-surface-container-high" />
            </div>
            <div className="flex gap-4">
              <div className="h-14 flex-1 animate-pulse rounded-2xl bg-surface-container-high" />
              <div className="h-14 flex-1 animate-pulse rounded-2xl bg-surface-container-high" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
