"use client";

import { useState, useTransition, useEffect } from "react";
import { fetchProducts, fetchCategorySeries } from "@/lib/api";
import type { Category, ProductListItem, PaginatedResponse, ProductFilters, ProductStatus, SortOption } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import Icon from "@/components/ui/Icon";

interface Props {
  slug: string;
  category: Category | null;
  categories: Category[];
  initialProducts: PaginatedResponse<ProductListItem>;
  initialFilters: Omit<ProductFilters, "category" | "page" | "one_time">;
}

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  low: "Price: low to high",
  high: "Price: high to low",
  rating: "Top rated",
};

const DEFAULT_MAX_PRICE = 2_000_000;

export default function CategoryPageClient({
  slug,
  category,
  categories,
  initialProducts,
  initialFilters,
}: Props) {
  const [q, setQ] = useState(initialFilters.q ?? "");
  const [brand, setBrand] = useState<string | null>(initialFilters.brand ?? null);
  const [series, setSeries] = useState<string | null>(initialFilters.series ?? null);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<ProductStatus[]>(
    initialFilters.status ? [initialFilters.status] : []
  );
  const [maxPrice, setMaxPrice] = useState(initialFilters.max_price ?? DEFAULT_MAX_PRICE);
  const [sort, setSort] = useState<SortOption>(initialFilters.sort ?? "featured");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch series list for this category (skip for "all")
  useEffect(() => {
    if (slug === "all") return;
    fetchCategorySeries(slug).then(setSeriesList).catch(() => {});
  }, [slug]);

  const [products, setProducts] = useState(initialProducts.results);
  const [count, setCount] = useState(initialProducts.count);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(!!initialProducts.next);
  const [isPending, startTransition] = useTransition();

  // For "all" slug, aggregate brands from every category
  const allCategoryView: Category = {
    id: 0,
    slug: "all",
    name: "All Products",
    icon: "grid",
    blurb: "",
    brands: categories
      .flatMap((c) => c.brands)
      .filter((b, i, arr) => arr.findIndex((x) => x.slug === b.slug) === i),
  };
  const cat = category ?? allCategoryView;

  const title = q
    ? `Results for "${q}"`
    : category
    ? category.name
    : "All products";

  function buildFilters(overrides?: Partial<{
    brand: string | null;
    series: string | null;
    statuses: ProductStatus[];
    maxPrice: number;
    sort: SortOption;
    q: string;
  }>): ProductFilters {
    const b = overrides?.brand !== undefined ? overrides.brand : brand;
    const sr = overrides?.series !== undefined ? overrides.series : series;
    const s = overrides?.statuses ?? statuses;
    const mp = overrides?.maxPrice ?? maxPrice;
    const so = overrides?.sort ?? sort;
    const query = overrides?.q !== undefined ? overrides.q : q;
    return {
      category: slug === "all" ? undefined : slug,
      brand: b ?? undefined,
      series: sr ?? undefined,
      status: s.length === 1 ? s[0] : undefined,
      max_price: mp < DEFAULT_MAX_PRICE ? mp : undefined,
      sort: so,
      q: query || undefined,
      page: 1,
    };
  }

  function runSearch(filters: ProductFilters) {
    setPage(1);
    startTransition(async () => {
      const res = await fetchProducts(filters).catch(() => ({
        results: [],
        count: 0,
        next: null,
        previous: null,
      }));
      setProducts(res.results);
      setCount(res.count);
      setHasMore(!!res.next);
    });
  }

  function handleBrand(b: string | null) {
    setBrand(b);
    setSeries(null); // reset series when brand changes
    runSearch(buildFilters({ brand: b, series: null }));
  }

  function handleSeries(s: string | null) {
    setSeries(s);
    runSearch(buildFilters({ series: s }));
  }

  function handleToggleStatus(s: ProductStatus) {
    const next = statuses.includes(s)
      ? statuses.filter((x) => x !== s)
      : [...statuses, s];
    setStatuses(next);
    runSearch(buildFilters({ statuses: next }));
  }

  function handleMaxPrice(v: number) {
    setMaxPrice(v);
    runSearch(buildFilters({ maxPrice: v }));
  }

  function loadMore() {
    const nextPage = page + 1;
    startTransition(async () => {
      const res = await fetchProducts({ ...buildFilters(), page: nextPage }).catch(() => ({
        results: [],
        count: 0,
        next: null,
        previous: null,
      }));
      setProducts((prev) => [...prev, ...res.results]);
      setPage(nextPage);
      setHasMore(!!res.next);
    });
  }

  return (
    <div className="page">
      <div className="container">
        {/* ── Header row: title + filter toggle + sort ── */}
        <div className="cat-head">
          <div>
            <h1>{title}</h1>
            <p>
              {count} {count === 1 ? "item" : "items"}
              {!q && category ? ` · ${category.blurb}` : ""}
              {q && (
                <button
                  className="clear-search"
                  onClick={() => {
                    setQ("");
                    runSearch(buildFilters({ q: "" }));
                  }}
                >
                  <Icon name="x" size={13} /> Clear search
                </button>
              )}
            </p>
          </div>
          <div className="cat-tools">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Icon name="sliders" size={16} /> Filters
            </button>
            <label className="sort">
              Sort
              <select
                value={sort}
                onChange={(e) => {
                  const s = e.target.value as SortOption;
                  setSort(s);
                  runSearch(buildFilters({ sort: s }));
                }}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABELS[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* ── Two-column layout: sidebar | results ── */}
        <div className="cat-layout">
          <FilterSidebar
            open={showFilters}
            category={cat}
            brand={brand}
            setBrand={handleBrand}
            series={series}
            setSeries={handleSeries}
            seriesList={seriesList}
            statuses={statuses}
            toggleStatus={handleToggleStatus}
            maxPrice={maxPrice}
            setMaxPrice={handleMaxPrice}
          />

          <div className="cat-results">
            {products.length === 0 && !isPending ? (
              <div className="empty">
                <Icon name="search" size={40} />
                <h3>No products found</h3>
                <p>Try adjusting your filters.</p>
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
                <button
                  className="btn btn-outline"
                  onClick={loadMore}
                  disabled={isPending}
                >
                  {isPending ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
