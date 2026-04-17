import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us - Basaveshwara Agro",
  description:
    "Sri Basaveshwara Agro Kendra bridges the gap between traditional wisdom and modern agrarian technology. Reach out for technical expertise in seeds, fertilizers, and equipment.",
};

export default function ContactPage() {
  return (
    <main className="relative bg-surface selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-3/5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-container/10 text-secondary rounded-full text-xs font-semibold tracking-wide mb-6">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }} data-icon="verified">verified</span>
            Authorized Dealer & Expert Consultation
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary leading-[1.0] mb-6">
            Rooted in <br /><span className="text-secondary italic font-medium">Chikkamagaluru.</span>
          </h1>
          <p className="text-base lg:text-lg text-on-surface-variant leading-relaxed max-w-lg opacity-90 font-medium">
            Sri Basaveshwara Agro Kendra bridges the gap between traditional wisdom and modern agrarian technology. Reach out for technical expertise in seeds, fertilizers, and equipment tailored for the Western Ghats.
          </p>
        </div>
        <div className="md:w-2/5 aspect-[4/5] relative overflow-hidden rounded-full shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=2000&auto=format&fit=crop"
            alt="Lush coffee plantation in Chikkamagaluru"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>
      </section>

      {/* Form & Contact Details Asymmetric Grid */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-12 md:p-16 rounded-[4rem] shadow-sm border border-outline-variant/10">
            <h2 className="text-3xl font-headline font-bold text-primary mb-12">Expert Consultation Request</h2>
            <form action="#" className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Full Name</label>
                  <input
                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all p-4 rounded-xl outline-none"
                    placeholder="Aravind Kumar"
                    type="text"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Email Address</label>
                  <input
                    className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all p-4 rounded-xl outline-none"
                    placeholder="aravind@coffeeestate.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Subject</label>
                <select className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all p-4 rounded-xl appearance-none outline-none">
                  <option>Technical Seed Consultation</option>
                  <option>Bulk Fertilizer Inquiry</option>
                  <option>Equipment Servicing</option>
                  <option>Pesticide Application Strategy</option>
                </select>
              </div>
              <div className="relative group">
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Detailed Message</label>
                <textarea
                  className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all p-4 rounded-xl outline-none"
                  placeholder="How can our agronomists assist your harvest?"
                  rows={5}
                ></textarea>
              </div>
              <button
                className="w-full bg-primary text-on-primary py-5 rounded-full font-headline font-bold text-lg hover:bg-primary-container transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                type="submit"
              >
                Submit Inquiry
                <span className="material-symbols-outlined" data-icon="arrow_right_alt">arrow_right_alt</span>
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-16">
              <div>
                <span className="text-secondary font-headline font-bold tracking-widest text-xs uppercase mb-4 block">Visit Our Kendra</span>
                <h3 className="text-4xl font-headline font-bold text-primary mb-6 leading-tight">Sri Basaveshwara Agro Kendra</h3>
                <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
                  Located in the heart of the coffee capital, serving the local agrarian community with premium inputs and expert advice.
                </p>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1" data-icon="location_on">location_on</span>
                  <div>
                    <p className="font-semibold text-primary">K.M. Road, Chikkamagaluru</p>
                    <p className="text-on-surface-variant">Karnataka, 577101</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 p-6 bg-surface-container rounded-full group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined" data-icon="call">call</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Emergency Hotline</p>
                    <p className="font-bold text-primary">+91 (8262) 234-567</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-surface-container rounded-full group cursor-pointer hover:bg-surface-container-high transition-colors">
                  <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" data-icon="schedule">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Business Hours</p>
                    <p className="font-bold text-primary">Mon - Sat: 08:00 - 19:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Map & Visual Section */}
      <section className="max-w-7xl mx-auto px-12 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Large Map Placeholder */}
          <div className="md:col-span-2 h-[500px] bg-surface-container-highest rounded-full overflow-hidden shadow-xl border-4 border-surface group">
            <div className="w-full h-full bg-slate-200 relative">
              <Image
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000&auto=format&fit=crop"
                alt="Chikkamagaluru Map Area"
                fill
                className="object-cover grayscale opacity-40 mix-blend-multiply"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-surface shadow-2xl rounded-full flex flex-col items-center gap-2 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }} data-icon="location_away">location_away</span>
                  <span className="font-headline font-bold text-primary">Sri Basaveshwara Agro Kendra</span>
                  <button className="mt-2 text-secondary text-sm font-bold flex items-center gap-1 group-hover:gap-3 transition-all">
                    GET DIRECTIONS <span className="material-symbols-outlined text-sm" data-icon="open_in_new">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Artistic Visual */}
          <div className="h-[500px] bg-primary relative rounded-full overflow-hidden shadow-xl group">
            <Image
              src="https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=2000&auto=format&fit=crop"
              alt="Freshly harvested coffee beans"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <p className="font-headline font-bold text-on-primary text-2xl leading-tight">Serving the heart of Karnataka&apos;s agricultural heritage since 1992.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Banner */}
      <section className="max-w-7xl mx-auto px-12 py-32">
        <div className="flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-3 font-headline font-bold text-xl uppercase tracking-wider">
            <span className="material-symbols-outlined" data-icon="agriculture">agriculture</span>
            ICAR RESEARCH PARTNER
          </div>
          <div className="flex items-center gap-3 font-headline font-bold text-xl uppercase tracking-wider">
            <span className="material-symbols-outlined" data-icon="spa">spa</span>
            ORGANIC CERTIFIED
          </div>
          <div className="flex items-center gap-3 font-headline font-bold text-xl uppercase tracking-wider">
            <span className="material-symbols-outlined" data-icon="verified">verified</span>
            BAYER TOP DEALER
          </div>
          <div className="flex items-center gap-3 font-headline font-bold text-xl uppercase tracking-wider">
            <span className="material-symbols-outlined" data-icon="security">security</span>
            ISO 9001 QUALITY
          </div>
        </div>
      </section>
    </main>
  );
}
