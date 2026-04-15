export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {/* Image skeleton */}
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200 md:w-1/2 md:flex-none" />

        {/* Info skeleton */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200" />

          {/* Specs skeleton */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={[
                  "flex gap-4 px-4 py-3",
                  i % 2 === 0 ? "bg-slate-50" : "bg-white",
                ].join(" ")}
              >
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Button skeleton — desktop only */}
          <div className="mt-4 hidden h-12 w-full animate-pulse rounded-md bg-slate-200 md:block" />
        </div>
      </div>

      {/* Mobile sticky button skeleton */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-slate-200 bg-[#F8FAFC] p-4 md:hidden">
        <div className="h-12 w-full animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
