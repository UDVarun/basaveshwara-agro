"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { 
  CheckCircle2, 
  Printer, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Truck,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuccessPage() {
  const { state, clearCart, subtotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [orderData] = useState({
    items: [...state.items],
    subtotal: subtotal,
    orderNumber: `#SB-${Math.floor(1000 + Math.random() * 9000)}`,
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  });

  useEffect(() => {
    setIsLoaded(true);
    if (state.items.length > 0) {
      clearCart();
    }
  }, [state.items.length, clearCart]);

  const formattedPrice = (priceInPaise: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceInPaise / 100);

  const shippingPaise = 35000;
  const gstPaise = orderData.subtotal * 0.05;
  const totalPaise = orderData.subtotal + shippingPaise + gstPaise;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-6 py-24 min-h-screen overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="flex flex-col items-center"
      >
        {/* Success Icon Section */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-agro-green/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative flex justify-center items-center w-28 h-28 rounded-full bg-agro-green text-white shadow-2xl shadow-agro-green/40">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </motion.div>
        
        {/* Headline */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="font-headline font-semibold text-5xl md:text-6xl text-agro-ink tracking-tight mb-4">
            Harvest Manifest Certified
          </h1>
          <p className="font-body text-xl text-agro-muted max-w-xl mx-auto leading-relaxed border-t border-agro-outline-ghost/20 pt-6">
            Registry Entry <span className="font-bold text-agro-green">{orderData.orderNumber}</span> verified. Your provision is being curated for dispatch.
          </p>
        </motion.div>

        {/* The Manifest "Certificate" Card */}
        <motion.div 
          variants={itemVariants}
          className="w-full bg-white border border-agro-outline-ghost/30 rounded-3xl shadow-editorial overflow-hidden mb-16 relative"
        >
          {/* Subtle Institutional Watermark */}
          <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none">
            <Leaf className="w-64 h-64 rotate-12" />
          </div>

          {/* Card Header */}
          <div className="p-8 md:p-12 border-b border-agro-outline-ghost/10 bg-agro-surface-low/50 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-agro-ink rounded-2xl flex items-center justify-center text-white shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted mb-1">Current Status</span>
                <div className="flex items-center gap-2 text-agro-green font-headline font-bold text-lg">
                  <div className="w-2 h-2 bg-agro-green animate-pulse rounded-full" />
                  Preparing for Shipment
                </div>
              </div>
            </div>
            <div className="md:text-right">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-agro-muted mb-1">Anticipated Delivery</span>
              <div className="flex items-center md:justify-end gap-2 text-agro-ink font-headline font-bold text-lg">
                <Truck className="w-5 h-5 text-agro-muted" />
                {orderData.deliveryDate}
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-agro-muted shrink-0">Provision Details</h3>
              <div className="h-[1px] flex-1 bg-agro-outline-ghost/20" />
            </div>
            
            <div className="space-y-8">
              {orderData.items.length > 0 ? (
                orderData.items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-6 group">
                    <div className="w-20 h-20 bg-agro-surface-low rounded-2xl overflow-hidden flex-shrink-0 border border-agro-outline-ghost/20 transition-transform group-hover:scale-105">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-agro-muted/30">
                          <Leaf className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-headline font-semibold text-lg text-agro-ink group-hover:text-agro-green transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-agro-muted uppercase tracking-wider">Qty: {item.quantity}</span>
                        <div className="w-1 h-1 bg-agro-outline-ghost/40 rounded-full" />
                        <span className="text-xs font-medium text-agro-muted italic">Batch Certified</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-headline font-bold text-lg text-agro-ink">
                         {formattedPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-agro-muted">
                  <p>Transaction details archived. Please check your vault for history.</p>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="mt-12 pt-8 border-t border-agro-outline-ghost/10 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-agro-muted font-medium">Provision Subtotal</span>
                <span className="text-agro-ink font-bold">{formattedPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-agro-muted font-medium">Logistics & Insurance</span>
                <span className="text-agro-ink font-bold">{formattedPrice(shippingPaise)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-agro-ink/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-agro-green" />
                  <span className="font-headline font-bold text-xl text-agro-ink uppercase tracking-tight">Total Certified Value</span>
                </div>
                <span className="font-headline font-bold text-3xl text-agro-green tracking-tighter">
                  {orderData.items.length > 0 ? formattedPrice(totalPaise) : '₹7,350'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Institutional Note */}
          <div className="bg-agro-ink text-white/40 p-6 text-center text-[10px] font-bold uppercase tracking-[0.4em]">
            Official Basaveshwara Agro Repository Record &bull; Est. 1992
          </div>
        </motion.div>

        {/* Actions Row */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mb-16">
          <Link 
            href="/products" 
            className="flex-1 group relative h-16 bg-agro-green text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-agro-green/20 hover:bg-agro-ink transition-all"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span>Return to Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
          
          <button 
            onClick={() => window.print()} 
            className="flex-1 h-16 bg-white border border-agro-outline-ghost/50 text-agro-muted font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-agro-surface-low hover:text-agro-ink transition-all flex items-center justify-center gap-3 shadow-editorial"
          >
            <Printer className="w-4 h-4" />
            Print Manifest
          </button>
        </motion.div>

        {/* Support Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center p-8 border border-agro-outline-ghost/20 rounded-3xl w-full bg-agro-surface-low/30 backdrop-blur-sm"
        >
          <div className="flex justify-center mb-4">
             <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-agro-surface-low flex items-center justify-center text-[8px] font-bold text-agro-muted">AG</div>
                 ))}
             </div>
          </div>
          <p className="font-body text-sm text-agro-muted leading-relaxed">
            Require consultation regarding your provision? Our agrarian experts are active.<br />
            Institutional Hotline: <span className="font-bold text-agro-ink">+91 98765 43210</span> &bull; <span className="text-agro-green italic underline decoration-agro-green/30 underline-offset-4 cursor-pointer">support@basaveshwaraagro.com</span>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
