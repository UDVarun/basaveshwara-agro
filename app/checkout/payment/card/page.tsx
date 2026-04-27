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
  CreditCard,
  HelpCircle,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CardPaymentPage() {
  const { status } = useSession();
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const { items, isHydrated } = state;

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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
      setTimeout(() => setError(null), 3500);
    }, 400);
  };

  const [cardBrand, setCardBrand] = useState("Agrarian Premium");

  useEffect(() => {
    const clean = cardNumber.replace(/\s/g, '');
    
    // 1. Dynamic Issuer Identification (BIN Lookup)
    if (clean.startsWith('4')) setCardBrand("VISA");
    else if (clean.startsWith('5')) setCardBrand("MASTERCARD");
    else if (clean.startsWith('34') || clean.startsWith('37')) setCardBrand("AMEX");
    else if (clean.startsWith('6')) setCardBrand("DISCOVER");
    else setCardBrand("Agrarian Premium");

    // 2. Institutional "Fetch" Mock for Specific Testing
    // NOTE: Personal card details cannot be fetched without a real PCI-compliant
    // banking gateway (Stripe/Paypal) for security and privacy reasons.
    if (clean === "4242424242424242") {
      const timer = setTimeout(() => {
         setCardName("VISA TEST USER");
      }, 800);
      return () => clearTimeout(timer);
    } else if (clean === "5105105105105105") {
      const timer = setTimeout(() => {
        setCardName("MASTERCARD ELITE");
     }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [cardNumber]);

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/products");
    }
  }, [isHydrated, items, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ─── Institutional Validation Logic ────────────────────────
    const cleanNumbers = cardNumber.replace(/\s/g, '');
    
    // 1. Luhn Algorithm for Card Integrity
    const validateLuhn = (num: string) => {
      if (num.length < 13 || num.length > 19) return false;
      let sum = 0;
      let shouldDouble = false;
      for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num.charAt(i));
        if (shouldDouble) {
          if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };

    // 2. Expiry Precision
    const validateExpiryDate = (val: string) => {
      const parts = val.split('/');
      if (parts.length !== 2) return false;
      const m = parseInt(parts[0]!);
      const y = parseInt(parts[1]!);
      if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return false;
      
      const now = new Date();
      const curM = now.getMonth() + 1;
      const curY = parseInt(now.getFullYear().toString().slice(-2));
      
      if (y < curY) return false;
      if (y === curY && m < curM) return false;
      return true;
    };

    // ─── Validation Sequence ────────────────────────────────────
    if (cleanNumbers.length < 13 || !validateLuhn(cleanNumbers)) {
      notifyError("Invalid card number. Handshake rejected by network.");
      return;
    }
    if (!validateExpiryDate(expiry)) {
      notifyError("Institutional expiry invalid. Update credentials.");
      return;
    }
    if (cvv.length < 3) {
      notifyError("CVV mismatch. Secure tag required.");
      return;
    }
    if (cardName.length < 3) {
      notifyError("Identity required. Fetching failed or name missing.");
      return;
    }

    const handleProcessPayment = async () => {
      setIsProcessing(true);
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
            paymentMethod: "card"
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Order synchronization failed.");
        }

        // 3. Navigate to success manifest
        router.push("/checkout/success");
        
      } catch (err: any) {
        console.error("[Card-Payment] Order Error:", err);
        notifyError(err.message || "Something went wrong. Order could not be synced.");
      } finally {
        setIsProcessing(false);
      }
    };

    await handleProcessPayment();
  };

  if (!isHydrated || status === "loading") return null;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-body selection:bg-[#004534]/10 antialiased font-body">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Payment Form */}
          <div className="lg:col-span-7 space-y-12">
            <header>
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-[#004534] mb-4">Payment Method</h1>
              <p className="text-[#57534e] text-lg leading-relaxed font-light">Securely complete your agrarian investment with our encrypted checkout.</p>
            </header>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-amber-50 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-headline font-bold text-amber-800 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Credit Card Visual */}
            <div className="relative w-full aspect-[1.586/1] max-w-md mx-auto group">
              <motion.div 
                variants={shakeVariants}
                animate={shake ? "shake" : { rotateY: 0, opacity: 1 }}
                initial={{ rotateY: -10, opacity: 0 }}
                className="absolute inset-0 bg-[#004534] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 transform group-hover:scale-[1.02]"
              >
                {/* Decorative Abstract Background */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#fe932c] rounded-full blur-[100px]"></div>
                  <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#065f46] rounded-full blur-[100px]"></div>
                </div>
                
                {/* Content Layer */}
                <div className="relative h-full w-full p-10 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-headline uppercase tracking-[0.2em] opacity-60 transition-all">{cardBrand}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                          <div className="w-8 h-6 border border-white/40 rounded-sm"></div>
                        </div>
                        {cardBrand !== "Agrarian Premium" && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/20 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30 text-[8px] font-bold uppercase tracking-[0.1em]"
                          >
                            Secure Banking Link Active
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <BadgeCheck className="w-8 h-8 opacity-40" />
                  </div>
                  
                  <div className="space-y-8">
                    <div className="text-2xl md:text-3xl font-headline tracking-[0.25em] font-medium">
                      {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[9px] uppercase tracking-widest opacity-50">Card Holder</p>
                        <p className="font-headline font-bold uppercase tracking-wider text-sm md:text-base">{cardName || "Your Name Here"}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] uppercase tracking-widest opacity-50">Expires</p>
                        <p className="font-headline font-semibold text-sm md:text-base tracking-widest">{expiry || "MM/YY"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment Form Fields */}
            <form onSubmit={handlePayment} className="space-y-10 max-w-2xl">
              <motion.div 
                variants={shakeVariants}
                animate={shake ? "shake" : ""}
                className="space-y-8"
              >
                <div className="group">
                  <label className="block text-[10px] font-bold text-[#004534] mb-3 uppercase tracking-[0.2em] opacity-50">Cardholder Name</label>
                  <input 
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#004534]/10 focus:ring-0 focus:border-[#004534] transition-all py-4 px-0 text-xl font-headline placeholder:text-stone-300" 
                    placeholder="Johnathan Doe" 
                    type="text"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-bold text-[#004534] mb-3 uppercase tracking-[0.2em] opacity-50">Card Number</label>
                  <div className="relative">
                    <input 
                      required
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                        if (val.length <= 16) {
                          setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
                        }
                      }}
                      className="w-full bg-transparent border-0 border-b border-[#004534]/10 focus:ring-0 focus:border-[#004534] transition-all py-4 px-0 text-xl font-headline placeholder:text-stone-300" 
                      placeholder="0000 0000 0000 0000" 
                      type="text"
                    />
                    <CreditCard className="absolute right-0 bottom-4 text-[#004534]/20 w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#004534] mb-3 uppercase tracking-[0.2em] opacity-50">Expiry Date</label>
                    <input 
                      required
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 4) val = val.slice(0, 4);
                        if (val.length >= 3) {
                          setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
                        } else {
                          setExpiry(val);
                        }
                      }}
                      className="w-full bg-transparent border-0 border-b border-[#004534]/10 focus:ring-0 focus:border-[#004534] transition-all py-4 px-0 text-xl font-headline placeholder:text-stone-300" 
                      placeholder="MM / YY" 
                      type="text"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#004534] mb-3 uppercase tracking-[0.2em] opacity-50">CVV</label>
                    <div className="relative">
                      <input 
                        required
                        value={cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 3) setCvv(val);
                        }}
                        className="w-full bg-transparent border-0 border-b border-[#004534]/10 focus:ring-0 focus:border-[#004534] transition-all py-4 px-0 text-xl font-headline placeholder:text-stone-300" 
                        placeholder="•••" 
                        type="password"
                      />
                      <HelpCircle className="absolute right-0 bottom-4 text-[#004534]/20 w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-4">
                <input className="rounded-sm border-[#004534]/20 text-[#004534] focus:ring-[#004534] h-5 w-5 bg-transparent" id="save-card" type="checkbox"/>
                <label className="text-[#3f4944] font-medium text-xs opacity-60 uppercase tracking-widest" htmlFor="save-card">Save this card for future agrarian investments.</label>
              </div>

              <button 
                className="w-full bg-[#004534] text-white py-6 rounded-xl font-headline font-bold text-lg uppercase tracking-widest hover:bg-[#065f46] transition-all shadow-xl hover:shadow-[#004534]/20 flex items-center justify-center gap-4 group" 
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Process Payment — {formatPaisePrice(totalCharge, "INR")}</span>
                    <Lock className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-[#f5f5f4] rounded-[3rem] p-10 md:p-12 sticky top-32 border border-[#004534]/5">
              <h2 className="text-2xl font-headline font-black text-[#004534] mb-12 uppercase tracking-widest">Manifest Summary</h2>
              
              <div className="space-y-10 mb-12">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-8 group">
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm p-2">
                      <img 
                        className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500" 
                        alt={item.title}
                        src={item.imageUrl || ""} 
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                      <h3 className="font-headline font-bold text-[#004534] uppercase text-xs tracking-tight">
                        {item.quantity}x {item.title}
                      </h3>
                      <p className="text-[#3f4944] text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Institutional Grade</p>
                      <p className="text-[#004534] font-bold mt-2 text-lg tracking-tighter">{formatPaisePrice(item.price * item.quantity, "INR")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#004534]/10 pt-10 space-y-5">
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-50">
                  <span>Subtotal</span>
                  <span className="text-[#1c1917]">{formatPaisePrice(subtotal, "INR")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-50">
                  <span>Sustainable Shipping</span>
                  <span className="text-[#1c1917]">{formatPaisePrice(shippingCharge, "INR")}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#57534e] uppercase tracking-widest opacity-50">
                  <span>Tax (Calculated)</span>
                  <span className="text-[#1c1917]">{formatPaisePrice(taxCharge, "INR")}</span>
                </div>
                <div className="flex justify-between text-2xl font-headline font-black text-[#004534] pt-8 tracking-tighter">
                  <span>Total</span>
                  <span>{formatPaisePrice(totalCharge, "INR")}</span>
                </div>
              </div>

              <div className="mt-12 bg-[#004534] rounded-2xl p-8 flex gap-6 items-start border border-white/10 group overflow-hidden relative">
                <Sprout className="text-white w-6 h-6 shrink-0 relative z-10" />
                <div className="space-y-2 relative z-10">
                  <p className="text-xs font-headline font-bold text-white uppercase tracking-widest">Agrarian Guarantee</p>
                  <p className="text-[11px] text-white/70 leading-relaxed font-light">
                    Your purchase supports small-batch regenerative farming practices. Returns accepted within 30 days of harvest.
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f4] border-t border-[#004534]/5 pt-24 pb-12 mt-24">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-24">
            <div className="space-y-8">
              <div className="font-headline font-black text-[#004534] text-xl uppercase tracking-[0.2em]">Modern Agrarian</div>
              <p className="text-xs leading-loose font-light text-[#57534e] tracking-wide">
                Preserving heritage farming through curation and the direct distribution of earth&apos;s most exceptional yields.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#004534] uppercase tracking-widest">Ecosystem</h4>
              <nav className="flex flex-col gap-4 font-body">
                <a className="text-[11px] text-[#57534e] hover:text-[#004534] transition-colors font-bold uppercase tracking-wider opacity-60" href="#">Sustainability</a>
                <a className="text-[11px] text-[#57534e] hover:text-[#004534] transition-colors font-bold uppercase tracking-wider opacity-60" href="#">Shipping & Returns</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#004534] uppercase tracking-widest">Newsletter</h4>
              <p className="text-[11px] font-bold text-[#57534e] leading-relaxed uppercase tracking-wider opacity-40">Seasonal updates from the farm.</p>
              <div className="flex gap-4 border-b border-[#004534]/10 pb-4">
                <input className="bg-transparent border-none p-0 text-xs w-full focus:ring-0 placeholder:text-stone-300" placeholder="heritage@land.com" type="email"/>
                <ArrowRight className="w-4 h-4 text-[#004534] opacity-40 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-[#004534]/5 flex justify-between items-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#57534e] opacity-40">
              © 2024 Modern Agrarian. Cultivating Excellence.
            </p>
            <div className="flex gap-8">
              <Globe className="w-4 h-4 text-[#004534] opacity-20" />
              <Mail className="w-4 h-4 text-[#004534] opacity-20" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
