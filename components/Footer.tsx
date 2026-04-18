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
    <footer className="w-full bg-surface-container-low text-on-surface border-t border-outline-variant/10">
      {/* Newsletter Section - Premium Polish */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 border-b border-outline-variant/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-primary leading-[1.1]">
              Cultivate Excellence <br />
              <span className="text-secondary opacity-90 inline-block mt-1">Modern Agronomy Science.</span>
            </h2>
            <p className="font-body text-on-surface-variant text-sm max-w-md leading-relaxed opacity-80">
              Join 5,000+ forward-thinking farmers receiving monthly biological assessments and soil health reports.
            </p>
          </div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-surface-container-highest/30 backdrop-blur-sm border border-outline-variant/40 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-outline-variant/60">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-grow bg-transparent border-none text-on-surface font-body px-5 py-2.5 focus:ring-0 outline-none text-sm placeholder:text-on-surface/40"
              />
              <button className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-headline font-bold text-sm hover:translate-y-[-1px] transition-all whitespace-nowrap active:translate-y-[1px] shadow-[0_4px_12px_rgba(30,93,74,0.15)] hover:shadow-[0_6px_20px_rgba(30,93,74,0.2)]">
                Stay Informed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Link Grid - Architectural & Compact */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-headline font-black tracking-tighter text-primary group-hover:opacity-80 transition-opacity">
                BASAVESHWARA<span className="text-secondary">.</span>AGRO
              </span>
            </Link>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant/10 shadow-sm">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.25em] mb-1.5 font-label">Headquarters</h4>
                  <p className="text-[13px] font-medium text-on-surface leading-snug">Indira Gandhi Rd, Joythinagar,<br />Chikkamagaluru, KA 577101</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-outline-variant/10 shadow-sm">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.25em] mb-1.5 font-label">Support</h4>
                  <p className="text-[13px] font-medium text-on-surface">contact@basaveshwaraagro.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid - High Density */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            <div>
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-8 font-label">Discover</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.discover.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-all font-medium flex items-center group">
                      <span className="w-0 group-hover:w-3 h-[1px] bg-secondary mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-8 font-label">Company</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-all font-medium flex items-center group">
                      <span className="w-0 group-hover:w-3 h-[1px] bg-secondary mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-8 font-label">Support</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-on-surface-variant hover:text-primary transition-all font-medium flex items-center group">
                      <span className="w-0 group-hover:w-3 h-[1px] bg-secondary mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Minimal & High Contrast */}
      <div className="border-t border-outline-variant/10 bg-surface-container py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] font-label">
              © {currentYear} Sri Basaveshwara Agro Kendra
            </span>
            <div className="hidden md:block w-px h-3 bg-outline-variant/30"></div>
            <span className="text-[11px] font-bold text-secondary/40 font-label tracking-tighter">
              CKM-AG-912-2024
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="w-10 h-10 rounded-2xl bg-surface border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-2xl bg-surface border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-2xl bg-surface border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">alternate_email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
