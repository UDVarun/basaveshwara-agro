// ─── Price formatter ──────────────────────────────────────────────────────────
// Single source of truth — imported by ProductCard, product detail page, CartDrawer.
// Uses a fixed locale string ("en-IN") to ensure SSR/CSR parity (no hydration mismatch).

export function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `${currencyCode} —`;
  if (currencyCode === "INR") {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return `${currencyCode} ${num.toFixed(2)}`;
}

// ─── Paise → display price ────────────────────────────────────────────────────
// Cart stores prices in paise (smallest denomination) to avoid float errors.
// e.g. 26800 paise → ₹268

export function formatPaisePrice(paise: number, currencyCode: string): string {
  return formatPrice((paise / 100).toFixed(2), currencyCode);
}
