import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProduct, fetchRelatedProducts, fetchCategories } from "@/lib/api";
import type { ProductListItem } from "@/lib/types";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/shop/ProductCard";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id).catch(() => null);
  if (!product) return { title: "Product not found" };
  const url = `https://kwiseworld.com/product/${product.id}`;
  return {
    title: `${product.name} — Kwise World`,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url,
      images: product.image ? [{ url: product.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

function conditionUrl(status: ProductListItem["status"]): string {
  return status === "Brand New"
    ? "https://schema.org/NewCondition"
    : "https://schema.org/UsedCondition";
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
  const productUrl = `https://kwiseworld.com/product/${product.id}`;
  const verifiedReviews = product.reviews.filter((r) => r.is_verified);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    ...(product.image ? { image: [product.image] } : {}),
    brand: {
      "@type": "Brand",
      name: product.brand_slug,
    },
    itemCondition: conditionUrl(product.status),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      url: productUrl,
      availability: product.sold_out
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Kwise World",
      },
    },
    ...(product.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
    ...(verifiedReviews.length > 0
      ? {
          review: verifiedReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.reviewer_name },
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
            reviewBody: r.text,
          })),
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kwiseworld.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat?.name ?? product.category_slug,
        item: `https://kwiseworld.com/category/${product.category_slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
