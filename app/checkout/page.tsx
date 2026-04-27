"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { 
  ShieldCheck, 
  ChevronLeft, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Truck, 
  MapPin, 
  ChevronRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { state, subtotal } = useCart();
  const { items, isHydrated } = state;

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const total = subtotal;

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const checkoutItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Checkout is temporarily unavailable. Please try again.");
      }

      const { checkoutUrl } = await res.json();
      
      if (!checkoutUrl) {
        throw new Error("Invalid response from checkout gateway.");
      }

      // Final redirect to Shopify
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Checkout process error:", err);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.name === 'AbortError') {
        errorMessage = "Operation timed out. Your connection might be unstable.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsPlacingOrder(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-agro-green opacity-20" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-agro-muted opacity-40" />
          </div>
          <h1 className="text-3xl font-headline font-semibold text-agro-ink mb-3 tracking-tight">Empty Manifest</h1>
          <p className="text-agro-muted mb-8 font-body leading-relaxed">You haven't selected any agricultural inputs for procurement yet.</p>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-agro-ink transition-colors rounded-sm"
          >
            Browse Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-agro-ink font-body selection:bg-primary/10">
      {/* Header */}
      <header className="bg-surface-container-lowest py-8 px-6 lg:px-12 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-4 group">
          <ChevronLeft className="w-4 h-4 text-agro-muted group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted">Abort Procurement</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-agro-green" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-green">Secure Channel Active</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Column: Form Tiers */}
        <div className="lg:col-span-7 p-6 lg:p-12 lg:pr-24 space-y-20 border-r border-outline-variant/10">
          
          <section>
            <div className="mb-12">
              <span className="text-[10px] font-bold text-primary tracking-[0.4em] uppercase block mb-4">Protocol 01</span>
              <h1 className="text-5xl lg:text-7xl font-headline font-semibold tracking-tighter leading-[0.9] text-agro-ink">
                Secure Procurement<br/>& Order Finalization.
              </h1>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10 p-5 bg-error_container text-agro-ink rounded-sm flex items-start gap-4 border-l-4 border-error"
              >
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1">Authorization Error</p>
                  <p className="text-[13px] opacity-80 leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-12">
              {/* Email Section */}
              <div className="space-y-6">
                <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted">
                  <span className="w-6 h-px bg-agro-outline-ghost/30" />
                  Point of Contact
                </label>
                <div className="relative group">
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="official.email@agrarian.com"
                    className="w-full bg-surface-container-high px-6 py-6 text-lg font-headline font-medium tracking-tight placeholder:text-agro-muted/30 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all rounded-sm"
                  />
                  <p className="mt-3 text-[10px] text-agro-muted/50 font-medium">Manifest updates will be sent to this channel.</p>
                </div>
              </div>

              {/* Logistics Section */}
              <div className="space-y-8 pt-12 border-t border-outline-variant/10">
                <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted">
                  <span className="w-6 h-px bg-agro-outline-ghost/30" />
                  Logistics & Destination
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                    onClick={() => setShippingMethod("standard")}
                    className={`flex flex-col items-start p-6 rounded-sm transition-all text-left ${shippingMethod === "standard" ? "bg-surface-container-high ring-1 ring-primary/20" : "bg-surface-container-low hover:bg-surface-container-high"}`}
                   >
                     <Truck className={`w-5 h-5 mb-4 ${shippingMethod === "standard" ? "text-primary" : "text-agro-muted opacity-30"}`} />
                     <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-agro-ink">Field Delivery</p>
                     <p className="text-[13px] text-agro-muted opacity-60">Standard institutional logistics (5-7 days).</p>
                   </button>

                   <button 
                    onClick={() => setShippingMethod("express")}
                    className={`flex flex-col items-start p-6 rounded-sm transition-all text-left ${shippingMethod === "express" ? "bg-surface-container-high ring-1 ring-primary/20" : "bg-surface-container-low hover:bg-surface-container-high"}`}
                   >
                     <MapPin className={`w-5 h-5 mb-4 ${shippingMethod === "express" ? "text-primary" : "text-agro-muted opacity-30"}`} />
                     <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-agro-ink">Priority Deployment</p>
                     <p className="text-[13px] text-agro-muted opacity-60">Accelerated land transit (2-3 days).</p>
                   </button>
                </div>
              </div>

              {/* Payment Protocol */}
              <div className="space-y-8 pt-12 border-t border-outline-variant/10">
                <label className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted">
                  <span className="w-6 h-px bg-agro-outline-ghost/30" />
                  Financial Protocol
                </label>

                <div className="space-y-3">
                  {[
                    { id: "upi", label: "Field Liquidity (UPI)", desc: "Instant digital settlement via mobile portal.", icon: Smartphone },
                    { id: "card", label: "Fiscal Card (Credit/Debit)", desc: "Formal bank authorization via encrypted gateway.", icon: CreditCard },
                    { id: "cod", label: "Physical Settlement (COD)", desc: "Authorized cash tender upon physical delivery.", icon: Truck },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-sm transition-all group ${paymentMethod === method.id ? "bg-surface-container-high ring-1 ring-primary/20" : "bg-surface-container-low hover:bg-surface-container-high"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 ${paymentMethod === method.id ? "text-primary" : "text-agro-muted opacity-30"}`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-agro-ink">{method.label}</p>
                          <p className="text-[12px] text-agro-muted opacity-60 leading-relaxed">{method.desc}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.id ? "border-primary" : "border-outline-variant opacity-30"}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Ledger Summary */}
        <aside className="lg:col-span-5 bg-surface-container-low p-6 lg:p-12 self-start sticky top-0 h-auto lg:h-screen flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] font-bold text-agro-muted tracking-[0.4em] uppercase">Manifest Ledger</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">[{items.length}] Units</span>
            </div>

            <div className="space-y-8 mb-16 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-6 group">
                  <div className="w-20 h-20 bg-surface-container-lowest shrink-0 relative overflow-hidden rounded-sm">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.imageAlt ?? item.title} 
                        className="w-full h-full object-cover mix-blend-multiply opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-bold uppercase tracking-widest text-agro-muted opacity-20">No Vis</div>
                    )}
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="text-[13px] font-headline font-semibold text-agro-ink mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-agro-muted font-bold tracking-widest uppercase mb-2">QTY: {item.quantity}</p>
                    <p className="text-[13px] font-headline text-primary font-semibold">{formatPrice(item.price.toString(), item.currencyCode)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-12 border-t border-agro-outline-ghost/10">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-agro-muted">
                <span>Sub-Total Ledger</span>
                <span>{formatPrice(subtotal.toString(), items[0]?.currencyCode)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-agro-muted opacity-50">
                <span>Institutional Tax</span>
                <span>Calculated at Portal</span>
              </div>
              <div className="flex items-center justify-between text-2xl font-headline font-bold text-agro-ink pt-6 border-t border-agro-outline-ghost/30">
                <span>TOTAL</span>
                <span className="text-primary tracking-tighter">{formatPrice(subtotal.toString(), items[0]?.currencyCode)}</span>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full h-20 bg-primary text-white text-[12px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-agro-ink transition-all active:scale-[0.98] disabled:bg-agro-ink/20 disabled:cursor-not-allowed group relative overflow-hidden shadow-2xl shadow-primary/20"
            >
              <AnimatePresence mode="wait">
                {isPlacingOrder ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initializing Secure Gateway...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Lock className="w-4 h-4 opacity-50" />
                    <span>Execute Procurement Acquisition</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <p className="text-[9px] text-center mt-6 text-agro-muted/40 uppercase font-bold tracking-[0.3em]">Institutional Grade Encrypted Channel</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
