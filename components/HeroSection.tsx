"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden py-12 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-surface-container-low rounded-full mb-6 border border-outline-variant/15 w-fit">
            <span className="text-secondary font-bold text-[9px] tracking-widest uppercase">Premium Agronomy</span>
            <div className="w-1 h-1 bg-secondary rounded-full"></div>
            <span className="text-on-surface/60 text-[9px] font-medium uppercase tracking-wider">Excellence Since 2009</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-headline font-semibold text-primary tracking-[-0.04em] leading-[1.0] mb-8">
            Nurturing <br/>
            <span className="relative inline-block">
              Excellence
              <div className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-secondary/30"></div>
            </span>
          </h1>
          
          <p className="text-base lg:text-lg text-on-surface-variant max-w-lg leading-relaxed mb-10 opacity-80 font-body">
            Sri Basaveshwara Agro Kendra bridges the gap between traditional wisdom and modern agrarian science, delivering the world&apos;s finest biological assets to your soil.
          </p>
          
          <div className="flex flex-wrap gap-5 items-center">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-base hover:scale-[1.02] transition-all shadow-editorial active:scale-98">
              Explore Catalog
            </button>
            <a href="/products" className="group flex items-center gap-2.5 text-primary font-bold font-headline tracking-tight text-base">
              View Collections
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </a>
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
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full flex items-center justify-center border-4 border-surface shadow-xl z-30 transition-all duration-500 hover:rotate-0 transform rotate-6">
            <div className="text-center text-white">
              <div className="text-[8px] font-bold uppercase tracking-tighter opacity-80">Established</div>
              <div className="text-xl font-headline font-extrabold leading-none">2009</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
