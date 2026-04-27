"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const { state, clearCart, subtotal } = useCart();
  
  const [orderData, setOrderData] = useState({
    items: [...state.items],
    subtotal: subtotal,
    orderNumber: `#BAK-${Math.floor(100000 + Math.random() * 900000)}`,
    deliveryDate: "Oct 24 - Oct 26, 2024"
  });

  useEffect(() => {
    if (state.items.length > 0) {
      clearCart();
    }
  }, []);

  const formattedPrice = (priceInPaise: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(priceInPaise / 100);

  const shippingPaise = 35000;
  const gstPaise = orderData.subtotal * 0.05;
  const totalPaise = orderData.subtotal + shippingPaise + gstPaise;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-8 md:px-12 py-40 flex flex-col items-center min-h-screen relative overflow-hidden">
      {/* Heritage Background Detail */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Success Emblem */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="mb-12 relative"
      >
        <div className="w-32 h-32 rounded-full border border-primary/10 flex items-center justify-center bg-white shadow-luxury relative z-10">
          <span className="material-symbols-outlined text-6xl text-primary animate-pulse-slow">verified</span>
        </div>
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse opacity-20" />
      </motion.div>

      {/* Header Attribution */}
      <div className="text-center space-y-4 mb-20 max-w-2xl">
        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] font-label">Transaction Absolute Success</h4>
        <h1 className="font-headline font-black text-5xl md:text-6xl text-primary tracking-tight leading-[0.9]">
          Dispatch Confirmed. <br />
          <span className="text-secondary opacity-80">Supplies Allocated.</span>
        </h1>
        <p className="font-body text-on-surface-variant/70 text-base leading-relaxed pt-4">
          The heavy-logistics protocol has been initiated for your agricultural assets. A certificate of purchase has been generated for your records.
        </p>
      </div>

      {/* The Receipt Structure (Architectural Layout) */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-12 mb-24">
        
        {/* Left: Summary Box */}
        <div className="lg:col-span-3 bg-white border border-outline-variant/10 rounded-3xl p-10 shadow-editorial relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
              <span className="text-[40px] font-black text-primary/5 font-headline select-none">OFFICIAL</span>
           </div>
           
           <div className="flex justify-between items-start mb-16">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Digital Ledger ID</span>
                <h3 className="font-headline font-black text-2xl text-primary tracking-tight">{orderData.orderNumber}</h3>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Dispatch Timeline</span>
                <p className="text-sm font-bold text-on-surface tracking-tight">{orderData.deliveryDate}</p>
              </div>
           </div>

           <div className="space-y-8 mb-16">
              <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] border-b border-outline-variant/10 pb-4">Consolidation Status</h5>
              {orderData.items.map((item) => (
                <div key={item.variantId} className="flex justify-between items-center group">
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-on-surface font-headline tracking-tight">{item.title}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Qty: 0{item.quantity} units</p>
                  </div>
                  <span className="text-[13px] font-medium text-on-surface">{formattedPrice(item.price * item.quantity)}</span>
                </div>
              ))}
           </div>

           <div className="pt-8 border-t border-dashed border-outline-variant/20 flex justify-between items-end">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Secured Payment Layer</span>
                 </div>
                 <p className="text-[9px] font-medium text-on-surface-variant/40 max-w-[200px]">Basaveshwara Agro Kendra - Trusted Agrarian Distribution Hub since inception.</p>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Total Fiscal Value</span>
                 <span className="text-3xl font-headline font-black text-primary tracking-tighter">{formattedPrice(totalPaise)}</span>
              </div>
           </div>
        </div>

        {/* Right: Actions & Trust */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-primary text-on-primary rounded-3xl p-10 shadow-luxury group transition-all">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Next Operations</h3>
              <div className="space-y-4">
                 <Link href="/products" className="block w-full text-center py-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    New Procurement
                 </Link>
                 <button onClick={() => window.print()} className="w-full py-4 border border-white/10 hover:border-white/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">print</span>
                    Export Receipt
                 </button>
              </div>
           </div>

           <div className="bg-surface-container-low/30 border border-outline-variant/10 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                 <span className="material-symbols-outlined text-secondary">support_agent</span>
                 <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Priority Desk</span>
              </div>
              <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
                Need immediate clarification regarding your dispatch? Our logistics directors are available for live consultation.
              </p>
              <div className="space-y-2">
                 <p className="text-sm font-black text-primary tracking-tight">+91 98765 43210</p>
                 <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest underline underline-offset-4">support@basaveshwaraagro.com</p>
              </div>
           </div>
        </div>
      </div>

    </main>
  );
}
