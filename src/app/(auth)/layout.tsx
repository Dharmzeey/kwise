import type { Metadata } from "next";
import { Istok_Web } from "next/font/google";
import "../globals.css";
import Image from "next/image";

const istokWeb = Istok_Web({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Kwise World",
  description:
    "Dealer of guaranteed apple and Samsung phones both brand new, direct UK/US and fairly used. Swap your old phones to latest ones. Guaranteed Laptops, Accessories, Game consoles etc. Retail and bulk purchase always available.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${istokWeb.className} container text-xs md:text-sm`}>
        <main className="flex justify-center mt-20">
          <div className="w-full max-w-md px-4">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpg" alt="logo" width={75} height={35} priority />
            </div>
            <div className="px-4">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
