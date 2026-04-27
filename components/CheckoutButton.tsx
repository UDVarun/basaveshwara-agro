"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CLIENT_CHECKOUT_ERROR =
  "Checkout is temporarily unavailable. Please try again.";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const { state, clearCart } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";

  async function handleCheckout() {
    setLoading(true);
    // Instead of calling Shopify API and redirecting away, 
    // we send the user to our custom internal checkout page on Vercel.
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="bg-red-50 p-4 border-l-2 border-red-600">
          <p
            role="alert"
            aria-live="assertive"
            className="text-[10px] font-bold uppercase tracking-widest text-red-700"
          >
            {error}
          </p>
        </div>
      ) : null}

      {!isAuthenticated ? (
        /* Not logged in — show a clear sign-in CTA */
        <button
          type="button"
          onClick={() => router.push("/login?callbackUrl=%2F")}
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
          disabled={loading || state.items.length === 0}
          id="cart-checkout-button"
          aria-label="Proceed to secure checkout"
          aria-busy={loading}
          className={[
            "flex h-[64px] w-full items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
            loading || state.items.length === 0
              ? "cursor-not-allowed bg-agro-ink/10 text-agro-muted"
              : "bg-agro-green text-white hover:bg-agro-ink",
            className ?? "",
          ].join(" ")}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Indexing...
            </>
          ) : (
            "Initiate Checkout"
          )}
        </button>
      )}
    </div>
  );
}
