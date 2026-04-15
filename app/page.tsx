import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import HeroSection from "@/components/HeroSection";
import type { ShopifyProduct } from "@/types/shopify";

// ─── Page metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:
    "Sri Basaveshwara Agro Kendra | Fertilizers & Pesticides, Chikmagalur",
  description:
    "Karnataka's trusted source for crop inputs since 1998. Government-licensed dealer in Chikmagalur supplying ISI-marked fertilizers, pesticides, and organic compost.",
  alternates: {
    canonical: "https://basaveshwaraagro.in",
  },
};

// ─── JSON-LD — AgriculturalService (SEO Law 3) ───────────────────────────────

function HomeJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AgriculturalService"],
    name: "Sri Basaveshwara Agro Kendra",
    description:
      "Government-licensed agricultural dealer in Chikmagalur, Karnataka. Supplier of fertilizers, pesticides, organic compost, and micronutrient blends since 1998.",
    url: "https://basaveshwaraagro.in",
    // TODO: Replace with real phone number
    telephone: "+91-XXXXXXXXXX",
    // TODO: Replace with real email
    email: "info@basaveshwaraagro.in",
    address: {
      "@type": "PostalAddress",
      // TODO: Replace with actual street address
      streetAddress: "[Street Address]",
      addressLocality: "Chikmagalur",
      addressRegion: "Karnataka",
      postalCode: "577101",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      // TODO: Replace with actual coordinates
      latitude: "13.3161",
      longitude: "75.7720",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    // TODO: Replace with actual GST number
    taxID: "29XXXXXXXXXXXXX",
    foundingDate: "1998",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Chikmagalur, Karnataka, India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Agricultural Inputs",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Fertilizers" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pesticides" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Organic Compost" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Micronutrient Blends" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Featured products fetcher ────────────────────────────────────────────────

async function fetchFeaturedProducts(): Promise<ShopifyProduct[]> {
  const baseUrl =
    process.env["NEXT_PUBLIC_BASE_URL"] ?? "http://localhost:3000";

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/products?first=3&q=featured`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      edges: Array<{ node: ShopifyProduct }>;
    };
    return data.edges.map((e) => e.node);
  } catch {
    return [];
  }
}

// ─── Trust signals (TODO: verify actual numbers with owner) ──────────────────

const TRUST_CLAIMS = [
  {
    label: "25+ years in business",
    detail: "Serving farmers since 1998",
  },
  {
    label: "Government-licensed dealer",
    detail: "Licensed by Karnataka Agriculture Dept.",
  },
  {
    label: "ISI-marked products only",
    detail: "No spurious inputs ever stocked",
  },
  {
    label: "500+ farmers served",
    detail: "Across Chikmagalur taluk", // TODO: verify
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <>
      <HomeJsonLd />

      {/* ── Hero — client island (Framer Motion requires client component) ─── */}
      <HeroSection />

      {/* ── Bento Grid ─────────────────────────────────────────────────────── */}
      <section
        aria-label="About Sri Basaveshwara Agro Kendra"
        className="mx-auto max-w-7xl px-4 py-12"
      >
        {/*
          Mobile: single column (grid-cols-1)
          Desktop (md:): 2-column with varied cell heights via CSS grid
        */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Cell 1 — Featured Products (spans 2 cols on lg+) */}
          <AnimatedSection
            delay={0}
            className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2"
          >
            <h2 className="text-base font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="mt-1 text-xs text-slate-700">
              Fertilizers, pesticides &amp; compost for Kharif and Rabi seasons
            </p>

            {featuredProducts.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-md bg-slate-50 px-4 py-8 text-center text-sm text-slate-700">
                We are updating our stock. Please{" "}
                <Link
                  href="/products"
                  className="font-semibold text-[#166534] hover:underline"
                >
                  browse all products
                </Link>
                .
              </div>
            )}

            <div className="mt-4">
              <Link
                href="/products"
                id="bento-view-all"
                className="text-sm font-semibold text-[#166534] hover:underline"
              >
                View all products →
              </Link>
            </div>
          </AnimatedSection>

          {/* Cell 2 — Why farmers trust us */}
          <AnimatedSection
            delay={0.08}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-bold text-slate-900">
              Why farmers trust us
            </h2>
            {/* TODO: Verify all numbers with business owner before launch */}
            <ul className="mt-4 space-y-3">
              {TRUST_CLAIMS.map(({ label, detail }) => (
                <li key={label} className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {label}
                  </span>
                  <span className="text-xs text-slate-700">{detail}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Cell 3 — Seasonal tip */}
          <AnimatedSection
            delay={0.12}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-bold text-slate-900">
              Seasonal Advisory
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#166534]">
              Kharif 2024 — Paddy
            </p>
            {/*
              TODO: Replace with real, verified agronomic advice.
              Content below is a placeholder — must be reviewed by an agronomist
              or the business owner before going live.
            */}
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              For paddy this Kharif season, apply basal dose of DAP (50 kg/acre)
              at transplanting. Top-dress with Urea (25 kg/acre) at tillering
              stage. Watch for leaf folder — contact us for recommended
              insecticides.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Always consult an agronomist for your specific soil and crop
              conditions.
            </p>
          </AnimatedSection>

          {/* Cell 4 — Location & hours */}
          <AnimatedSection
            delay={0.16}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-bold text-slate-900">Find Us</h2>

            <address className="mt-3 text-sm not-italic leading-relaxed text-slate-700">
              {/* TODO: Replace with actual address */}
              [Street Address],
              <br />
              Chikmagalur, Karnataka — 577101
            </address>

            <p className="mt-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Phone:</span>{" "}
              <a
                href="tel:+91XXXXXXXXXX"
                className="text-[#166534] hover:underline"
              >
                +91-XXXXXXXXXX {/* TODO: Real number */}
              </a>
            </p>

            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Hours:</span>
              <br />
              Mon – Sat: 9:00 AM – 7:00 PM
              <br />
              Sunday: Closed
            </p>

            {/* Google Maps placeholder */}
            <a
              href="https://maps.google.com/?q=Chikmagalur,Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              id="bento-maps-link"
              className="mt-3 inline-flex min-h-[48px] items-center text-sm font-semibold text-[#166534] hover:underline"
              aria-label="Open location in Google Maps"
            >
              Open in Google Maps →
            </a>
          </AnimatedSection>

        </div>
      </section>
    </>
  );
}
