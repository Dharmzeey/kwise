/**
 * Kwise World — API client.
 *
 * Thin wrapper around fetch().  All functions return typed results or throw
 * an ApiError.  Token storage is handled via localStorage (client-only).
 */

import type {
  Category,
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
  ProductWritePayload,
  ProductSpec,
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

  let res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Auto-refresh: if 401 and we might have a refresh token, try once
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = tokenStore.getAccess();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { ...options, headers });
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

export async function fetchCategorySeries(categorySlug: string): Promise<string[]> {
  return request<string[]>(`/api/categories/${categorySlug}/series/`);
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

export async function fetchAdminOrders(): Promise<PaginatedResponse<AdminOrder>> {
  return request<PaginatedResponse<AdminOrder>>("/api/admin/orders/", {}, true);
}

export async function updateOrderStatus(reference: string, status: string): Promise<AdminOrder> {
  return request<AdminOrder>(`/api/admin/orders/${reference}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }, true);
}
