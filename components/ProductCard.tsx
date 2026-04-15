"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ShopifyProduct } from "@/types/shopify";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, variants, availableForSale } =
    product;

  const { addItem, openCart } = useCart();

  const minPrice = priceRange.minVariantPrice;
  const firstVariant = variants.nodes[0];

  // Build a short, honest description from the product vendor + type
  const subtitle =
    [product.vendor, product.productType].filter(Boolean).join(" · ") ||
    "Agricultural input";

  function handleAddToCart() {
    if (!firstVariant || !availableForSale) return;

    // CR: multi-variant products go to PDP where user picks the right variant
    if (variants.nodes.length > 1) {
      window.location.href = `/products/${handle}`;
      return;
    }

    // CR: guard against malformed price amounts
    const priceNum = parseFloat(firstVariant.price.amount);
    if (!isFinite(priceNum)) return;

    addItem({
      variantId: firstVariant.id,
      title,
      price: Math.round(priceNum * 100), // store in paise
      currencyCode: firstVariant.price.currencyCode,
      imageUrl: featuredImage?.url ?? null,
      imageAlt: featuredImage?.altText ?? null,
      handle,
      quantity: 1,
    });

    openCart();
  }

  return (
    <motion.article
      // Anti-gravity hover: y: -8 on hover, scale feedback on tap — BOTH required (mobile + desktop)
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white"
      // Shadow grows on hover via CSS class — no gradient shadow
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Hover shadow via pseudo — handled with group-hover in globals */}
      <Link
        href={`/products/${handle}`}
        id={`product-card-${handle}`}
        aria-label={`View ${title}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2"
      >
        {/* Product image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.altText ?? `${title} product image`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm text-slate-500"
              aria-hidden="true"
            >
              No image
            </div>
          )}

          {/* Out-of-stock badge */}
          {!availableForSale && (
            <span className="absolute left-3 top-3 rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
              Out of Stock
            </span>
          )}
        </div>

        {/* Card content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Product name */}
          <h2 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">
            {title}
          </h2>

          {/* Subtitle: vendor · type */}
          <p className="mt-1 text-xs text-slate-700">{subtitle}</p>

          {/* Pack size / weight from first variant title */}
          {firstVariant?.title && firstVariant.title !== "Default Title" && (
            <p className="mt-1 text-xs text-slate-700">
              Pack:{" "}
              <span className="font-medium text-slate-900">
                {firstVariant.title}
              </span>
            </p>
          )}

          {/* Price */}
          <p className="mt-3 text-base font-bold text-[#166534]">
            {formatPrice(minPrice.amount, minPrice.currencyCode)}
            {variants.nodes.length > 1 && (
              <span className="ml-1 text-xs font-normal text-slate-700">
                onwards
              </span>
            )}
          </p>
        </div>
      </Link>

      {/* Quick-add CTA — always visible, min tap target */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!availableForSale}
          onClick={handleAddToCart}
          aria-label={
            availableForSale
              ? `Add ${title} to cart`
              : `${title} is out of stock`
          }
          id={`add-to-cart-${handle}`}
          className={[
            "flex min-h-[48px] w-full items-center justify-center rounded-md text-sm font-semibold transition-colors",
            availableForSale
              ? "bg-[#166534] text-white hover:bg-[#14532d]"
              : "cursor-not-allowed bg-slate-200 text-slate-500",
          ].join(" ")}
        >
          {availableForSale ? "Add to Cart" : "Out of Stock"}
        </motion.button>
      </div>
    </motion.article>
  );
}
