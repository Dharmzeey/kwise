import type { MetadataRoute } from "next";
import { fetchCategories, fetchProducts, fetchContentSitemapData } from "@/lib/api";
import type { ProductListItem } from "@/lib/types";

export const revalidate = 600; // 10 min

const BASE = "https://kwiseworld.com";

async function fetchAllProducts(): Promise<ProductListItem[]> {
  const all: ProductListItem[] = [];
  let page = 1;
  while (true) {
    const data = await fetchProducts({ page }).catch(() => null);
    if (!data) break;
    all.push(...data.results);
    if (!data.next) break;
    page++;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, contentEntries] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchAllProducts(),
    fetchContentSitemapData().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,             changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE}/category/all`, changeFrequency: "daily",  priority: 0.9 },
    { url: `${BASE}/offers`,       changeFrequency: "daily",  priority: 0.8 },
    { url: `${BASE}/swap`,         changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`,        changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/pc-finder`,    changeFrequency: "weekly", priority: 0.7 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/category/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/product/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const contentPages: MetadataRoute.Sitemap = contentEntries.map((e) => {
    const prefix = e.type === "device" ? "phones" : e.type === "comparison" ? "compare" : "guides";
    return {
      url: `${BASE}/${prefix}/${e.slug}`,
      lastModified: new Date(e.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    };
  });

  return [...staticPages, ...categoryPages, ...productPages, ...contentPages];
}
