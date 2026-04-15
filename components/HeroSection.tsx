"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-slate-200 bg-[#F8FAFC] px-4 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl"
        >
          Sri Basaveshwara Agro Kendra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg"
        >
          Karnataka&apos;s trusted source for crop inputs since 1998.
          Government-licensed dealer in Chikmagalur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            href="/products"
            id="hero-cta"
            className="inline-flex min-h-[48px] items-center rounded-md bg-[#166534] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#14532d]"
          >
            Browse Products
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#166534]"
        >
          Government Licensed · ISI-Marked Products · Chikmagalur, Karnataka
        </motion.p>
      </div>
    </section>
  );
}
