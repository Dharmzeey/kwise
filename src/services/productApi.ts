import "server-only";

import { Brand, Deal, Product } from "@/types/productInterfaces";
import {
  DEALS_URL,
  PRODUCTS_URL,
  PRODUCT_BRAND_URL,
  PRODUCT_BY_CATEGORY_URL,
  PRODUCT_DETAILS_URL,
  SIMILAR_PRODUCTS_URL,
} from "@/utils/urls/productUrls";

export async function fetchDeals() {
  const response = await fetch(DEALS_URL);
  const deals: Deal[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return deals;
}


export async function fetchAllProducts() {
  const response = await fetch(PRODUCTS_URL);
  const products: Product[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return products;
}

export async function fetchProductById(id: string) {
  const response = await fetch(PRODUCT_DETAILS_URL(id));
  const product: Product = await response.json();
  if (!response.ok) {
    return null;
  }
  return product;
}

export async function fetchProductBrands(categoryName: string) {
  const response = await fetch(PRODUCT_BRAND_URL(categoryName));
  const brands: Brand[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  return brands;
}

export async function fetchProductsByCategory(categoryName: string) {
  const response = await fetch(PRODUCT_BY_CATEGORY_URL(categoryName));
  const products: Product[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return products;
}

export async function fetchSimilarProducts(productId: string) {
  const response = await fetch(SIMILAR_PRODUCTS_URL(productId));
  const products: Product[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return products;
}
