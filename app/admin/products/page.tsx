"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAdminProducts, deleteAdminProduct } from "@/lib/api";
import type { AdminProduct } from "@/lib/types";

function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

type TypeFilter = "all" | "one-time" | "regular";
type VisibilityFilter = "all" | "live" | "hidden";
type SortKey = "newest" | "oldest" | "name" | "price-low" | "price-high" | "stock-low" | "stock-high";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    fetchAdminProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category_slug))).sort(),
    [products]
  );

  const visibleProducts = useMemo(() => {
    let list = products;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q));
    }
    if (categoryFilter !== "all") list = list.filter((p) => p.category_slug === categoryFilter);
    if (typeFilter !== "all") list = list.filter((p) => (typeFilter === "one-time" ? p.is_one_time : !p.is_one_time));
    if (visibilityFilter !== "all") list = list.filter((p) => (visibilityFilter === "live" ? p.is_visible : !p.is_visible));

    const sorted = [...list];
    switch (sort) {
      case "oldest": sorted.sort((a, b) => a.created_at.localeCompare(b.created_at)); break;
      case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "price-low": sorted.sort((a, b) => a.price - b.price); break;
      case "price-high": sorted.sort((a, b) => b.price - a.price); break;
      case "stock-low": sorted.sort((a, b) => a.stock - b.stock); break;
      case "stock-high": sorted.sort((a, b) => b.stock - a.stock); break;
      default: sorted.sort((a, b) => b.created_at.localeCompare(a.created_at)); break; // newest
    }
    return sorted;
  }, [products, search, categoryFilter, typeFilter, visibilityFilter, sort]);

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
        <>
          <div className="adm-filters">
            <input
              className="adm-filter-search"
              placeholder="Search by name or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
              <option value="all">All types</option>
              <option value="one-time">One-time offers</option>
              <option value="regular">Regular stock</option>
            </select>
            <select value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value as VisibilityFilter)}>
              <option value="all">All visibility</option>
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="stock-low">Stock: low to high</option>
              <option value="stock-high">Stock: high to low</option>
            </select>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Live</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((p) => (
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
                          <div className="adm-prod-name">
                            {p.name}
                            {p.is_one_time && <span className="adm-chip adm-chip-ot">⚡ One-time</span>}
                          </div>
                          <div className="adm-prod-slug">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category_slug}</td>
                    <td>{formatNaira(p.price)}</td>
                    <td>{p.stock}</td>
                    <td><span className={`adm-status adm-status-${p.status.toLowerCase().replace(/\s/g, "-")}`}>{p.status}</span></td>
                    <td><span className={`adm-status ${p.is_visible ? "adm-status-live" : "adm-status-hidden"}`}>{p.is_visible ? "Live" : "Hidden"}</span></td>
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
                {visibleProducts.length === 0 && (
                  <tr><td colSpan={7} className="adm-loading">No products match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
