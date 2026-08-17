import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import ShellLayout from "@/components/layout/ShellLayout";
import BetaBanner from "@/components/layout/BetaBanner";
import { fetchCategories } from "@/lib/api";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kwiseworld.com"),
  title: {
    template: "%s | Kwise World",
    default: "Kwise World — Gadgets you can trust",
  },
  description:
    "Buy brand-new and clean UK-used phones, laptops, and accessories in Nigeria. " +
    "iPhone, Samsung, HP, Lenovo — tested & verified. Delivery everywhere in Nigeria.",
  keywords: [
    "buy iPhone Nigeria", "UK-used Samsung Nigeria", "HP laptop Ibadan",
    "Lenovo laptop Nigeria", "phone accessories Iwo Road Ibadan",
    "Kwise World", "trusted gadgets Nigeria",
  ],
  openGraph: {
    type: "website",
    siteName: "Kwise World",
    title: "Kwise World — Gadgets you can trust",
    description: "Phones, laptops & accessories. Tested & verified. Fast delivery across Nigeria.",
    locale: "en_NG",
    url: "https://kwiseworld.com",
    images: [
      {
        url: "https://kwiseworld.com/og.png",
        width: 1200,
        height: 630,
        alt: "Kwise World — Trusted Gadgets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwise World — Gadgets you can trust",
    description: "Phones, laptops & accessories. Tested & verified. Fast delivery across Nigeria.",
    images: ["https://kwiseworld.com/og.png"],
  },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kwiseworld.com" },
  verification: {
    other: {
      "msvalidate.01": "97F771670C6A5A0D973C08363EDDC8D1",
    }
  }
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kwise World",
  url: "https://kwiseworld.com",
  logo: "https://kwiseworld.com/logo.png",
  description:
    "Trusted brand-new and UK-used phones, laptops, and accessories, tested before shipping, with delivery across Nigeria.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "92B Lagelu Plaza, Iwo Road",
    addressLocality: "Ibadan",
    addressCountry: "NG",
  },
  telephone: "+2349048807490",
  sameAs: [
    "https://www.instagram.com/kwise.world",
    "https://www.tiktok.com/@kwiseworld",
    "https://www.threads.net/@kwise.world",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await fetchCategories().catch(() => []);

  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <ToastProvider>
            <ShellLayout categories={categories}>
              {children}
            </ShellLayout>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
