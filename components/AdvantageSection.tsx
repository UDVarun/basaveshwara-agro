"use client";

import Image from "next/image";

export default function AdvantageSection() {
  const advantages = [
    {
      title: "Verified Pedigree",
      description: "Every seed batch undergoes genetic purity testing to ensure consistent yield quality.",
      icon: "verified",
    },
    {
      title: "Technical Consulting",
      description: "On-site soil analysis and tailored nutrient programs designed by senior agronomists.",
      icon: "biotech",
    },
    {
      title: "Sustainability Focus",
      description: "Prioritizing biological solutions that restore soil health for future generations.",
      icon: "eco",
    },
  ];

  return (
    <section className="py-24 bg-surface-container-low px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-5xl font-headline font-semibold text-primary tracking-tighter mb-8 leading-tight">
              The Basaveshwara <br/> Advantage
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-12 max-w-xl">
              Since our inception in 2009, we have redefined the standards of agricultural supply through a triple-filter selection process that ensures only the most resilient and productive assets reach your farm.
            </p>
            
            <div className="space-y-10">
              {advantages.map((adv) => (
                <div key={adv.title} className="flex gap-6">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-editorial">
                    <span className="material-symbols-outlined text-on-primary text-3xl">{adv.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-headline font-bold text-primary mb-2 uppercase tracking-wide">{adv.title}</h4>
                    <p className="text-on-surface-variant leading-relaxed max-w-md">{adv.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-surface-container-high rounded-[3rem] overflow-hidden border-[1px] border-outline-variant/30 flex items-center justify-center p-8 lg:p-12 shadow-inner">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow- editorial">
                 <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpEflSRDOoAnN8UM7Bc7vLWG9n8tFETMlv1MSyFUZ-UdI7kUqu54ttVKLnW_YWI5TipOsJNWHvkH3xRGdXaTx4QH1KKfaGa0Yiu5iRN2VG_UXuNVMxra5f-PHM6cb-1nSdzK5peYWtnHqHt36jjLUlshnZ7IX9kpEUGz3O1KF2QjHOSHuNLTxbRAx14xno-bhy5weW44aY1z4iHzTytIfVPrpoosRQcjShbIt4mQpp8FwHNA19mN6OS3XhftPfCIWzXbLP8HAffM"
                  alt="Agronomist inspecting plants"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
