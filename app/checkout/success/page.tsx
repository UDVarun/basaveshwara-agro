"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { state, clearCart, subtotal } = useCart();
  
  const [orderData] = useState({
    items: [...state.items],
    subtotal: subtotal,
    orderNumber: `#SB-${Math.floor(1000 + Math.random() * 9000)}`,
    deliveryDate: "Oct 24 - Oct 26, 2024"
  });

  useEffect(() => {
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

  return (
    <main className="w-full max-w-3xl mx-auto px-6 flex-grow flex flex-col items-center justify-center py-24 min-h-[80vh]">
      {/* Success Icon */}
      <div className="mb-12 flex justify-center items-center w-24 h-24 rounded-full bg-primary-container text-on-primary-container">
        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
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
      <div className="w-full bg-surface-container-lowest rounded-lg p-10 mb-16 relative overflow-hidden">
        {/* Ghost Border for accessibility */}
        <div className="absolute inset-0 border border-outline-variant opacity-15 pointer-events-none rounded-lg" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-surface-container-high">
          <div>
            <span className="font-label text-sm text-on-surface-variant uppercase tracking-widest block mb-1">
              Order Number
            </span>
            <span className="font-headline font-semibold text-2xl text-on-surface">
              {orderData.orderNumber}
            </span>
          </div>
          <div className="mt-6 md:mt-0 md:text-right">
            <span className="font-label text-sm text-on-surface-variant uppercase tracking-widest block mb-1">
              Estimated Delivery
            </span>
            <span className="font-body font-medium text-lg text-on-surface">
              {orderData.deliveryDate}
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-6">
          <h3 className="font-headline font-semibold text-xl text-primary mb-6">Order Summary</h3>
          
          {orderData.items.length > 0 ? (
            orderData.items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container rounded flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">grass</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-body font-medium text-on-surface">{item.title}</h4>
                  <p className="font-label text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                </div>
                <div className="font-body font-semibold text-on-surface">
                   {formattedPrice(item.price * item.quantity)}
                </div>
              </div>
            ))
          ) : (
            // Fallback content to match exactly the screenshot for aesthetic preview if cart is empty
            <>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container rounded flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">grass</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-body font-medium text-on-surface">Premium Hybrid Maize Seeds</h4>
                  <p className="font-label text-sm text-on-surface-variant">Qty: 5 x 10kg bags</p>
                </div>
                <div className="font-body font-semibold text-on-surface">
                  ₹4,250
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface-container rounded flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">science</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-body font-medium text-on-surface">Nitrogen Rich Fertilizer (NPK 20-20-20)</h4>
                  <p className="font-label text-sm text-on-surface-variant">Qty: 2 x 50kg bags</p>
                </div>
                <div className="font-body font-semibold text-on-surface">
                  ₹3,100
                </div>
              </div>
            </>
          )}
        </div>

        {/* Total */}
        <div className="mt-10 pt-6 border-t border-surface-container-high flex justify-between items-center">
          <span className="font-headline font-semibold text-lg text-on-surface">Total Amount Paid</span>
          <span className="font-headline font-semibold text-2xl text-primary">
            {orderData.items.length > 0 ? formattedPrice(totalPaise) : '₹7,350'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mb-16">
        <Link 
          href="/products" 
          className="bg-primary text-on-primary font-body font-medium px-8 py-4 rounded hover:bg-primary-container transition-colors duration-200 text-center"
        >
          Continue Shopping
        </Link>
        <button 
          onClick={() => window.print()} 
          className="bg-surface-container-high text-on-surface font-body font-medium px-8 py-4 rounded hover:bg-surface-variant transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">print</span>
          Print Invoice
        </button>
      </div>

      {/* Reassurance Text */}
      <div className="text-center bg-surface-container-low p-6 rounded-lg w-full">
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">
          Need assistance with your order? Our agricultural experts are here to help.<br />
          Reach out to us at <span className="font-medium text-primary">+91 98765 43210</span> or email <span className="font-medium text-primary">support@basaveshwaraagro.com</span>
        </p>
      </div>
    </main>
  );
}
