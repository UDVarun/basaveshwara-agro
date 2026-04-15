import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Sri Basaveshwara Agro Kendra in Chikmagalur, Karnataka. Visit our store or call us for fertilizer, pesticide, and compost queries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Contact Us
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">
        Visit us at our store in Chikmagalur or reach us by phone during business
        hours. We are happy to help with product recommendations, dosage queries,
        and bulk orders.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Address */}
        <div>
          <h2 className="text-sm font-bold text-slate-900">Store Address</h2>
          <address className="mt-2 text-sm not-italic text-slate-700">
            {/* TODO: Replace with actual address */}
            [Street Address],
            <br />
            Chikmagalur, Karnataka — 577101
          </address>
          <a
            href="https://maps.google.com/?q=Chikmagalur,Karnataka"
            target="_blank"
            rel="noopener noreferrer"
            id="contact-maps-link"
            className="mt-2 inline-flex min-h-[48px] items-center text-sm font-semibold text-[#166534] hover:underline"
            aria-label="Open location in Google Maps"
          >
            Open in Google Maps →
          </a>
        </div>

        {/* Phone & hours */}
        <div>
          <h2 className="text-sm font-bold text-slate-900">Phone</h2>
          <p className="mt-2 text-sm text-slate-700">
            <a
              href="tel:+91XXXXXXXXXX"
              id="contact-phone"
              className="font-semibold text-[#166534] hover:underline"
              aria-label="Call Sri Basaveshwara Agro Kendra"
            >
              +91-XXXXXXXXXX {/* TODO: Replace with real number */}
            </a>
          </p>

          <h2 className="mt-4 text-sm font-bold text-slate-900">
            Business Hours
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Mon – Sat: 9:00 AM – 7:00 PM
            <br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  );
}
