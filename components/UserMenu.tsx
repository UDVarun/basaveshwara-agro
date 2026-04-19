"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <Link 
        href="/login"
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-emerald-800 hover:scale-[1.02] active:scale-[0.98] transition-all font-headline font-bold text-xs tracking-[0.1em] uppercase shadow-lg shadow-emerald-900/10"
      >
        Sign In
      </Link>
    );
  }

  const initial = (session.user?.name?.[0] || session.user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pl-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-primary/20 hover:bg-white transition-all group"
      >
        <div className="flex flex-col text-right hidden sm:block">
          <span className="text-[11px] font-black text-primary leading-none uppercase tracking-tight">
            {session.user?.name?.split(" ")[0]}
          </span>
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em] mt-0.5">
            Legacy Account
          </span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105">
          {initial}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-50 bg-stone-50/50">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-xl shadow-inner">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-primary truncate uppercase tracking-tighter">
                    {session.user?.name}
                  </h4>
                  <p className="text-[10px] font-bold text-stone-400 truncate tracking-tight">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-3">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-stone-600 hover:bg-primary/5 hover:text-primary transition-all group lg:min-w-0"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   <User className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[12px] font-black uppercase tracking-tight">Your Account</span>
                   <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Profile & Orders</span>
                </div>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ redirectTo: "/login" });
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50/50 transition-all group mt-1"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                   <LogOut className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                   <span className="text-[12px] font-black uppercase tracking-tight">Sign Out</span>
                   <span className="text-[9px] font-bold text-red-300 uppercase tracking-widest leading-none">Terminate Session</span>
                </div>
              </button>
            </div>

            {/* Footer Status */}
            <div className="px-6 py-4 bg-stone-50/30 border-t border-stone-100">
               <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-stone-300">Sync Status</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Live Secure</span>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
