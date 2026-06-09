import type { Review } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="rev-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "rev-star on" : "rev-star"}>★</span>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ReviewsStrip({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <div>
            <h2>What customers say</h2>
            <p className="sec-sub">Verified purchases only.</p>
          </div>
        </div>
        <div className="rev-grid">
          {reviews.map((r) => (
            <div key={r.id} className="rev-card">
              <Stars rating={r.rating} />
              <p className="rev-text">&ldquo;{r.text}&rdquo;</p>
              <div className="rev-author">
                <div className="rev-avatar">{initials(r.reviewer_name)}</div>
                <div>
                  <strong>{r.reviewer_name}</strong>
                  {r.product_name && <span className="rev-product">on {r.product_name}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
