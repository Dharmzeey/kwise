"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { placeOrder } from "@/lib/api";
import { formatNaira, deliveryFee } from "@/lib/utils";
import type { PlaceOrderPayload } from "@/lib/types";
import Icon from "@/components/ui/Icon";
import Btn from "@/components/ui/Btn";
import ProductThumb from "@/components/ui/ProductThumb";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, cartProducts, clearCart, subtotal } = useCart();
  const { showToast } = useToast();

  const lines = items
    .map((it) => ({ ...it, product: cartProducts.find((p) => p.id === it.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => !!l.product);

  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  // Redirect to cart if empty
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
    setSubmitting(true);
    try {
      const payload: PlaceOrderPayload = {
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
        guest_name: form.name,
        guest_email: form.email,
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

        <div className="checkout-layout">
          {/* ── Delivery form ── */}
          <form className="co-form" onSubmit={handleSubmit}>
            <div className="co-section">
              <h2>Delivery details</h2>
              <div className="form-row-2">
                <label className="field">
                  <span>Full name *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ada Obi"
                  />
                </label>
                <label className="field">
                  <span>Email *</span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ada@example.com"
                  />
                </label>
              </div>
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

            {/* ── Order items (mobile: show inside form) ── */}
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
                  <span className="co-line-price">{formatNaira(l.product.price * l.qty)}</span>
                </div>
              ))}
            </div>

            <Btn kind="primary" size="lg" type="submit" disabled={submitting}>
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
              {lines.map((l) => (
                <div className="co-line" key={l.id}>
                  <div className="co-line-thumb">
                    <ProductThumb thumb={l.product.thumb} tint={l.product.tint} />
                  </div>
                  <div className="co-line-info">
                    <span>{l.product.name}</span>
                    <span className="co-line-qty">× {l.qty}</span>
                  </div>
                  <span className="co-line-price">{formatNaira(l.product.price * l.qty)}</span>
                </div>
              ))}
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
