"use client";

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import type { ReactNode } from "react";

// Wraps all client providers + global UI that needs client context.
// Separated so app/layout.tsx (server component) can import it cleanly.

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      {/* CartDrawer lives here so it is always mounted and can read CartContext */}
      <CartDrawer />
    </CartProvider>
  );
}
