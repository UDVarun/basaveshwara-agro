"use client";

import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { motion } from "framer-motion";

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
  available: boolean;
  priceInPaise: number;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
  handle: string;
}

export default function AddToCartButton({
  variantId,
  productTitle,
  available,
  priceInPaise,
  currencyCode,
  imageUrl,
  imageAlt,
  handle,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const requireAuth = useAuthGuard();

  function handleAddToCart() {
    if (!requireAuth()) return;
    const item: Omit<CartItem, "quantity"> & { quantity: number } = {
      variantId,
      title: productTitle,
      price: priceInPaise,
      currencyCode,
      quantity: 1,
      imageUrl,
      imageAlt,
      handle,
    };

    addItem(item);
    openCart();
  }

  return (
    <motion.button
      whileHover={available ? { scale: 1.01 } : {}}
      whileTap={available ? { scale: 0.99 } : {}}
      type="button"
      disabled={!available}
      onClick={handleAddToCart}
      id="product-add-to-cart"
      aria-label={
        available
          ? `Add ${productTitle} to cart`
          : `${productTitle} is out of stock`
      }
      className={[
        "group relative flex h-[64px] w-full items-center justify-center gap-3 overflow-hidden text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
        available
          ? "bg-agro-green text-white hover:bg-agro-ink shadow-lg shadow-agro-green/5"
          : "cursor-not-allowed bg-agro-ink/10 text-agro-muted",
      ].join(" ")}
    >
      {/* Subtle Shine Effect */}
      {available && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      )}

      <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
      <span>{available ? "Provision to Cart" : "Out of Stock"}</span>
      {available && (
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
      )}
    </motion.button>
  );
}
