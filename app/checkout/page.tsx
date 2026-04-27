"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const items = state.items;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setCheckoutError("");

    try {
      // Build the item list for the server
      const checkoutItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setCheckoutError(
          data.error || "Something went wrong. Please try again."
        );
        setIsPlacingOrder(false);
        return;
      }

      // Clear local cart then hand off to Shopify's secure hosted checkout
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch {
      setCheckoutError("Network error. Please check your connection.");
      setIsPlacingOrder(false);
    }
  };

  const formattedPrice = (priceInPaise: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(priceInPaise / 100);

  const shippingPaise = 35000; // ₹350.00
  const gstPaise = subtotal * 0.05;
  const totalPaise = subtotal + shippingPaise + gstPaise;

  if (items.length === 0) {
    return (
      <main className="pt-40 pb-24 max-w-7xl mx-auto px-8 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-8 border border-outline-variant/10">
          <span className="material-symbols-outlined text-4xl text-primary/40">shopping_basket</span>
        </div>
        <h1 className="font-headline font-semibold text-4xl tracking-tight text-primary mb-4">Your Session is Empty</h1>
        <p className="font-body text-on-surface-variant max-w-sm mb-10 text-base opacity-70">
          Begin your agricultural procurement journey by selecting from our curated range of biological assets.
        </p>
        <Link 
          href="/products" 
          className="bg-primary text-on-primary font-headline font-semibold px-10 py-4 rounded-md hover:translate-y-[-2px] transition-all shadow-lg active:translate-y-0"
        >
          Browse Inventory
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-semibold text-on-surface mb-2">Checkout</h1>
        <p className="font-body text-on-surface-variant text-lg">Securely complete your agricultural supply order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-12">
          
          {/* Shipping Address Section */}
          <section className="bg-[#fcf2eb] p-8 lg:p-10 rounded-lg">
            <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 flex items-center uppercase tracking-tight">
              <span className="material-symbols-outlined mr-3 text-primary">local_shipping</span>
              Shipping Information
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="first_name">First Name</label>
                  <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="first_name" name="first_name" placeholder="Farmer" type="text" />
                </div>
                <div>
                  <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="last_name">Last Name</label>
                  <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="last_name" name="last_name" placeholder="Gowda" type="text" />
                </div>
              </div>
              <div>
                <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="address">Street Address</label>
                <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="address" name="address" placeholder="123 Agrarian Way" type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="city">City / District</label>
                  <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="city" name="city" placeholder="Hubballi" type="text" />
                </div>
                <div>
                  <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="pincode">Pincode</label>
                  <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="pincode" name="pincode" placeholder="580020" type="text" />
                </div>
              </div>
              <div>
                <label className="block font-label text-sm font-medium text-on-surface-variant mb-1" htmlFor="phone">Phone Number (For Delivery Updates)</label>
                <input className="w-full bg-[#f0e6e0] border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-sm px-4 py-3 text-on-surface transition-colors" id="phone" name="phone" placeholder="+91 98765 43210" type="tel" />
              </div>
            </form>
          </section>

          {/* Billing Section */}
          <section className="bg-[#fcf2eb] p-8 lg:p-10 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-semibold text-on-surface flex items-center uppercase tracking-tight">
                <span className="material-symbols-outlined mr-3 text-primary">receipt_long</span>
                Billing Address
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <input defaultChecked className="h-5 w-5 rounded-sm border-stone-300 text-primary focus:ring-primary/20 bg-white" id="same_as_shipping" name="same_as_shipping" type="checkbox" />
              <label className="font-body text-on-surface-variant" htmlFor="same_as_shipping">Same as Shipping Address</label>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-[#fcf2eb] p-8 lg:p-10 rounded-lg">
            <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 flex items-center uppercase tracking-tight">
              <span className="material-symbols-outlined mr-3 text-primary">payments</span>
              Payment Method
            </h2>
            <div className="space-y-4">
              {[
                { id: "upi", label: "UPI (GPay, PhonePe, Paytm)", desc: "Instant transfer using any UPI app.", icon: "qr_code_scanner" },
                { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay accepted.", icon: "credit_card" },
                { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives.", icon: "payments" }
              ].map((opt) => (
                <label key={opt.id} className="block relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="peer sr-only" 
                  />
                  <div className="w-full bg-[#eae1da] border-2 border-transparent peer-checked:border-primary peer-checked:bg-white rounded-lg p-5 flex items-center transition-all duration-200">
                    <div className="w-6 h-6 rounded-full border-2 border-stone-300 peer-checked:border-primary flex items-center justify-center mr-4 bg-white">
                      <div className={`w-3 h-3 rounded-full bg-primary transition-opacity ${paymentMethod === opt.id ? "opacity-100" : "opacity-0"}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline font-semibold text-on-surface text-lg leading-tight">{opt.label}</h3>
                      <p className="font-body text-sm text-on-surface-variant mt-1">{opt.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl opacity-80">{opt.icon}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-[0_8px_40px_rgb(31,27,23,0.06)] border border-stone-100">
              <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 uppercase tracking-tight">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-start">
                    <div className="w-16 h-16 bg-[#fcf2eb] rounded-lg overflow-hidden flex-shrink-0 relative border border-stone-100">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-headline font-semibold text-on-surface text-sm leading-tight">{item.title}</h4>
                      <p className="font-body text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="font-body font-medium text-on-surface text-sm">{formattedPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-100 pt-6 space-y-3">
                <div className="flex justify-between font-body text-on-surface-variant text-sm font-medium">
                  <span>Subtotal</span>
                  <span>{formattedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant text-sm font-medium">
                  <span>Shipping (Heavy Cargo)</span>
                  <span>{formattedPrice(shippingPaise)}</span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant text-sm font-medium">
                  <span>Taxes (GST 5%)</span>
                  <span>{formattedPrice(gstPaise)}</span>
                </div>
              </div>

              <div className="border-t border-stone-100 mt-6 pt-6 flex justify-between items-center mb-8">
                <span className="font-headline font-bold text-xl text-on-surface tracking-tight uppercase">Total</span>
                <span className="font-headline font-bold text-2xl text-primary tracking-tighter">{formattedPrice(totalPaise)}</span>
              </div>

              {checkoutError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-widest rounded-md">
                   {checkoutError}
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-primary text-on-primary font-headline font-semibold py-4 rounded-md hover:bg-[#1e5d4a] hover:scale-[1.02] shadow-[0_4px_20px_rgb(31,27,23,0.06)] hover:shadow-[0_8px_40px_rgb(31,27,23,0.10)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing..." : "Place Order Securely"}
                {!isPlacingOrder && <span className="material-symbols-outlined text-xl">lock</span>}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="bg-[#fcf2eb] p-6 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-[#904d00] text-3xl">verified_user</span>
              <h4 className="font-headline font-semibold text-on-surface uppercase tracking-tight text-sm">Trusted Agrarian Supply</h4>
              <p className="font-body text-[11px] font-medium text-on-surface-variant leading-relaxed">
                Your transaction is encrypted and securely processed. We guarantee the authenticity of all agricultural inputs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
