"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CheckoutButton from "@/components/CheckoutButton";
import { formatPaisePrice } from "@/lib/format";

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
    if (quantity < 99) updateQuantity(variantId, quantity + 1);
  }

  return (
    <div
      role="group"
      aria-label={`Quantity for ${title}`}
      className="inline-flex items-center bg-agro-bg"
    >
      <button
        id={`qty-dec-${variantId}`}
        type="button"
        onClick={decrement}
        aria-label={
          quantity <= 1 ? `Remove ${title}` : `Decrease quantity of ${title}`
        }
        className="flex h-10 w-10 items-center justify-center text-agro-ink border border-agro-ink/10 transition-all hover:bg-agro-ink hover:text-white"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        className="min-w-[48px] text-center text-[13px] font-bold text-agro-ink border-y border-agro-ink/10 h-10 flex items-center justify-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <button
        id={`qty-inc-${variantId}`}
        type="button"
        onClick={increment}
        disabled={quantity >= 99}
        aria-label={`Increase quantity of ${title}`}
        className="flex h-10 w-10 items-center justify-center text-agro-ink border border-agro-ink/10 transition-all hover:bg-agro-ink hover:text-white disabled:opacity-20 disabled:grayscale"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { state, closeCart, subtotal, totalQuantity, removeItem } = useCart();
  const { isOpen, items } = state;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
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
      {isOpen ? (
        <>
          <motion.div
            id="cart-drawer-overlay"
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-stone-950/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />

          <motion.aside
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[60] flex w-full flex-col bg-agro-bg border-l border-agro-ink/10 sm:w-[500px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
          >
            <div className="flex items-center justify-between border-b border-agro-ink/10 bg-white px-8 py-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-agro-gold mb-1">
                  The Provisioning
                </p>
                <h2 className="text-3xl font-bold font-serif text-agro-green tracking-tight">Cart</h2>
              </div>
              <button
                id="cart-drawer-close"
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-12 w-12 items-center justify-center border border-agro-ink/10 text-agro-ink transition-all hover:bg-agro-ink hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-1 px-12 bg-agro-ink/10 w-full mb-12" />
                  <p className="text-2xl font-bold font-serif text-agro-green tracking-tight">
                    Your Index is empty.
                  </p>
                  <p className="mt-4 max-w-[240px] text-xs font-bold uppercase tracking-[0.2em] leading-relaxed text-agro-muted">
                    Add resources to prepare your seasonal order.
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    id="cart-browse-products"
                    className="mt-12 inline-flex h-[64px] items-center px-12 bg-agro-green text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-agro-ink"
                  >
                    Browse Collections &rarr;
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6" aria-label="Items in your cart">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="group border border-agro-ink/10 bg-white transition-all hover:border-agro-green/30"
                    >
                      <div className="flex bg-agro-ink/5">
                        <div className="relative h-[120px] w-[120px] flex-none overflow-hidden bg-white border-r border-agro-ink/10">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.imageAlt ?? `${item.title} product image`}
                              fill
                              sizes="120px"
                              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[9px] font-bold uppercase tracking-widest text-agro-muted opacity-40">
                              No Visual
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center p-6">
                          <Link
                            href={`/products/${item.handle}`}
                            onClick={closeCart}
                            className="text-sm font-bold font-serif leading-tight text-agro-green hover:text-agro-ink transition-colors"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-2 text-lg font-bold font-serif text-agro-ink">
                            {formatPaisePrice(
                              item.price * item.quantity,
                              item.currencyCode
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-6 py-4 border-t border-agro-ink/10">
                        <QuantityStepper
                          variantId={item.variantId}
                          quantity={item.quantity}
                          title={item.title}
                        />
                        <button 
                          onClick={() => removeItem(item.variantId)}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 hover:text-red-900 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 ? (
              <div className="border-t border-agro-ink/10 bg-white px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted mb-1">Authenticated Total</h4>
                    <span className="text-3xl font-bold font-serif text-agro-green">
                      {formatPaisePrice(subtotal, items[0]?.currencyCode ?? "INR")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-agro-gold">Tax Not Index</p>
                  </div>
                </div>
                <div className="mt-4">
                  <CheckoutButton />
                </div>
                <p className="mt-6 text-[10px] font-medium leading-relaxed text-agro-muted opacity-60 text-center uppercase tracking-widest">
                  Secure checkout hosted by Shopify Partners.
                </p>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
