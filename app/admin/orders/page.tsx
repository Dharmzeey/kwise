"use client";
import { useEffect, useState } from "react";
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

// "confirmed" is set by the webhook only — admin can only move forward
const ADMIN_SETTABLE = ["dispatched", "delivered", "cancelled"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOrders().then((r) => setOrders(r.results)).finally(() => setLoading(false));
  }, []);

  async function handleStatus(reference: string, newStatus: string) {
    setUpdating(reference);
    try {
      const updated = await updateOrderStatus(reference, newStatus);
      setOrders((prev) => prev.map((o) => o.reference === reference ? updated : o));
    } catch { alert("Failed to update status."); }
    finally { setUpdating(null); }
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <h1 className="adm-title">Orders</h1>
        <span className="adm-count">{orders.length} total</span>
      </div>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Confirmed</th>
                <th>Dispatched</th>
                <th>Delivered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.reference}>
                  <td><code className="adm-ref">{o.reference}</code></td>
                  <td>
                    <div>{o.guest_name || "—"}</div>
                    <div className="adm-sub">{o.guest_email}</div>
                  </td>
                  <td>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td>{formatNaira(o.total)}</td>
                  <td className="adm-sub">{fmtDate(o.confirmed_at)}</td>
                  <td className="adm-sub">{fmtDate(o.dispatched_at)}</td>
                  <td className="adm-sub">{fmtDate(o.delivered_at)}</td>
                  <td>
                    {o.status === "delivered" || o.status === "cancelled" ? (
                      <span className="adm-badge">{STATUS_LABEL[o.status]}</span>
                    ) : (
                      <select
                        className="adm-status-select"
                        value={o.status}
                        disabled={updating === o.reference}
                        onChange={(e) => handleStatus(o.reference, e.target.value)}
                      >
                        {/* Show current status (read-only option if not admin-settable) */}
                        {!ADMIN_SETTABLE.includes(o.status) && (
                          <option value={o.status} disabled>{STATUS_LABEL[o.status]}</option>
                        )}
                        {ADMIN_SETTABLE.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
