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

export default async function SwapPage() {
  const [seriesList, defects] = await Promise.all([
    swapApi.series(),
    swapApi.defects(),
  ]);

  return <SwapApp seriesList={seriesList} defects={defects} />;
}
