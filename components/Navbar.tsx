"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// ─── Cart icon ────────────────────────────────────────────────────────────────

function CartIcon({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`View cart — ${count} item${count !== 1 ? "s" : ""}`}
      id="navbar-cart-link"
      className="relative flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md text-slate-700 transition-colors hover:text-[#166534]"
    >
      {/* Cart bag SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Item count badge */}
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#166534] text-[10px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      id="navbar-hamburger"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      onClick={onClick}
      className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md text-slate-700 md:hidden"
      whileTap={{ scale: 0.92 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        {isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </motion.button>
  );
}

// ─── Mobile full-screen slide-in menu ────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while menu open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — flat bg-black/40, zero backdrop-blur */}
          <motion.div
            id="mobile-menu-overlay"
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Slide-in menu panel — x: "-100%" → 0 */}
          <motion.nav
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 left-0 z-50 w-full bg-[#F8FAFC] sm:w-80"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <span className="text-base font-bold text-slate-900">
                Sri Basaveshwara Agro Kendra
              </span>
              <button
                id="mobile-menu-close"
                aria-label="Close navigation menu"
                onClick={onClose}
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md text-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav links — min-h-[56px], font-size 18px */}
            <ul className="mt-2 px-2">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={[
                        "flex min-h-[56px] items-center rounded-md px-4 text-[18px] font-semibold transition-colors",
                        isActive
                          ? "text-[#166534]"
                          : "text-slate-900 hover:text-[#166534]",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

interface NavbarProps {
  cartItemCount?: number;
  pathname?: string;
}

export default function Navbar({
  cartItemCount = 0,
  pathname = "/",
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* Sticky navbar bar */}
      <motion.header
        id="main-navbar"
        role="banner"
        className="sticky top-0 z-30 border-b border-slate-200 bg-[#F8FAFC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          {/* Logo — visible on all sizes */}
          <Link
            href="/"
            id="navbar-logo"
            aria-label="Sri Basaveshwara Agro Kendra — Home"
            className="flex min-h-[48px] items-center text-[15px] font-bold leading-tight text-slate-900 hover:text-[#166534] sm:text-base"
          >
            {/* Mobile: short name. Desktop: full name */}
            <span className="md:hidden">S.B. Agro Kendra</span>
            <span className="hidden md:inline">
              Sri Basaveshwara Agro Kendra
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex md:items-center md:gap-1"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex min-h-[48px] items-center rounded-md px-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "text-[#166534]"
                      : "text-slate-700 hover:text-[#166534]",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right-side controls: cart + hamburger */}
          <div className="flex items-center gap-1">
            <CartIcon count={cartItemCount} />
            <HamburgerButton isOpen={menuOpen} onClick={openMenu} />
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-in menu portal */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={closeMenu}
        pathname={pathname}
      />
    </>
  );
}
