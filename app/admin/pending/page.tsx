"use client";
import { useEffect, useState } from "react";
import { fetchAdminPendingTransactions } from "@/lib/api";
import type { PendingTransaction } from "@/lib/types";

function formatNaira(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function minutesAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  return `${h}h ago`;
}

export default function AdminPendingPage() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPendingTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <h1 className="adm-title">Pending Payments</h1>
        <span className="adm-count">{transactions.length} in-flight</span>
      </div>
      <p className="adm-desc">
        These customers have reached the Paystack payment page but payment has not yet been confirmed.
        Records are deleted automatically once payment succeeds (via webhook).
      </p>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : transactions.length === 0 ? (
        <p className="adm-empty">No pending payments at the moment.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.reference}>
                  <td><code className="adm-ref">{t.reference}</code></td>
                  <td>
                    <div>{t.guest_name || "—"}</div>
                    <div className="adm-sub">{t.guest_email}</div>
                  </td>
                  <td className="adm-sub">{t.guest_phone || "—"}</td>
                  <td>
                    {t.cart_data.map((item, i) => (
                      <div key={i} className="adm-sub">
                        {item.product_name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{formatNaira(t.total)}</td>
                  <td>
                    <div>{fmtDate(t.created_at)}</div>
                    <div className="adm-sub">{minutesAgo(t.created_at)}</div>
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
