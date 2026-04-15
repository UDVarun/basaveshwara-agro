import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Sri Basaveshwara Agro Kendra is a government-licensed agricultural dealer in Chikmagalur, Karnataka, serving farmers since 1998 with ISI-marked fertilizers, pesticides, and organic compost.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        About Sri Basaveshwara Agro Kendra
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">
        Sri Basaveshwara Agro Kendra is a government-licensed agricultural dealer
        based in Chikmagalur, Karnataka. We have been serving the farming
        communities of Chikmagalur taluk and surrounding districts since 1998.
      </p>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">
        We stock only ISI-marked, government-approved agricultural inputs —
        fertilizers, pesticides, micronutrient blends, and organic compost. Every
        product on our shelves meets regulatory standards set by the Department of
        Agriculture, Karnataka.
      </p>

      <h2 className="mt-8 text-base font-bold text-slate-900">
        Licensing Information
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        <li>
          <span className="font-semibold text-slate-900">GST No.:</span>{" "}
          {/* TODO: Replace */}
          29XXXXXXXXXXXXX
        </li>
        <li>
          <span className="font-semibold text-slate-900">
            Dealer License No.:
          </span>{" "}
          {/* TODO: Replace */}
          KA-CHK-XXXX-XXXX
        </li>
      </ul>

      <div className="mt-8">
        <Link
          href="/contact"
          id="about-contact-link"
          className="inline-flex min-h-[48px] items-center rounded-md bg-[#166534] px-6 text-sm font-semibold text-white hover:bg-[#14532d]"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
