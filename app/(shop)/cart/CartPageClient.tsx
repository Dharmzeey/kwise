"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatNaira, deliveryFee } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import ProductThumb from "@/components/ui/ProductThumb";
import StatusPill from "@/components/ui/StatusPill";

export default function CartPageClient() {
  const { items, cartProducts, updateQty, removeItem, subtotal } = useCart();

  const lines = items
    .map((it) => ({ ...it, product: cartProducts.find((p) => p.id === it.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => !!l.product);

  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;
  const freeDeliveryGap = 500_000 - subtotal;

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty empty-lg">
            <Icon name="cart" size={56} stroke={1.2} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven&apos;t added anything yet.</p>
            <Btn kind="primary" size="lg" href="/category/all" iconAfter="arrowRight">
              Browse products
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs">
          <Link href="/">Home</Link>
          <Icon name="chevron" size={13} />
          <span>Cart</span>
        </nav>
        <h1 className="page-title">Your cart</h1>

        <div className="cart-layout">
          {/* ── Items ── */}
          <div className="cart-items">
            {lines.map((l) => (
              <div className="cart-row" key={l.id}>
                <Link className="cart-row-media" href={`/product/${l.id}`}>
                  <ProductThumb thumb={l.product.thumb} tint={l.product.tint} size="card" />
                </Link>
                <div className="cart-row-main">
                  <div className="cart-row-head">
                    <div>
                      <Link href={`/product/${l.id}`}>
                        <strong>{l.product.name}</strong>
                      </Link>
                      <div className="cart-row-pills">
                        <StatusPill status={l.product.status} />
                        {l.product.is_one_time && (
                          <span className="badge badge-ot">
                            <Icon name="bolt" size={11} stroke={0} /> One-Time
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="iconbtn-sm"
                      onClick={() => removeItem(l.id)}
                      aria-label="Remove item"
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                  <div className="cart-row-bot">
                    <div className="qty qty-sm">
                      <button
                        onClick={() => updateQty(l.id, l.qty - 1)}
                        disabled={l.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Icon name="minus" size={15} />
                      </button>
                      <span>{l.qty}</span>
                      <button
                        onClick={() => updateQty(l.id, l.qty + 1)}
                        disabled={l.product.is_one_time}
                        aria-label="Increase quantity"
                      >
                        <Icon name="plus" size={15} />
                      </button>
                    </div>
                    <span className="cart-row-price">
                      {formatNaira(l.product.price * l.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <aside className="cart-summary">
            <h3>Order summary</h3>
            <div className="sum-row">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Delivery</span>
              <span>{fee === 0 ? "Free" : formatNaira(fee)}</span>
            </div>
            {fee > 0 && (
              <p className="sum-hint">
                Add {formatNaira(freeDeliveryGap)} more for free delivery.
              </p>
            )}
            <div className="sum-row sum-total">
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>
            <Btn kind="primary" size="lg" href="/checkout" iconAfter="arrowRight">
              Checkout
            </Btn>
            <div className="sum-pay">
              <Icon name="shieldCheck" size={15} /> Secure checkout · transfer, card or USSD
            </div>
            <Link href="/category/all" className="link-btn cart-continue">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
