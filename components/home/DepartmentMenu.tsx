import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

/**
 * Vertical "Shop by Department" menu shown beside the hero on desktop.
 * Each department reveals a flyout of its brands on hover (pure CSS).
 * Hidden below the tablet breakpoint — those users reach it via the header drawer.
 */
export default function DepartmentMenu({ categories }: Props) {
  return (
    <nav className="dept-menu" aria-label="Shop by department">
      <div className="dept-menu-head">
        <Icon name="menu" size={16} /> Shop by Department
      </div>
      <ul className="dept-list">
        {categories.map((c) => (
          <li key={c.slug} className="dept-item">
            <Link href={`/category/${c.slug}`} className="dept-link">
              <Icon name={c.icon} size={18} />
              <span className="dept-name">{c.name}</span>
              {c.brands.length > 0 && <Icon name="chevronRight" size={14} className="dept-caret" />}
            </Link>

            {c.brands.length > 0 && (
              <div className="dept-flyout">
                <span className="dept-flyout-head">{c.name}</span>
                <div className="dept-flyout-brands">
                  {c.brands.map((b) => (
                    <Link key={b.slug} href={`/category/${c.slug}?brand=${b.slug}`}>
                      {b.name}
                    </Link>
                  ))}
                </div>
                <Link className="dept-flyout-all" href={`/category/${c.slug}`}>
                  Shop all {c.name} <Icon name="arrowRight" size={14} />
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
