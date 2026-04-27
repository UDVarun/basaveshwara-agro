"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPricePaise } from "@/lib/format";
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  Package,
  ShieldCheck,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal } = useCart();
  const items = state.items;

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8"
        >
           <div className="absolute inset-0 bg-agro-green/10 rounded-full blur-3xl" />
           <ShoppingBag className="w-16 h-16 text-agro-muted relative z-10" />
        </motion.div>
        <h1 className="text-4xl font-headline font-semibold text-agro-ink mb-4">Provision Vault Empty</h1>
        <p className="text-agro-muted mb-10 text-center max-w-md italic">
          Your curation is currently empty. Explore our seasonal harvests to begin your acquisition.
        </p>
        <Link 
          href="/products" 
          className="bg-agro-green text-white font-bold text-[11px] uppercase tracking-[0.3em] px-10 py-5 rounded-xl hover:bg-agro-ink transition-all shadow-xl shadow-agro-green/10 flex items-center gap-4"
        >
          Access Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <div className="flex items-center gap-4 mb-16 px-2">
        <h1 className="text-5xl md:text-7xl font-headline font-semibold tracking-tighter text-agro-ink">My Curation</h1>
        <div className="h-0.5 flex-1 bg-agro-outline-ghost/10 mt-4" />
        <span className="text-[10px] font-bold text-agro-muted uppercase tracking-[0.2em] mt-4">{items.length} Units</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-12">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.variantId} 
                className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-agro-outline-ghost/10 group relative"
              >
                {/* Image */}
                <div className="w-full sm:w-48 aspect-square bg-agro-surface-low rounded-2xl overflow-hidden border border-agro-outline-ghost/20 relative">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.imageAlt || item.title} 
                      fill 
                      className="object-cover transition-transform group-hover:scale-105 duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-agro-muted/30">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Data */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-headline font-semibold text-agro-ink group-hover:text-agro-green transition-colors">{item.title}</h2>
                      <button 
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-agro-muted hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-agro-muted mb-6 italic">Batch Verified &bull; Single Source</p>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-agro-outline-ghost/30 rounded-xl h-12 bg-agro-surface-low overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        className="w-10 flex items-center justify-center text-agro-muted hover:bg-agro-green/5 hover:text-agro-green h-full transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-headline font-bold text-agro-ink text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.variantId, Math.min(99, item.quantity + 1))}
                        className="w-10 flex items-center justify-center text-agro-muted hover:bg-agro-green/5 hover:text-agro-green h-full transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-2xl font-headline font-bold text-agro-ink">{formatPricePaise(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link href="/products" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted hover:text-agro-green transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Browsing
          </Link>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-agro-surface-low/50 border border-agro-outline-ghost/30 rounded-3xl p-8 shadow-editorial">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-agro-muted mb-8 pb-4 border-b border-agro-outline-ghost/10">Summary of Provision</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-agro-muted font-medium">Subtotal</span>
                <span className="text-agro-ink font-bold">{formatPricePaise(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-agro-muted font-medium">Logistics Estimate</span>
                <span className="text-agro-green font-bold italic">Calculated at Checkout</span>
              </div>
            </div>

            <div className="pt-6 mb-8 border-t-2 border-agro-ink/5 flex justify-between items-end">
              <span className="text-sm font-headline font-bold text-agro-ink uppercase tracking-tight">Vault Total</span>
              <span className="text-3xl font-headline font-bold text-agro-green tracking-tighter">{formatPricePaise(subtotal)}</span>
            </div>

            <Link 
              href="/checkout"
              className="group relative w-full h-14 bg-agro-green text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-agro-ink transition-all shadow-xl shadow-agro-green/10 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span>Secure Acquisition</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>

            {/* Reassurance */}
            <div className="mt-8 space-y-4 pt-8 border-t border-agro-outline-ghost/10">
               <div className="flex items-center gap-3 text-agro-muted">
                  <ShieldCheck className="w-4 h-4 text-agro-green" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Heritage Guarantee</span>
               </div>
               <div className="flex items-center gap-3 text-agro-muted">
                  <Truck className="w-4 h-4 text-agro-green" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Temperature Controlled</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
