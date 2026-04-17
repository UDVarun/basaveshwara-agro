"use client";

export default function TrustBar() {
  const brands = ["SYNGENTA", "BAYER", "UPL", "CORTEVA", "BASF"];

  return (
    <section className="bg-surface-container-low py-12 px-6 md:px-12 border-y border-outline-variant/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-[10px] font-bold tracking-[0.3em] uppercase text-on-surface/40 mb-8">
          Authorized Global Partnerships
        </p>
        <div className="flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
          {brands.map((brand) => (
            <div 
              key={brand}
              className="text-2xl font-headline font-bold text-primary tracking-tighter"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
