import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Heading skeleton */}
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />

      {/* Search skeleton */}
      <div className="mt-6 h-12 w-full animate-pulse rounded-md bg-slate-200" />

      {/* Grid skeleton */}
      <div className="mt-8">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}
