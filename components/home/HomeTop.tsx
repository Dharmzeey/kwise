import DepartmentMenu from "./DepartmentMenu";
import HeroEditorial from "./HeroEditorial";
import type { Category, ProductListItem } from "@/lib/types";

interface Props {
  categories: Category[];
  products: ProductListItem[];
}

/**
 * Homepage top band: slot.ng-style "Shop by Department" rail on the left,
 * hero on the right. The department rail collapses on tablet/mobile, where the
 * hero takes the full width and departments live in the header drawer.
 */
export default function HomeTop({ categories, products }: Props) {
  return (
    <section className="home-top">
      <div className="container home-top-in">
        <DepartmentMenu categories={categories} />
        <HeroEditorial products={products} bare />
      </div>
    </section>
  );
}
