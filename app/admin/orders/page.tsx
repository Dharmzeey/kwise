"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
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

const STATUS_TABS = ["all", "pending", "confirmed", "dispatched", "delivered", "cancelled"];

function exportCSV(orders: AdminOrder[]) {
  const rows = [
    ["Reference", "Customer", "Email", "Phone", "Total", "Status", "Confirmed", "Dispatched", "Delivered", "Date"],
    ...orders.map((o) => [
      o.reference, o.guest_name, o.guest_email, o.guest_phone,
      o.total, o.status,
      o.confirmed_at ?? "", o.dispatched_at ?? "", o.delivered_at ?? "",
      new Date(o.created_at).toLocaleDateString("en-NG"),
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "kwise-orders.csv"; a.click();
  URL.revokeObjectURL(url);
}

function AdminOrdersInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState(params.get("status") ?? "all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminOrders({
        q: q || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setOrders(res.results);
    } finally { setLoading(false); }
  }, [q, statusFilter]);

  useEffect(() => { load(); }, [load]);

  // Sync URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (statusFilter !== "all") p.set("status", statusFilter);
    router.replace(`/admin/orders${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }, [q, statusFilter, router]);

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
        <button className="btn btn-outline btn-sm" onClick={() => exportCSV(orders)}>
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="adm-toolbar">
        <input
          className="adm-search"
          placeholder="Search by reference, name, email or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="adm-count">{orders.length} result{orders.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Status tabs */}
      <div className="adm-tabs">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            className={`adm-tab${statusFilter === s ? " on" : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="adm-empty">No orders found.</p>
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
                  <td>
                    <Link href={`/admin/orders/${o.reference}`} className="adm-ref-link">
                      <code className="adm-ref">{o.reference}</code>
                    </Link>
                  </td>
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

export default function AdminOrdersPage() {
  return <Suspense><AdminOrdersInner /></Suspense>;
}
