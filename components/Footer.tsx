import Link from "next/link";

// ─── Footer ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      role="contentinfo"
      className="border-t border-slate-200 bg-[#F8FAFC]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/*
          Mobile: single column stack
          Desktop (md:): three column grid
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1 — Business identity */}
          <div>
            <p className="text-base font-bold text-slate-900">
              Sri Basaveshwara Agro Kendra
            </p>
            <p className="mt-1 text-sm font-semibold text-[#166534]">
              Government-licensed agricultural dealer
            </p>

            {/* Address */}
            <address className="mt-4 text-sm not-italic text-slate-700">
              {/* TODO: Replace with actual street address */}
              [Street Address],
              <br />
              Chikmagalur, Karnataka — 577101
            </address>

            {/* Phone */}
            <p className="mt-2 text-sm text-slate-700">
              Phone:{" "}
              <a
                href="tel:+91XXXXXXXXXX"
                id="footer-phone"
                className="min-h-[48px] font-medium text-[#166534] underline-offset-2 hover:underline"
                aria-label="Call Sri Basaveshwara Agro Kendra"
              >
                +91-XXXXXXXXXX {/* TODO: Replace with real phone */}
              </a>
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <p className="text-sm font-bold text-slate-900">Quick Links</p>
            <ul className="mt-3 space-y-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex min-h-[48px] items-center text-sm text-slate-700 hover:text-[#166534]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Licensing & trust signals */}
          <div>
            <p className="text-sm font-bold text-slate-900">
              Licensing Information
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <span className="font-medium text-slate-900">GST No.:</span>{" "}
                {/* TODO: Replace with actual GST number */}
                29XXXXXXXXXXXXX
              </li>
              <li>
                <span className="font-medium text-slate-900">
                  Dealer License No.:
                </span>{" "}
                {/* TODO: Replace with actual dealer license */}
                KA-CHK-XXXX-XXXX
              </li>
              <li className="pt-1 text-[#166534]">
                Government-licensed dealer since 1998.
                <br />
                All products are ISI-marked and government-approved.
              </li>
            </ul>

            {/* Business hours */}
            <p className="mt-4 text-sm text-slate-700">
              <span className="font-medium text-slate-900">Hours:</span>
              <br />
              Mon – Sat: 9:00 AM – 7:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-700">
          <p>
            &copy; {currentYear} Sri Basaveshwara Agro Kendra. All rights
            reserved.
          </p>
          <p className="mt-1">
            Chikmagalur, Karnataka, India &mdash; basaveshwaraagro.in
          </p>
        </div>
      </div>
    </footer>
  );
}
