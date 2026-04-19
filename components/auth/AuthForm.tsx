"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

interface AuthFormProps {
  type?: "login" | "register";
}

export default function AuthForm({ type = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // In a real headless OAuth flow with Shopify, we'd start the sign-in 
      // process here. For the "New Customer Accounts" API, we typically 
      // redirect to Shopify's authorize endpoint with the login_hint.
      
      // Simulating a smooth transition to OTP state as requested
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Initiate Shopify Sign-in
      // We use login_hint to pre-fill the email on Shopify's side
      await signIn("shopify", { 
        callbackUrl: "/profile",
        redirect: true,
        // We'll pass the email as a hint if the provider configuration allows it
        // Or handle the redirect manually if needed.
      }, { login_hint: email });

      setStep("otp");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-stone-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
            {type === "login" ? "Welcome Back" : "Join the Community"}
          </h2>
          <p className="text-stone-500 font-medium">
            {type === "login" 
              ? "Manage your harvests and orders securely" 
              : "Create an account to start your farming journey"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {type === "login" ? "Sign In" : "Register"}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 px-4 text-stone-400 font-bold tracking-widest backdrop-blur-sm">
                      OR
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-stone-50 text-stone-700 font-semibold py-4 rounded-2xl border border-stone-200 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </button>

                <div className="text-center mt-6">
                  <p className="text-stone-500 text-sm">
                    {type === "login" ? "Don't have an account?" : "Already have an account?"}
                    <Link 
                      href={type === "login" ? "/register" : "/login"}
                      className="text-emerald-700 hover:text-emerald-800 font-bold ml-1 transition-colors"
                    >
                      {type === "login" ? "Register now" : "Sign in here"}
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Check your email</h3>
              <p className="text-stone-500 mb-8 px-4">
                We&apos;ve sent a 6-digit security code to <br />
                <span className="text-stone-800 font-semibold">{email}</span>
              </p>

              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 bg-stone-50 border border-stone-200 rounded-xl text-center text-2xl font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setStep("email")}
                  className="text-stone-500 hover:text-stone-800 text-sm font-semibold transition-colors"
                >
                  Change email address
                </button>
                <div className="text-stone-400 text-sm">
                  Didn&apos;t receive a code?{" "}
                  <button className="text-emerald-700 hover:text-emerald-800 font-bold ml-1">
                    Resend
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center mt-8 text-stone-400 text-sm font-medium px-4">
        Securely authenticated by Shopify Customer Accounts. <br />
        By continuing, you agree to our Terms of Service.
      </p>
    </div>
  );
}
