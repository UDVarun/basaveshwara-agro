"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { state, subtotal } = useCart();
  const items = state.items;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [sameAsShipping, setSameAsShipping] = useState(true);

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
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-6" data-icon="shopping_basket">shopping_basket</span>
        <h1 className="font-headline font-semibold text-4xl tracking-tight text-on-surface">Checkout Unavailable</h1>
        <p className="font-body text-on-surface-variant mt-4 text-lg max-w-md">
          Your cart is currently empty. Please add items to your cart before proceeding to checkout.
        </p>
        <Link 
          href="/products" 
          className="mt-8 bg-primary hover:bg-primary-container text-on-primary font-body font-medium py-3 px-8 rounded-lg transition-colors"
        >
          View Products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-semibold text-on-surface mb-2 tracking-tight">Checkout</h1>
        <p className="font-body text-on-surface-variant text-lg">Securely complete your agricultural supply order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-12">
          {/* Shipping Address Section */}
          <section className="bg-surface-container-low p-8 lg:p-10 rounded-lg">
            <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 flex items-center">
              <span className="material-symbols-outlined mr-3 text-primary" data-icon="local_shipping">local_shipping</span>
              Shipping Information
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="first_name">First Name</label>
                  <input 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                    id="first_name" 
                    name="first_name" 
                    placeholder="Farmer" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="last_name">Last Name</label>
                  <input 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                    id="last_name" 
                    name="last_name" 
                    placeholder="Gowda" 
                    type="text" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="address">Street Address</label>
                <input 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                  id="address" 
                  name="address" 
                  placeholder="123 Agrarian Way" 
                  type="text" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="city">City / District</label>
                  <input 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                    id="city" 
                    name="city" 
                    placeholder="Hubballi" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="pincode">Pincode</label>
                  <input 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                    id="pincode" 
                    name="pincode" 
                    placeholder="580020" 
                    type="text" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-on-surface-variant mb-1" htmlFor="phone">Phone Number (For Delivery Updates)</label>
                <input 
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 text-on-surface transition-colors outline-none" 
                  id="phone" 
                  name="phone" 
                  placeholder="+91 98765 43210" 
                  type="tel" 
                />
              </div>
            </form>
          </section>

          {/* Billing Address Section */}
          <section className="bg-surface-container-low p-8 lg:p-10 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-semibold text-on-surface flex items-center tracking-tight">
                <span className="material-symbols-outlined mr-3 text-primary" data-icon="receipt_long">receipt_long</span>
                Billing Address
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <input 
                checked={sameAsShipping} 
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="h-5 w-5 rounded-sm border-outline text-primary focus:ring-primary-container bg-surface-container-high" 
                id="same_as_shipping" 
                name="same_as_shipping" 
                type="checkbox" 
              />
              <label className="font-body text-on-surface-variant" htmlFor="same_as_shipping">Same as Shipping Address</label>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-surface-container-low p-8 lg:p-10 rounded-lg">
            <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 flex items-center tracking-tight">
              <span className="material-symbols-outlined mr-3 text-primary" data-icon="payments">payments</span>
              Payment Method
            </h2>
            <div className="space-y-4">
              {/* UPI Option */}
              <label className="block relative cursor-pointer group">
                <input 
                  checked={paymentMethod === "upi"} 
                  onChange={() => setPaymentMethod("upi")}
                  className="peer sr-only" 
                  name="payment_method" 
                  type="radio" 
                  value="upi" 
                />
                <div className="w-full bg-surface-container-highest border-2 border-transparent peer-checked:border-primary peer-checked:bg-surface-bright rounded-lg p-5 flex items-center transition-all duration-200">
                  <div className="w-6 h-6 rounded-full border-2 border-outline peer-checked:border-primary flex items-center justify-center mr-4 bg-surface">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-semibold text-on-surface text-lg tracking-tight">UPI (GPay, PhonePe, Paytm)</h3>
                    <p className="font-body text-sm text-on-surface-variant mt-1">Instant transfer using any UPI app.</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl opacity-80" data-icon="qr_code_scanner">qr_code_scanner</span>
                </div>
              </label>

              {/* Card Option */}
              <label className="block relative cursor-pointer group">
                <input 
                  checked={paymentMethod === "card"} 
                  onChange={() => setPaymentMethod("card")}
                  className="peer sr-only" 
                  name="payment_method" 
                  type="radio" 
                  value="card" 
                />
                <div className="w-full bg-surface-container-highest border-2 border-transparent peer-checked:border-primary peer-checked:bg-surface-bright rounded-lg p-5 flex items-center transition-all duration-200">
                  <div className="w-6 h-6 rounded-full border-2 border-outline peer-checked:border-primary flex items-center justify-center mr-4 bg-surface">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-semibold text-on-surface text-lg tracking-tight">Credit / Debit Card</h3>
                    <p className="font-body text-sm text-on-surface-variant mt-1">Visa, Mastercard, RuPay accepted.</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl opacity-80" data-icon="credit_card">credit_card</span>
                </div>
              </label>

              {/* COD Option */}
              <label className="block relative cursor-pointer group">
                <input 
                  checked={paymentMethod === "cod"} 
                  onChange={() => setPaymentMethod("cod")}
                  className="peer sr-only" 
                  name="payment_method" 
                  type="radio" 
                  value="cod" 
                />
                <div className="w-full bg-surface-container-highest border-2 border-transparent peer-checked:border-primary peer-checked:bg-surface-bright rounded-lg p-5 flex items-center transition-all duration-200">
                  <div className="w-6 h-6 rounded-full border-2 border-outline peer-checked:border-primary flex items-center justify-center mr-4 bg-surface">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-semibold text-on-surface text-lg tracking-tight">Cash on Delivery</h3>
                    <p className="font-body text-sm text-on-surface-variant mt-1">Pay when your order arrives.</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl opacity-80" data-icon="payments">payments</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_8px_40px_rgb(31,27,23,0.06)] border border-outline-variant/15">
              <h2 className="font-headline text-2xl font-semibold text-on-surface mb-6 tracking-tight">Order Summary</h2>
              {/* Order Items */}
              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-start">
                    <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-headline font-semibold text-on-surface text-base tracking-tight">{item.title}</h4>
                      <p className="font-body text-sm text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="font-body font-medium text-on-surface">{formattedPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-outline-variant/15 pt-6 space-y-3">
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formattedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Shipping (Heavy Cargo)</span>
                  <span>{formattedPrice(shippingPaise)}</span>
                </div>
                <div className="flex justify-between font-body text-on-surface-variant">
                  <span>Taxes (GST 5%)</span>
                  <span>{formattedPrice(gstPaise)}</span>
                </div>
              </div>
              <div className="border-t border-outline-variant/15 mt-6 pt-6 flex justify-between items-center mb-8">
                <span className="font-headline font-bold text-xl text-on-surface tracking-tight">Total</span>
                <span className="font-headline font-bold text-2xl text-primary tracking-tight">{formattedPrice(totalPaise)}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-primary text-on-primary font-headline font-semibold py-4 rounded-md hover:bg-primary-container hover:scale-[1.02] shadow-[0_4px_20px_rgb(31,27,23,0.06)] hover:shadow-[0_8px_40px_rgb(31,27,23,0.10)] transition-all duration-300 flex items-center justify-center active:scale-[0.98]"
              >
                Place Order Securely
                <span className="material-symbols-outlined ml-2 text-xl" data-icon="lock">lock</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-secondary text-3xl" data-icon="verified_user">verified_user</span>
              <h4 className="font-headline font-semibold text-on-surface tracking-tight">Trusted Agrarian Supply</h4>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">Your transaction is encrypted and securely processed. We guarantee the authenticity of all agricultural inputs.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
