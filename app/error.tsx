"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        We are updating our store.
      </h1>
      <p className="mt-3 text-base text-slate-700">
        Please check back in a few minutes.
      </p>
      <button
        id="error-retry-button"
        onClick={reset}
        className="mt-6 min-h-[48px] min-w-[48px] rounded-md bg-[#166534] px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}
