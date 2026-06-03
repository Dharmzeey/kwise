import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Category } from "@/lib/types";

interface Props { categories: Category[]; }

export default function CategoryTiles({ categories }: Props) {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <h2>Shop by category</h2>
          <Link className="link-btn" href="/category/all">
            Browse all <Icon name="arrowRight" size={15} />
          </Link>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.slug} className={`cat-tile ct-${c.icon}`} href={`/category/${c.slug}`}>
              <Icon name={c.icon} size={42} stroke={1.3} />
              <div>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </div>
              <Icon name="arrowRight" size={18} className="cat-arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
