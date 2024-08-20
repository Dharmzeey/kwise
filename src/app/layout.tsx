import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false
import type { Metadata } from "next";
import { Istok_Web } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const istokWeb = Istok_Web({
  weight: ["400", "700"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Kwise World",
  description: "Dealer of guaranteed apple and Samsung phones both brand new, direct UK/US and fairly used. Swap your old phones to latest ones. Guaranteed Laptops, Accessories, Game consoles etc. Retail and bulk purchase always available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${istokWeb.className} container text-xs md:text-sm`}>
        <Header />
        <div className="p-4">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
