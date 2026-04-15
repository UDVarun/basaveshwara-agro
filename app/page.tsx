import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sri Basaveshwara Agro Kendra | Fertilizers & Pesticides, Chikmagalur",
  description:
    "Trusted supplier of fertilizers, pesticides, and organic compost for farmers in Chikmagalur and Karnataka. Government-licensed dealer since 1998.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
        Sri Basaveshwara Agro Kendra
      </h1>
      <p className="mt-4 max-w-lg text-center text-base text-slate-700">
        Fertilizers, pesticides, and organic compost for farmers in Chikmagalur
        and Karnataka. Government-licensed dealer since 1998.
      </p>
    </main>
  );
}
