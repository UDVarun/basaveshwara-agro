"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

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
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex justify-between items-center">
        {/* Logo Left */}
        <Link href="/" className="text-xl font-bold text-primary tracking-tight font-headline">
          Basaveshwara Agro
        </Link>
        
        {/* Navigation Center */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-semibold tracking-tight transition-all duration-300 relative py-2 ${
                  isActive 
                    ? "text-primary" 
                    : "text-stone-500 hover:text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 w-full h-[2.5px] bg-primary rounded-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-1" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Icons Right */}
        <div className="flex items-center space-x-6">
          <button
            onClick={openCart}
            aria-label="Open Cart" 
            className="text-primary hover:scale-[1.05] transition-transform duration-300 relative group"
          >
            <span className="material-symbols-outlined text-[24px]" data-icon="shopping_cart">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-secondary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-white ring-2 ring-primary/5 group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </button>

          <button aria-label="Account" className="text-primary hover:scale-[1.05] transition-transform duration-300">
            <span className="material-symbols-outlined text-[24px]" data-icon="account_circle">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
