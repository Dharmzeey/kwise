import ListItems from "@/components/products/listItem";
import ProductNotFound from "@/components/products/productNotFound";
import {
  fetchProductBrands,
  fetchProductsByBrand,
  fetchProductsByCategory,
} from "@/services/productApi";
import { Metadata } from "next";
import Link from "next/link";
import slugify from "slugify";

type Props = {
  params: {
    gadgetType: string;
  };
  searchParams: {
    brandName: string;
  }
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

export default async function DevicePage({ params, searchParams: queryParams }: Props) {
  const brands = await fetchProductBrands(params.gadgetType);
  let products;
  if (queryParams?.brandName) {
    products = await fetchProductsByBrand(params.gadgetType, queryParams.brandName);
  } else {
    products = await fetchProductsByCategory(params.gadgetType);
  }
  return (
    <>
      {brands.length >= 1 && products.length > 1 ? (
        <section>
          <div className="flex gap-7">
            <h1>{params.gadgetType}</h1>
            <div className="flex gap-4 opacity-70">
              <Link prefetch={true} href={`/products/${params.gadgetType}`}>
                <h2>All</h2>
              </Link>
              {brands.map((brand) => (
                <Link prefetch={true} key={brand.id} href={`/products/${params.gadgetType}/?brandName=${brand.name}`}>
                  <h2> {brand.name}</h2>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <Link prefetch={true}
                key={product.id}
                href={`/products/${product.category}/${slugify(product.name)}-${product.id}`}
                className="hover:scale-[1.01] transition"
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
