"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import type { ShopifyProduct } from "@/types/shopify";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, variants, availableForSale, vendor, description } = product;
  const { addItem, openCart } = useCart();
  const requireAuth = useAuthGuard();
  
  const minPrice = priceRange.minVariantPrice;
  const firstVariant = variants.nodes[0];
  const priceValue = parseFloat(minPrice.amount);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth()) return;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="group bg-surface-container-lowest overflow-hidden hover:scale-[1.01] transition-all duration-500 relative shadow-none hover:shadow-[0_12px_30px_-10px_rgba(31,27,23,0.07)] flex flex-col h-full border border-outline-variant/10 rounded-lg"
    >
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
        
        {!availableForSale && (
          <div className="absolute top-3 right-3 bg-agro-ink/80 backdrop-blur-sm text-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content Area - 16px padding */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-surface-container-lowest relative z-10 pointer-events-none">
        <div className="mb-3">
          <p className="text-[9px] font-bold text-agro-muted tracking-wider uppercase mb-1 font-body opacity-70">
            {vendor}
          </p>
          <h3 className="font-headline text-base font-semibold text-agro-ink mb-1 leading-tight group-hover:text-agro-green transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-agro-muted font-body line-clamp-2 leading-relaxed opacity-60">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/5 pointer-events-auto">
          <span className="font-headline font-semibold text-base text-agro-green tracking-tighter">
            {formatPrice(minPrice.amount, minPrice.currencyCode)}
          </span>
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={!availableForSale}
            aria-label="Add to cart"
            className="flex items-center justify-center text-agro-green hover:bg-agro-green/5 rounded-full w-8 h-8 transition-all disabled:opacity-30 relative z-20 hover:scale-110 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
  );
}
