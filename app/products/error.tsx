"use client";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-stone-50 px-4 py-16 text-center">
      <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-10 shadow-xl shadow-black/5">
        <h2 className="text-2xl font-bold text-stone-950">
          We are updating our stock.
        </h2>
        <p className="mt-3 text-sm text-stone-600">
          Please check back in a few minutes.
        </p>
        <button
          type="button"
          id="products-retry-button"
          onClick={reset}
          className="mt-6 min-h-12 rounded-lg bg-emerald-900 px-6 text-sm font-bold text-white shadow-xl shadow-black/10 hover:bg-emerald-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
