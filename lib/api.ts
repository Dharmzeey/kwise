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

// ── Token helpers (client-side only) ─────────────────────────────────────────

export const tokenStore = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("kw_access") : null,
  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("kw_refresh") : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem("kw_access", access);
    localStorage.setItem("kw_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("kw_access");
    localStorage.removeItem("kw_refresh");
  },
};

// ── Core fetch helper ─────────────────────────────────────────────────────────

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

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const message =
      (body as { detail?: string })?.detail ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  // 204 No Content
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

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const params: Record<string, string | number | boolean | undefined> = {
    category: filters.category,
    brand: filters.brand,
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

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  tokenStore.set(res.tokens.access, res.tokens.refresh);
  return res;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  tokenStore.set(res.tokens.access, res.tokens.refresh);
  return res;
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

export function logout(): void {
  tokenStore.clear();
}
