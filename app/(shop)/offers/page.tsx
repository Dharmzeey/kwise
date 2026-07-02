import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import OffersClient from "./OffersClient";

export const revalidate = 300; // 5 min

export const metadata: Metadata = {
  title: "One-Time Offers — Kwise World",
  description: "Limited-stock deals on phones, laptops, and accessories. Once gone, gone for good.",
  alternates: { canonical: "https://kwiseworld.com/offers" },
  openGraph: {
    title: "One-Time Offers — Kwise World",
    description: "Limited-stock deals on phones, laptops, and accessories. Once gone, gone for good.",
    url: "https://kwiseworld.com/offers",
    type: "website",
    images: [{ url: "https://kwiseworld.com/og.png", width: 1200, height: 630, alt: "Kwise World One-Time Offers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "One-Time Offers — Kwise World",
    description: "Limited-stock deals on phones, laptops, and accessories. Once gone, gone for good.",
    images: ["https://kwiseworld.com/og.png"],
  },
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
