"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-stone-950">
        We are updating our store.
      </h1>
      <p className="mt-3 text-base text-stone-600">
        Please check back in a few minutes.
      </p>
      <button
        type="button"
        id="error-retry-button"
        onClick={reset}
        className="mt-6 min-h-12 rounded-lg bg-emerald-900 px-6 text-sm font-bold text-white shadow-xl shadow-black/10 hover:bg-emerald-800"
      >
        Try again
      </button>
    </main>
  );
}
