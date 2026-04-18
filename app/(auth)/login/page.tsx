import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-stone-200/50 blur-[120px] rounded-full" />

      <div className="z-10 w-full flex flex-col items-center">
        <div className="mb-12 flex flex-col items-center">
            {/* Logo placeholder - replace with real logo if exists */}
            <div className="w-16 h-16 bg-emerald-800 rounded-2xl mb-6 shadow-xl flex items-center justify-center text-white">
                <span className="text-2xl font-black">BA</span>
            </div>
          <h1 className="text-xl font-black text-emerald-900 tracking-[0.2em] uppercase">
            Basaveshwara Agro
          </h1>
          <div className="h-1 w-12 bg-emerald-800 mt-2 rounded-full" />
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
