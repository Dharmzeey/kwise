"use client";
import { useEffect, useState } from "react";
import { fetchAdminReviews, toggleReviewVerified, deleteReview } from "@/lib/api";
import type { Review } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#f59e0b", letterSpacing: 1 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const verified = filter === "all" ? undefined : filter === "verified";
    fetchAdminReviews(filter === "all" ? undefined : verified)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleToggle(id: number) {
    setActing(id);
    try {
      const updated = await toggleReviewVerified(id);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch { alert("Failed to update."); }
    finally { setActing(null); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this review permanently?")) return;
    setActing(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch { alert("Failed to delete."); }
    finally { setActing(null); }
  }

  const pending = reviews.filter((r) => !r.is_verified).length;

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <h1 className="adm-title">Reviews {pending > 0 && <span className="adm-badge">{pending} pending</span>}</h1>
        <div className="adm-filter-tabs">
          {(["pending", "all", "verified"] as const).map((f) => (
            <button
              key={f}
              className={`adm-filter-tab${filter === f ? " on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="adm-loading">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="adm-loading">No reviews found.</p>
      ) : (
        <div className="adm-rev-list">
          {reviews.map((r) => (
            <div key={r.id} className={`adm-rev${r.is_verified ? " verified" : ""}`}>
              <div className="adm-rev-meta">
                <Stars rating={r.rating} />
                <span className={`adm-rev-badge${r.is_verified ? " adm-rev-badge-ok" : " adm-rev-badge-pending"}`}>
                  {r.is_verified ? "Verified" : "Pending"}
                </span>
                <span className="adm-sub">{new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <p className="adm-rev-text">&ldquo;{r.text}&rdquo;</p>
              <div className="adm-rev-footer">
                <div>
                  <strong>{r.reviewer_name}</strong>
                  <span className="adm-sub"> on {r.product_name}</span>
                </div>
                <div className="adm-rev-actions">
                  <button
                    className={`btn btn-sm ${r.is_verified ? "btn-ghost" : "btn-primary"}`}
                    disabled={acting === r.id}
                    onClick={() => handleToggle(r.id)}
                  >
                    {r.is_verified ? "Unverify" : "Verify"}
                  </button>
                  <button
                    className="btn btn-sm adm-rev-del"
                    disabled={acting === r.id}
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
