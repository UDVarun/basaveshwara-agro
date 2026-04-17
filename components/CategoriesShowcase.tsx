"use client";

import Link from "next/link";
import { ArrowRight, Bug, Leaf, Sprout, Wheat } from "lucide-react";

const CATEGORIES = [
  {
    id: "fertilizer",
    title: "Fertilizers",
    desc: "Balanced crop nutrition for soil and seasonal demand.",
    icon: Sprout,
  },
  {
    id: "insecticide",
    title: "Crop Protection",
    desc: "Insecticides and crop-care essentials for field pressure.",
    icon: Bug,
  },
  {
    id: "seed",
    title: "High-Yield Seeds",
    desc: "Certified seeds selected for local growing requirements.",
    icon: Wheat,
  },
  {
    id: "compost",
    title: "Soil Health",
    desc: "Organic compost and inputs for stronger soil structure.",
    icon: Leaf,
  },
] as const;

export default function CategoriesShowcase() {
  return (
    <section className="bg-stone-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-amber-600">
              Categories
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
              What We Sell In Our Store
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-emerald-900 px-5 text-sm font-bold text-white shadow-xl shadow-black/10 hover:bg-emerald-800"
          >
            View all products
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ id, title, desc, icon: Icon }) => (
            <Link
              key={id}
              href={`/products?q=${id}`}
              className="group rounded-lg bg-white p-6 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900 transition-colors group-hover:bg-emerald-900 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-stone-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
