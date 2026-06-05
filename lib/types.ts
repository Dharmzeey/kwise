/**
 * Kwise World — shared TypeScript types.
 *
 * These mirror the Django REST API response shapes exactly.
 * Import from here whenever talking to the backend.
 */

// ── Catalog ───────────────────────────────────────────────────────────────────

export interface Brand {
  id: number;
  slug: string;
  name: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  brands: Brand[];
}

export type ProductStatus = "Brand New" | "Foreign Used" | "Nigeria-Used";
export type ProductTint = "blue" | "indigo" | "orange";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  text: string;
  is_verified: boolean;
  created_at: string;
}

/** Shape returned by the product list endpoint. */
export interface ProductListItem {
  id: string;
  name: string;
  category_slug: string;
  brand_slug: string;
  image: string | null;
  thumb: string;
  tint: ProductTint;
  price: number;
  old_price: number | null;
  save_amount: number | null;
  status: ProductStatus;
  rating: number;
  review_count: number;
  is_featured: boolean;
  badge: string;
  is_one_time: boolean;
  stock: number;
  sold_out: boolean;
  colors: string[];
  series: string;
}

/** Full shape returned by the product detail endpoint. */
export interface ProductDetail extends ProductListItem {
  description: string;
  one_time_note: string;
  specs: ProductSpec[];
  reviews: Review[];
  created_at: string;
}

// ── Cart (local state only — not persisted to backend until checkout) ─────────

export interface CartItem {
  id: string;       // product id
  qty: number;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  product: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  reference: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  guest_name: string;
  guest_email: string;
  delivery_address: string;
  items: OrderItem[];
  created_at: string;
}

export interface PlaceOrderPayload {
  items: { product_id: string; quantity: number }[];
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  delivery_address?: string;
}

export interface PlaceOrderResponse {
  reference: string;
  total: number;
  status: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  full_name: string;
  date_joined: string;
  is_superuser: boolean;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminStats {
  products: number;
  orders: number;
  pending_orders: number;
  total_revenue: number;
}

export interface AdminProduct {
  id: string;        // slug
  slug: string;
  name: string;
  category: number;
  category_slug: string;
  brand: number;
  brand_slug: string;
  image: string | null;
  thumb: string;
  tint: ProductTint;
  price: number;
  old_price: number | null;
  status: ProductStatus;
  rating: number;
  review_count: number;
  is_featured: boolean;
  badge: string;
  is_one_time: boolean;
  stock: number;
  sold_out: boolean;
  description: string;
  one_time_note: string;
  colors: string[];
  specs: ProductSpec[];
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: number;
  reference: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  delivery_address: string;
  items: OrderItem[];
  created_at: string;
}

export interface ProductWritePayload {
  name: string;
  category: number;
  brand: number;
  thumb: string;
  tint: ProductTint;
  price: number;
  old_price?: number | null;
  status: ProductStatus;
  is_featured?: boolean;
  badge?: string;
  is_one_time?: boolean;
  stock?: number;
  description: string;
  one_time_note?: string;
  colors?: string[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: TokenPair;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ── API pagination ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Filters (frontend state) ──────────────────────────────────────────────────

export type SortOption = "featured" | "low" | "high" | "rating";

export interface ProductFilters {
  category?: string;
  brand?: string;
  series?: string;
  status?: ProductStatus;
  q?: string;
  one_time?: boolean;
  sort?: SortOption;
  max_price?: number;
  page?: number;
}
