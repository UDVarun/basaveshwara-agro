import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Heritage | Sri Basaveshwara Agro Kendra",
  description: "Understanding fifteen years of agricultural dedication. Our legacy of biological precision and farmer-first expertise.",
};

export default function AboutPage() {
  return (
    <main className="bg-surface font-body text-on-surface antialiased">
      {/* Hero Section: Immersive Storytelling */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/heritage_field_hero_1776445573823.png"
            alt="Aerial shot of Chikkamagaluru coffee plantations"
            fill
            className="object-cover grayscale-[30%] brightness-[0.7] contrast-[1.1]"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-[1px] bg-secondary-fixed"></span>
              <span className="text-[10px] font-bold text-secondary-fixed uppercase tracking-[0.4em] font-label">The Heritage</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
              Deeply <br/> Rooted in <br/> <span className="text-secondary-fixed">Precision.</span>
            </h1>
            <p className="text-lg lg:text-xl text-stone-200 leading-relaxed max-w-lg font-medium opacity-90 font-body">
              Fifteen years of redefining the intersection of traditional wisdom and modern agrarian technology.
            </p>
          </div>
        </div>
        
        {/* Floating Metrics */}
        <div className="absolute bottom-12 left-12 z-20 hidden lg:flex gap-16">
          <div>
            <div className="text-3xl font-black text-white tracking-tighter">2009</div>
            <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Foundation Year</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tighter">150+</div>
            <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Scientific Blends</div>
          </div>
        </div>
      </section>

      {/* Our Heritage: Asymmetric Layout */}
      <section className="py-40 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-edge z-10">
              <Image 
                src="/scientific_farming_portrait_1776445596321.png"
                alt="Modern agronomist at work"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 -z-10 rounded-full blur-3xl"></div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-primary mb-10 leading-none uppercase">
              The Evolution of <br/> Governance.
            </h2>
            <div className="space-y-8 text-on-surface-variant leading-relaxed text-lg font-body">
              <p>Founded in the heart of the agrarian belt, Basaveshwara Agro began as a collective of soil scientists and multi-generational farmers. We believed that the future of the harvest lay not in industrial force, but in <span className="text-primary font-bold">biological precision</span>.</p>
              <p>For over 15 years, we have documented, tested, and refined the practices that sustain the earth. Our history is written in the soil, measured by the vitality of the crops and the prosperity of the hands that tend them.</p>
            </div>
            <div className="mt-16 flex gap-16">
              <div>
                <div className="text-5xl font-black text-primary tracking-tighter">15+</div>
                <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mt-3">Years of Trust</div>
              </div>
              <div>
                <div className="text-5xl font-black text-primary tracking-tighter">450k</div>
                <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mt-3">Acres Restored</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Modern Agrarian Mission: Bento Grid */}
      <section className="py-40 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-secondary"></span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] font-label">The Mission</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-primary mb-8 leading-none uppercase">
                Bridging Epochs.
              </h2>
              <p className="text-on-surface-variant text-xl leading-relaxed font-body">
                We synchronize ancestral wisdom with future-proofed biological assets, ensuring every cultivator reaches their absolute peak harvest potential.
              </p>
            </div>
            <div className="flex gap-6 opacity-20">
              <span className="material-symbols-outlined text-5xl">biotech</span>
              <span className="material-symbols-outlined text-5xl">agriculture</span>
              <span className="material-symbols-outlined text-5xl">wb_sunny</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white p-12 rounded-[2.5rem] hover:shadow-2xl transition-all duration-700 group border border-outline-variant/10">
              <div className="w-14 h-14 bg-primary/5 flex items-center justify-center rounded-2xl mb-10 group-hover:bg-primary transition-all duration-500">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors" data-icon="science">science</span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-primary mb-6 uppercase">Precision <br/> Chemistry.</h3>
              <p className="text-on-surface-variant leading-relaxed font-body text-base">Our nutrients are synthesized for the unique soil DNA of the Western Ghats region.</p>
            </div>

            {/* Card 2 (Large) */}
            <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] group min-h-[450px] shadow-edge">
              <Image 
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200"
                alt="Modern agriculture irrigation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent"></div>
              <div className="absolute bottom-0 p-12">
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em] mb-4">Infrastructure</div>
                <h3 className="text-4xl font-black tracking-tighter text-white mb-6 uppercase leading-none">The Equipment <br/> Revolution.</h3>
                <p className="text-white/80 max-w-md leading-relaxed font-body">Deploying autonomous irrigation and drone monitoring to optimize resource consumption by 70%.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="md:col-span-2 bg-primary text-white p-12 rounded-[2.5rem] flex flex-col justify-between shadow-2xl overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter mb-8 uppercase leading-none">Regenerative <br/> Stewardship.</h3>
                <p className="text-white/75 text-xl leading-relaxed max-w-xl font-body">Our legacy links us to a future where agriculture is not just sustainable, but a net-positive force for the Karnataka ecosystem.</p>
              </div>
              <div className="mt-12 relative z-10">
                <Link href="/products" className="inline-flex items-center gap-3 font-black uppercase tracking-widest text-[11px] group text-secondary-fixed">
                  Explore Soil Solutions
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform text-xl" data-icon="east">east</span>
                </Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-highest p-12 rounded-[2.5rem] border border-outline-variant/10">
              <h3 className="text-2xl font-black tracking-tighter text-primary mb-6 uppercase">Expertise <br/> Network.</h3>
              <p className="text-on-surface-variant leading-relaxed font-body mb-8">Direct access to multi-generational consultants specialized in regional crop cycles.</p>
              <div className="flex -space-x-4 items-center">
                {[
                  "https://i.pravatar.cc/150?u=1",
                  "https://i.pravatar.cc/150?u=2",
                  "https://i.pravatar.cc/150?u=3"
                ].map((src, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-surface overflow-hidden relative shadow-sm">
                    <Image src={src} fill alt="Advisor" className="object-cover" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white border-4 border-surface shadow-sm">+18</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section: Minimalist density */}
      <section className="py-40 bg-surface">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="bg-surface-container-low p-12 lg:p-24 rounded-[3rem] flex flex-col lg:flex-row gap-20 relative overflow-hidden group">
            <div className="lg:w-1/2 relative z-10">
              <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] mb-6">Our Methodology</div>
              <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-primary mb-10 leading-[0.9] uppercase">Grounded in <br/> Data.</h2>
              <p className="text-on-surface-variant text-xl leading-relaxed mb-10 font-body">Every solution in our catalog undergoes rigorous field analysis in three distinct soil topographies before deployment. This commitment to data-led agronomy is our covenant.</p>
              <button className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl active:scale-95">Download Biosphere Report</button>
            </div>
            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-auto overflow-hidden rounded-[2rem] shadow-2xl translate-y-8 group-hover:translate-y-0 transition-transform duration-1000">
              <Image 
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800"
                alt="Agricultural lab work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Visuals */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA9KxgxeBzEMBoSvtgQLQGNe3x8sR9vslR1xxjffSDUI3oXczKfK4VW6hSGYdKWfbjo-qA-T9Zn8hwntIOeCCJmHzmM1fw7rQBQAeiFrcAGcxWHylkNSUn50wHpPd77jiN4bRxjwJ1auuHs7c37cYoJFUCdIM2N9VNb8ZRLkELLX79fNq3oyhsIFKXew6BaovKZnsSMmjb1J4zs6K9-tti2AiTmx5klWT_JZ1R0bgJMpF4TWz_qJuu0pKw6Q-OJaecEirP73PDEMJA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAR_WmkHNjh2rGX668ybdNXUXdsbJ8TGmssIc4C87w8jT-KHaAVYSFvMbXIm0-SZJnB6YbuXBJgxTtics4HMPxxfsM-r5PnsqAd-LopsAF8poRdsBoxdcbTCbud2ebC2l2AfgGxlf9Hecb0ucJwv7b5vt-BgnZTAEJTkBgmyM8SsJn0QYTS4ndz4pk6h8A3_L7EgyQQAQFYiJga2l036eM2AOG3UJcrhPgiBxWx5tmgpF_22F1muYASN9mXbERhBPHhKtqzQWoKA4U",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDb-5gkSx8rQYASA2M2peIb0cnbM0ql0wXnedTLBbswsxnsaroKNIt10TCKJ2Rw8sw-Xt_Sa0bAkKrFs9fTbvPMdIhvxTdirZ9PTZDcmwb_K7LeTo0L38lDTnBhJZveCMBAHnyuuQUwyHdYsVZEfyeaxgzo9PxCvZdPV1023ob978IOl1yoYNkXS-xslQe4F-ChHLrh7MP7dLna77i_TDHxVWTb02KUpi75dv07iOB1d4o993aOSxptY-59tBia-G38KTYEiALNAuA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuC27smQCCgJFLaj5UsrJIrflLHHC6piSmR_PkoMHtc6eGapiDhkYomK6ZoQHPjepYRtpi1f6ozHFZUlA1z22or6ZQPaNSO8ANu2E16314AKLpWCra0P2FIOx22Ywk2d2zqAIoZNx_z8C8pOa5oh7ukTuozvA5j0UHdUI1Q1iQc4oKiNwuTOjTgXAh90ZVAAKwCbipOkUuqmSPnv0rPuPJ8zZI-8tHuhm50bDZyzEL6QK62CLYbLjlL8ewhTFYwvNsv1An6yiduZBZQ"
            ].map((src, i) => (
              <div key={i} className={`relative h-64 overflow-hidden rounded-lg group ${i % 2 === 1 ? 'translate-y-8' : ''}`}>
                <Image 
                  src={src}
                  alt="Gallery image"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
