"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { ShopifyProduct } from "@/types/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, variants, availableForSale, vendor, description } = product;
  const { addItem, openCart } = useCart();
  
  const minPrice = priceRange.minVariantPrice;
  const firstVariant = variants.nodes[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant || !availableForSale) return;

    addItem({
      variantId: firstVariant.id,
      title,
      price: Math.round(Number.parseFloat(firstVariant.price.amount) * 100),
      currencyCode: firstVariant.price.currencyCode,
      imageUrl: featuredImage?.url ?? null,
      imageAlt: featuredImage?.altText ?? null,
      handle,
      quantity: 1,
    });

    openCart();
  }

  return (
    <div className="group bg-surface-container-lowest overflow-hidden hover:scale-[1.01] transition-all duration-500 relative shadow-none hover:shadow-[0_12px_30px_-10px_rgba(31,27,23,0.07)] flex flex-col h-full border border-outline-variant/10 rounded-lg">
      {/* Clickable Overlay Link */}
      <Link 
        href={`/products/${handle}`} 
        className="absolute inset-0 z-0" 
        aria-label={`View details for ${title}`}
      />

      {/* Image Container - Even smaller h-42 for ultra-sleek look */}
      <div className="h-42 bg-surface-container-low relative overflow-hidden rounded-t-lg pointer-events-none">
        {featuredImage ? (
          <Image 
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover mix-blend-multiply opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline/30 uppercase text-[8px] font-bold tracking-widest bg-surface-container-high">
            Draft Vis
          </div>
        )}
      </div>

      {/* Content Area - 16px padding */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-surface-container-lowest relative z-10 pointer-events-none">
        <div className="mb-3">
          <p className="text-[9px] font-bold text-outline tracking-wider uppercase mb-1 font-body opacity-70">
            {vendor}
          </p>
          <h3 className="font-headline text-base font-semibold text-on-surface mb-1 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-on-surface-variant font-body line-clamp-2 leading-relaxed opacity-60">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/5 pointer-events-auto">
          <span className="font-headline font-semibold text-base text-primary tracking-tighter">
            {formatPrice(minPrice.amount, minPrice.currencyCode)}
          </span>
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={!availableForSale}
            aria-label="Add to cart"
            className="text-primary hover:text-primary-container transition-all p-1.5 disabled:opacity-30 relative z-20 hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="add_shopping_cart">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
