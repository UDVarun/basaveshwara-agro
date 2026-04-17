"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = {
  discover: [
    { label: "Premium Seeds", href: "/products?q=seeds" },
    { label: "Bio-Fertilizers", href: "/products?q=fertilizers" },
    { label: "Crop Protection", href: "/products?q=pesticides" },
    { label: "Specialty Nutrients", href: "/products?q=nutrients" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Agronomy Science", href: "/about#science" },
    { label: "Sustainability", href: "/about#sustainability" },
    { label: "Contact Us", href: "/contact" },
  ],
  support: [
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Don't show footer on checkout or minimal pages if needed
  if (pathname === "/checkout") return null;

  return (
    <footer className="w-full bg-surface-container-low text-on-surface">
      {/* Newsletter Section - More Compact */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 border-b border-outline-variant/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-primary">
              Cultivate Excellence <br />
              <span className="text-secondary">with Modern Agronomy.</span>
            </h2>
            <p className="font-body text-on-surface-variant text-[13px] max-w-md leading-relaxed">
              Join 5k+ farmers receiving monthly biological reports and assessments.
            </p>
          </div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-surface border border-outline-variant/30 rounded-xl shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-grow bg-transparent border-none text-on-surface font-body px-4 py-2 focus:ring-0 outline-none text-sm placeholder:text-on-surface/30"
              />
              <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-headline font-bold text-sm hover:scale-[1.02] transition-all whitespace-nowrap active:scale-95 shadow-md">
                Stay Informed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Link Grid - Reduced Padding */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <span className="text-xl font-headline font-bold tracking-tight text-primary">BASAVESHWARA AGRO</span>
            </Link>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">location_on</span>
                <div>
                  <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Headquarters</h4>
                  <p className="text-[13px] font-medium text-on-surface">Indira Gandhi Rd, Joythinagar,<br />Chikkamagaluru, 577101</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">mail</span>
                <div>
                  <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Support</h4>
                  <p className="text-[13px] font-medium text-on-surface">contact@basaveshwaraagro.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Discover</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.discover.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Company</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Support</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Compact */}
      <div className="border-t border-outline-variant/10 bg-surface-container py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">
              © {currentYear} Sri Basaveshwara Agro Kendra
            </span>
            <div className="hidden md:block w-px h-3 bg-outline-variant/30"></div>
            <span className="text-[10px] font-medium text-on-surface/50">
              AG-CKM-2024-912
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all group">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
