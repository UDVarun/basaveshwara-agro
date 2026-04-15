"use client";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-slate-900">
        We are updating our stock.
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        Please check back in a few minutes.
      </p>
      <button
        id="products-retry-button"
        onClick={reset}
        className="mt-6 min-h-[48px] rounded-md bg-[#166534] px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
