import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCategories, fetchProducts } from "@/lib/api";
import type { ProductStatus, SortOption } from "@/lib/types";
import CategoryPageClient from "./CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

const FILTER_PARAMS = ["brand", "series", "q", "status", "max_price"] as const;

function hasActiveFilters(sp: Record<string, string>): boolean {
  if (FILTER_PARAMS.some((k) => sp[k])) return true;
  if (sp.sort && sp.sort !== "featured") return true;
  return false;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const categories = await fetchCategories().catch(() => []);
  const cat = slug === "all" ? null : categories.find((c) => c.slug === slug);
  const title = cat ? `${cat.name} — Kwise World` : "All Products — Kwise World";
  const description = cat
    ? `Shop ${cat.name} — ${cat.blurb}. Every unit tested before it ships.`
    : "Browse all gadgets at Kwise World. Phones, laptops, accessories — brand new and UK-used.";

  const canonicalUrl = `https://kwiseworld.ng/category/${slug}`;

  const meta: Metadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
  };

  if (hasActiveFilters(sp)) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
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

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat ? cat.name : "All Products",
    url: `https://kwiseworld.ng/category/${slug}`,
    itemListElement: initialProducts.results.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://kwiseworld.ng/product/${p.id}`,
      name: p.name,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kwiseworld.ng",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat ? cat.name : "All Products",
        item: `https://kwiseworld.ng/category/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
    </>
  );
}
