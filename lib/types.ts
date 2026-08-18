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
  category?: number;
  category_name?: string;
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
  product_name: string;
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
  product: ProductListItem;
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
  payment_status: "unpaid" | "paid" | "failed";
  subtotal: number;
  delivery_fee: number;
  total: number;
  guest_name: string;
  guest_email: string;
  delivery_address: string;
  items: OrderItem[];
  created_at: string;
  confirmed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
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
  authorization_url: string | null;
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
  recent_orders: AdminOrder[];
  low_stock: AdminProduct[];
}

export interface PendingTransaction {
  reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  cart_data: { product_slug: string; product_name: string; unit_price: number; quantity: number }[];
  created_at: string;
}

export interface AdminCustomer {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  date_joined: string;
  order_count: number;
  total_spent: number;
}

export interface AdminCustomerDetail extends AdminCustomer {
  first_name: string;
  last_name: string;
  is_active: boolean;
  orders: Order[];
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
  confirmed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
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

// ── Content section ───────────────────────────────────────────────────────────

export interface ContentAuthor {
  id: number;
  name: string;
  slug: string;
  bio: string;
  credentials: string;
  avatar: string | null;
}

export interface UseCaseTag {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export type DeviceFormFactor = "phone" | "laptop";

export interface Device {
  id: number;
  brand: string;
  model_name: string;
  slug: string;
  form_factor: DeviceFormFactor;
  release_year: number;
  chipset: string;
  ram_options: string[];
  storage_options: string[];
  display_specs: Record<string, string>;
  camera_specs: Record<string, string>;
  battery_capacity_mah: number | null;
  battery_wh: number | null;
  price_band_ngn: string;
  price_band_cad: string;
  conditions_available: string[];
  use_case_tags: UseCaseTag[];
  pros: string[];
  cons: string[];
  verdict_summary: string;
  meta_description: string;
  hero_image: string | null;
  is_in_stock: boolean;
  faqs: FAQItem[];
  created_at: string;
  updated_at: string;
}

export interface DeviceListItem
  extends Pick<Device, "id" | "brand" | "model_name" | "slug" | "form_factor" | "release_year" | "price_band_ngn" | "price_band_cad" | "is_in_stock" | "hero_image" | "verdict_summary" | "use_case_tags" | "created_at" | "updated_at"> {}

export interface Comparison {
  id: number;
  title: string;
  slug: string;
  device_a: Device;
  device_b: Device;
  intro: string;
  winner_by_category: Record<string, "a" | "b" | "tie">;
  overall_recommendation: string;
  author: ContentAuthor | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_description: string;
  faqs: FAQItem[];
}

export interface ComparisonListItem
  extends Pick<Comparison, "id" | "title" | "slug" | "author" | "published_at" | "created_at" | "updated_at" | "meta_description"> {
  device_a: DeviceListItem;
  device_b: DeviceListItem;
}

export interface BuyingGuideEntry {
  id: number;
  rank: number;
  device: Device;
  blurb: string;
}

export interface BuyingGuide {
  id: number;
  title: string;
  slug: string;
  use_case_tag: UseCaseTag;
  intro: string;
  body: string;
  entries: BuyingGuideEntry[];
  author: ContentAuthor | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_description: string;
  faqs: FAQItem[];
}

export interface BuyingGuideListItem
  extends Pick<BuyingGuide, "id" | "title" | "slug" | "use_case_tag" | "intro" | "author" | "published_at" | "created_at" | "updated_at" | "meta_description"> {}

export interface SpecDiffRow {
  label: string;
  a_value: string;
  b_value: string;
}

export interface SpecDiff {
  device_a: Device;
  device_b: Device;
  diff: SpecDiffRow[];
}

export interface SitemapEntry {
  type: "device" | "comparison" | "guide";
  slug: string;
  updated_at: string;
}
