import type { Metadata } from "next";
import { fetchCategories, fetchProducts, fetchFeaturedReviews } from "@/lib/api";
import HeroEditorial from "@/components/home/HeroEditorial";
import CategoryTiles from "@/components/home/CategoryTiles";
import BrandStrip from "@/components/home/BrandStrip";
import ReviewsStrip from "@/components/home/ReviewsStrip";
import ProductCard from "@/components/shop/ProductCard";
import Btn from "@/components/ui/Btn";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Kwise World — Trusted Gadgets, Delivered",
  description:
    "Shop brand-new and UK-used phones, laptops, and accessories — every unit tested before it ships. Fast delivery across Nigeria.",
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
  const featured = featuredPage.results.slice(0, 4);
  const offers = offersPage.results.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroEditorial products={heroProducts} />
      <CategoryTiles categories={categories} />

      {/* Featured products row */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <h2>Featured picks</h2>
              <Btn kind="ghost" href="/category/all" iconAfter="arrowRight">See all</Btn>
            </div>
            <div className="prod-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} hideAdd />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* One-time offers spotlight */}
      {offers.length > 0 && (
        <section className="section offers-section">
          <div className="container">
            <div className="sec-head">
              <div>
                <h2><Icon name="bolt" size={22} stroke={0} className="offers-bolt" /> One-Time Offers</h2>
                <p className="sec-sub">Limited units — once they&apos;re gone, they&apos;re gone.</p>
              </div>
              <Btn kind="orange" href="/offers" iconAfter="arrowRight">View all offers</Btn>
            </div>
            <div className="prod-grid">
              {offers.map((p) => (
                <ProductCard key={p.id} product={p} hideAdd />
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsStrip reviews={reviews} />

      {/* Swap feature strip */}
      <section className="swap-strip-section">
        <div className="container">
          <div className="swap-strip">
            <div className="swap-strip-copy">
              <span className="eyebrow"><Icon name="refresh" size={14} /> Swap Deal Estimator </span>
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
