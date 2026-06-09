import type { Metadata } from "next";
import { swapApi } from "@/lib/swap/api";
import SwapApp from "@/components/swap/SwapApp";

export const revalidate = 7200; // 2 hours — matches Django cache TTL

export const metadata: Metadata = {
  title: "iPhone Swap Estimator",
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
  alternates: { canonical: "/swap" },
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
