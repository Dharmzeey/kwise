"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import type { ProductDetail } from "@/lib/types";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import Stars from "@/components/ui/Stars";
import StatusPill from "@/components/ui/StatusPill";
import ProductThumb from "@/components/ui/ProductThumb";
import { formatNaira } from "@/lib/utils";

interface Props {
  product: ProductDetail;
}

export default function ProductDetailClient({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "details" | "reviews">("specs");
  const [color, setColor] = useState<string | null>(product.colors?.[0] ?? null);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const soldOut = product.sold_out;

  function handleAdd() {
    addItem(product, qty);
    showToast(`${product.name} added to cart`);
  }

  return (
    <>
      {/* ── Two-column layout ── */}
      <div className="pdp">
        {/* Left: media */}
        <div className="pdp-media">
          <div className="pdp-main">
            <ProductThumb
              thumb={product.thumb}
              tint={product.tint}
              name={product.name}
              size="fill"
            />
            {product.is_one_time && (
              <span className="badge badge-ot pdp-ot">
                <Icon name="bolt" size={13} stroke={0} /> One-Time Offer
              </span>
            )}
          </div>
        </div>

        {/* Right: info */}
        <div className="pdp-info">
          <div className="pdp-top">
            <StatusPill status={product.status} />
            <Stars value={product.rating} size={15} showNum count={product.review_count} />
          </div>

          <h1>{product.name}</h1>
          <p className="pdp-desc">{product.description}</p>

          <div className="pdp-price">
            <span className="price-now">{formatNaira(product.price)}</span>
            {product.old_price && (
              <>
                <span className="price-old">{formatNaira(product.old_price)}</span>
                <span className="badge badge-save">
                  Save {formatNaira(product.save_amount ?? 0)}
                </span>
              </>
            )}
          </div>

          {product.is_one_time && (
            <div className="pdp-otnote">
              <Icon name="bolt" size={16} stroke={0} />
              <div>
                <strong>
                  Single unit — {soldOut ? "now sold out." : "only 1 available."}
                </strong>
                {product.one_time_note && <p>{product.one_time_note}</p>}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="pdp-opt">
              <span className="opt-label">
                Colour: <strong>{color}</strong>
              </span>
              <div className="opt-chips">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`chip${color === c ? " on" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pdp-buy">
            <div className="qty">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={soldOut || qty <= 1}
                aria-label="Decrease quantity"
              >
                <Icon name="minus" size={16} />
              </button>
              <span>{qty}</span>
              <button
                onClick={() =>
                  setQty((q) =>
                    product.is_one_time ? 1 : Math.min(product.stock, q + 1)
                  )
                }
                disabled={soldOut || qty >= product.stock}
                aria-label="Increase quantity"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
            <Btn
              kind={product.is_one_time ? "orange" : "primary"}
              size="lg"
              full
              icon={soldOut ? "close" : "cart"}
              disabled={soldOut}
              onClick={handleAdd}
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </Btn>
          </div>

          <div className="pdp-assure">
            <span><Icon name="shieldCheck" size={16} /> Tested &amp; verified</span>
            <span><Icon name="truck" size={16} /> Nationwide delivery</span>
            <span><Icon name="refresh" size={16} /> 7-day returns</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pdp-tabs">
        <div className="tabbar">
          {(["specs", "details", "reviews"] as const).map((t) => (
            <button
              key={t}
              className={`tab${tab === t ? " on" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "specs"
                ? "Specifications"
                : t === "details"
                ? "Details"
                : `Reviews (${product.review_count})`}
            </button>
          ))}
        </div>

        <div className="tabpanel">
          {tab === "specs" && (
            product.specs.length > 0 ? (
              <table className="spec-table">
                <tbody>
                  {product.specs.map((s) => (
                    <tr key={s.key}>
                      <th>{s.key}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                  <tr><th>Condition</th><td>{product.status}</td></tr>
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--ink-3)", fontSize: 14 }}>
                No specifications listed for this product.
              </p>
            )
          )}

          {tab === "details" && (
            <div className="details-copy">
              <p>{product.description}</p>
              <p>
                Every Kwise World device is inspected and function-tested before listing.{" "}
                {product.status === "Brand New"
                  ? "This unit is sealed with full manufacturer warranty."
                  : "This is a pre-owned unit, honestly graded — what you see is what you get."}
              </p>
              <ul>
                <li>Function-tested: screen, battery, cameras, speakers, ports</li>
                <li>Comes with a compatible charging cable</li>
                <li>7-day return window if it isn&apos;t as described</li>
              </ul>
            </div>
          )}

          {tab === "reviews" && (
            product.reviews.length === 0 ? (
              <p style={{ color: "var(--ink-3)", fontSize: 14 }}>
                No reviews yet — be the first to buy this product.
              </p>
            ) : (
              <>
                <div className="rev-summary">
                  <div className="rev-big">
                    <strong>{Number(product.rating).toFixed(1)}</strong>
                    <Stars value={product.rating} size={16} />
                    <span>{product.review_count} reviews</span>
                  </div>
                </div>
                <div className="rev-list">
                  {product.reviews.map((r) => (
                    <div className="rev" key={r.id}>
                      <div className="rev-head">
                        <span className="rev-av">{r.reviewer_name[0]}</span>
                        <div>
                          <strong>
                            {r.reviewer_name}
                            {r.is_verified && (
                              <span className="rev-verified">
                                <Icon name="check" size={11} /> Verified
                              </span>
                            )}
                          </strong>
                          <span className="rev-date">
                            {new Date(r.created_at).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <Stars value={r.rating} size={13} />
                      </div>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}
