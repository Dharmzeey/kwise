import type { Metadata } from "next";
import { LAPTOPS } from "./laptops";
import PcFinderClient from "./PcFinderClient";

export const metadata: Metadata = {
  title: "PC Finder — Find the Right Laptop",
  description: "Answer four quick questions and find a laptop from Kwise World that fits your budget, workload, and screen preference.",
  alternates: { canonical: "https://kwiseworld.com/pc-finder" },
};

export default function PcFinderPage() {
  return <PcFinderClient laptops={LAPTOPS} />;
}
