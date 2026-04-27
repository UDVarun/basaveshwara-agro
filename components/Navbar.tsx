"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import UserMenu from "@/components/UserMenu";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { state, openCart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md h-20 flex items-center shadow-none">
      <div className="w-full px-6 md:px-12 relative flex items-center justify-between">
        
        {/* Brand Name - Pushed to the far Left */}
        <Link href="/" className="group z-10">
          <span className="text-2xl font-headline font-black tracking-tighter text-agro-ink group-hover:text-agro-green transition-colors">
            BASAVESHWARA<span className="text-agro-gold">.</span>AGRO
          </span>
        </Link>
        
        {/* Navigation - Locked to the mathematical Dead-Center */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${
                  isActive 
                    ? "text-agro-green" 
                    : "text-agro-muted hover:text-agro-ink"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-agro-green rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons - Pushed to the far Right */}
        <div className="flex items-center space-x-8 z-10">
          <button
            onClick={openCart}
            aria-label="Open Cart" 
            className="text-agro-ink hover:text-agro-green transition-colors relative group active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5px]" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-agro-green text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg shadow-agro-green/20">
                {cartCount}
              </span>
            )}
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
