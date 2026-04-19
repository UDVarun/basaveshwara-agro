"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Leaf } from "lucide-react";
import GardenerCanvas from "@/components/auth/GardenerCanvas";

interface AuthShellProps {
  mode: "login" | "register";
  children: ReactNode;
}

const content = {
  login: {
    eyebrow: "Customer Access",
    ctaLabel: "Need a new account?",
    ctaHref: "/register",
    ctaText: "Create one",
  },
  register: {
    eyebrow: "Create Account",
    ctaLabel: "Already registered?",
    ctaHref: "/login",
    ctaText: "Sign in",
  },
} as const;

export default function AuthShell({ mode, children }: AuthShellProps) {
  const current = content[mode];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f1ee] text-stone-900">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-white shadow-md shadow-primary/15">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="hidden sm:block">Basaveshwara Agro</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(31,27,23,0.14)] lg:min-h-[620px] lg:grid-cols-[0.54fr_0.46fr]">
            <section className="relative min-h-[300px] overflow-hidden bg-[#efefed] sm:min-h-[360px] lg:min-h-[620px]">
              <GardenerCanvas className="scale-[1.01]" />

              <div className="absolute left-5 top-5 max-w-[220px] rounded-[16px] border border-white/70 bg-white/68 px-3.5 py-2.5 shadow-[0_16px_36px_-28px_rgba(31,27,23,0.3)] backdrop-blur-sm sm:left-6 sm:top-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  {current.eyebrow}
                </div>
                <p className="mt-1.5 text-[13px] leading-5 text-stone-700">
                  The gardener follows your cursor with a soft glance while watering the plant.
                </p>
              </div>
            </section>

            <section className="flex items-center justify-center bg-white px-5 py-6 sm:px-7 lg:px-10">
              <div className="w-full max-w-[360px]">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[2px] bg-black text-lg font-semibold text-white">
                    BA
                  </div>
                  <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-stone-950">
                    {mode === "login" ? "Welcome back!" : "Create account"}
                  </h1>
                  <p className="mt-3 text-[15px] text-stone-700">
                    {mode === "login"
                      ? "Please enter your details"
                      : "Start with your account details"}
                  </p>
                </div>

                {children}

                <p className="mt-6 text-center text-sm text-stone-600">
                  {current.ctaLabel}{" "}
                  <Link
                    href={current.ctaHref}
                    className="font-semibold text-primary transition-colors hover:text-secondary"
                  >
                    {current.ctaText}
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
