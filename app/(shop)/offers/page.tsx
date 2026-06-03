import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import OffersClient from "./OffersClient";

export const metadata: Metadata = {
  title: "One-Time Offers — Kwise World",
  description:
    "Limited-stock deals on phones, laptops, and accessories. Once gone, gone for good.",
};

export default async function OffersPage() {
  const data = await fetchProducts({ one_time: true, sort: "featured", page: 1 }).catch(() => ({
    results: [],
    count: 0,
    next: null,
    previous: null,
  }));

  return <OffersClient initialProducts={data} />;
}
