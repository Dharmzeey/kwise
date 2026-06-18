/**
 * Kwise World — API client.
 *
 * Thin wrapper around fetch().  All functions return typed results or throw
 * an ApiError.  Token storage is handled via localStorage (client-only).
 */

import type {
  Category,
  Brand,
  ProductListItem,
  ProductDetail,
  PaginatedResponse,
  ProductFilters,
  PlaceOrderPayload,
  PlaceOrderResponse,
  Order,
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  UserProfile,
  AdminStats,
  AdminProduct,
  AdminOrder,
  AdminCustomer,
  AdminCustomerDetail,
  PendingTransaction,
  ProductWritePayload,
  ProductSpec,
  Review,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Error class ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Token helpers (cookie-based, client-side only) ────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const tokenStore = {
  /** Access token is a regular (non-HttpOnly) cookie so JS can read it. */
  getAccess: (): string | null => getCookie("kw_access"),
  /** Refresh token is HttpOnly — JS cannot read it; only the server route can. */
  hasRefresh: (): boolean => {
    // We can't read HttpOnly cookies from JS, but we can infer presence
    // via a lightweight sentinel stored alongside it.
    if (typeof document === "undefined") return false;
    return document.cookie.includes("kw_has_refresh=1");
  },
  clear: () => {
    // Clears only the non-HttpOnly access cookie client-side.
    // The HttpOnly refresh cookie is cleared by the /api/auth/logout route.
    document.cookie = "kw_access=; path=/; max-age=0";
    document.cookie = "kw_has_refresh=; path=/; max-age=0";
  },
};

// ── Core fetch helper ─────────────────────────────────────────────────────────

let _refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  // Deduplicate concurrent refresh attempts
  if (_refreshing) return _refreshing;
  _refreshing = fetch("/api/auth/refresh", { method: "POST" })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => { _refreshing = null; });
  return _refreshing;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE}${path}`, { cache: "no-store", ...options, headers });

  // Auto-refresh: if 401 and we might have a refresh token, try once
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = tokenStore.getAccess();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { cache: "no-store", ...options, headers });
    }
  }

  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = null; }
    const message = (body as { detail?: string })?.detail ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ── Query string builder ──────────────────────────────────────────────────────

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  return request<Category[]>("/api/categories/");
}

export async function fetchCategorySeries(categorySlug: string, brandSlug?: string): Promise<string[]> {
  const query = brandSlug ? `?brand=${encodeURIComponent(brandSlug)}` : "";
  return request<string[]>(`/api/categories/${categorySlug}/series/${query}`);
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params: Record<string, string | number | boolean | undefined> = {
    category: filters.category,
    brand: filters.brand,
    series: filters.series,
    status: filters.status,
    q: filters.q,
    one_time: filters.one_time !== undefined ? (filters.one_time ? "1" : "0") : undefined,
    sort: filters.sort,
    max_price: filters.max_price,
    page: filters.page,
  };
  return request<PaginatedResponse<ProductListItem>>(`/api/products/${qs(params)}`);
}

export async function fetchProduct(id: string): Promise<ProductDetail> {
  return request<ProductDetail>(`/api/products/${id}/`);
}

export async function fetchRelatedProducts(id: string): Promise<ProductListItem[]> {
  return request<ProductListItem[]>(`/api/products/${id}/related/`);
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function fetchFeaturedReviews(limit = 6): Promise<Review[]> {
  return request<Review[]>(`/api/reviews/?limit=${limit}`);
}

export async function submitReview(
  productId: string,
  payload: { rating: number; text: string }
): Promise<Review> {
  return request<Review>(`/api/products/${productId}/reviews/`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export async function fetchAdminReviews(verified?: boolean): Promise<Review[]> {
  const param = verified === undefined ? "" : `?verified=${verified ? "1" : "0"}`;
  return request<Review[]>(`/api/admin/reviews/${param}`, {}, true);
}

export async function toggleReviewVerified(id: number): Promise<Review> {
  return request<Review>(`/api/admin/reviews/${id}/verify/`, { method: "PATCH" }, true);
}

export async function deleteReview(id: number): Promise<void> {
  return request<void>(`/api/admin/reviews/${id}/verify/`, { method: "DELETE" }, true);
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartVerifyItem {
  product_id: string;
  name?: string;
  quantity: number;
  unit_price?: number;
  available: boolean;
}

export async function verifyCart(
  items: { product_id: string; quantity: number }[]
): Promise<CartVerifyItem[]> {
  return request<CartVerifyItem[]>("/api/cart/verify/", {
    method: "POST",
    body: JSON.stringify(items),
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function placeOrder(
  payload: PlaceOrderPayload
): Promise<PlaceOrderResponse> {
  return request<PlaceOrderResponse>("/api/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export async function fetchOrder(reference: string): Promise<Order> {
  return request<Order>(`/api/orders/${reference}/`, {}, true);
}

export async function fetchMyOrders(): Promise<PaginatedResponse<Order>> {
  return request<PaginatedResponse<Order>>("/api/orders/mine/", {}, true);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(payload: RegisterPayload): Promise<{ user: UserProfile }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, data?.detail ?? data?.email?.[0] ?? "Registration failed.", data);
  }
  return data;
}

export async function login(payload: LoginPayload): Promise<{ user: UserProfile }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, data?.detail ?? data?.non_field_errors?.[0] ?? "Login failed.", data);
  }
  return data;
}

export async function fetchProfile(): Promise<UserProfile> {
  return request<UserProfile>("/api/auth/profile/", {}, true);
}

export async function updateProfile(
  data: Partial<Pick<UserProfile, "first_name" | "last_name" | "phone">>
): Promise<UserProfile> {
  return request<UserProfile>("/api/auth/profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  }, true);
}

export async function logout(): Promise<void> {
  tokenStore.clear();
  await fetch("/api/auth/logout", { method: "POST" });
}

// ── Admin API ─────────────────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminStats> {
  return request<AdminStats>("/api/admin/stats/", {}, true);
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  return request<AdminProduct[]>("/api/admin/products/", {}, true);
}

export async function fetchAdminProduct(slug: string): Promise<AdminProduct> {
  return request<AdminProduct>(`/api/admin/products/${slug}/`, {}, true);
}

export async function createAdminProduct(payload: ProductWritePayload): Promise<AdminProduct> {
  return request<AdminProduct>("/api/admin/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export async function updateAdminProduct(slug: string, payload: Partial<ProductWritePayload>): Promise<AdminProduct> {
  return request<AdminProduct>(`/api/admin/products/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
}

export async function deleteAdminProduct(slug: string): Promise<void> {
  return request<void>(`/api/admin/products/${slug}/`, { method: "DELETE" }, true);
}

export async function uploadProductImage(slug: string, file: File): Promise<{ image: string }> {
  const token = tokenStore.getAccess();
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`${BASE}/api/admin/products/${slug}/image/`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

export async function deleteProductImage(slug: string): Promise<void> {
  return request<void>(`/api/admin/products/${slug}/image/`, { method: "DELETE" }, true);
}

export async function updateProductSpecs(slug: string, specs: Pick<ProductSpec, "key" | "value">[]): Promise<void> {
  return request<void>(`/api/admin/products/${slug}/specs/`, {
    method: "PUT",
    body: JSON.stringify(specs),
  }, true);
}

export async function fetchAdminOrders(params?: { q?: string; status?: string }): Promise<PaginatedResponse<AdminOrder>> {
  return request<PaginatedResponse<AdminOrder>>(`/api/admin/orders/${qs(params ?? {})}`, {}, true);
}

export async function updateOrderStatus(reference: string, status: string): Promise<AdminOrder> {
  return request<AdminOrder>(`/api/admin/orders/${reference}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }, true);
}

// ── Admin: Pending Transactions ───────────────────────────────────────────────

export async function fetchAdminPendingTransactions(): Promise<PendingTransaction[]> {
  return request<PendingTransaction[]>("/api/admin/pending-transactions/", {}, true);
}

// ── Admin: Customers ──────────────────────────────────────────────────────────

export async function fetchAdminCustomers(q?: string): Promise<AdminCustomer[]> {
  return request<AdminCustomer[]>(`/api/auth/admin/customers/${qs({ q })}`, {}, true);
}

export async function fetchAdminCustomer(id: number): Promise<AdminCustomerDetail> {
  return request<AdminCustomerDetail>(`/api/auth/admin/customers/${id}/`, {}, true);
}

// ── Admin: Categories ─────────────────────────────────────────────────────────

export async function fetchAdminCategories(): Promise<Category[]> {
  return request<Category[]>("/api/admin/categories/", {}, true);
}

export async function createAdminCategory(payload: { name: string; icon: string; blurb: string }): Promise<Category> {
  return request<Category>("/api/admin/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export async function updateAdminCategory(slug: string, payload: Partial<{ name: string; icon: string; blurb: string }>): Promise<Category> {
  return request<Category>(`/api/admin/categories/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
}

export async function deleteAdminCategory(slug: string): Promise<void> {
  return request<void>(`/api/admin/categories/${slug}/`, { method: "DELETE" }, true);
}

// ── Admin: Brands ─────────────────────────────────────────────────────────────

export async function fetchAdminBrands(): Promise<Brand[]> {
  return request<Brand[]>("/api/admin/brands/", {}, true);
}

export async function createAdminBrand(payload: { name: string; category: number }): Promise<Brand> {
  return request<Brand>("/api/admin/brands/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, true);
}

export async function updateAdminBrand(id: number, payload: Partial<{ name: string; category: number }>): Promise<Brand> {
  return request<Brand>(`/api/admin/brands/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
}

export async function deleteAdminBrand(id: number): Promise<void> {
  return request<void>(`/api/admin/brands/${id}/`, { method: "DELETE" }, true);
}
