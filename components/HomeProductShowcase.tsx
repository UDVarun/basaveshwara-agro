"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { ShopifyProduct, ShopifyProductVariant } from "@/types/shopify";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface HomeProductShowcaseProps {
  product?: ShopifyProduct;
}

function variantLabel(variant: ShopifyProductVariant): string {
  if (variant.title && variant.title !== "Default Title") return variant.title;
  const option = variant.selectedOptions[0];
  return option ? option.value : "Pack";
}

function shortText(value: string | undefined, fallback: string): string {
  const text = value?.replace(/\s+/g, " ").trim() || fallback;
  return text.length > 165 ? `${text.slice(0, 162)}...` : text;
}

export default function HomeProductShowcase({
  product,
}: HomeProductShowcaseProps) {
  const { addItem, openCart } = useCart();
  const requireAuth = useAuthGuard();
  const variants = product?.variants.nodes ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  const isAvailable =
    Boolean(product?.availableForSale) &&
    Boolean(selectedVariant?.availableForSale);

  const description = shortText(
    product?.description,
    "Balanced organic nutrition for stronger roots, healthier soil, and steady crop growth through the season."
  );

  const productTitle = product?.title ?? "Premium Organic Fertilizer";
  const price = selectedVariant?.price ?? product?.priceRange.minVariantPrice;

  function decrement() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increment() {
    setQuantity((current) => Math.min(99, current + 1));
  }

  function handleAddToCart() {
    if (!requireAuth()) return;
    if (!product || !selectedVariant || !isAvailable) return;

    const priceNum = Number.parseFloat(selectedVariant.price.amount);
    if (!Number.isFinite(priceNum)) return;

    addItem({
      variantId: selectedVariant.id,
      title: product.title,
      price: Math.round(priceNum * 100),
      currencyCode: selectedVariant.price.currencyCode,
      imageUrl: product.featuredImage?.url ?? null,
      imageAlt: product.featuredImage?.altText ?? null,
      handle: product.handle,
      quantity,
    });

    openCart();
  }

  return (
    <section
      id="product"
      aria-labelledby="home-product-heading"
      className="bg-agro-bg px-4 py-32 lg:py-48 sm:px-6 lg:px-8 font-sans overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-start">
          
          {/* Detailed Image Block - Tonal Surface */}
          <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-agro-surface-low p-8 border border-agro-outline-ghost/30 shadow-2xl shadow-black/5">
             <div className="relative w-full h-full overflow-hidden rounded-[0.25rem]">
              <Image
                src={product?.featuredImage?.url || "/agro-ui/product-compost.webp"}
                alt={product?.featuredImage?.altText || "Product visualization"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover contrast-[1.05] grayscale-[0.1]"
              />
            </div>
            <div className="absolute bottom-12 right-12 z-10 bg-white/90 backdrop-blur-md px-6 py-4 border border-agro-outline-ghost/20 shadow-xl">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted">Registry ID</p>
               <p className="text-xs font-bold text-agro-green">#SBK-2024-PRM</p>
            </div>
          </div>

          {/* Editorial Content Block */}
          <div className="lg:col-span-6 sticky top-32">
            <span className="text-[10px] font-bold tracking-[0.4em] text-agro-gold uppercase mb-8 block">
              Section 04 / Product Detail
            </span>
            <h2
              id="home-product-heading"
              className="text-6xl font-bold leading-[0.85] text-agro-green sm:text-8xl font-serif tracking-tight"
            >
              {productTitle.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h2>

            <div className="mt-12 flex items-baseline gap-6 border-b border-agro-outline-ghost/20 pb-10">
              <p className="text-5xl font-bold text-agro-green font-serif tracking-tighter">
                {price
                  ? formatPrice(price.amount, price.currencyCode)
                  : "Visit store for price"}
              </p>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted opacity-60">Verified Rate</span>
                <span className="text-xs font-bold text-agro-gold">Market Authenticated</span>
              </div>
            </div>

            <p className="mt-10 text-xl font-medium leading-[1.625] text-agro-muted max-w-xl">
              {description}
            </p>

            {/* Variant Select - Structural Command */}
            {variants.length > 1 ? (
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-green">Configuration</span>
                  <div className="h-[1px] flex-1 bg-agro-outline-ghost/30" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.slice(0, 4).map((variant) => {
                    const selected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={[
                          "min-h-[56px] px-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border",
                          selected
                            ? "bg-agro-green text-white border-agro-green shadow-lg shadow-agro-green/20"
                            : "bg-agro-surface-low text-agro-muted border-agro-outline-ghost/50 hover:border-agro-green hover:text-agro-green",
                        ].join(" ")}
                      >
                        {variantLabel(variant)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Controls Row - Grid Command */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Quantity */}
              <div
                role="group"
                aria-label={`Quantity for ${product?.title}`}
                className="sm:col-span-4 flex h-[72px] items-center bg-agro-surface-low border border-agro-outline-ghost/50 text-agro-green"
              >
                <button
                  type="button"
                  onClick={decrement}
                  className="flex flex-1 h-full items-center justify-center text-xl transition-colors hover:bg-agro-outline-ghost/10"
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="w-12 text-center text-sm font-bold font-serif">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="flex flex-1 h-full items-center justify-center text-xl transition-colors hover:bg-agro-outline-ghost/10"
                  aria-label="Increase quantity"
                >
                  &#43;
                </button>
              </div>

              {/* Action */}
              <div className="sm:col-span-8">
                {product ? (
                  <button
                    id="home-product-add-to-cart"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={[
                      "w-full h-[72px] flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all",
                      isAvailable
                        ? "bg-agro-green text-white hover:bg-agro-ink active:scale-[0.98] shadow-2xl shadow-agro-green/10"
                        : "cursor-not-allowed bg-agro-surface-low text-agro-muted border border-agro-outline-ghost/50",
                    ].join(" ")}
                  >
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    {isAvailable ? "Provision to Cart" : "Provision Exhausted"}
                  </button>
                ) : (
                  <Link
                    href="/products"
                    className="w-full h-[72px] flex items-center justify-center bg-agro-green text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-agro-ink group"
                  >
                    Access Inventory
                    <ArrowRight className="h-4 w-4 ml-4 transition-transform group-hover:translate-x-2" />
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-agro-outline-ghost/20 flex items-center gap-6">
               <div className="w-8 h-8 rounded-full border border-agro-green/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-agro-green animate-pulse" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted">
                 Direct from manufacturer &bull; Quality check verified
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
