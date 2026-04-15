"use client";

import { motion } from "framer-motion";

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
  available: boolean;
}

export default function AddToCartButton({
  variantId: _variantId,
  productTitle,
  available,
}: AddToCartButtonProps) {
  // Cart integration wired in Step 6 (CartContext)
  // For now: renders the correct button with all required accessibility + animation

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={!available}
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
