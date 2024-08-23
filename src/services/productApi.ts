import "server-only";

import { Brand, Product } from '@/utils/productInterface'
import { PRODUCTS_URL, PRODUCT_BRAND_URL, PRODUCT_BY_CATEGORY_URL, PRODUCT_DETAILS_URL, PRODUCT_SEARCH_URL } from '@/utils/urls'


export async function fetchAllProducts() {
    const response = await fetch(PRODUCTS_URL);
    const products: Product[] = await response.json()
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return products
}

export async function fetchProductById(id: string) {
    const response = await fetch(PRODUCT_DETAILS_URL(id));
    const product: Product = await response.json()
    if (!response.ok) {
        return null;
    }
    return product;
}

export async function fetchProductBrands(categoryName: string) {
    const response = await fetch(PRODUCT_BRAND_URL(categoryName));
    const brands: Brand[] = await response.json()
    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }
    return brands;
}


export async function fetchProductsByCategory(categoryName: string) {
    const response = await fetch(PRODUCT_BY_CATEGORY_URL(categoryName));
    const products: Product[] = await response.json()
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return products;
}


