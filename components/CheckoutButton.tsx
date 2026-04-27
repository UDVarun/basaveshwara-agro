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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckoutClick}
        disabled={state.items.length === 0}
        className={[
          "group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-sm transition-all shadow-2xl shadow-primary/10",
          state.items.length === 0
            ? "cursor-not-allowed bg-agro-ink/10 text-agro-muted"
            : "bg-primary text-white hover:bg-agro-ink",
          className ?? "h-16 text-[11px] font-bold uppercase tracking-[0.3em]",
        ].join(" ")}
      >
        {/* Shine Animation */}
        {state.items.length > 0 && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        )}
        
        {state.items.length > 0 ? (
          <>
            <ShieldCheck className="h-4 w-4 opacity-70" />
            <span>Secure Checkout</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 opacity-30" />
            <span>Manifest Empty</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
