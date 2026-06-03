"use client";

import { useState, useTransition } from "react";
import { fetchProducts } from "@/lib/api";
import type { PaginatedResponse, ProductListItem } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import Icon from "@/components/ui/Icon";

interface Props {
  initialProducts: PaginatedResponse<ProductListItem>;
}

export default function OffersClient({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts.results);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!initialProducts.next);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    const next = page + 1;
    startTransition(async () => {
      const res = await fetchProducts({ one_time: true, sort: "featured", page: next }).catch(
        () => ({ results: [], count: 0, next: null, previous: null })
      );
      setProducts((prev) => [...prev, ...res.results]);
      setPage(next);
      setHasMore(!!res.next);
    });
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>
          <Icon name="bolt" size={28} stroke={0} className="offers-bolt" /> One-Time Offers
        </h1>
        <p className="page-sub">
          {initialProducts.count} limited-stock deal{initialProducts.count !== 1 ? "s" : ""} —
          priced to move fast.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <Icon name="bolt" size={48} stroke={0} />
          <p>No one-time offers at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="prod-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="load-more-wrap">
          <button className="btn btn-outline" onClick={loadMore} disabled={isPending}>
            {isPending ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
