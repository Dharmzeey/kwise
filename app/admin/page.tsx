"use client";
import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/lib/api";
import type { AdminStats } from "@/lib/types";

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(console.error);
  }, []);

  const cards = stats
    ? [
        { label: "Products", value: stats.products, sub: "in catalog" },
        { label: "Total Orders", value: stats.orders, sub: "all time" },
        { label: "Pending Orders", value: stats.pending_orders, sub: "need action" },
        { label: "Revenue", value: formatNaira(stats.total_revenue), sub: "confirmed + delivered" },
      ]
    : [];

  return (
    <div className="adm-page">
      <h1 className="adm-title">Dashboard</h1>
      {!stats ? (
        <p className="adm-loading">Loading…</p>
      ) : (
        <div className="adm-stat-grid">
          {cards.map((c) => (
            <div className="adm-stat" key={c.label}>
              <span className="adm-stat-label">{c.label}</span>
              <strong className="adm-stat-value">{c.value}</strong>
              <span className="adm-stat-sub">{c.sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
