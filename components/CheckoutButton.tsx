"use client";

import { LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const { state, closeCart } = useCart();
  const { status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";

  function handleCheckout() {
    if (state.items.length === 0) return;
    closeCart();
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => {
            closeCart();
            router.push("/login?callbackUrl=%2Fcheckout");
          }}
          id="cart-signin-button"
          aria-label="Sign in to checkout"
          className={[
            "relative flex h-[64px] w-full items-center justify-center gap-3 overflow-hidden text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
            "bg-agro-green text-white hover:bg-agro-ink",
            className ?? "",
          ].join(" ")}
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Sign in to Checkout
        </motion.button>
      ) : (
        <motion.button
          whileHover={state.items.length > 0 ? { scale: 1.01 } : {}}
          whileTap={state.items.length > 0 ? { scale: 0.99 } : {}}
          type="button"
          onClick={handleCheckout}
          disabled={state.items.length === 0}
          id="cart-checkout-button"
          aria-label="Proceed to secure checkout"
          className={[
            "group relative flex h-[64px] w-full items-center justify-center gap-3 overflow-hidden text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
            state.items.length === 0
              ? "cursor-not-allowed bg-agro-ink/10 text-agro-muted"
              : "bg-agro-green text-white hover:bg-agro-ink shadow-lg shadow-agro-green/10",
            className ?? "",
          ].join(" ")}
        >
          {/* Subtle Shine Effect */}
          {state.items.length > 0 && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          )}
          
          <ShieldCheck className="h-4 w-4 opacity-80" aria-hidden="true" />
          <span>Secure Checkout</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      )}
    </div>
  );
}

