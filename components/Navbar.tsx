"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import SearchInput from "@/components/SearchInput";
import { Suspense } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { state, openCart } = useCart();
  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md h-16 flex items-center border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex justify-between items-center gap-8">
        {/* Logo Left */}
        <Link href="/" className="text-xl font-bold text-primary tracking-tighter font-headline flex-shrink-0">
          BASAVESHWARA<span className="text-secondary">.</span>AGRO
        </Link>
        
        {/* Navigation Center */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[12px] uppercase font-bold tracking-widest transition-all duration-300 relative py-2 ${
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant/60 hover:text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex-1 flex justify-end items-center space-x-6">
          <div className="hidden md:block flex-1 max-w-[280px]">
            <Suspense fallback={<div className="h-10 bg-surface-container-low rounded-full animate-pulse" />}>
              <SearchInput />
            </Suspense>
          </div>

          <div className="flex items-center space-x-5 flex-shrink-0">
            <button
              onClick={openCart}
              aria-label="Open Cart" 
              className="text-primary hover:scale-110 transition-transform duration-300 relative group"
            >
              <span className="material-symbols-outlined text-[22px]" data-icon="shopping_basket">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-secondary text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-primary transition-colors">
                  {cartCount}
                </span>
              )}
            </button>

            <button aria-label="Account" className="text-primary hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[22px]" data-icon="person">person</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
