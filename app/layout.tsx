import type { Metadata } from "next";
import { Nunito } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="bg-[#F8FAFC] font-sans antialiased">{children}</body>
    </html>
  );
}
