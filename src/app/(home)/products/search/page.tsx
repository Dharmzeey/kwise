"use client";

import { Product } from "@/types/productInterfaces";
import { useSearchParams } from "next/navigation";
import { PRODUCT_SEARCH_URL } from "@/utils/urls/productUrls";
import { useEffect, useState } from "react";
import ProductSearch from "@/components/products/productSearch";
import Loading from "@/components/loading";
import ProductNotFound from "@/components/products/productNotFound";

async function searchProduct(queryParam: string | null) {
  if (!queryParam) {
    return;
  }
  const response = await fetch(PRODUCT_SEARCH_URL(queryParam));
  const products: Product[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return products;
}

export default function ProductSearchPage() {
  const searchParams = useSearchParams();
  const queryParams = searchParams!.get("query");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setProducts([]);
    setLoading(true);
    async function fetchSearchedProduct() {
      try {
        const products = await searchProduct(queryParams);
        if (products && products.length > 0) {
          setProducts(products);
          setError(false);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    if (queryParams) {
      fetchSearchedProduct();
    }
  }, [queryParams]);

  return (
    <>
      <br />
      {loading ? (
        <Loading />
      ) : error ? (
        <ProductNotFound />
      ) : products.length >= 1 ? (
        <div>
          <ProductSearch
            products={products
              .filter((product) => product.category == "Phones")
              .slice(0, 10)}
            gadgetType="Phones"
          />
          <ProductSearch
            products={products
              .filter((product) => product.category == "Laptops")
              .slice(0, 10)}
            gadgetType="Laptops"
          />
          <ProductSearch
            products={products
              .filter((product) => product.category == "Accessories")
              .slice(0, 10)}
            gadgetType="Accessories"
          />
          <ProductSearch
            products={products
              .filter((product) => product.category == "Console")
              .slice(0, 10)}
            gadgetType="Console"
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
