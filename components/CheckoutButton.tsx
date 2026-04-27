"use client";

import { LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
        /* Not logged in — show a clear sign-in CTA */
        <button
          type="button"
          onClick={() => {
            closeCart();
            router.push("/login?callbackUrl=%2Fcheckout");
          }}
          id="cart-signin-button"
          aria-label="Sign in to checkout"
          className={[
            "flex h-[64px] w-full items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all bg-agro-green text-white hover:bg-agro-ink",
            className ?? "",
          ].join(" ")}
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Sign in to Checkout
        </button>
      ) : (
        /* Logged in — normal checkout button */
        <button
          type="button"
          onClick={handleCheckout}
          disabled={state.items.length === 0}
          id="cart-checkout-button"
          aria-label="Proceed to secure checkout"
          className={[
            "flex h-[64px] w-full items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
            state.items.length === 0
              ? "cursor-not-allowed bg-agro-ink/10 text-agro-muted"
              : "bg-agro-green text-white hover:bg-agro-ink",
            className ?? "",
          ].join(" ")}
        >
          Initiate Checkout
        </button>
      )}
    </div>
  );
}

