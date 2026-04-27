"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Cart", "Shipping", "Confirmation"];

export default function CheckoutPage() {
  const { state, subtotal } = useCart();
  const items = state.items;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const router = useRouter();

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setCheckoutError("");

    // Simulate a brief processing time to make it feel premium
    setTimeout(() => {
      router.push("/checkout/success");
    }, 1500);
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
      <main className="pt-40 pb-24 max-w-[1600px] mx-auto px-8 md:px-12 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-8 border border-outline-variant/10">
          <span className="material-symbols-outlined text-4xl text-primary/40">shopping_basket</span>
        </div>
        <h1 className="font-headline font-black text-4xl tracking-tight text-primary mb-4">Your Session is Empty</h1>
        <p className="font-body text-on-surface-variant max-w-sm mb-10 text-base opacity-70">
          Begin your agricultural procurement journey by selecting from our curated range of biological assets.
        </p>
        <Link 
          href="/products" 
          className="bg-primary text-on-primary font-headline font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-xl hover:translate-y-[-2px] transition-all shadow-lg active:translate-y-0"
        >
          Browse Inventory
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1600px] mx-auto px-8 md:px-12 pt-40 pb-24 relative overflow-hidden">
      {/* Visual Header & Stepper */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="h-10 w-1 bg-secondary rounded-full" />
             <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] font-label">Checkout Portal</h4>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-black text-primary tracking-tight leading-[0.9]">
            Secure Procurement <br className="hidden md:block" />
            <span className="text-secondary opacity-80">& Order Finalization.</span>
          </h1>
        </div>

        {/* Stepper Component */}
        <div className="flex items-center gap-12 pt-4">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center gap-4 group">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                idx === 1 
                  ? "bg-primary text-on-primary border-primary shadow-[0_4px_12px_rgba(30,93,74,0.2)]" 
                  : idx === 0 ? "border-primary text-primary opacity-40" : "border-outline-variant/30 text-outline-variant"
              }`}>
                {idx + 1}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                idx === 1 ? "text-primary" : "text-on-surface-variant/30"
              }`}>
                {step}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="w-12 h-px bg-outline-variant/10 ml-4 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
        {/* Left Column: Form Architecture */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-16">
          
          {/* Section: Shipping */}
          <section className="space-y-10 group">
            <div className="flex items-center gap-6">
              <span className="w-px h-12 bg-outline-variant opacity-20" />
              <div className="space-y-1">
                <h2 className="font-headline text-xl font-bold text-primary uppercase tracking-wider">I. Logistics & Destination</h2>
                <p className="text-xs text-on-surface-variant/60 font-medium">Verify your regional dispatch details for optimal supply chain routing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              <div className="relative group/input">
                <input type="text" id="fname" className="peer w-full bg-transparent border-b-2 border-outline-variant/20 py-4 font-body text-base text-on-surface outline-none focus:border-primary transition-all placeholder:text-transparent" placeholder="First Name" />
                <label htmlFor="fname" className="absolute left-0 top-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]">First Name</label>
              </div>
              <div className="relative group/input">
                <input type="text" id="lname" className="peer w-full bg-transparent border-b-2 border-outline-variant/20 py-4 font-body text-base text-on-surface outline-none focus:border-primary transition-all placeholder:text-transparent" placeholder="Last Name" />
                <label htmlFor="lname" className="absolute left-0 top-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]">Last Name</label>
              </div>
              <div className="md:col-span-2 relative group/input">
                <input type="text" id="addr" className="peer w-full bg-transparent border-b-2 border-outline-variant/20 py-4 font-body text-base text-on-surface outline-none focus:border-primary transition-all placeholder:text-transparent" placeholder="Address" />
                <label htmlFor="addr" className="absolute left-0 top-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]">Territory / Street Address</label>
              </div>
              <div className="relative group/input">
                <input type="text" id="city" className="peer w-full bg-transparent border-b-2 border-outline-variant/20 py-4 font-body text-base text-on-surface outline-none focus:border-primary transition-all placeholder:text-transparent" placeholder="City" />
                <label htmlFor="city" className="absolute left-0 top-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]">City / Hub</label>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="relative group/input">
                   <input type="text" id="pin" className="peer w-full bg-transparent border-b-2 border-outline-variant/20 py-4 font-body text-base text-on-surface outline-none focus:border-primary transition-all placeholder:text-transparent" placeholder="Pin" />
                   <label htmlFor="pin" className="absolute left-0 top-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[10px]">Zip Code</label>
                </div>
                <div className="relative group/input">
                   <input type="text" value="KA" disabled className="peer w-full bg-transparent border-b-2 border-outline-variant/10 py-4 font-body text-base text-on-surface/40 outline-none" />
                   <label className="absolute left-0 top-1 text-[10px] font-bold text-primary/20 uppercase tracking-widest">State</label>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Payment Modalities */}
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <span className="w-px h-12 bg-outline-variant opacity-20" />
              <div className="space-y-1">
                <h2 className="font-headline text-xl font-bold text-primary uppercase tracking-wider">II. Financial Protocol</h2>
                <p className="text-xs text-on-surface-variant/60 font-medium">Select your preferred transaction layer for secure fiscal clearance.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "upi", label: "UPI Assets", desc: "Instant Digital Transfer", icon: "qr_code_scanner" },
                { id: "card", label: "Fiscal Card", desc: "Visa / Mastercard Hub", icon: "credit_card" },
                { id: "cod", label: "Field Liquidity", desc: "Physical Point Clearance", icon: "payments" }
              ].map((opt) => (
                <label key={opt.id} className="relative cursor-pointer group">
                  <input 
                    type="radio" 
                    name="pay" 
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="peer sr-only" 
                  />
                  <div className="h-full bg-surface-container-low/30 border border-outline-variant/10 rounded-2xl p-6 transition-all duration-300 peer-checked:bg-white peer-checked:border-primary/40 peer-checked:shadow-editorial hover:border-primary/20">
                    <div className="w-10 h-10 rounded-xl bg-surface mb-6 flex items-center justify-center text-secondary border border-outline-variant/5 shadow-sm">
                      <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                    </div>
                    <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-1">{opt.label}</h4>
                    <p className="text-[11px] font-medium text-on-surface-variant opacity-60 leading-tight">{opt.desc}</p>
                    <div className="absolute top-6 right-6 w-4 h-4 rounded-full border-2 border-outline-variant/20 flex items-center justify-center peer-checked:bg-primary transition-all">
                       <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Dynamic Subledger (Sticky) */}
        <div className="lg:col-span-12 xl:col-span-4 lg:mt-16 xl:mt-0">
          <div className="sticky top-32 space-y-10">
            <section className="bg-surface-container-high/20 backdrop-blur-md rounded-3xl p-10 border border-outline-variant/10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                <span className="w-4 h-px bg-secondary" />
                Order Subledger
              </h3>

              <div className="space-y-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-12">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm relative shrink-0 border border-outline-variant/5">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h5 className="text-[13px] font-bold text-on-surface leading-tight font-headline tracking-tight">{item.title}</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-on-surface-variant/40 font-label tracking-widest">L-ORD-0{item.quantity}</span>
                        <span className="text-[13px] font-medium text-on-surface">{formattedPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-outline-variant/10">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <span>Gross Value</span>
                  <span>{formattedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <span>Logistics Tax (Heavy)</span>
                  <span>{formattedPrice(shippingPaise)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <span>Fiscal GST (5%)</span>
                  <span>{formattedPrice(gstPaise)}</span>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/10 mt-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Consolidated Net</span>
                  <span className="text-3xl font-headline font-black text-primary tracking-tighter">{formattedPrice(totalPaise)}</span>
                </div>
              </div>

              {/* Error message */}
              {checkoutError && (
                <div className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                  {checkoutError}
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full mt-6 bg-primary text-on-primary font-headline font-black uppercase tracking-[0.25em] text-[11px] py-6 rounded-2xl hover:bg-primary/95 transition-all shadow-editorial active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {isPlacingOrder ? (
                  <>
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="material-symbols-outlined"
                    >
                      sync
                    </motion.span>
                    Finalizing Procurement...
                  </>
                ) : (
                  <>
                    Authorize Order
                    <span className="material-symbols-outlined text-lg opacity-40 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </section>

            {/* Secure Clearance Footer */}
            <div className="px-6 flex flex-col items-center text-center space-y-4">
               <div className="flex items-center gap-4 text-secondary/40">
                  <span className="material-symbols-outlined text-[20px]">encrypted</span>
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
               </div>
               <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.25em] leading-relaxed">
                  Basaveshwara Agro Kendra <br /> Secure Transaction Layer v1.0
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
