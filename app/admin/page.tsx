"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAdminStats } from "@/lib/api";
import type { AdminStats } from "@/lib/types";

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_COLOR: Record<string, string> = {
  pending: "adm-badge--orange",
  confirmed: "adm-badge--blue",
  dispatched: "adm-badge--purple",
  delivered: "adm-badge--green",
  cancelled: "adm-badge--red",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(console.error);
  }, []);

  const cards = stats
    ? [
        { label: "Products", value: stats.products, sub: "in catalog", href: "/admin/products" },
        { label: "Total Orders", value: stats.orders, sub: "all time", href: "/admin/orders" },
        { label: "Pending Orders", value: stats.pending_orders, sub: "need action", href: "/admin/orders?status=pending" },
        { label: "Revenue", value: formatNaira(stats.total_revenue), sub: "confirmed + delivered", href: null },
      ]
    : [];

  return (
    <div className="adm-page">
      <h1 className="adm-title">Dashboard</h1>
      {!stats ? (
        <p className="adm-loading">Loading…</p>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="adm-stat-grid">
            {cards.map((c) => (
              <div className="adm-stat" key={c.label}>
                <span className="adm-stat-label">{c.label}</span>
                <strong className="adm-stat-value">{c.value}</strong>
                <span className="adm-stat-sub">
                  {c.href ? <Link href={c.href}>{c.sub}</Link> : c.sub}
                </span>
              </div>
            ))}
          </div>

          <div className="adm-dash-cols">
            {/* ── Recent orders ── */}
            <section className="adm-dash-section">
              <div className="adm-section-head">
                <h2>Recent orders</h2>
                <Link href="/admin/orders" className="adm-see-all">See all</Link>
              </div>
              {stats.recent_orders.length === 0 ? (
                <p className="adm-empty">No orders yet.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_orders.map((o) => (
                        <tr key={o.reference}>
                          <td>
                            <Link href={`/admin/orders/${o.reference}`} className="adm-ref-link">
                              <code className="adm-ref">{o.reference}</code>
                            </Link>
                          </td>
                          <td>
                            <div>{o.guest_name || "—"}</div>
                            <div className="adm-sub">{o.guest_email}</div>
                          </td>
                          <td>{formatNaira(o.total)}</td>
                          <td className="adm-sub">{fmtDate(o.created_at)}</td>
                          <td>
                            <span className={`adm-badge ${STATUS_COLOR[o.status] ?? ""}`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ── Low stock ── */}
            <section className="adm-dash-section">
              <div className="adm-section-head">
                <h2>Low stock <span className="adm-badge adm-badge--red">{stats.low_stock.length}</span></h2>
                <Link href="/admin/products" className="adm-see-all">See all products</Link>
              </div>
              {stats.low_stock.length === 0 ? (
                <p className="adm-empty">All products have healthy stock.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th style={{ textAlign: "center" }}>Stock</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.low_stock.map((p) => (
                        <tr key={p.slug}>
                          <td>
                            <div>{p.name}</div>
                            <div className="adm-sub">{p.brand_slug}</div>
                          </td>
                          <td className="adm-sub">{p.category_slug}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`adm-badge ${p.stock === 0 ? "adm-badge--red" : "adm-badge--orange"}`}>
                              {p.stock === 0 ? "Out" : p.stock}
                            </span>
                          </td>
                          <td>
                            <Link href={`/admin/products/${p.slug}/edit`} className="adm-action-link">Edit</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
