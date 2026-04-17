import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import CategoriesBento from "@/components/CategoriesBento";
import AdvantageSection from "@/components/AdvantageSection";

export const metadata: Metadata = {
  title: "AGRARIAN | Sri Basaveshwara Agro Kendra",
  description: "Premier agricultural solutions provider empowering the next generation of cultivators through science-led nutrition and superior biological assets.",
  alternates: {
    canonical: "https://basaveshwaraagro.in",
  },
};

function HomeJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AgriculturalService"],
    name: "Sri Basaveshwara Agro Kendra (AGRARIAN)",
    description: "Premier agricultural supply store in Karnataka offering world-class biological assets and expert agronomic guidance.",
    url: "https://basaveshwaraagro.in",
    telephone: "+91-XXXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chikkamagaluru",
      addressRegion: "Karnataka",
      postalCode: "577101",
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function CTASection() {
  return (
    <section className="py-16 px-6 md:px-12 bg-primary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-primary mb-6 leading-tight">
          Ready to elevate your harvest potential?
        </h2>
        <p className="text-on-primary-container text-base mb-8 max-w-lg mx-auto opacity-80 font-body">
          Connect with our consultants to build a bespoke agronomy plan tailored to your soil&apos;s specific DNA.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-surface text-primary px-12 py-5 rounded-xl font-headline font-bold text-lg hover:scale-[1.05] transition-all shadow-editorial">
            Schedule Consultation
          </button>
          <button className="border-2 border-surface text-surface px-12 py-5 rounded-xl font-headline font-bold text-lg hover:bg-surface/10 transition-all uppercase tracking-widest text-sm">
            Request Price List
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="bg-surface">
      <HomeJsonLd />
      <HeroSection />
      <TrustBar />
      <CategoriesBento />
      <AdvantageSection />
      <CTASection />
    </main>
  );
}
