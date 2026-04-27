"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  Mail, 
  Share2, 
  MessageSquare, 
  AtSign, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

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
    <footer className="w-full bg-agro-surface-low text-agro-ink border-t border-agro-outline-ghost/10">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 border-b border-agro-outline-ghost/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-headline font-semibold tracking-tighter text-agro-ink leading-[0.9] uppercase">
              Cultivate <br />
              <span className="text-agro-green italic">Excellence.</span>
            </h2>
            <p className="font-body text-agro-muted text-sm max-w-md leading-relaxed opacity-80 italic">
              Join 5,000+ forward-thinking farmers receiving monthly biological assessments and soil health reports.
            </p>
          </div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl shadow-agro-green/5 border border-agro-outline-ghost/30">
              <input 
                type="email" 
                placeholder="Institutional email address"
                className="flex-grow bg-transparent border-none text-agro-ink font-body px-5 py-3 focus:ring-0 outline-none text-sm placeholder:text-agro-muted/40"
              />
              <button className="bg-agro-green text-white px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-agro-green/10">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Link Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-12">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-headline font-black tracking-tighter text-agro-ink group-hover:text-agro-green transition-colors">
                BASAVESHWARA<span className="text-agro-gold">.</span>AGRO
              </span>
            </Link>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-agro-green border border-agro-outline-ghost/30 shadow-editorial">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-agro-muted uppercase tracking-[0.3em] mb-2 font-label">Headquarters</h4>
                  <p className="text-sm font-medium text-agro-ink leading-snug">Indira Gandhi Rd, Joythinagar,<br />Chikkamagaluru, KA 577101</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-agro-green border border-agro-outline-ghost/30 shadow-editorial">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-agro-muted uppercase tracking-[0.3em] mb-2 font-label">Institutional Support</h4>
                  <p className="text-sm font-medium text-agro-ink mb-1">contact@basaveshwaraagro.in</p>
                  <p className="text-[10px] font-bold text-agro-muted uppercase tracking-widest">+91 948XXXXXXX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            <div>
              <h4 className="text-[11px] font-bold text-agro-ink uppercase tracking-[0.4em] mb-10 pb-2 border-b border-agro-outline-ghost/10 w-fit">Discover</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.discover.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-agro-muted hover:text-agro-green transition-all flex items-center group">
                      <ChevronRight className="w-3.5 h-3.5 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100 transition-all text-agro-gold" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-agro-ink uppercase tracking-[0.4em] mb-10 pb-2 border-b border-agro-outline-ghost/10 w-fit">Company</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-agro-muted hover:text-agro-green transition-all flex items-center group">
                      <ChevronRight className="w-3.5 h-3.5 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100 transition-all text-agro-gold" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[11px] font-bold text-agro-ink uppercase tracking-[0.4em] mb-10 pb-2 border-b border-agro-outline-ghost/10 w-fit">Support</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[11px] font-bold uppercase tracking-[0.2em] text-agro-muted hover:text-agro-green transition-all flex items-center group">
                      <ChevronRight className="w-3.5 h-3.5 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100 transition-all text-agro-gold" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-agro-outline-ghost/10 bg-white/50 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-[10px] font-bold text-agro-muted uppercase tracking-[0.2em] font-label">
              © {currentYear} Sri Basaveshwara Agro Kendra
            </span>
            <div className="hidden md:block w-px h-3 bg-agro-outline-ghost/30"></div>
            <span className="text-[10px] font-bold text-agro-gold/60 font-label tracking-tighter uppercase italic">
              Certified Agrarian Distribution &bull; CKM-AG-912
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="w-12 h-12 rounded-2xl bg-white border border-agro-outline-ghost/30 flex items-center justify-center text-agro-muted hover:text-agro-green hover:border-agro-green hover:bg-agro-green/5 transition-all shadow-editorial group">
              <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            </Link>
            <Link href="#" className="w-12 h-12 rounded-2xl bg-white border border-agro-outline-ghost/30 flex items-center justify-center text-agro-muted hover:text-agro-green hover:border-agro-green hover:bg-agro-green/5 transition-all shadow-editorial group">
              <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
            </Link>
            <Link href="#" className="w-12 h-12 rounded-2xl bg-white border border-agro-outline-ghost/30 flex items-center justify-center text-agro-muted hover:text-agro-green hover:border-agro-green hover:bg-agro-green/5 transition-all shadow-editorial group">
              <AtSign className="w-4 h-4 transition-transform group-hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
