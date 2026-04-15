"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
  available: boolean;
  // Price in paise (passed from server component — convert amount * 100)
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

  function handleAddToCart() {
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
      whileTap={{ scale: 0.97 }}
      disabled={!available}
      onClick={handleAddToCart}
      id="product-add-to-cart"
      aria-label={
        available
          ? `Add ${productTitle} to cart`
          : `${productTitle} is out of stock`
      }
      className={[
        "flex min-h-[48px] w-full items-center justify-center rounded-md text-base font-semibold transition-colors",
        available
          ? "bg-[#166534] text-white hover:bg-[#14532d]"
          : "cursor-not-allowed bg-slate-200 text-slate-500",
      ].join(" ")}
    >
      {available ? "Add to Cart" : "Out of Stock"}
    </motion.button>
  );
}
