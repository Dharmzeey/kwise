"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/api";
import type { AdminOrder } from "@/lib/types";

function formatNaira(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ADMIN_SETTABLE = ["dispatched", "delivered", "cancelled"];
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", dispatched: "Dispatched",
  delivered: "Delivered", cancelled: "Cancelled",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "adm-badge--orange", confirmed: "adm-badge--blue",
  dispatched: "adm-badge--purple", delivered: "adm-badge--green", cancelled: "adm-badge--red",
};

export default function AdminOrderDetailPage() {
  const { reference } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdminOrders({ q: reference })
      .then((res) => {
        const found = res.results.find((o) => o.reference === reference) ?? null;
        setOrder(found);
      })
      .finally(() => setLoading(false));
  }, [reference]);

  async function handleStatus(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order.reference, newStatus);
      setOrder(updated);
    } catch { alert("Failed to update status."); }
    finally { setUpdating(false); }
  }

  if (loading) return <div className="adm-page"><p className="adm-loading">Loading…</p></div>;
  if (!order) return (
    <div className="adm-page">
      <p className="adm-empty">Order not found. <Link href="/admin/orders">Back to orders</Link></p>
    </div>
  );

  const steps: { label: string; ts: string | null }[] = [
    { label: "Confirmed", ts: order.confirmed_at },
    { label: "Dispatched", ts: order.dispatched_at },
    { label: "Delivered", ts: order.delivered_at },
  ];
  const activeIdx = steps.map((s) => !!s.ts).lastIndexOf(true);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <Link href="/admin/orders" className="adm-back-link">← Orders</Link>
          <h1 className="adm-title" style={{ marginTop: 6 }}>
            <code>{order.reference}</code>
            <span className={`adm-badge ${STATUS_COLOR[order.status] ?? ""}`} style={{ marginLeft: 12 }}>
              {STATUS_LABEL[order.status]}
            </span>
          </h1>
        </div>
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Move to:</span>
            <select
              className="adm-status-select"
              value={order.status}
              disabled={updating}
              onChange={(e) => handleStatus(e.target.value)}
            >
              {!ADMIN_SETTABLE.includes(order.status) && (
                <option value={order.status} disabled>{STATUS_LABEL[order.status]}</option>
              )}
              {ADMIN_SETTABLE.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="adm-order-detail-grid">
        {/* ── Customer info ── */}
        <div className="adm-detail-card">
          <h3>Customer</h3>
          <dl className="adm-dl">
            <dt>Name</dt><dd>{order.guest_name || "—"}</dd>
            <dt>Email</dt><dd>{order.guest_email || "—"}</dd>
            <dt>Phone</dt><dd>{order.guest_phone || "—"}</dd>
            <dt>Delivery address</dt><dd>{order.delivery_address || "—"}</dd>
          </dl>
        </div>

        {/* ── Timeline ── */}
        <div className="adm-detail-card">
          <h3>Timeline</h3>
          <ol className="order-timeline">
            {steps.map((step, i) => (
              <li
                key={step.label}
                className={`ot-step${i <= activeIdx ? " ot-step--done" : ""}${i === activeIdx ? " ot-step--current" : ""}`}
              >
                <span className="ot-dot" />
                <div className="ot-body">
                  <span className="ot-label">{step.label}</span>
                  {step.ts && <span className="ot-time">{fmtDate(step.ts)}</span>}
                </div>
              </li>
            ))}
          </ol>
          <p className="adm-sub" style={{ marginTop: 12 }}>Placed {fmtDate(order.created_at)}</p>
        </div>

        {/* ── Order items ── */}
        <div className="adm-detail-card adm-detail-card--wide">
          <h3>Items</h3>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: "right" }}>Unit price</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Line total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product_name}</td>
                    <td style={{ textAlign: "right" }}>{formatNaira(item.unit_price)}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{formatNaira(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: "right", color: "var(--ink-2)", fontSize: 13 }}>Subtotal</td>
                  <td style={{ textAlign: "right" }}>{formatNaira(order.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: "right", color: "var(--ink-2)", fontSize: 13 }}>Delivery</td>
                  <td style={{ textAlign: "right" }}>{order.delivery_fee === 0 ? "Free" : formatNaira(order.delivery_fee)}</td>
                </tr>
                <tr className="adm-total-row">
                  <td colSpan={3} style={{ textAlign: "right" }}>Total</td>
                  <td style={{ textAlign: "right" }}><strong>{formatNaira(order.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
