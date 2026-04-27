"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  Check, 
  Printer, 
  ShoppingBag,
  ArrowLeft,
  Smartphone,
  Mail,
  Box,
  Leaf,
  FlaskConical,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuccessPage() {
  const router = useRouter();
  const { state, clearCart, subtotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Storing items locally so they don't disappear when cart clears
  const [orderItems] = useState([...state.items]);
  const [orderTotal] = useState(subtotal);

  // Fallback for empty state
  const itemsToDisplay = orderItems.length > 0 ? orderItems : [
    { title: "Premium Hybrid Maize Seeds", quantity: 5, price: 85000, currencyCode: "INR", variantId: "1", imageUrl: null, imageAlt: null, handle: "maize" },
    { title: "Nitrogen Rich Fertilizer (NPK 20-20-20)", quantity: 2, price: 155000, currencyCode: "INR", variantId: "2", imageUrl: null, imageAlt: null, handle: "fertilizer" }
  ];

  const totalToDisplay = orderItems.length > 0 ? orderTotal : 735000;

  useEffect(() => {
    setIsLoaded(true);
    // Only clear if items exist, avoiding re-triggering logic
    if (state.items.length > 0) {
      const timer = setTimeout(() => clearCart(), 2000);
      return () => clearTimeout(timer);
    }
  }, [clearCart, state.items.length]);

  const formatPrice = (priceInPaise: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceInPaise / 100);

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1b17] font-body selection:bg-[#004534]/10 antialiased flex flex-col items-center py-24 px-6 mb-24">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Success Icon - Architectural Rounded Square */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 flex justify-center items-center w-24 h-24 rounded-[2.5rem] bg-[#004534] text-[#b0f0d6] shadow-2xl shadow-[#004534]/20"
        >
          <CheckCircle2 className="w-12 h-12 stroke-[2px]" />
        </motion.div>

        {/* Headline */}
        <h1 className="font-headline font-bold text-4xl md:text-6xl text-[#004534] tracking-tighter text-center mb-6">
          Order Confirmed.
        </h1>

        {/* Subheadline */}
        <p className="font-body text-lg text-[#3f4944] text-center leading-relaxed mb-16 max-w-lg opacity-70">
          Your agricultural supplies are being prepared for dispatch. A confirmation has been sent to your registered email.
        </p>

        {/* Order Details Card - Tonal Surface, No Border */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-[#fcf2eb] rounded-[3rem] p-12 mb-16 relative shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-12 border-b border-[#bec9c2]/30">
            <div>
              <span className="font-label text-[10px] text-[#904d00] font-bold uppercase tracking-[0.4em] block mb-3">Order Identifier</span>
              <span className="font-headline font-black text-3xl text-[#1f1b17] tracking-tight">#SB-1234</span>
            </div>
            <div className="mt-8 md:mt-0 md:text-right">
              <span className="font-label text-[10px] text-[#904d00] font-bold uppercase tracking-[0.4em] block mb-3">Expected Logistics</span>
              <span className="font-body font-bold text-lg text-[#1f1b17]">Oct 24 — Oct 26, 2024</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-10">
            <h3 className="font-headline font-bold text-xl text-[#004534] tracking-tight mb-8">Manifest Summary</h3>
            
            {itemsToDisplay.map((item, idx) => (
               <div key={`${item.variantId}-${idx}`} className="flex items-center gap-8 group">
                <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                  {item.title.toLowerCase().includes("seed") ? (
                    <Leaf className="w-8 h-8 text-[#004534] opacity-40" />
                  ) : item.title.toLowerCase().includes("fertilizer") ? (
                    <FlaskConical className="w-8 h-8 text-[#004534] opacity-40" />
                  ) : (
                    <Box className="w-8 h-8 text-[#004534] opacity-40" />
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-headline font-bold text-[#1f1b17] text-lg">{item.title}</h4>
                  <p className="font-label text-xs text-[#3f4944] font-bold uppercase tracking-widest opacity-40 mt-1.5">Qty: {item.quantity} • Institutional Grade</p>
                </div>
                <div className="font-headline font-black text-[#1f1b17] text-xl tracking-tight">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-12 pt-10 border-t border-[#bec9c2]/30 flex justify-between items-center">
            <span className="font-headline font-bold text-lg text-[#1f1b17]">Total Remittance</span>
            <span className="font-headline font-black text-4xl text-[#004534] tracking-tighter">
              {formatPrice(totalToDisplay)}
            </span>
          </div>
        </motion.div>

        {/* Actions - Editorial Grade Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center mb-24 max-w-xl">
          <button 
            onClick={() => router.push("/products")}
            className="flex-1 bg-[#004534] text-white font-headline font-bold text-xs uppercase tracking-[0.3em] px-12 py-7 rounded-xl hover:bg-[#1e5d4a] transition-all shadow-2xl shadow-[#004534]/20 active:scale-[0.98]"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-white text-[#1f1b17] font-headline font-bold text-xs uppercase tracking-[0.3em] px-12 py-7 rounded-xl hover:bg-[#f6ece6] transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-sm"
          >
            <Printer className="w-5 h-5 opacity-40" />
            Print Invoice
          </button>
        </div>

        {/* Reassurance Anchor */}
        <div className="text-center bg-[#fcf2eb]/50 p-12 rounded-[2.5rem] w-full">
          <p className="font-body text-sm text-[#3f4944] leading-relaxed max-w-md mx-auto opacity-80 font-medium">
            Strategic agricultural inquiries or delivery coordination: 
            <br/>
            <span className="font-bold text-[#004534] block mt-4 text-base">+91 98765 43210</span>
          </p>
        </div>
      </main>
    </div>
  );
}
