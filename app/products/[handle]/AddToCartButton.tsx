"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";

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
    <button
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
        "flex h-[64px] w-full items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
        available
          ? "bg-agro-green text-white hover:bg-agro-ink"
          : "cursor-not-allowed bg-agro-ink/10 text-agro-muted",
      ].join(" ")}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {available ? "Provision to Cart" : "Out of Stock"}
    </button>
  );
}
