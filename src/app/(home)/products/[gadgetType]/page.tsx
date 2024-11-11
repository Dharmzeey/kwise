import ListItems from "@/components/products/listItem";
import ProductNotFound from "@/components/products/productNotFound";
import {
  fetchProductBrands,
  fetchProductsByCategory,
} from "@/services/productApi";
import { Metadata } from "next";
import Link from "next/link";
import slugify from "slugify";

type Props = {
  params: {
    gadgetType: string;
  };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const brands = await fetchProductBrands(params.gadgetType);
  if (!brands || brands.length === 0) {
    return {
      title: "Kwise world",
    };
  }
  const brandNames = brands.map((brand) => brand.name).join(", ");
  return {
    title: `${params.gadgetType} | Kwise World`,
    description: `Explore our selection of ${params.gadgetType} including brands such as ${brandNames}. Find the best options at Kwise World.`,
  };
};

export default async function DevicePage({ params }: Props) {
  const brands = await fetchProductBrands(params.gadgetType);
  const products = await fetchProductsByCategory(params.gadgetType);
  return (
    <>
      {brands.length >= 1 && products.length > 1 ? (
        <section>
          <div className="flex gap-7">
            <h1>{params.gadgetType}</h1>
            <div className="flex gap-4 opacity-70">
              <h2>All</h2>
              {brands.map((brand) => (
                <h2 key={brand.id}> {brand.name}</h2>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <Link prefetch={true}
                key={product.id}
                href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}
              >
                <ListItems key={product.id} device={product} />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <ProductNotFound />
      )}
    </>
  );
}
