"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal } = useCart();
  const items = state.items;

  const formattedPrice = (priceInPaise: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(priceInPaise / 100);

  const gstPaise = subtotal * 0.05;
  const totalPaise = subtotal + gstPaise;

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-6" data-icon="shopping_basket">shopping_basket</span>
        <h1 className="font-headline font-semibold text-4xl tracking-tight text-on-surface">Your Cart is Empty</h1>
        <p className="font-body text-on-surface-variant mt-4 text-lg max-w-md">
          It looks like you haven&apos;t added any agricultural inputs to your cart yet.
        </p>
        <Link 
          href="/products" 
          className="mt-8 bg-primary hover:bg-primary-container text-on-primary font-body font-medium py-3 px-8 rounded-lg transition-colors"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="font-headline font-semibold text-5xl tracking-tight text-on-surface">Your Cart</h1>
        <p className="font-body text-on-surface-variant mt-2 text-lg">Review your selected agricultural inputs before checkout.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div 
              key={item.variantId} 
              className="bg-surface-container-lowest rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:scale-[1.01] transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]"
            >
              <div className="w-32 h-32 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[128px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline font-semibold text-xl text-on-surface tracking-tight">{item.title}</h3>
                    <p className="font-body text-sm text-on-surface-variant mt-1">High Yield Variant</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item" 
                    className="text-outline hover:text-error transition-colors p-2"
                  >
                    <span className="material-symbols-outlined" data-icon="delete">delete</span>
                  </button>
                </div>
                <div className="flex justify-between items-end mt-4 sm:mt-0">
                  <div className="flex items-center gap-3 bg-surface-container rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                      aria-label="Decrease quantity" 
                      className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded"
                    >
                      <span className="material-symbols-outlined text-sm" data-icon="remove">remove</span>
                    </button>
                    <span className="font-body font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.variantId, Math.min(99, item.quantity + 1))}
                      aria-label="Increase quantity" 
                      className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded"
                    >
                      <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                    </button>
                  </div>
                  <div className="font-headline font-semibold text-xl text-primary tracking-tight">
                    {formattedPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 rounded-xl sticky top-28">
            <h2 className="font-headline font-semibold text-2xl text-on-surface tracking-tight mb-6">Order Summary</h2>
            <div className="space-y-4 font-body text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-medium text-on-surface">{formattedPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-medium text-on-surface">{formattedPrice(gstPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sm italic">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/15">
              <div className="flex justify-between items-baseline mb-8">
                <span className="font-headline font-semibold text-lg text-on-surface">Total</span>
                <span className="font-headline font-bold text-3xl text-primary tracking-tight">{formattedPrice(totalPaise)}</span>
              </div>
              <Link 
                href="/checkout"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-body font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
