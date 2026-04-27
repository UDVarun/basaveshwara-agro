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
  Globe
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UPIPaymentPage() {
  const { status } = useSession();
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const { items, isHydrated } = state;

  const [upiId, setUpiId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes session timer
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Financials
  const shippingCharge = 85000; // ₹850 in paise
  const taxCharge = 42000; // ₹420 in paise
  const totalCharge = subtotal + shippingCharge + taxCharge;

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
      setTimeout(() => setError(null), 3000);
    }, 400);
  };

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/products");
    }
  }, [isHydrated, items, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (!upiId) {
      notifyError("Please enter your Unified Payment ID");
      return;
    }
    if (!upiId.includes("@")) {
      notifyError("Invalid UPI ID format. Expected user@provider");
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    // Simulate premium verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const handleFinalize = async () => {
    if (!isVerified) {
      notifyError("Identity verification is required to proceed.");
      return;
    }

    setIsFinalizing(true);
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
          paymentMethod: "upi"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order synchronization failed.");
      }

      // 3. Navigate to success manifest
      router.push("/checkout/success");
      
    } catch (err: any) {
      console.error("[UPI-Payment] Order Error:", err);
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
        <header className="mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-headline text-6xl md:text-7xl font-bold text-[#004534] leading-[1.1] mb-8 tracking-tighter">
              Secure Checkout
            </h1>
            <p className="text-[#57534e] text-lg leading-relaxed font-light">
              Confirm your selection of artisanal harvests. Our encrypted gateway ensures the integrity of your agrarian procurement.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Payment Area */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-[#f5f5f4] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-black/[0.02]">
              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="font-headline text-3xl font-semibold text-[#004534] mb-3">UPI Payment</h2>
                  <p className="text-[#57534e] font-light">Verification via secure Unified Payments Interface.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                  {/* QR Visual */}
                  <div className="relative group">
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-8 shadow-xl flex flex-col items-center justify-center transition-all duration-700 hover:-translate-y-1">
                      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                        <div className="w-40 h-40 bg-stone-50 flex items-center justify-center overflow-hidden grayscale contrast-125">
                          <img 
                            alt="UPI QR Code" 
                            className="w-full h-full object-cover mix-blend-multiply opacity-80" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb8TS4KjDmDj2jOkkFKkovZ2DXJoAiiYE3nCDzn4M1AgxEkTlqH3mfjG340NsGzHNKXJetyBOormjNOg9WkvxdmWfpOsB5OpakVksNjcNfuWs4bd1UI77xf-z6-nOiFNHB3wjP-gVRQtmSSlleFEJpD-3OMZmNmxbk7CGaJewBaWmhzNyCpdH0edC5Qcatl_FUgeOyk_IIGTD0FoFllv63sNR0UCmY22bQ-AAxQ8vhi2I6q2xy16jml-89PKpxwmAsyv2eyWUhwKU"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-2 font-headline font-bold text-[10px] uppercase tracking-[0.15em] text-[#004534]">
                          <Scan className="w-3 h-3" />
                          Scan to Pay
                        </div>
                        <p className="text-[9px] text-[#57534e] mt-2 tracking-wide font-medium opacity-50 uppercase">GLOBAL UPI COMPLIANT</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 -z-10 bg-[#004534]/5 blur-3xl rounded-full scale-75 opacity-50 group-hover:opacity-80 transition-opacity" />
                  </div>

                  {/* Input Interaction */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-[10px] font-black text-[#004534] uppercase tracking-[0.2em] opacity-50">Unified Payment ID</label>
                        <AnimatePresence>
                          {error && (
                            <motion.span 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter"
                            >
                              {error}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative flex flex-col gap-3">
                        <motion.div 
                          variants={shakeVariants}
                          animate={shake ? "shake" : ""}
                          className="relative"
                        >
                          <input 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            disabled={isVerified}
                            className={`w-full bg-white border ${error ? 'border-amber-500/50 ring-2 ring-amber-500/5' : 'border-[#d6d3d1]/30'} focus:border-[#004534] focus:ring-0 px-6 py-4 rounded-xl text-base transition-all placeholder:text-[#d6d3d1]/60 font-light disabled:opacity-50`} 
                            placeholder="user@provider" 
                            type="text"
                          />
                          {isVerified && (
                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                          )}
                        </motion.div>
                        {!isVerified ? (
                          <button 
                            onClick={handleVerify}
                            disabled={!upiId.includes("@") || isVerifying}
                            className="bg-[#004534] text-white px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#065f46] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                          </button>
                        ) : (
                          <div className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-lg flex items-center gap-2">
                             Verified Account Active
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-[11px] text-[#57534e] font-medium tracking-wide italic opacity-40">e.g. agrarian@bank</p>
                    </div>

                    <div className="pt-8 border-t border-[#d6d3d1]/20">
                      <button 
                        onClick={handleFinalize}
                        disabled={!isVerified || isFinalizing}
                        className="w-full bg-[#004534] text-white py-5 rounded-xl font-headline font-bold text-sm tracking-[0.15em] uppercase hover:shadow-2xl hover:shadow-[#004534]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group"
                      >
                        {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            Finalize Order
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                      <div className="mt-6 flex items-center justify-between opacity-50">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#004534]">
                          Session: <span className="font-mono text-emerald-700">{formatTime(timeLeft)}</span>
                        </span>
                        <Lock className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 px-8 py-4 bg-white rounded-full border border-[#d6d3d1]/20 w-fit mx-auto lg:mx-0 shadow-sm">
              <ShieldCheck className="text-[#004534] w-4 h-4" />
              <span className="text-[10px] font-black text-[#57534e] tracking-[0.15em] uppercase">PCI-DSS Tier 1 Encrypted Environment</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-12">
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-[#d6d3d1]/10 shadow-xl shadow-black/[0.02]">
              <h3 className="font-headline text-xs font-black text-[#004534] uppercase tracking-[0.2em] mb-12 border-b border-[#d6d3d1]/10 pb-6">Manifest</h3>
              
              <div className="space-y-10">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-8 items-center group">
                    <div className="w-20 h-24 bg-[#f5f5f4] rounded-xl overflow-hidden shrink-0 relative p-2">
                       {item.imageUrl && (
                        <img 
                          alt={item.title} 
                          className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-110" 
                          src={item.imageUrl} 
                        />
                       )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline font-bold text-[#004534] text-xs leading-tight uppercase tracking-tight">
                        {item.quantity}x {item.title}
                      </h4>
                      <p className="text-[10px] text-[#57534e] font-bold mt-1.5 uppercase tracking-[0.1em] opacity-40">Organic Reserve</p>
                      <p className="font-headline font-bold text-[#004534] mt-3 text-lg leading-none tracking-tighter">{formatPaisePrice(item.price * item.quantity, "INR")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-[#d6d3d1]/10 space-y-5">
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-50">
                  <span>Subtotal</span>
                  <span className="text-[#1c1917]">{formatPaisePrice(subtotal, "INR")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-50">
                  <span>Shipping</span>
                  <span className="text-[#1c1917]">{formatPaisePrice(shippingCharge, "INR")}</span>
                </div>
                <div className="flex justify-between items-baseline pt-6">
                  <span className="font-headline text-xs font-black text-[#004534] uppercase tracking-[0.15em]">Total Payable</span>
                  <span className="font-headline text-3xl font-black text-[#004534] tracking-tighter">{formatPaisePrice(totalCharge, "INR")}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#004534] text-white rounded-[2.5rem] p-10 flex gap-6 items-start overflow-hidden relative group">
              <div className="p-3 bg-white/10 rounded-xl relative z-10">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="font-headline font-black text-[10px] uppercase tracking-[0.2em] mb-2">Impact Fulfillment</p>
                <p className="text-xs font-light text-white/70 leading-relaxed font-body">
                  Your procurement contributes to the 2024 reforestation of the Northern Plains. Rooted in tradition.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f4] border-t border-[#d6d3d1]/10 pt-24 pb-12 mt-24">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
              <div className="font-headline font-black text-[#004534] text-xl uppercase tracking-[0.2em]">Modern Agrarian</div>
              <p className="text-xs leading-loose font-light text-[#57534e] tracking-wide">
                Preserving heritage farming through curation and the direct distribution of earth&apos;s most exceptional yields.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#004534] uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-4">
                {["Sustainability", "Logistics", "Privacy Codex", "The Journal"].map(item => (
                  <li key={item}>
                    <a className="text-[11px] text-[#57534e] hover:text-[#004534] transition-colors font-bold uppercase tracking-wider opacity-60" href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#004534] uppercase tracking-widest">Inquiries</h4>
              <p className="text-[11px] font-bold text-[#57534e] leading-relaxed uppercase tracking-wider opacity-60">
                Heritage Plains, Farm 42<br />
                concierge@modernagrarian.com
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#004534] uppercase tracking-widest">Social</h4>
              <div className="flex gap-6">
                <Globe className="w-4 h-4 text-[#004534] opacity-50 cursor-pointer hover:opacity-100 transition-opacity" />
                <Mail className="w-4 h-4 text-[#004534] opacity-50 cursor-pointer hover:opacity-100 transition-opacity" />
                <LocateFixed className="w-4 h-4 text-[#004534] opacity-50 cursor-pointer hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-[#d6d3d1]/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#57534e] opacity-40">
              © 2024 Modern Agrarian. Cultivating Excellence.
            </p>
            <div className="flex gap-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#57534e] opacity-40">Terms</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#57534e] opacity-40">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
