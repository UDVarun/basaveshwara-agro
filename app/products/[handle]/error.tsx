"use client";

export default function ProductDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-slate-900">
        We are updating our store.
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        This product may be temporarily unavailable. Please try again shortly.
      </p>
      <button
        id="product-detail-retry-button"
        onClick={reset}
        className="mt-6 min-h-[48px] rounded-md bg-[#166534] px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
