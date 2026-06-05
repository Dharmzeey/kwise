import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategories, fetchProducts } from "@/lib/api";
import type { ProductStatus, SortOption } from "@/lib/types";
import CategoryPageClient from "./CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await fetchCategories().catch(() => []);
  const cat = slug === "all" ? null : categories.find((c) => c.slug === slug);
  const title = cat ? `${cat.name} — Kwise World` : "All Products — Kwise World";
  const description = cat
    ? `Shop ${cat.name} — ${cat.blurb}. Every unit tested before it ships.`
    : "Browse all gadgets at Kwise World. Phones, laptops, accessories — brand new and UK-used.";
  return { title, description };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const categories = await fetchCategories().catch(() => []);
  if (slug !== "all" && !categories.find((c) => c.slug === slug)) notFound();

  const cat = categories.find((c) => c.slug === slug);

  const validStatus = (["Brand New", "Foreign Used", "Nigeria-Used"] as ProductStatus[]).find(
    (s) => s === sp.status
  );
  const validSort = (["featured", "low", "high", "rating"] as SortOption[]).find(
    (s) => s === sp.sort
  ) ?? "featured";

  const initialProducts = await fetchProducts({
    category: slug === "all" ? undefined : slug,
    brand: sp.brand,
    series: sp.series,
    q: sp.q,
    status: validStatus,
    sort: validSort,
    max_price: sp.max_price ? Number(sp.max_price) : undefined,
    page: 1,
  }).catch(() => ({ results: [], count: 0, next: null, previous: null }));

  return (
    <CategoryPageClient
      slug={slug}
      category={cat ?? null}
      categories={categories}
      initialProducts={initialProducts}
      initialFilters={{
        brand: sp.brand,
        series: sp.series,
        q: sp.q,
        status: validStatus,
        sort: validSort,
        max_price: sp.max_price ? Number(sp.max_price) : undefined,
      }}
    />
  );
}
