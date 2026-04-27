import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden py-12 px-6 md:px-12 bg-agro-bg">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-agro-surface-low rounded-full mb-8 border border-agro-outline-ghost/30 w-fit">
            <Globe className="w-3.5 h-3.5 text-agro-gold" />
            <span className="text-agro-gold font-bold text-[9px] tracking-[0.2em] uppercase">Premium Agronomy</span>
            <div className="w-1 h-1 bg-agro-outline-ghost/30 rounded-full"></div>
            <span className="text-agro-ink/40 text-[9px] font-bold uppercase tracking-widest">Excellence Since 2009</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-headline font-semibold text-agro-ink tracking-tighter leading-[0.9] mb-10">
            Nurturing <br/>
            <span className="relative inline-block text-agro-green italic">
              Excellence
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-agro-gold/20 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-agro-muted max-w-lg leading-relaxed mb-12 opacity-90 font-body">
            Sri Basaveshwara Agro Kendra bridges the gap between traditional wisdom and modern agrarian science, delivering the world&apos;s finest biological assets to your soil.
          </p>
          
          <div className="flex flex-wrap gap-8 items-center">
            <Link href="/products" className="group relative bg-agro-green text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-agro-ink transition-all shadow-xl shadow-agro-green/10 flex items-center gap-3 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="group flex items-center gap-3 text-agro-ink font-bold text-[11px] uppercase tracking-[0.2em] hover:text-agro-green transition-all">
              Our Heritage
              <div className="w-8 h-8 rounded-full border border-agro-outline-ghost/30 flex items-center justify-center group-hover:bg-agro-surface-low transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Asymmetric Imagery */}
        <div className="lg:col-span-5 relative mt-10 lg:mt-0 px-4">
          <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-editorial transition-all duration-700 hover:rotate-0 transform rotate-1">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIDxydrLGg3pn51NHobF0UYcLzro4q79h2P9MVgBaQukQTvISPZ4T1IiJOuz4RXjEZzLfpocU1VejTShot_XDqzwWwqo5QBpaaXD2JrKr0D8vigU22MWsC0qgI_eFNzNbe93_jeBldHbu8xPsEYaXEqRoAfkDDTRunvMOu8yqXWxl18nnw-JTYaZIY94-fkdQ2Is-j_bF8i--d1yLCE56FS8xc_eWs6k8TpKQt-lueBP_eZejgGlPmrYxv3DK4XIuM50gKAsiBH9k"
              alt="Rice terrace fields at golden hour"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          
          {/* Floating Inset Card */}
          <div className="absolute -bottom-6 -left-6 w-36 lg:w-52 h-36 lg:h-52 rounded-[1.5rem] overflow-hidden shadow-editorial border-[8px] border-surface z-20 transition-all duration-700 hover:rotate-0 transform -rotate-1">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAObwZXrU-cZPEP-VPudTsQruWy8AzcYxFNkwFu4qnjjBPoYA0fMATrYPzHUnmkcBhC53E41TSs8_yeRCBapmYsAx6lPVeOWLNZsPi9845ecEeVZaaozt3Cy-HjMpsFlJGyKUAkQTjPMwe858w8UoO06pWoeDNGJEI3BkGAhMyCYUxfRXqHv-sYX7a3BoTbAezbF0H5i6Twm-r_DUd_mc87OqHSWKAu3RX_3et03ni1cawZVEnASdGTCHt7FIXmjT5WcF9p1pUJNSo"
              alt="High-quality organic seeds macro"
              fill
              priority
              sizes="(max-width: 768px) 150px, 200px"
              className="object-cover"
            />
          </div>
          
          {/* Luxury Badge */}
          <div className="absolute -top-4 -right-4 w-28 h-28 bg-agro-gold rounded-full flex flex-col items-center justify-center border-4 border-agro-bg shadow-2xl z-30 transition-all duration-500 hover:rotate-0 transform rotate-6">
            <Sparkles className="w-4 h-4 text-white/50 mb-1" />
            <div className="text-center text-white">
              <div className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-60">Est.</div>
              <div className="text-2xl font-headline font-bold leading-none tracking-tighter">2009</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
