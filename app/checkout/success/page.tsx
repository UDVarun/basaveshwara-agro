"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { state, clearCart, subtotal } = useCart();
  
  // Capture order details before the cart is cleared
  const [orderData, setOrderData] = useState({
    items: [...state.items],
    subtotal: subtotal,
    orderNumber: `#SB-${Math.floor(1000 + Math.random() * 9000)}`,
    deliveryDate: "Oct 24 - Oct 26, 2024" // Static placeholder for mockup fidelity
  });

  useEffect(() => {
    // Clear the cart on mount to signal successful order placement
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

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("seed")) return "grass";
    if (title.toLowerCase().includes("fertilizer") || title.toLowerCase().includes("npk")) return "science";
    return "inventory_2";
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-screen">
      {/* Success Icon */}
      <div className="mb-12 flex justify-center items-center w-24 h-24 rounded-full bg-primary-container text-on-primary-container shadow-lg shadow-primary/10 transition-all duration-500 scale-110">
        <span className="material-symbols-outlined text-5xl fill-icon" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-headline font-semibold text-4xl text-primary tracking-tight text-center mb-4">
        Order Placed Successfully!
      </h1>

      {/* Subheadline */}
      <p className="font-body text-lg text-on-surface-variant text-center leading-relaxed mb-16 max-w-xl">
        Thank you for your purchase. We are preparing your agricultural supplies for dispatch.
      </p>

      {/* Order Details Card */}
      <div className="w-full bg-surface-container-lowest rounded-lg p-10 mb-16 relative shadow-[0_8px_40px_rgb(31,27,23,0.06)]">
        <div className="absolute inset-0 border border-outline-variant opacity-15 pointer-events-none rounded-lg"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-surface-container-high">
          <div>
            <span className="font-body text-xs text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Order Number</span>
            <span className="font-headline font-semibold text-2xl text-on-surface">{orderData.orderNumber}</span>
          </div>
          <div className="mt-6 md:mt-0 md:text-right">
            <span className="font-body text-xs text-on-surface-variant uppercase tracking-widest block mb-1 font-semibold">Estimated Delivery</span>
            <span className="font-body font-medium text-lg text-on-surface">{orderData.deliveryDate}</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-6">
          <h3 className="font-headline font-semibold text-xl text-primary mb-6">Order Summary</h3>
          {orderData.items.length > 0 ? (
            orderData.items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-surface-container rounded flex-shrink-0 flex items-center justify-center transition-colors group-hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-outline" data-icon={getIcon(item.title)}>{getIcon(item.title)}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-body font-medium text-on-surface">{item.title}</h4>
                  <p className="font-body text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                </div>
                <div className="font-body font-semibold text-on-surface">
                  {formattedPrice(item.price * item.quantity)}
                </div>
              </div>
            ))
          ) : (
            <p className="font-body text-on-surface-variant italic">Order processing summary...</p>
          )}
        </div>

        {/* Total */}
        <div className="mt-10 pt-6 border-t border-surface-container-high flex justify-between items-center">
          <span className="font-headline font-semibold text-lg text-on-surface">Total Amount Paid</span>
          <span className="font-headline font-semibold text-2xl text-primary">{formattedPrice(totalPaise)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mb-16">
        <Link 
          href="/products"
          className="bg-primary text-on-primary font-body font-medium px-10 py-4 rounded hover:bg-primary-container transition-all duration-300 shadow-md hover:shadow-xl text-center active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-surface-container-high text-on-surface font-body font-medium px-8 py-4 rounded hover:bg-surface-variant transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-xl" data-icon="print">print</span>
          Print Invoice
        </button>
      </div>

      {/* Reassurance Text */}
      <div className="text-center bg-surface-container-low p-8 rounded-lg w-full border border-primary/5">
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Need assistance with your order? Our agricultural experts are here to help.<br className="hidden md:block" />
          Reach out to us at <span className="font-bold text-primary">+91 98765 43210</span> or email <span className="font-bold text-primary shadow-sm">support@basaveshwaraagro.com</span>
        </p>
      </div>
    </main>
  );
}
