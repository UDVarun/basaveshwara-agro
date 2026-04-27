"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface AuthFormProps {
  type?: "login" | "register";
}

const formCopy = {
  login: {
    submit: "Send Code",
    google: "Continue with Google",
    footer: "Secure access via one-time code or Google.",
  },
  register: {
    submit: "Send Code",
    google: "Register with Google",
    footer: "Your account is created securely via your email or Google.",
  },
} as const;

export default function AuthForm({ type = "login" }: AuthFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const copy = formCopy[type];

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send code. Please try again.");
        return;
      }

      // Transition to the OTP entry step
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Handle OTP input ───────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  // ── Step 3: Verify OTP server-side ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      // 1. Call our secure server-side verification endpoint
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. OTP verified server-side — now create a session via Credentials provider
      //    The provider reads the Redis verified flag, NOT the OTP itself
      const result = await signIn("email-otp", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Session creation failed. Please try verifying again.");
        setIsLoading(false);
        return;
      }

      // 3. Redirect to profile on success
      window.location.href = result?.url || "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full">
      <div className="rounded-[8px] bg-white">
        {/* Tab toggle */}
        <div className="mb-6 grid grid-cols-2 rounded-[14px] bg-stone-100 p-1.5">
          <Link
            href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className={`rounded-[10px] px-4 py-3 text-center text-sm font-semibold transition-colors ${
              type === "login"
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Sign in
          </Link>
          <Link
            href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className={`rounded-[10px] px-4 py-3 text-center text-sm font-semibold transition-colors ${
              type === "register"
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Register
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Email Step ─────────────────────────────────────────────────── */}
          {step === "email" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-0.5 text-sm font-medium text-stone-900">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-stone-900" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border-0 border-b border-stone-300 bg-transparent py-3 pr-4 pl-8 text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-stone-950"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Divider */}
                <div className="relative py-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 font-semibold tracking-[0.24em] text-stone-400">
                      Or
                    </span>
                  </div>
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-stone-200 bg-white py-3 font-semibold text-stone-700 transition-all active:scale-[0.99] hover:border-stone-300 hover:bg-stone-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  {copy.google}
                </button>

                {/* Send Code */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-semibold text-white transition-all active:scale-[0.99] hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {copy.submit}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ── OTP Step ──────────────────────────────────────────────────── */
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[8px] bg-emerald-50 text-emerald-700 shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                Check your email
              </h3>
              <p className="mb-8 px-4 text-sm leading-6 text-stone-600">
                We&apos;ve sent a 6-digit security code to <br />
                <span className="font-semibold text-stone-900">{email}</span>
              </p>

              {/* 6-digit OTP boxes */}
              <div className="mb-5 flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-12 w-10 rounded-[8px] border border-stone-200 bg-stone-50 text-center text-xl font-semibold text-stone-900 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-900/10 sm:h-14 sm:w-12 sm:text-2xl"
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 text-left">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {/* Verify button */}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-semibold text-white transition-all active:scale-[0.99] hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Change email */}
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); setOtp(["","","","","",""]); }}
                  className="block w-full text-sm font-semibold text-stone-500 transition-colors hover:text-stone-800"
                >
                  Change email address
                </button>

                {/* Resend */}
                <div className="text-sm text-stone-400">
                  Didn&apos;t receive a code?{" "}
                  <button
                    type="button"
                    onClick={() => handleEmailSubmit()}
                    disabled={isLoading}
                    className="ml-1 font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
                  >
                    Resend
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 border-t border-stone-200 pt-3">
          <p className="text-sm leading-5 text-stone-500">{copy.footer}</p>
        </div>
      </div>
    </div>
  );
}
