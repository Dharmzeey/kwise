"use client";

import { useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductListItem } from "@/lib/types";

interface Props {
  title: string;
  href: string;
  products: ProductListItem[];
  eyebrow?: string;
  eyebrowIcon?: "bolt" | "tag" | "star" | "truck";
  accent?: "blue" | "orange";
  soft?: boolean;
}

export default function ProductRail({
  title,
  href,
  products,
  eyebrow,
  eyebrowIcon,
  accent = "blue",
  soft = false,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  function scroll(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <section className={`section rail-section${soft ? " section-soft" : ""}`}>
      <div className="container">
        <div className="rail-head">
          <div className="rail-head-titles">
            {eyebrow && (
              <span className={`eyebrow${accent === "orange" ? " eyebrow-orange" : ""}`}>
                {eyebrowIcon && <Icon name={eyebrowIcon} size={14} stroke={eyebrowIcon === "bolt" ? 0 : 2} />}
                {eyebrow}
              </span>
            )}
            <h2>{title}</h2>
          </div>
          <div className="rail-head-actions">
            <div className="rail-arrows">
              <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left">
                <Icon name="arrowLeft" size={17} />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="Scroll right">
                <Icon name="arrowRight" size={17} />
              </button>
            </div>
            <Link className="link-btn" href={href}>
              See all <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </div>

        <div className="rail-scroller" ref={scroller}>
          {products.map((p) => (
            <div className="rail-item" key={p.id}>
              <ProductCard product={p} hideAdd />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
