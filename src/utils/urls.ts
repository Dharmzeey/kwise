export const BASE_URL = 'http://localhost:8000/v1';

// products
export const PRODUCT_CATEGORIES_URL = `${BASE_URL}/products/categories/`;
export const PRODUCT_BRAND_URL = (categoryName: string)=> `${BASE_URL}/products/brands/?q=${categoryName}`;

export const PRODUCTS_URL = `${BASE_URL}/products/`;
export const PRODUCT_SEARCH_URL = `${BASE_URL}/products/search/`;
export const PRODUCT_BY_CATEGORY_URL = (categoryName: string) => `${BASE_URL}/products/category/${categoryName}`;

export const RECENTLY_VIEWED_URL = `${BASE_URL}/recently-viewed/`;
export const PRODUCT_DETAILS_URL = (id:string)=> `${BASE_URL}/products/${id}/`;
  
