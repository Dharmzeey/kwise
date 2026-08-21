import type { Metadata } from "next";
import { fetchCategories, fetchProducts, fetchFeaturedReviews } from "@/lib/api";

export const revalidate = 300; // 5 min — edit lib/revalidate.ts as reference
import HomeTop from "@/components/home/HomeTop";
import CategoryTiles from "@/components/home/CategoryTiles";
import ProductRail from "@/components/home/ProductRail";
import BrandStrip from "@/components/home/BrandStrip";
import ReviewsStrip from "@/components/home/ReviewsStrip";
import ContentHub from "@/components/home/ContentHub";
import Btn from "@/components/ui/Btn";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Kwise World — Trusted Gadgets, Delivered",
  description:
    "Shop brand-new and UK-used phones, laptops, and accessories — every unit tested before it ships. Fast delivery across Nigeria.",
  alternates: { canonical: "https://kwiseworld.com" },
  openGraph: {
    title: "Kwise World — Trusted Gadgets, Delivered",
    description: "Shop brand-new and UK-used phones, laptops, and accessories — every unit tested before it ships. Fast delivery across Nigeria.",
    url: "https://kwiseworld.com",
    type: "website",
    images: [{ url: "https://kwiseworld.com/og.png", width: 1200, height: 630, alt: "Kwise World" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwise World — Trusted Gadgets, Delivered",
    description: "Shop brand-new and UK-used phones, laptops, and accessories — every unit tested before it ships.",
    images: ["https://kwiseworld.com/og.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Kwise World",
  url: "https://kwiseworld.com",
  logo: "https://kwiseworld.com/logo.png",
  description:
    "Nigeria's trusted source for tested & verified phones, laptops, and accessories.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ibadan",
    addressRegion: "Oyo",
    addressCountry: "NG",
  },
  areaServed: "NG",
  sameAs: [],
};

export default async function HomePage() {
  const [categories, featuredPage, offersPage, reviews] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchProducts({ sort: "featured", page: 1 }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
    fetchProducts({ one_time: true, page: 1 }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
    fetchFeaturedReviews(6).catch(() => []),
  ]);

  const heroProducts = featuredPage.results.slice(0, 6);
  const featured = featuredPage.results.slice(0, 12);
  const offers = offersPage.results.slice(0, 12);

  // One product rail per category (slot.ng-style horizontal rows).
  const categoryRails = (
    await Promise.all(
      categories.map(async (c) => {
        const page = await fetchProducts({ category: c.slug, page: 1 }).catch(
          () => ({ results: [], count: 0, next: null, previous: null })
        );
        return { category: c, products: page.results.slice(0, 12) };
      })
    )
  ).filter((r) => r.products.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <HomeTop categories={categories} products={heroProducts} />
      <CategoryTiles categories={categories} />

      {/* One-time offers rail */}
      {offers.length > 0 && (
        <ProductRail
          title="One-Time Offers"
          accent="orange"
          href="/offers"
          products={offers}
          soft
        />
      )}

      {/* Featured rail */}
      {featured.length > 0 && (
        <ProductRail
          title="Featured picks"
          href="/category/all"
          products={featured}
        />
      )}

      {/* One rail per category, alternating soft backgrounds */}
      {categoryRails.map((rail, i) => (
        <ProductRail
          key={rail.category.slug}
          title={rail.category.name}
          href={`/category/${rail.category.slug}`}
          products={rail.products}
          soft={i % 2 === 0}
        />
      ))}

      <ReviewsStrip reviews={reviews} />

      {/* Content hub — reviews, comparisons, buying guides */}
      <ContentHub />

      {/* Swap feature strip */}
      <section className="swap-strip-section">
        <div className="container">
          <div className="swap-strip">
            <div className="swap-strip-copy">
             <h2>Find out what your iPhone is worth for a swap, in seconds.</h2>
              <p>Tell us what you have, pick what you want — we quote a fair trade-in value and you top up the gap.</p>
              <Btn kind="primary" href="/swap" iconAfter="arrowRight">Get my swap price</Btn>
            </div>
            <div className="swap-how">
              <div className="trust-item">
                <div className="trust-ic"><Icon name="phone" size={20} /></div>
                <div><strong>Tell us what you have</strong><p>Pick your current iPhone model, storage, and condition.</p></div>
              </div>
              <div className="trust-item">
                <div className="trust-ic"><Icon name="refresh" size={20} /></div>
                <div><strong>Choose your upgrade</strong><p>Select the iPhone you want — any model or storage tier.</p></div>
              </div>
              <div className="trust-item">
                <div className="trust-ic"><Icon name="shieldCheck" size={20} /></div>
                <div><strong>Pay the difference</strong><p>We handle the swap — you only settle what&apos;s left.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandStrip />
    </>
  );
}
