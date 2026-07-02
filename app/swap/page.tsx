import type { Metadata } from "next";
import { swapApi } from "@/lib/swap/api";
import SwapApp from "@/components/swap/SwapApp";

export const revalidate = 600; // 10 min

export const metadata: Metadata = {
  title: "iPhone Swap Estimator — Kwise World",
  description:
    "Get an instant estimate for your iPhone swap in Nigerian Naira. " +
    "Powered by Kwise World — Nigeria's trusted gadget store. Inspection branch in Ibadan.",
  keywords: [
    "iPhone swap Nigeria",
    "iPhone trade-in Nigeria",
    "swap iPhone Ibadan",
    "iPhone price Nigeria",
    "phone swap estimator",
  ],
  alternates: { canonical: "https://kwiseworld.com/swap" },
  openGraph: {
    title: "iPhone Swap Estimator — Kwise World",
    description: "Get an instant trade-in estimate for your iPhone in Nigerian Naira. Pay only the difference for your upgrade.",
    url: "https://kwiseworld.com/swap",
    type: "website",
    images: [{ url: "https://kwiseworld.com/og.png", width: 1200, height: 630, alt: "Kwise World iPhone Swap Estimator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Swap Estimator — Kwise World",
    description: "Get an instant trade-in estimate for your iPhone in Nigerian Naira. Pay only the difference for your upgrade.",
    images: ["https://kwiseworld.com/og.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "iPhone Swap Estimator",
  provider: {
    "@type": "Organization",
    name: "Kwise World",
    url: "https://kwiseworld.com",
  },
  serviceType: "Phone Trade-in / Swap",
  areaServed: "NG",
  description:
    "Get an instant estimate for your iPhone swap in Nigerian Naira. Trade in your current iPhone and pay only the difference for an upgrade.",
  url: "https://kwiseworld.com/swap",
};

export default async function SwapPage() {
  const [seriesList, defects] = await Promise.all([
    swapApi.series(),
    swapApi.defects(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <SwapApp seriesList={seriesList} defects={defects} />
    </>
  );
}
