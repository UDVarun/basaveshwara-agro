"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ShopifyProductVariant } from "@/types/shopify";

interface ProductActionsProps {
  variants: ShopifyProductVariant[];
  productTitle: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  sku?: string;
}

export default function ProductActions({
  variants,
  productTitle,
  handle,
  featuredImage,
  sku
}: ProductActionsProps) {
  const { addItem, openCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);

  if (!selectedVariant) return null;

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      title: productTitle,
      price: Math.round(parseFloat(selectedVariant.price.amount) * 100),
      currencyCode: selectedVariant.price.currencyCode,
      quantity: quantity,
      imageUrl: featuredImage?.url ?? null,
      imageAlt: featuredImage?.altText ?? null,
      handle: handle,
    });
    openCart();
  };

  const handleBuyNow = () => {
    // In a real implementation, this would redirect directly to checkout
    handleAddToCart();
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-editorial border border-outline-variant/15 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-primary font-medium">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{selectedVariant.availableForSale ? "In Stock (Ships in 24hrs)" : "Currently Unavailable"}</span>
        </div>
        <div className="text-sm text-on-surface-variant font-label">SKU: {sku || `AG-${handle.slice(0, 5).toUpperCase()}`}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Quantity */}
        <div className="flex items-center border border-outline-variant rounded-xl h-12 w-32 bg-surface overflow-hidden">
          <button
            onClick={() => handleQuantityChange("dec")}
            aria-label="Decrease quantity"
            className="px-3 text-on-surface-variant hover:text-primary h-full flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <input
            readOnly
            aria-label="Quantity"
            className="w-full h-full text-center border-none bg-transparent font-medium focus:ring-0 text-on-surface"
            type="text"
            value={quantity}
          />
          <button
            onClick={() => handleQuantityChange("inc")}
            aria-label="Increase quantity"
            className="px-3 text-on-surface-variant hover:text-primary h-full flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        {/* Pack Size / Variant Select */}
        <div className="flex-grow">
          <select
            value={selectedVariant.id}
            onChange={(e) => {
              const variant = variants.find(v => v.id === e.target.value);
              if (variant) setSelectedVariant(variant);
            }}
            className="w-full h-12 border border-outline-variant rounded-xl bg-surface text-on-surface px-4 focus:border-primary focus:ring-1 focus:ring-primary font-body outline-none transition-all"
          >
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.title === "Default Title" ? "Standard Pack" : v.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant.availableForSale}
          className="flex-1 bg-surface border-2 border-primary text-primary h-14 rounded-2xl font-semibold font-label hover:bg-surface-container-low transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span>Add to Cart</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant.availableForSale}
          className="flex-1 bg-primary text-on-primary h-14 rounded-2xl font-semibold font-label hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
