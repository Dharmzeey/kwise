"use client";

import { useState } from "react";
import { submitReview } from "@/lib/api";
import { ApiError } from "@/lib/api";

interface Props {
  productId: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (!text.trim()) { setError("Please write something about your experience."); return; }

    setError(null);
    setSubmitting(true);
    try {
      await submitReview(productId, { rating, text: text.trim() });
      setDone(true);
      onSubmitted();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("You need to be logged in to leave a review.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rev-form-done">
        <strong>Thanks for your review!</strong>
        <p>It will appear once verified by our team.</p>
      </div>
    );
  }

  const display = hovered || rating;

  return (
    <form className="rev-form" onSubmit={handleSubmit}>
      <h4>Write a review</h4>

      <div className="rev-form-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`rev-form-star${n <= display ? " on" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
        <span className="rev-form-stars-label">
          {display ? ["", "Poor", "Fair", "Good", "Very good", "Excellent"][display] : "Select rating"}
        </span>
      </div>

      <textarea
        className="rev-form-input rev-form-textarea"
        placeholder="Share your experience with this product…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={1000}
      />

      {error && <p className="rev-form-error">{error}</p>}

      <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
