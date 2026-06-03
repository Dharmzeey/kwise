import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@/lib/api";
import HeroEditorial from "@/components/home/HeroEditorial";
import CategoryTiles from "@/components/home/CategoryTiles";
import BrandStrip from "@/components/home/BrandStrip";
import ProductCard from "@/components/shop/ProductCard";
import Btn from "@/components/ui/Btn";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Kwise World — Trusted Gadgets, Delivered",
  description:
    "Shop brand-new and UK-used phones, laptops, and accessories — every unit tested before it ships. Fast delivery across Nigeria.",
};

export default async function HomePage() {
  const [categories, featuredPage, offersPage] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchProducts({ sort: "featured", page: 1 }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
    fetchProducts({ one_time: true, page: 1 }).catch(() => ({ results: [], count: 0, next: null, previous: null })),
  ]);

  const heroProducts = featuredPage.results.slice(0, 6);
  const featured = featuredPage.results.slice(0, 4);
  const offers = offersPage.results.slice(0, 4);

  return (
    <>
      <HeroEditorial products={heroProducts} />
      <CategoryTiles categories={categories} />

      {/* Featured products row */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="sec-head">
              <h2>Featured picks</h2>
              <Btn kind="ghost" href="/category/all">
                See all <Icon name="arrowRight" size={15} />
              </Btn>
            </div>
            <div className="prod-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
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
              <Btn kind="orange" href="/offers">
                View all offers <Icon name="arrowRight" size={15} />
              </Btn>
            </div>
            <div className="prod-grid">
              {offers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BrandStrip />
    </>
  );
}
