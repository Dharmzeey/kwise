"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAdminProducts, deleteAdminProduct } from "@/lib/api";
import type { AdminProduct } from "@/lib/types";

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await deleteAdminProduct(slug);
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <h1 className="adm-title">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ New product</Link>
      </div>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <div className="adm-prod-cell">
                      <div className="adm-prod-img">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain" }} />
                        ) : (
                          <span className="adm-prod-img-placeholder" />
                        )}
                      </div>
                      <div>
                        <div className="adm-prod-name">{p.name}</div>
                        <div className="adm-prod-slug">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category_slug}</td>
                  <td>{formatNaira(p.price)}</td>
                  <td>{p.stock}</td>
                  <td><span className={`adm-status adm-status-${p.status.toLowerCase().replace(/\s/g, "-")}`}>{p.status}</span></td>
                  <td>
                    <div className="adm-row-actions">
                      <Link href={`/admin/products/${p.slug}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button
                        className="btn btn-sm adm-btn-danger"
                        onClick={() => handleDelete(p.slug, p.name)}
                        disabled={deleting === p.slug}
                      >
                        {deleting === p.slug ? "…" : "Delete"}
                      </button>
                    </div>
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
