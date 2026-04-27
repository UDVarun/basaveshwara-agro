"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { 
  ShieldCheck, 
  Lock, 
  Loader2,
  Check,
  Package,
  QrCode,
  CreditCard,
  Banknote,
  Verified,
  Library,
  Sprout,
  Egg,
  Truck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal } = useCart();
  const { items, isHydrated } = state;

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isBillingSame, setIsBillingSame] = useState(true);

  // Financial calculations
  const shippingCharge = 850; // Mock: $8.50 scaled for ₹
  const taxCharge = 420; // Mock: $4.20 scaled for ₹
  const totalCharge = subtotal + shippingCharge + taxCharge;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push("/checkout/success");
  };

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-headline font-bold text-[#004534] mb-4">Your basket is empty</h1>
          <p className="text-[#3f4944] mb-8 font-body opacity-70">Begin your agricultural journey by selecting our premium inputs.</p>
          <Link href="/products" className="inline-block bg-[#004534] text-white px-12 py-5 rounded-lg font-headline font-bold uppercase tracking-widest hover:bg-[#1e5d4a] transition-all">
            Return to Fields
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1f1b17] font-body selection:bg-[#95d3ba] selection:text-[#002117] antialiased">
      {/* Header: Identity Anchor */}
      <header className="bg-[#fff8f5] border-b border-[#f0e6e0]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-12 py-8">
          <Link href="/" className="text-2xl font-headline font-black text-[#004534] uppercase tracking-widest">
            MODERN AGRARIAN
          </Link>
          <div className="flex items-center gap-4 text-[#3f4944] font-medium">
            <Lock className="w-5 h-5 opacity-40" />
            <span className="text-sm tracking-widest uppercase font-bold opacity-60">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Primary Form Section */}
          <div className="lg:col-span-7 space-y-24">
            
            {/* Step 01: Shipping Information */}
            <section id="shipping-info">
              <div className="mb-12">
                <span className="text-[#904d00] font-bold tracking-widest text-[10px] uppercase mb-2 block">Step 01</span>
                <h2 className="text-4xl font-headline font-bold tracking-tight text-[#004534]">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  { id: "fname", label: "First Name", placeholder: "Farmer" },
                  { id: "lname", label: "Last Name", placeholder: "Gowda" },
                  { id: "address", label: "Street Address", placeholder: "123 Agrarian Way", full: true },
                  { id: "city", label: "City / District", placeholder: "Hubballi" },
                  { id: "pincode", label: "Pincode", placeholder: "580020" },
                  { id: "phone", label: "Phone Number", placeholder: "+91 98765 43210", full: true },
                ].map((field) => (
                  <div key={field.id} className={`relative ${field.full ? "md:col-span-2" : ""}`}>
                    <input 
                      type="text" 
                      id={field.id}
                      placeholder=" "
                      className="block w-full px-0 py-4 bg-transparent border-0 border-b-2 border-[#bec9c2] focus:border-[#004534] focus:ring-0 transition-all peer font-medium"
                    />
                    <label 
                      htmlFor={field.id}
                      className="absolute left-0 top-4 text-[#6f7973] pointer-events-none transition-all duration-200 origin-left peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-focus:text-[#004534] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-4 group cursor-pointer" onClick={() => setIsBillingSame(!isBillingSame)}>
                <div className={`relative w-12 h-6 rounded-full transition-colors ${isBillingSame ? "bg-[#004534]" : "bg-[#f0e6e0]"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isBillingSame ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <label className="text-[#3f4944] font-medium text-sm cursor-pointer select-none">Billing address is same as shipping</label>
              </div>
            </section>

            {/* Step 02: Payment Method */}
            <section className="pt-12" id="payment-methods">
              <div className="mb-12">
                <span className="text-[#904d00] font-bold tracking-widest text-[10px] uppercase mb-2 block">Step 02</span>
                <h2 className="text-4xl font-headline font-bold tracking-tight text-[#004534]">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: "upi", label: "UPI Transfer", desc: "Google Pay, PhonePe, or BHIM", icon: QrCode },
                  { id: "card", label: "Credit or Debit Card", desc: "Secure checkout with Visa, Master, or Amex", icon: CreditCard },
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your harvest", icon: Banknote },
                ].map((method) => (
                  <label key={method.id} className="relative block group cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-between p-8 rounded-xl bg-[#fcf2eb] transition-all duration-300 peer-checked:bg-[#1e5d4a] peer-checked:ring-2 peer-checked:ring-[#004534] ring-inset">
                      <div className="flex items-center gap-6">
                        <method.icon className={`w-8 h-8 ${paymentMethod === method.id ? "text-[#95d4bb]" : "text-[#004534]"}`} />
                        <div>
                          <p className={`font-headline font-bold text-lg ${paymentMethod === method.id ? "text-white" : "text-[#1f1b17]"}`}>{method.label}</p>
                          <p className={`text-sm ${paymentMethod === method.id ? "text-white/70" : "text-[#3f4944]"}`}>{method.desc}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? "border-white" : "border-[#004534]"}`}>
                        {paymentMethod === method.id && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <div className="pt-12">
              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-8 bg-[#004534] text-white font-headline font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-[#1e5d4a] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isPlacingOrder ? <Loader2 className="w-6 h-6 animate-spin" /> : "Complete Order"}
              </button>
              <p className="text-center mt-6 text-[#3f4944] text-sm flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 opacity-40" />
                <span>Your transaction is encrypted and secure</span>
              </p>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <aside className="lg:col-span-5 sticky top-16">
            <div className="bg-[#fcf2eb] p-10 rounded-[2.5rem] shadow-sm">
              <h3 className="text-2xl font-headline font-bold text-[#004534] mb-10">Order Summary</h3>
              
              <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-6 group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white p-2">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-[#f6ece6] flex items-center justify-center rounded-lg">
                          <Package className="w-8 h-8 text-[#004534] opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-headline font-bold text-[#1f1b17] group-hover:text-[#004534] transition-colors line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-[#3f4944] mb-2 uppercase tracking-widest font-semibold opacity-60">Qty: {item.quantity} • Institutional</p>
                      <p className="font-bold text-[#004534]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-10 border-t border-[#bec9c2]/30">
                <div className="flex justify-between items-center text-[#3f4944] font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[#3f4944] font-medium">
                  <span>Sustainable Shipping</span>
                  <span>{formatPrice(shippingCharge)}</span>
                </div>
                <div className="flex justify-between items-center text-[#3f4944] font-medium">
                  <span>Agricultural Tax</span>
                  <span>{formatPrice(taxCharge)}</span>
                </div>
                <div className="flex justify-between items-center pt-8 text-3xl font-headline font-black text-[#004534] tracking-tighter">
                  <span>Total</span>
                  <span>{formatPrice(totalCharge)}</span>
                </div>
              </div>

              <div className="mt-12 p-8 bg-white/50 rounded-2xl border border-[#bec9c2]/20">
                <div className="flex gap-4 items-start">
                  <Library className="w-6 h-6 text-[#904d00] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold text-[#904d00] uppercase tracking-widest mb-1.5">Modern Agrarian Promise</p>
                    <p className="text-[11px] text-[#3f4944] leading-relaxed font-medium opacity-80">
                      Every purchase supports regenerative soil practices and fair-trade small farm collectives. Rooted in tradition, grown for the future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Hallmark Footer */}
      <footer className="bg-[#fcf2eb] rounded-t-[3rem] mt-24">
        <div className="max-w-7xl mx-auto py-24 px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="font-headline font-black text-[#004534] text-xl uppercase tracking-widest">Modern Agrarian</div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Cultivating excellence through modern architectural agricultural design and sustainable sourcing.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[#004534] uppercase tracking-widest text-xs">Explore</span>
            <Link href="/sustainability" className="text-stone-500 hover:text-[#004534] transition-all text-sm">Sustainability</Link>
            <Link href="/shipping" className="text-stone-500 hover:text-[#004534] transition-all text-sm">Shipping & Returns</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[#004534] uppercase tracking-widest text-xs">Company</span>
            <Link href="/privacy" className="text-stone-500 hover:text-[#004534] transition-all text-sm">Privacy</Link>
            <Link href="/journal" className="text-stone-500 hover:text-[#004534] transition-all text-sm">Journal</Link>
          </div>
          <div className="space-y-6">
            <span className="font-bold text-[#004534] uppercase tracking-widest text-xs">Heritage</span>
            <p className="text-stone-500 text-sm">© 2024 Modern Agrarian. Cultivating Excellence.</p>
            <div className="flex gap-4">
              <Sprout className="w-5 h-5 text-[#004534] cursor-pointer hover:scale-110 transition-transform" />
              <Egg className="w-5 h-5 text-[#004534] cursor-pointer hover:scale-110 transition-transform" />
              <div className="w-5 h-5 text-[#004534] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bec9c2; border-radius: 10px; }
      `}</style>
    </div>
  );
}
