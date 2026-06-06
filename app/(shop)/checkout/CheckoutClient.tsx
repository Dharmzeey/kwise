"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { placeOrder, verifyCart, fetchProfile, type CartVerifyItem } from "@/lib/api";
import { formatNaira, deliveryFee } from "@/lib/utils";
import type { PlaceOrderPayload } from "@/lib/types";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import ProductThumb from "@/components/ui/ProductThumb";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, cartProducts, clearCart } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({ phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [verifiedPrices, setVerifiedPrices] = useState<Map<string, number>>(new Map());
  const [priceChanged, setPriceChanged] = useState(false);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // On mount: check auth + verify prices
  useEffect(() => {
    const isLoggedIn = document.cookie.includes("kw_access=");
    if (!isLoggedIn) {
      router.replace("/login?next=/checkout");
      return;
    }

    // Pre-fill phone from profile
    fetchProfile()
      .then((profile) => {
        setForm((f) => ({ ...f, phone: profile.phone ?? "" }));
      })
      .catch(() => {
        router.replace("/login?next=/checkout");
      });

    // Verify cart prices against DB
    if (items.length > 0) {
      verifyCart(items.map((i) => ({ product_id: i.id, quantity: i.qty })))
        .then((result: CartVerifyItem[]) => {
          const priceMap = new Map<string, number>();
          let changed = false;
          const unavailableItems: string[] = [];

          for (const v of result) {
            if (!v.available) {
              unavailableItems.push(v.product_id);
              continue;
            }
            if (v.unit_price !== undefined) {
              priceMap.set(v.product_id, v.unit_price);
              const cartProduct = cartProducts.find((p) => p.id === v.product_id);
              if (cartProduct && cartProduct.price !== v.unit_price) changed = true;
            }
          }

          setVerifiedPrices(priceMap);
          setPriceChanged(changed);
          setUnavailable(unavailableItems);
          setReady(true);
        })
        .catch(() => setReady(true));
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lines = items
    .map((it) => ({ ...it, product: cartProducts.find((p) => p.id === it.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => !!l.product);

  // Use verified price if available, else fall back to cart price
  function unitPrice(id: string, fallback: number): number {
    return verifiedPrices.get(id) ?? fallback;
  }

  const subtotal = lines.reduce((sum, l) => sum + unitPrice(l.id, l.product.price) * l.qty, 0);
  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;

  if (lines.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty empty-lg">
            <Icon name="cart" size={56} stroke={1.2} />
            <h2>Your cart is empty</h2>
            <Btn kind="primary" size="lg" href="/category/all" iconAfter="arrowRight">
              Browse products
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (unavailable.length > 0) {
      showToast("Some items are no longer available. Please update your cart.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: PlaceOrderPayload = {
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
        guest_phone: form.phone,
        delivery_address: form.address,
      };
      const res = await placeOrder(payload);
      clearCart();
      router.push(`/order-confirmed?ref=${res.reference}`);
    } catch {
      showToast("Could not place order — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs">
          <Link href="/">Home</Link>
          <Icon name="chevron" size={13} />
          <Link href="/cart">Cart</Link>
          <Icon name="chevron" size={13} />
          <span>Checkout</span>
        </nav>
        <h1 className="page-title">Checkout</h1>

        {priceChanged && (
          <div className="price-alert">
            <Icon name="info" size={16} />
            Some prices have changed since you added items to your cart. Totals have been updated.
          </div>
        )}

        {unavailable.length > 0 && (
          <div className="price-alert price-alert--error">
            <Icon name="info" size={16} />
            {unavailable.length} item(s) are no longer available. Please{" "}
            <Link href="/cart">update your cart</Link> before continuing.
          </div>
        )}

        <div className="checkout-layout">
          {/* ── Delivery form ── */}
          <form className="co-form" onSubmit={handleSubmit}>
            <div className="co-section">
              <h2>Delivery details</h2>
              <label className="field">
                <span>WhatsApp / Phone *</span>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                />
              </label>
              <label className="field">
                <span>Delivery address *</span>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="12 Bodija Market Road, Ibadan"
                />
              </label>
            </div>

            {/* ── Order items (mobile) ── */}
            <div className="co-items-mobile">
              {lines.map((l) => (
                <div className="co-line" key={l.id}>
                  <div className="co-line-thumb">
                    <ProductThumb thumb={l.product.thumb} tint={l.product.tint} />
                  </div>
                  <div className="co-line-info">
                    <span>{l.product.name}</span>
                    <span className="co-line-qty">× {l.qty}</span>
                  </div>
                  <span className="co-line-price">{formatNaira(unitPrice(l.id, l.product.price) * l.qty)}</span>
                </div>
              ))}
            </div>

            <Btn
              kind="primary"
              size="lg"
              type="submit"
              disabled={submitting || !ready || unavailable.length > 0}
            >
              {submitting ? "Placing order…" : `Place order — ${formatNaira(total)}`}
            </Btn>
            <div className="sum-pay" style={{ marginTop: 14 }}>
              <Icon name="shieldCheck" size={15} /> Secure checkout · transfer, card or USSD
            </div>
          </form>

          {/* ── Summary sidebar ── */}
          <aside className="cart-summary">
            <h3>Order summary</h3>
            <div className="co-lines">
              {lines.map((l) => {
                const vPrice = unitPrice(l.id, l.product.price);
                const changed = verifiedPrices.has(l.id) && vPrice !== l.product.price;
                return (
                  <div className="co-line" key={l.id}>
                    <div className="co-line-thumb">
                      <ProductThumb thumb={l.product.thumb} tint={l.product.tint} />
                    </div>
                    <div className="co-line-info">
                      <span>{l.product.name}</span>
                      <span className="co-line-qty">× {l.qty}</span>
                    </div>
                    <span className={`co-line-price${changed ? " price-updated" : ""}`}>
                      {formatNaira(vPrice * l.qty)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="sum-row" style={{ marginTop: 16 }}>
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Delivery</span>
              <span>{fee === 0 ? "Free" : formatNaira(fee)}</span>
            </div>
            <div className="sum-row sum-total">
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
