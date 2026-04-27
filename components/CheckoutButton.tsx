"use client";

import { useCart } from "@/context/CartContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutButton({ className }: { className?: string }) {
  const { state, closeCart } = useCart();
  const requireAuth = useAuthGuard();
  const router = useRouter();

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Ensure user is authenticated
    if (!requireAuth()) return;

    // 2. Close drawer
    closeCart();

    // 3. Navigate to local checkout page
    router.push("/checkout");
  };

  return (
    <div className="w-full">
      {/* If not authenticated, require sign-in first */}
      {/* This logic is handled by useAuthGuard during click, but we show the state here */}
      <motion.button
        whileHover={{ scale: 1.01, backgroundColor: "#1e5d4a" }}
        whileTap={{ scale: 0.99 }}
        onClick={handleCheckoutClick}
        disabled={state.items.length === 0}
        className={[
          "group relative flex w-full items-center justify-center gap-6 overflow-hidden rounded-xl transition-all duration-500",
          state.items.length === 0
            ? "cursor-not-allowed bg-[#f0e6e0] text-[#3f4944]/30"
            : "bg-[#004534] text-white shadow-[0_20px_50px_-15px_rgba(0,69,52,0.3)]",
          className ?? "h-20 text-[10px] font-headline font-bold uppercase tracking-[0.4em]",
        ].join(" ")}
      >
        {/* Shine Animation */}
        {state.items.length > 0 && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        )}
        
        {state.items.length > 0 ? (
          <>
            <ShieldCheck className="h-5 w-5 opacity-50 transition-transform group-hover:rotate-12" />
            <span className="relative z-10">Secure Checkout</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-3" />
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 opacity-20" />
            <span>Manifest Empty</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
