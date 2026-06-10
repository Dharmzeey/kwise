"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { fetchAdminCustomers } from "@/lib/api";
import type { AdminCustomer } from "@/lib/types";

function formatNaira(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCustomers(q || undefined);
      setCustomers(data);
    } finally { setLoading(false); }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <h1 className="adm-title">Customers</h1>
        <span className="adm-count">{customers.length} total</span>
      </div>

      <div className="adm-toolbar">
        <input
          className="adm-search"
          placeholder="Search by name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="adm-empty">No customers found.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th style={{ textAlign: "center" }}>Orders</th>
                <th style={{ textAlign: "right" }}>Total spent</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div>{c.full_name || "—"}</div>
                    <div className="adm-sub">{c.email}</div>
                  </td>
                  <td className="adm-sub">{c.phone || "—"}</td>
                  <td style={{ textAlign: "center" }}>{c.order_count}</td>
                  <td style={{ textAlign: "right" }}>{formatNaira(c.total_spent)}</td>
                  <td className="adm-sub">{fmtDate(c.date_joined)}</td>
                  <td>
                    <Link href={`/admin/customers/${c.id}`} className="adm-action-link">View</Link>
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
