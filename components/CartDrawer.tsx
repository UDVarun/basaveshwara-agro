"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Trash2, 
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import CheckoutButton from "./CheckoutButton";

export default function CartDrawer() {
  const { state, removeItem, updateQuantity, closeCart, subtotal, totalQuantity } = useCart();
  const { items, isOpen } = state;

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-agro-ink/40 backdrop-blur-sm z-[9998] cursor-crosshair"
          />

          {/* Drawer - Architectural Portal Design */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-surface z-[9999] shadow-[-20px_0_60px_-10px_rgba(31,27,23,0.15)] flex flex-col"
          >
            {/* Header: Institutional Status */}
            <header className="py-8 px-10 flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-agro-green rounded-full animate-pulse" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-agro-ink">Active Manifest</h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 -mr-2 text-agro-muted hover:text-agro-ink transition-colors group"
                aria-label="Close manifest"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </header>

            {/* List: Tonal Items */}
            <div className="flex-1 overflow-y-auto px-10 py-6 space-y-1">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 opacity-40">
                      <ShoppingBag className="w-6 h-6 text-agro-muted" />
                    </div>
                    <p className="text-[14px] text-agro-muted font-headline font-medium opacity-60">No agricultural inputs in current manifest.</p>
                    <button 
                      onClick={closeCart}
                      className="mt-8 text-[11px] font-bold uppercase tracking-widest text-agro-green border-b border-agro-green/30 hover:border-agro-green transition-all"
                    >
                      Browse Repository
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group p-6 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-sm flex items-start gap-6 relative"
                    >
                      <div className="w-20 h-20 bg-surface-container-lowest shrink-0 overflow-hidden relative rounded-sm">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.imageAlt ?? item.title} 
                            className="w-full h-full object-cover mix-blend-multiply opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold uppercase text-agro-muted opacity-20">No Image</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-agro-ink line-clamp-1 flex-1 pr-4">{item.title}</h4>
                          <button 
                            onClick={() => removeItem(item.variantId)}
                            className="text-agro-muted hover:text-error transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[13px] font-headline font-semibold text-agro-green mb-4">
                          {formatPrice(item.price.toString(), item.currencyCode)}
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-surface-container-lowest rounded-sm overflow-hidden p-0.5">
                            <button 
                              onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                              className="p-1 px-2 text-agro-muted hover:text-agro-ink hover:bg-surface-container-low transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] font-bold w-8 text-center text-agro-ink">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.variantId, Math.min(99, item.quantity + 1))}
                              className="p-1 px-2 text-agro-muted hover:text-agro-ink hover:bg-surface-container-low transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer: Fiscal Channel */}
            {items.length > 0 && (
              <footer className="bg-surface-container-lowest p-10 space-y-8 shadow-[0_-20px_40px_rgba(31,27,23,0.03)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-agro-muted opacity-60">Logistics Total</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-agro-muted">Free Delivery</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-agro-muted opacity-60">Sub-Total Depot</span>
                    <span className="text-[13px] font-headline font-bold text-agro-ink tracking-tight">
                      {formatPrice(subtotal.toString(), items[0]?.currencyCode || "INR")}
                    </span>
                  </div>
                  
                  <div className="h-px bg-agro-outline-ghost/10 my-6" />
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted mb-1">Authenticated Total</h4>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-agro-gold">Tax Not Index</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-headline font-bold text-agro-ink tracking-tighter leading-none">
                        {formatPrice(subtotal.toString(), items[0]?.currencyCode || "INR")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <CheckoutButton className="h-20 text-[12px] uppercase tracking-[0.3em]" />
                  <div className="flex items-center justify-center gap-2 opacity-30">
                    <ShieldCheck className="w-3.5 h-3.5 text-agro-green" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Secured Institutional Node</span>
                  </div>
                </div>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
