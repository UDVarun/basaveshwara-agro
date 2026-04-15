"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CheckoutButton from "@/components/CheckoutButton";
import { formatPaisePrice } from "@/lib/format";

// formatPaisePrice imported from @/lib/format

// ─── Quantity stepper ─────────────────────────────────────────────────────────

function QuantityStepper({
  variantId,
  quantity,
  title,
}: {
  variantId: string;
  quantity: number;
  title: string;
}) {
  const { updateQuantity, removeItem } = useCart();

  function decrement() {
    if (quantity <= 1) {
      removeItem(variantId);
    } else {
      updateQuantity(variantId, quantity - 1);
    }
  }

  function increment() {
    // max 99 — validated in reducer too
    if (quantity < 99) updateQuantity(variantId, quantity + 1);
  }

  return (
    <div
      role="group"
      aria-label={`Quantity for ${title}`}
      className="flex items-center gap-1"
    >
      <button
        id={`qty-dec-${variantId}`}
        onClick={decrement}
        aria-label={quantity <= 1 ? `Remove ${title}` : `Decrease quantity of ${title}`}
        className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md border border-slate-300 text-lg font-bold text-slate-700 hover:border-[#166534] hover:text-[#166534]"
      >
        {quantity <= 1 ? "×" : "−"}
      </button>

      <span
        className="min-w-[2.5rem] text-center text-sm font-semibold text-slate-900"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        id={`qty-inc-${variantId}`}
        onClick={increment}
        disabled={quantity >= 99}
        aria-label={`Increase quantity of ${title}`}
        className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md border border-slate-300 text-lg font-bold text-slate-700 hover:border-[#166534] hover:text-[#166534] disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

// ─── CartDrawer ───────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { state, closeCart, subtotal, totalQuantity } = useCart();
  const { isOpen, items } = state;

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    },
    [closeCart]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — flat bg-black/40, zero backdrop-blur */}
          <motion.div
            id="cart-drawer-overlay"
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />

          {/* Drawer — slides in from right: x: "100%" → 0 */}
          <motion.aside
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[#F8FAFC] shadow-xl md:w-[400px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                Cart
                {totalQuantity > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-700">
                    ({totalQuantity} item{totalQuantity !== 1 ? "s" : ""})
                  </span>
                )}
              </h2>
              <button
                id="cart-drawer-close"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md text-slate-700 hover:text-slate-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-base text-slate-700">Your cart is empty.</p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    id="cart-browse-products"
                    className="flex min-h-[48px] items-center rounded-md bg-[#166534] px-6 text-sm font-semibold text-white"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4" aria-label="Items in your cart">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      {/* Product image */}
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md bg-slate-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.imageAlt ?? `${item.title} product image`}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-slate-900 hover:text-[#166534]"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm font-bold text-[#166534]">
                           {formatPaisePrice(item.price * item.quantity, item.currencyCode)}
                        </p>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex-none self-center">
                        <QuantityStepper
                          variantId={item.variantId}
                          quantity={item.quantity}
                          title={item.title}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {items.length > 0 && (
              <div className="border-t border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Subtotal</span>
                  <span className="text-base font-bold text-slate-900">
                    {formatPaisePrice(subtotal, items[0]?.currencyCode ?? "INR")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-700">
                  Taxes and delivery calculated at checkout.
                </p>

                <CheckoutButton />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
