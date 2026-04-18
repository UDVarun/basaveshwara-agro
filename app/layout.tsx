import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import NavigationProgressBar from "@/components/NavigationProgressBar";
import "./globals.css";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plusjakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-spacemono",
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

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className="flex min-h-screen flex-col bg-surface font-body text-on-surface antialiased pt-16"
        suppressHydrationWarning
      >
        {/*
          ClientProviders wraps the whole tree so:
          - CartProvider is available to Navbar (cart count) and all product pages
          - CartDrawer is mounted globally and can read CartContext
          - Navbar itself is a client component and reads useCart for the live badge
        */}
        <ClientProviders>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
