"use client";

import Image from "next/image";
import { BadgeCheck, FlaskConical, Leaf, ShieldCheck, Microscope } from "lucide-react";

export default function AdvantageSection() {
  const advantages = [
    {
      title: "Verified Pedigree",
      description: "Every seed batch undergoes genetic purity testing to ensure consistent yield quality.",
      icon: BadgeCheck,
    },
    {
      title: "Technical Consulting",
      description: "On-site soil analysis and tailored nutrient programs designed by senior agronomists.",
      icon: Microscope,
    },
    {
      title: "Sustainability Focus",
      description: "Prioritizing biological solutions that restore soil health for future generations.",
      icon: Leaf,
    },
  ];

  return (
    <section className="py-32 bg-agro-surface-low px-6 md:px-12 relative overflow-hidden">
      {/* Texture background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #004534 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
                <ShieldCheck className="w-4 h-4 text-agro-green" />
                <span className="text-[10px] font-bold text-agro-green uppercase tracking-[0.3em]">The Institutional Edge</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-semibold text-agro-ink tracking-tighter mb-10 leading-[0.9] uppercase">
              The Basaveshwara <br/> Advantage
            </h2>
            <p className="text-agro-muted text-xl leading-relaxed mb-16 max-w-xl italic">
              Since our inception in 2009, we have redefined the standards of agricultural supply through a triple-filter selection process that ensures only the most resilient assets reach your soil.
            </p>
            
            <div className="space-y-12">
              {advantages.map((adv) => (
                <div key={adv.title} className="flex gap-8 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-editorial border border-agro-outline-ghost/20 group-hover:bg-agro-green transition-all duration-500">
                    <adv.icon className="w-7 h-7 text-agro-green group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-agro-ink mb-2 uppercase tracking-[0.2em]">{adv.title}</h4>
                    <p className="text-agro-muted text-sm leading-relaxed max-w-md opacity-80">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-white rounded-[3rem] overflow-hidden border border-agro-outline-ghost/30 flex items-center justify-center p-6 lg:p-10 shadow-luxury">
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpEflSRDOoAnN8UM7Bc7vLWG9n8tFETMlv1MSyFUZ-UdI7kUqu54ttVKLnW_YWI5TipOsJNWHvkH3xRGdXaTx4QH1KKfaGa0Yiu5iRN2VG_UXuNVMxra5f-PHM6cb-1nSdzK5peYWtnHqHt36jjLUlshnZ7IX9kpEUGz3O1KF2QjHOSHuNLTxbRAx14xno-bhy5weW44aY1z4iHzTytIfVPrpoosRQcjShbIt4mQpp8FwHNA19mN6OS3XhftPfCIWzXbLP8HAffM"
                  alt="Agronomist inspecting plants"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-agro-green/5 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
