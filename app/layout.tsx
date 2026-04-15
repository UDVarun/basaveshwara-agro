import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sri Basaveshwara Agro Kendra",
    default:
      "Sri Basaveshwara Agro Kendra | Fertilizers & Pesticides, Chikmagalur",
  },
  description:
    "Trusted supplier of fertilizers, pesticides, and organic compost for farmers in Chikmagalur and Karnataka. Government-licensed dealer since 1998.",
  keywords: [
    "buy fertilizer Chikmagalur",
    "pesticides Karnataka",
    "DAP fertilizer",
    "organic compost",
    "agricultural supplies",
  ],
  openGraph: {
    title: "Sri Basaveshwara Agro Kendra",
    description: "Trusted agricultural supplies for Karnataka farmers.",
    url: "https://basaveshwaraagro.in",
    siteName: "Sri Basaveshwara Agro Kendra",
    images: [
      {
        url: "https://basaveshwaraagro.in/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  return (
    <html lang="en" className={nunito.variable}>
      <body className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans antialiased">
        {/*
          ClientProviders wraps the whole tree so:
          - CartProvider is available to Navbar (cart count) and all product pages
          - CartDrawer is mounted globally and can read CartContext
          - Navbar itself is a client component and reads useCart for the live badge
        */}
        <ClientProviders>
          <Navbar pathname={pathname} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
