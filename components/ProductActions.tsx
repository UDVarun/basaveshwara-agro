"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ShopifyProductVariant } from "@/types/shopify";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { 
  CheckCircle2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Zap, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

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
  const requireAuth = useAuthGuard();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);

  if (!selectedVariant) return null;

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (!requireAuth()) return;
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
    if (!requireAuth()) return;
    handleAddToCart();
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-editorial border border-outline-variant/15 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2.5">
          {selectedVariant.availableForSale ? (
            <div className="flex items-center gap-2 text-agro-green bg-agro-green/5 px-3 py-1 rounded-full border border-agro-green/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Harvest Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-agro-muted bg-agro-muted/5 px-3 py-1 rounded-full border border-agro-muted/10">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Provision Exhausted</span>
            </div>
          )}
        </div>
        <div className="text-[10px] font-bold text-agro-muted tracking-[0.1em] opacity-40 uppercase">Registry: {sku || `AG-${handle.slice(0, 5).toUpperCase()}`}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Quantity */}
        <div className="flex items-center border border-agro-outline-ghost/30 rounded-xl h-14 w-full sm:w-36 bg-agro-surface-low overflow-hidden transition-all focus-within:border-agro-green focus-within:ring-1 focus-within:ring-agro-green/20">
          <button
            onClick={() => handleQuantityChange("dec")}
            aria-label="Decrease quantity"
            className="w-12 text-agro-muted hover:text-agro-green h-full flex items-center justify-center transition-colors hover:bg-agro-green/5"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            readOnly
            aria-label="Quantity"
            className="w-full h-full text-center border-none bg-transparent font-headline font-semibold text-agro-ink focus:ring-0 text-sm"
            type="text"
            value={quantity}
          />
          <button
            onClick={() => handleQuantityChange("inc")}
            aria-label="Increase quantity"
            className="w-12 text-agro-muted hover:text-agro-green h-full flex items-center justify-center transition-colors hover:bg-agro-green/5"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Configuration Select */}
        <div className="flex-grow">
          <div className="relative group">
            <select
              value={selectedVariant.id}
              onChange={(e) => {
                const variant = variants.find(v => v.id === e.target.value);
                if (variant) setSelectedVariant(variant);
              }}
              className="w-full h-14 border border-agro-outline-ghost/30 rounded-xl bg-agro-surface-low text-agro-ink px-4 focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 font-body outline-none transition-all appearance-none cursor-pointer"
            >
              {variants.map(v => (
                <option key={v.id} value={v.id}>
                  {v.title === "Default Title" ? "Institutional Grade Pack" : v.title}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <Minus className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleAddToCart}
          disabled={!selectedVariant.availableForSale}
          className="group relative h-14 w-full flex items-center justify-center gap-3 bg-agro-green text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-agro-ink transition-all shadow-xl shadow-agro-green/10 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          
          <ShoppingBag className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>Provision to Cart</span>
        </motion.button>
        
        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant.availableForSale}
          className="h-14 w-full flex items-center justify-center gap-3 bg-white border border-agro-outline-ghost/50 text-agro-muted rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-agro-surface-low hover:text-agro-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Acquire Immediately</span>
        </button>
      </div>
    </div>
  );
}
