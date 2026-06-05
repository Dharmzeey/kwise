"use client";
import Icon from "@/components/ui/Icon";
import { formatNaira } from "@/lib/utils";
import type { Category, ProductStatus } from "@/lib/types";

interface FilterSidebarProps {
  open: boolean;
  category: Category | null;
  brand: string | null;
  setBrand: (slug: string | null) => void;
  series: string | null;
  setSeries: (s: string | null) => void;
  seriesList: string[];
  statuses: ProductStatus[];
  toggleStatus: (s: ProductStatus) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
}

const ALL_STATUSES: ProductStatus[] = ["Brand New", "Foreign Used", "Nigeria-Used"];

export default function FilterSidebar({
  open, category, brand, setBrand,
  series, setSeries, seriesList,
  statuses, toggleStatus, maxPrice, setMaxPrice,
}: FilterSidebarProps) {
  return (
    <aside className={`filters${open ? " open" : ""}`} aria-label="Product filters">

      {/* Brand filter */}
      {category && category.brands.length > 0 && (
        <div className="filter-group">
          <h4>Brand</h4>
          <div className="filter-group-chips">
            <button className={`chip${!brand ? " on" : ""}`} onClick={() => setBrand(null)}>All</button>
            {category.brands.map((b) => (
              <button
                key={b.slug}
                className={`chip${brand === b.slug ? " on" : ""}`}
                onClick={() => setBrand(b.slug)}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Series filter — shown when series data is available */}
      {seriesList.length > 0 && (
        <div className="filter-group">
          <h4>Series</h4>
          <div className="filter-group-chips">
            <button className={`chip${!series ? " on" : ""}`} onClick={() => setSeries(null)}>All</button>
            {seriesList.map((s) => (
              <button
                key={s}
                className={`chip${series === s ? " on" : ""}`}
                onClick={() => setSeries(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-group">
        <h4>Condition</h4>
        {ALL_STATUSES.map((s) => (
          <label key={s} className="check">
            <input
              type="checkbox"
              checked={statuses.includes(s)}
              onChange={() => toggleStatus(s)}
            />
            <span className="check-box"><Icon name="check" size={13} /></span>
            {s}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Max price</h4>
        <input
          className="range"
          type="range"
          min={50000}
          max={2000000}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
        />
        <div className="range-val">Up to {formatNaira(maxPrice)}</div>
      </div>
    </aside>
  );
}
