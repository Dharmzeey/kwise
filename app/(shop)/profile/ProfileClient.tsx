"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProfile, updateProfile, fetchMyOrders, logout } from "@/lib/api";
import type { UserProfile, Order } from "@/lib/types";
import Icon from "@/components/ui/Icon";

type Tab = "account" | "orders";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const STATUS_CLS: Record<string, string> = {
  pending: "prf-st-pending",
  confirmed: "prf-st-confirmed",
  dispatched: "prf-st-dispatched",
  delivered: "prf-st-delivered",
  cancelled: "prf-st-cancelled",
};

export default function ProfileClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("account");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((u) => {
        setUser(u);
        setForm({ first_name: u.first_name, last_name: u.last_name, phone: u.phone ?? "" });
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (tab !== "orders" || orders.length) return;
    setLoadingOrders(true);
    fetchMyOrders()
      .then((res) => setOrders(res.results ?? (res as unknown as Order[])))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [tab, orders.length]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError(""); setSaved(false);
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setFormError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (!user) {
    return (
      <div className="prf-loading">
        <div className="prf-spinner" />
      </div>
    );
  }

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();
  const memberSince = new Date(user.date_joined).toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  return (
    <div className="prf-page page">
      <div className="container">
        <div className="prf-layout">

          {/* ── Sidebar ── */}
          <aside className="prf-sidebar">
            <div className="prf-identity">
              <div className="prf-avatar">{initials}</div>
              <div className="prf-id-text">
                <p className="prf-fullname">{user.full_name || "—"}</p>
                <p className="prf-email-sm">{user.email}</p>
                <p className="prf-since">Member since {memberSince}</p>
              </div>
            </div>

            <nav className="prf-nav">
              <button
                className={`prf-navlink${tab === "account" ? " on" : ""}`}
                onClick={() => setTab("account")}
              >
                <Icon name="user" size={16} /> Account details
              </button>
              <button
                className={`prf-navlink${tab === "orders" ? " on" : ""}`}
                onClick={() => setTab("orders")}
              >
                <Icon name="cart" size={16} /> My orders
                {orders.length > 0 && <span className="prf-count">{orders.length}</span>}
              </button>
            </nav>

            <button className="prf-signout" onClick={handleLogout}>
              <Icon name="arrowLeft" size={15} /> Sign out
            </button>
          </aside>

          {/* ── Content ── */}
          <div className="prf-content">

            {/* Account tab */}
            {tab === "account" && (
              <div className="prf-card">
                <div className="prf-card-head">
                  <h2>Personal details</h2>
                  <p>Update your name and contact info.</p>
                </div>
                <form className="prf-form" onSubmit={handleSave}>
                  <div className="prf-form-row">
                    <label>
                      First name
                      <input
                        required
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      />
                    </label>
                    <label>
                      Last name
                      <input
                        required
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      />
                    </label>
                  </div>
                  <label>
                    Phone number <span className="prf-hint">optional</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                    />
                  </label>
                  <label>
                    Email address <span className="prf-hint">cannot be changed</span>
                    <input value={user.email} disabled />
                  </label>

                  {formError && <p className="prf-field-error">{formError}</p>}

                  <div className="prf-form-foot">
                    <button type="submit" className="btn btn-primary btn-md" disabled={saving}>
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    {saved && (
                      <span className="prf-saved-msg">
                        <Icon name="shieldCheck" size={14} /> Saved successfully
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Orders tab */}
            {tab === "orders" && (
              <div className="prf-card">
                <div className="prf-card-head">
                  <h2>Order history</h2>
                  <p>All your past purchases in one place.</p>
                </div>

                {loadingOrders ? (
                  <div className="prf-orders-loading">
                    <div className="prf-spinner" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="prf-empty">
                    <div className="prf-empty-icon"><Icon name="cart" size={28} /></div>
                    <p>You haven&apos;t placed any orders yet.</p>
                    <Link href="/" className="btn btn-primary btn-md">Browse products</Link>
                  </div>
                ) : (
                  <div className="prf-orders">
                    {orders.map((o) => (
                      <div key={o.reference} className="prf-order">
                        <div className="prf-order-top">
                          <div className="prf-order-meta">
                            <span className="prf-order-ref">{o.reference}</span>
                            <span className={`prf-status ${STATUS_CLS[o.status] ?? ""}`}>
                              {STATUS_LABEL[o.status] ?? o.status}
                            </span>
                          </div>
                          <span className="prf-order-date">
                            {new Date(o.created_at).toLocaleDateString("en-NG", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="prf-order-items">
                          {o.items.map((item, i) => (
                            <div key={i} className="prf-order-row">
                              <span className="prf-item-name">{item.product_name}</span>
                              <span className="prf-item-qty">×{item.quantity}</span>
                              <span className="prf-item-price">
                                ₦{(item.unit_price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="prf-order-total">
                          <span>Order total</span>
                          <strong>₦{o.total.toLocaleString()}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
