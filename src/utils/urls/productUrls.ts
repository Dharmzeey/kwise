export const BASE_URL = "http://localhost:8000/v1";

// products
export const PRODUCT_CATEGORIES_URL = `${BASE_URL}/products/categories/`;
export const PRODUCT_BRAND_URL = (categoryName: string) =>
  `${BASE_URL}/products/brands/?q=${categoryName}`;

export const PRODUCTS_URL = `${BASE_URL}/products/`;
export const PRODUCT_SEARCH_URL = (queryParam: string) =>
  `${BASE_URL}/products/search/?q=${queryParam}`;
export const PRODUCT_BY_CATEGORY_URL = (categoryName: string) =>
  `${BASE_URL}/products/category/${categoryName}`;

export const SIMILAR_PRODUCTS_URL = (id: string) =>
  `${BASE_URL}/products/similar-products/?product_id=${id}`;
export const RECENTLY_VIEWED_URL = (ids: string[]) => {
  const queryParams = ids
    .map((id) => `q_list[]=${encodeURIComponent(id)}`)
    .join("&");
  return `${BASE_URL}/products/recently-viewed/?${queryParams}`;
};

export const PRODUCT_DETAILS_URL = (id: string) =>
  `${BASE_URL}/products/${id}/`;
