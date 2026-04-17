export default function Testimonials() {
  return (
    <section className="bg-agro-bg px-4 py-32 lg:py-48 sm:px-6 lg:px-8 font-sans text-agro-ink overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32">
          
          {/* Section Header */}
          <div className="lg:col-span-12 mb-16">
             <span className="text-[10px] font-bold tracking-[0.4em] text-agro-gold uppercase mb-8 block text-center lg:text-left">
              Section 05 / Field Veracity
            </span>
          </div>

          <div className="lg:col-span-5 sticky top-32 h-fit">
            <h2 className="text-6xl font-bold leading-[0.85] text-agro-green sm:text-8xl font-serif tracking-tight mb-12">
              Legacy <br /> of Yield.
            </h2>
            <p className="text-xl font-medium leading-[1.625] text-agro-muted max-w-sm mb-12">
              Authentic stories from the fields of Chikkamagaluru, where trust is measured in quintals and generations.
            </p>
            
            <div className="p-12 bg-agro-green text-agro-bg shadow-2xl shadow-agro-green/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-agro-ink/10 -mr-16 -mt-16 rotate-45 transition-transform group-hover:scale-110" />
              <p className="text-[64px] font-serif leading-none italic opacity-20 mb-4 tracking-tighter">"</p>
              <h3 className="text-3xl font-bold font-serif leading-[1.1] relative z-10">27 years of <br /> Zero Compromise.</h3>
            </div>
          </div>

          {/* Quotes Column - Tonal Blocks */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Quote 1 */}
            <div className="bg-agro-surface-low p-12 lg:p-16 border border-agro-outline-ghost/30 hover:border-agro-gold/30 transition-all duration-500 shadow-2xl shadow-black/5">
              <p className="text-agro-green text-3xl sm:text-4xl font-serif leading-[1.1] tracking-tight mb-12 italic">
                "Bought Kaveri paddy last Kharif... Got 62 quintals an acre — best yield I've had in eight years."
              </p>
              <div className="flex items-center gap-8">
                <div className="h-[1px] w-16 bg-agro-gold" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-agro-green">Raju Naik</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted mt-2">Paddy farmer, Birur</p>
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-agro-surface-low p-12 lg:p-16 border border-agro-outline-ghost/30 hover:border-agro-gold/30 transition-all duration-500 shadow-2xl shadow-black/5">
              <p className="text-agro-green text-3xl sm:text-4xl font-serif leading-[1.1] tracking-tight mb-12 italic">
                "Only here have I never once found an expired product or a duplicate brand. That trust is worth a lot."
              </p>
              <div className="flex items-center gap-8">
                <div className="h-[1px] w-16 bg-agro-gold" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-agro-green">Krishna Gowda</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-agro-muted mt-2">Maize farmer, Aldur</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
