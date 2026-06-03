import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import ShellLayout from "@/components/layout/ShellLayout";
import { fetchCategories, fetchProducts } from "@/lib/api";

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
  metadataBase: new URL("https://kwiseworld.ng"),
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
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kwiseworld.ng" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, productsPage] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchProducts({ page: 1 }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
  ]);

  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <CartProvider allProducts={productsPage.results}>
          <ToastProvider>
            <ShellLayout categories={categories} products={productsPage.results}>
              {children}
            </ShellLayout>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
