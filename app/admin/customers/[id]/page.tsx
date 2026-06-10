"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchAdminCustomer } from "@/lib/api";
import type { AdminCustomerDetail } from "@/lib/types";

function formatNaira(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const STATUS_COLOR: Record<string, string> = {
  pending: "adm-badge--orange", confirmed: "adm-badge--blue",
  dispatched: "adm-badge--purple", delivered: "adm-badge--green", cancelled: "adm-badge--red",
};

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminCustomer(Number(id))
      .then(setCustomer)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="adm-page"><p className="adm-loading">Loading…</p></div>;
  if (!customer) return (
    <div className="adm-page">
      <p className="adm-empty">Customer not found. <Link href="/admin/customers">Back</Link></p>
    </div>
  );

  return (
    <div className="adm-page">
      <Link href="/admin/customers" className="adm-back-link">← Customers</Link>
      <h1 className="adm-title" style={{ marginTop: 8 }}>{customer.full_name || customer.email}</h1>

      <div className="adm-order-detail-grid">
        {/* ── Profile ── */}
        <div className="adm-detail-card">
          <h3>Profile</h3>
          <dl className="adm-dl">
            <dt>Email</dt><dd>{customer.email}</dd>
            <dt>Phone</dt><dd>{customer.phone || "—"}</dd>
            <dt>Joined</dt><dd>{fmtDate(customer.date_joined)}</dd>
            <dt>Status</dt><dd>{customer.is_active ? "Active" : "Disabled"}</dd>
          </dl>
        </div>

        {/* ── Summary ── */}
        <div className="adm-detail-card">
          <h3>Summary</h3>
          <dl className="adm-dl">
            <dt>Total orders</dt><dd>{customer.order_count}</dd>
            <dt>Total spent</dt><dd>{formatNaira(customer.total_spent)}</dd>
          </dl>
        </div>

        {/* ── Orders ── */}
        <div className="adm-detail-card adm-detail-card--wide">
          <h3>Orders</h3>
          {customer.orders.length === 0 ? (
            <p className="adm-empty">No orders yet.</p>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o) => (
                    <tr key={o.reference}>
                      <td>
                        <Link href={`/admin/orders/${o.reference}`} className="adm-ref-link">
                          <code className="adm-ref">{o.reference}</code>
                        </Link>
                      </td>
                      <td>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                      <td>{formatNaira(o.total)}</td>
                      <td>
                        <span className={`adm-badge ${STATUS_COLOR[o.status] ?? ""}`}>{o.status}</span>
                      </td>
                      <td className="adm-sub">{fmtDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
