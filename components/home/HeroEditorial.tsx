"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import ProductThumb from "@/components/ui/ProductThumb";
import StatusPill from "@/components/ui/StatusPill";
import { formatNaira } from "@/lib/utils";
import type { ProductListItem } from "@/lib/types";

interface Props {
  products: ProductListItem[];
}

export default function HeroEditorial({ products }: Props) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const len = products.length;

  useEffect(() => {
    if (len < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % len), 4000);
    return () => clearInterval(t);
  }, [len]);

  const main = products[idx];
  const f1 = len > 1 ? products[(idx + 1) % len] : null;
  const f2 = len > 2 ? products[(idx + 2) % len] : null;

  return (
    <section className="hero hero-editorial">
      <div className="container hero-in">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="shieldCheck" size={15} /> Integrity, every single sale</span>
          <h1>Gadgets you can <em>actually</em> trust.</h1>
          <p>
            iPhone &amp; Samsung, HP &amp; Lenovo, plus every accessory in between — brand new and
            clean UK-used, tested before it reaches you.
          </p>
          <div className="hero-cta">
            <Btn kind="primary" size="lg" href="/category/phones" iconAfter="arrowRight">Shop phones</Btn>
            <Btn kind="ghost" size="lg" href="/offers">
              <Icon name="bolt" size={18} stroke={0} /> One-Time Offers
            </Btn>
          </div>
          <div className="hero-stats">
            <div><strong>4.8★</strong><span>2,400+ reviews</span></div>
            <div><strong>36</strong><span>States covered</span></div>
            <div><strong>100%</strong><span>Tested units</span></div>
          </div>
        </div>

        {main ? (
          <div className="hero-art">
            {/* Main card */}
            <div
              className="hero-card hero-card-main"
              onClick={() => router.push(`/product/${main.id}`)}
            >
              <div key={`main-${main.id}`} className="hero-card-anim">
                <ProductThumb thumb={main.thumb} tint={main.tint} name={main.name} size="hero" />
                <div className="hero-card-tag">
                  <div className="hero-card-tag-info">
                    <StatusPill status={main.status} />
                    <span className="hero-card-name">{main.name}</span>
                  </div>
                  <strong>{formatNaira(main.price)}</strong>
                </div>
              </div>
            </div>

            {/* Float 1 */}
            {f1 && (
              <div
                key={`f1-${f1.id}`}
                className="hero-card hero-card-float hf1"
                onClick={() => router.push(`/product/${f1.id}`)}
              >
                <ProductThumb thumb={f1.thumb} tint={f1.tint} />
                <div className="hero-card-tag hero-card-tag-sm">
                  <span>{f1.name}</span>
                </div>
              </div>
            )}

            {/* Float 2 */}
            {f2 && (
              <div
                key={`f2-${f2.id}`}
                className="hero-card hero-card-float hf2"
                onClick={() => router.push(`/product/${f2.id}`)}
              >
                <ProductThumb thumb={f2.thumb} tint={f2.tint} />
                <div className="hero-card-tag hero-card-tag-sm">
                  <span>{f2.name}</span>
                </div>
              </div>
            )}

            {/* Dot indicators */}
            {len > 1 && (
              <div className="hero-dots">
                {products.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-dot${i === idx ? " on" : ""}`}
                    onClick={() => setIdx(i)}
                    aria-label={`Show product ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Fallback when no products loaded */
          <div className="hero-art" aria-hidden="true">
            <div className="hero-card hero-card-main">
              <div className="hero-card-placeholder" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
