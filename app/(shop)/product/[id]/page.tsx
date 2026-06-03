import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProduct, fetchRelatedProducts, fetchCategories } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/shop/ProductCard";
import Icon from "@/components/ui/Icon";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id).catch(() => null);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Kwise World`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, related, categories] = await Promise.all([
    fetchProduct(id).catch(() => null),
    fetchRelatedProducts(id).catch(() => []),
    fetchCategories().catch(() => []),
  ]);

  if (!product) notFound();

  const cat = categories.find((c) => c.slug === product.category_slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.sold_out
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    aggregateRating:
      product.review_count > 0
        ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.review_count }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page">
        <div className="container">
          <nav className="crumbs">
            <Link href="/">Home</Link>
            <Icon name="chevronRight" size={13} />
            <Link href={`/category/${product.category_slug}`}>
              {cat?.name ?? product.category_slug}
            </Link>
            <Icon name="chevronRight" size={13} />
            <span>{product.name}</span>
          </nav>

          <ProductDetailClient product={product} />

          {related.length > 0 && (
            <section className="section">
              <div className="sec-head">
                <h2>You may also like</h2>
              </div>
              <div className="prod-grid">
                {related.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
