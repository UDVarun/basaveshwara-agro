"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Truck, 
  FileText, 
  CreditCard, 
  Smartphone, 
  Banknote,
  ShoppingBag,
  Package,
  MapPin,
  ChevronRight
} from "lucide-react";
import { formatPricePaise } from "@/lib/format";

export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const items = state.items;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setCheckoutError("");

    try {
      const checkoutItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setCheckoutError(data.error || "The secure vault connection failed. Please re-authenticate.");
        setIsPlacingOrder(false);
        return;
      }

      clearCart();
      window.location.href = data.checkoutUrl;
    } catch {
      setCheckoutError("Logistics connection error. Please verify your transmission.");
      setIsPlacingOrder(false);
    }
  };

  const shippingPaise = 35000; // ₹350.00
  const gstPaise = subtotal * 0.05;
  const totalPaise = subtotal + shippingPaise + gstPaise;

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-40 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
           <div className="absolute inset-0 bg-agro-green/10 rounded-full blur-3xl" />
           <ShoppingBag className="w-16 h-16 text-agro-muted relative z-10" />
        </motion.div>
        <h1 className="text-4xl font-headline font-semibold text-agro-ink mb-4">Provision Vault Empty</h1>
        <p className="text-agro-muted mb-10 text-center max-w-md italic">
          Your acquisition session is currently inactive. Please populate your curation to proceed.
        </p>
        <Link 
          href="/products" 
          className="bg-agro-green text-white font-bold text-[11px] uppercase tracking-[0.3em] px-10 py-5 rounded-xl hover:bg-agro-ink transition-all shadow-xl shadow-agro-green/10 flex items-center gap-4"
        >
          Access Inventory
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-24">
      {/* Cinematic Loading Overlay */}
      <AnimatePresence>
        {isPlacingOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-agro-bg/80 backdrop-blur-md"
          >
            <div className="text-center space-y-8">
              <div className="relative inline-block">
                <Loader2 className="w-16 h-16 text-agro-green animate-spin opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-agro-green animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold text-agro-ink italic uppercase tracking-[0.3em]">Vault Authorization</h2>
                <p className="text-[10px] font-bold text-agro-muted uppercase tracking-widest">Bridging secure connection to Shopify Gateway...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-agro-green text-[10px] font-bold uppercase tracking-[0.4em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Acquisition Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-semibold tracking-tighter text-agro-ink">Checkout</h1>
        </div>
        <div className="flex items-center gap-4 text-agro-muted text-xs font-medium bg-agro-surface-low px-6 py-4 rounded-2xl border border-agro-outline-ghost/30">
          <span>Cart</span>
          <ChevronRight className="w-4 h-4 opacity-30" />
          <span className="text-agro-green font-bold uppercase tracking-wider">Acquisition</span>
          <ChevronRight className="w-4 h-4 opacity-30" />
          <span>Harvest</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-16">
          
          {/* Shipping Address Section */}
          <section className="bg-agro-surface-low/30 p-8 lg:p-12 rounded-3xl border border-agro-outline-ghost/20 shadow-editorial">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-agro-green/5 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-agro-green" />
              </div>
              <h2 className="text-2xl font-headline font-semibold text-agro-ink uppercase tracking-tight">Delivery Logistics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">First Name</label>
                <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="Kishore" type="text" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">Last Name</label>
                <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="Gowda" type="text" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">Institutional Address</label>
                <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="Basaveshwara Farm, K.M. Road" type="text" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">City / District</label>
                  <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="Chikkamagaluru" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">Pincode</label>
                  <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="577101" type="text" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-agro-muted uppercase tracking-widest px-1">Verified Contact</label>
                <input className="w-full bg-white border border-agro-outline-ghost/30 rounded-xl px-4 py-4 text-agro-ink focus:border-agro-green focus:ring-1 focus:ring-agro-green/20 transition-all placeholder:text-agro-muted/30" placeholder="+91 948XXXXXXX" type="tel" />
              </div>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-agro-surface-low/30 p-8 lg:p-12 rounded-3xl border border-agro-outline-ghost/20 shadow-editorial">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-agro-green/5 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-agro-green" />
              </div>
              <h2 className="text-2xl font-headline font-semibold text-agro-ink uppercase tracking-tight">Acquisition Method</h2>
            </div>

            <div className="space-y-4">
              {[
                { id: "upi", label: "Unified Payments Interface", desc: "Premium instant settlement via GPay/PhonePe.", icon: Smartphone },
                { id: "card", label: "Corporate Credit/Debit", desc: "Secured encrypted card processing.", icon: CreditCard },
                { id: "cod", label: "Settlement on Delivery", desc: "Pay upon physical verification of quality.", icon: Banknote }
              ].map((opt) => (
                <label key={opt.id} className="block relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="peer sr-only" 
                  />
                  <div className="w-full bg-white border border-agro-outline-ghost/30 peer-checked:border-agro-green peer-checked:shadow-lg peer-checked:shadow-agro-green/5 rounded-2xl p-6 flex items-center gap-6 transition-all duration-300">
                    <div className="w-6 h-6 rounded-full border-2 border-agro-outline-ghost/30 peer-checked:border-agro-green flex items-center justify-center bg-white transition-colors group-hover:border-agro-green/50">
                      <div className={`w-2.5 h-2.5 rounded-full bg-agro-green transition-all ${paymentMethod === opt.id ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-headline font-semibold text-agro-ink leading-tight">{opt.label}</h3>
                      <p className="text-[10px] font-bold text-agro-muted uppercase tracking-wider mt-1">{opt.desc}</p>
                    </div>
                    <opt.icon className="w-8 h-8 text-agro-green/40 group-hover:text-agro-green/80 transition-colors" />
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-40">
          <div className="bg-agro-ink text-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Texture background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-agro-muted mb-10 pb-4 border-b border-white/10 relative z-10">Provision Manifest</h2>
            
            {/* Order Items */}
            <div className="space-y-8 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden shrink-0 relative border border-white/5">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover opacity-80" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-headline font-semibold truncate leading-tight">{item.title}</h4>
                    <p className="text-[9px] font-bold text-agro-muted uppercase tracking-widest mt-1">Batch ID #VLT-{item.variantId.slice(-4).toUpperCase()} &bull; Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold tracking-tight">{formatPricePaise(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-4 mb-10 border-t border-white/10 pt-8 relative z-10">
              <div className="flex justify-between text-xs text-agro-muted">
                <span className="font-bold uppercase tracking-widest">Sub-Provision</span>
                <span className="text-white font-bold">{formatPricePaise(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-agro-muted">
                <span className="font-bold uppercase tracking-widest">Heavy Logistics</span>
                <span className="text-white font-bold">{formatPricePaise(shippingPaise)}</span>
              </div>
              <div className="flex justify-between text-xs text-agro-muted">
                <span className="font-bold uppercase tracking-widest">Statutory GST (5%)</span>
                <span className="text-white font-bold">{formatPricePaise(gstPaise)}</span>
              </div>
            </div>

            <div className="pt-8 mb-10 border-t-2 border-white/10 flex justify-between items-end relative z-10">
              <span className="text-sm font-headline font-bold uppercase tracking-tighter text-white/60">Vault Total</span>
              <span className="text-4xl font-headline font-bold text-agro-green tracking-tighter">{formatPricePaise(totalPaise)}</span>
            </div>

            {checkoutError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center relative z-10"
              >
                 {checkoutError}
              </motion.div>
            )}

            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="group relative w-full h-16 bg-agro-green text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-agro-ink transition-all shadow-2xl shadow-agro-green/20 disabled:opacity-50 relative z-10 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <Lock className="w-4 h-4" />
              <span>{isPlacingOrder ? "Authorizing..." : "Execute Acquisition"}</span>
            </button>

            {/* Reassurance */}
            <div className="mt-10 flex flex-col items-center gap-4 text-center opacity-40 relative z-10">
               <ShieldCheck className="w-10 h-10 text-white" />
               <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                  Basel III Compliant Encryption &bull; Heritage Seed Guarantee
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
