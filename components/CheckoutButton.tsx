"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CLIENT_CHECKOUT_ERROR =
  "Checkout is temporarily unavailable. Please try again.";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const { state, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    // Build line items from cart — validate quantity before sending
    const lineItems = state.items
      .filter((item) => item.quantity >= 1 && item.quantity <= 99)
      .map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

    if (lineItems.length === 0) {
      setError(CLIENT_CHECKOUT_ERROR);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });

      if (!res.ok) {
        // 429 rate limit
        if (res.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError(CLIENT_CHECKOUT_ERROR);
        }
        setLoading(false);
        return;
      }

      const data = (await res.json()) as { checkoutUrl?: string };

      if (!data.checkoutUrl) {
        setError(CLIENT_CHECKOUT_ERROR);
        setLoading(false);
        return;
      }

      // Clear cart state then redirect to Shopify hosted checkout
      clearCart();
      window.location.href = data.checkoutUrl;
      // Don't reset loading — page is navigating away
    } catch {
      // Network error — never expose internals to client
      setError(CLIENT_CHECKOUT_ERROR);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-center text-xs font-semibold text-red-600"
        >
          {error}
        </p>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCheckout}
        disabled={loading || state.items.length === 0}
        id="cart-checkout-button"
        aria-label="Proceed to checkout"
        aria-busy={loading}
        className={[
          "flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors",
          loading || state.items.length === 0
            ? "cursor-not-allowed bg-slate-300 text-slate-500"
            : "bg-[#166534] text-white hover:bg-[#14532d]",
          className ?? "",
        ].join(" ")}
      >
        {loading ? (
          <>
            {/* Loading spinner */}
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Processing…
          </>
        ) : (
          "Proceed to Checkout"
        )}
      </motion.button>
    </div>
  );
}
