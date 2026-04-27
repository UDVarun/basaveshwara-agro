"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPaisePrice } from "@/lib/format";
import { useSession } from "next-auth/react";
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Package, 
  Scan,
  Sprout,
  Mail,
  LocateFixed,
  Globe,
  Wallet,
  Banknote,
  Navigation,
  Map,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CODPaymentPage() {
  const { status } = useSession();
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const { items, isHydrated } = state;

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Financials
  const shippingCharge = 0; // "FREE" as per the user's provided COD HTML
  const taxCharge = 0; // Tax 0 in their COD example
  const totalCharge = subtotal; // subtotal only

  // Shake animation variant
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  const notifyError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setTimeout(() => setError(null), 3500);
    }, 400);
  };

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/products");
    }
  }, [isHydrated, items, router]);

  const handlePlaceOrder = async () => {
    setIsFinalizing(true);
    setError(null);
    try {
      // 1. Retrieve persistent shipping info from session storage
      const savedShipping = sessionStorage.getItem("agro_shipping");
      const shippingAddress = savedShipping ? JSON.parse(savedShipping) : {
        firstName: "Guest",
        lastName: "Customer",
        address1: "Pending Verification",
        city: "Unknown",
        state: "Karnataka",
        zip: "000000"
      };

      // 2. Transmit to Shopify Sync API
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          shippingAddress: {
            firstName: shippingAddress.fname || shippingAddress.firstName,
            lastName: shippingAddress.lname || shippingAddress.lastName,
            address1: shippingAddress.address || shippingAddress.address1,
            city: shippingAddress.city,
            state: "Karnataka", // Defaulting to region as per design brief
            zip: shippingAddress.pincode || shippingAddress.zip
          },
          paymentMethod: "cod"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order synchronization failed.");
      }

      // 3. Navigate to success manifest
      router.push("/checkout/success");
      
    } catch (err: any) {
      console.error("[COD-Payment] Order Error:", err);
      notifyError(err.message || "Something went wrong. Order could not be synced.");
    } finally {
      setIsFinalizing(false);
    }
  };

  if (!isHydrated || status === "loading") return null;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-body selection:bg-[#004534]/10 antialiased">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#fafaf9]/80 backdrop-blur-md border-b border-[#004534]/5">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 md:px-16 py-6 font-headline">
          <Link href="/" className="text-xl font-black text-[#004534] tracking-[0.2em] uppercase">
            Modern Agrarian
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {["Home", "Products", "About Us", "Contact Us"].map((link) => (
              <a key={link} className="text-[11px] font-bold uppercase tracking-widest text-[#57534e] hover:text-[#004534] transition-colors" href="#">
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-[#004534]">shopping_cart</span>
            <span className="material-symbols-outlined text-[#004534]">account_circle</span>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 md:px-16 pt-40 pb-24">
        {/* Editorial Header */}
        <header className="mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#904d00] font-headline font-bold tracking-[0.3em] uppercase text-[10px] block mb-4">Secure Checkout</span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-[#004534] tracking-tighter leading-[1.05] mb-8">
              Confirm your <br />selection.
            </h1>
            <p className="text-xl text-[#57534e] leading-relaxed max-w-xl font-light">
              We believe in the integrity of the handshake. Your order is prepared with precision and delivered with transparency.
            </p>
          </motion.div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Checkout Details */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Payment: COD Confirmation */}
            <section className="bg-[#f5f5f4] p-10 md:p-14 rounded-t-[3rem] rounded-b-xl group transition-all duration-500 hover:bg-[#eaeaea] shadow-sm">
              <div className="flex justify-between items-start mb-14">
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold text-[#004534]">Payment at Doorstep</h2>
                  <p className="text-[#57534e] font-light">Pay only when you touch and feel the quality.</p>
                </div>
                <div className="p-5 bg-[#004534] rounded-[1.5rem] text-white shadow-xl shadow-[#004534]/20">
                  <Banknote className="w-8 h-8" />
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border-l-4 border-[#004534] shadow-sm">
                <p className="text-[#1c1917] font-bold text-xs uppercase tracking-widest mb-6 opacity-60">How it works:</p>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 text-sm font-medium text-[#3f4944]">
                    <CheckCircle2 className="text-[#004534] w-5 h-5 shrink-0" />
                    Hand over the exact amount to our courier.
                  </li>
                  <li className="flex items-center gap-4 text-sm font-medium text-[#3f4944]">
                    <CheckCircle2 className="text-[#004534] w-5 h-5 shrink-0" />
                    Receive your digital receipt via email instantly.
                  </li>
                </ul>
              </div>
            </section>

            {/* Delivery Address & Trust Badge */}
            <section className="bg-[#f5f5f4] p-10 md:p-14 rounded-xl group transition-all duration-500 hover:bg-[#eaeaea] shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <h2 className="text-3xl font-headline font-bold text-[#004534]">Delivery Details</h2>
                <div className="flex items-center gap-3 bg-[#b0f0d6] px-5 py-2 rounded-full border border-[#004534]/10">
                  <BadgeCheck className="text-[#002117] w-4 h-4" />
                  <span className="text-[#002117] text-[10px] font-black uppercase tracking-[0.2em]">Authentic Delivery</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="text-[#904d00] uppercase tracking-[0.3em] text-[10px] font-black opacity-60">Shipping Address</div>
                  <address className="not-italic text-lg text-[#1c1917] leading-relaxed font-light">
                    Arthur J. Sterling<br />
                    4822 Willow Creek Estates<br />
                    Hudson Valley, NY 12534<br />
                    United States
                  </address>
                </div>
                <div className="space-y-6">
                  <div className="text-[#904d00] uppercase tracking-[0.3em] text-[10px] font-black opacity-60">Estimated Arrival</div>
                  <div className="text-lg text-[#1c1917] leading-relaxed font-light">
                    Thursday, Oct 24th<br />
                    <span className="text-[#004534] font-bold">Between 9:00 AM — 12:00 PM</span>
                  </div>
                </div>
              </div>
            </section>

            {/* World Map Overlay */}
            <section className="relative h-[450px] overflow-hidden rounded-xl rounded-b-[3rem] bg-[#e2d8d2] group shadow-sm">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOBCKaT-_z2QQIJRCfRF6TMbIFZSQR2erC-QGIG2awPT3RSDZRIj0U2Uv5Yx9XxIfRX6nrGdADutXvvIPpGpqi9aP6vChp5a4MT6ejBJ8MoidJMc8Qb1PwmLT6AOX3BAYUW7ATgl3ppVrCAZfD0YIT1vL53FXzeDzjTWRR-GWtYDdEri6nb1J-4exifmBahEcK-4KOLfv4LzMyCzPky7k7TqkriPtDIaDQ8LTBa-EpiZBy-PeEgMl3AaA8ns5z6uwGYbJ6jhWRZ_k"
                alt="Logistics Map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#e2d8d2] via-transparent to-transparent"></div>
              <div className="relative z-10 p-10 md:p-14 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-headline font-bold text-[#004534] mb-3">Our Network</h2>
                  <p className="text-[#3f4944] max-w-xs font-medium opacity-80">Cultivating connections from our soil to your doorstep, globally.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#fe932c] animate-pulse"></div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#004534]">Active Hubs: 42</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#004534]"></div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#004534]">Countries Served: 18</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <aside className="sticky top-32 bg-white p-10 rounded-[3rem] border border-[#004534]/5 shadow-2xl shadow-[#004534]/5">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-headline font-black text-[#004534] uppercase tracking-widest">Order Summary</h3>
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-amber-200"
                    >
                      Sync Error
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="space-y-10 mb-14">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-8 items-center group">
                    <div className="w-20 h-20 shrink-0 bg-[#f5f5f4] rounded-2xl overflow-hidden p-2">
                       {item.imageUrl && (
                        <img 
                          className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500" 
                          src={item.imageUrl} 
                          alt={item.title}
                        />
                       )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline font-bold text-[#004534] text-xs uppercase tracking-tight leading-tight">
                        {item.quantity}x {item.title}
                      </h4>
                      <p className="text-[#3f4944] text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1.5">Institutional Reserve</p>
                      <div className="mt-2 text-lg font-bold text-[#004534] tracking-tighter">{formatPaisePrice(item.price * item.quantity, "INR")}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 py-10 border-y border-[#004534]/10">
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-40">
                  <span>Subtotal</span>
                  <span>{formatPaisePrice(subtotal, "INR")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-40">
                  <span>Delivery Fee</span>
                  <span className="text-[#904d00] font-black">FREE</span>
                </div>
              </div>

              <div className="py-12 flex flex-col gap-4">
                <div>
                  <span className="text-[#57534e] text-[10px] uppercase tracking-[0.3em] font-black opacity-40 block mb-2">Payable at Delivery</span>
                  <div className="text-6xl font-headline font-bold text-[#004534] tracking-tighter leading-none">{formatPaisePrice(totalCharge, "INR")}</div>
                </div>
                <div className="flex items-center gap-3">
                   <Sprout className="w-4 h-4 text-[#904d00] opacity-60" />
                   <span className="text-[10px] font-bold text-[#904d00]/60 uppercase tracking-widest">Sustainability Verified</span>
                </div>
              </div>

              <motion.button 
                variants={shakeVariants}
                animate={shake ? "shake" : ""}
                onClick={handlePlaceOrder}
                disabled={isFinalizing}
                className="w-full bg-[#004534] text-white py-6 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.3em] hover:bg-[#065f46] transition-all duration-300 shadow-xl shadow-[#004534]/20 flex justify-center items-center gap-4 group disabled:opacity-50"
              >
                {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Confirm & Place Order
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </>
                )}
              </motion.button>
              
              <p className="mt-8 text-center text-[#57534e] text-[10px] font-medium leading-loose opacity-40 uppercase tracking-widest">
                By placing this order, you agree to our <br/>Terms of Stewardship.
              </p>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f4] border-t border-[#004534]/5 pt-24 pb-12 mt-24 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
            <div className="space-y-8">
              <div className="font-headline font-black text-[#004534] text-xl uppercase tracking-[0.2em]">Modern Agrarian</div>
              <p className="text-xs leading-loose font-light text-[#57534e] tracking-wide">
                Cultivating excellence through sustainable practices and direct-to-door transparency.
              </p>
            </div>
            <div className="space-y-8">
              <div className="text-[#004534] font-black text-[10px] uppercase tracking-widest opacity-40">Navigation</div>
              <ul className="space-y-4 font-body">
                {["Sustainability", "Shipping & Returns", "Privacy", "Journal"].map(item => (
                  <li key={item}><a className="text-[11px] text-[#57534e] hover:text-[#004534] transition-colors font-bold uppercase tracking-wider opacity-60" href="#">{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <div className="text-[#004534] font-black text-[10px] uppercase tracking-widest opacity-40">Connect</div>
              <ul className="space-y-4 font-body">
                {["Instagram", "LinkedIn", "Newsletter"].map(item => (
                  <li key={item}><a className="text-[11px] text-[#57534e] hover:text-[#004534] transition-colors font-bold uppercase tracking-wider opacity-60" href="#">{item}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#57534e] opacity-40">
                  © 2024 Modern Agrarian.
              </p>
              <div className="flex gap-6">
                <Sprout className="w-5 h-5 text-[#004534] opacity-30" />
                <Globe className="w-5 h-5 text-[#004534] opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
