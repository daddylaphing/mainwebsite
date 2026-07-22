export type UserRole = "customer" | "admin" | "wholesale";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type CouponType = "percentage" | "fixed" | "free_shipping";

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  gstin: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price?: number | null;
  bulk_price: number | null;
  minimum_quantity: number;
  category: string; // 'kit', 'addon', 'wholesale', 'corndog'
  featured: boolean;
  active: boolean;
  images: string[];
  ingredients: string[] | null;
  preparation: string | null;
  recipe_available: boolean;
  inventory: number;
  low_stock_threshold?: number;
  created_at: string;
  updated_at: string;
  // Relations
  related_products?: Product[];
}

export interface NutritionInfo {
  serving_size: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sodium: string;
}

export interface KitConfiguration {
  id: string;
  name: string;
  base_price: number;
  components: KitComponents;
  packaging_charge: number;
  min_order_qty: number;
}

export interface KitComponents {
  sheet_qty: number;
  chilli_oil_qty: number;
  garlic_water_qty: number;
  sauce_qty: number;
  seasoning_qty: number;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  kit_config: KitCustomization | null;
  created_at: string;
  // Joined
  product?: Product;
}

export interface KitCustomization {
  base_kit_id: string;
  extras: Record<string, number>;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_charge: number;
  packaging_charge: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  payment_status: PaymentStatus;
  payment_method?: string | null;
  payment_id: string | null;
  shipping_address: AddressSnapshot;
  delivery_notes: string | null;
  invoice_number: string | null;
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
  // Joined
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface AddressSnapshot {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  kit_config: KitCustomization | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
  created_by: string | null;
}

export interface WholesaleOrder {
  id: string;
  user_id: string;
  company_name: string;
  gstin: string | null;
  items: WholesaleOrderItem[];
  status: "pending" | "quoted" | "confirmed" | "cancelled";
  pricing_tier: string | null;
  min_order_met: boolean;
  notes: string | null;
  quote_requested_at: string;
  created_at: string;
}

export interface WholesaleOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  // Joined
  profile?: Profile;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Joined
  product?: Product;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_value: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "order" | "offer" | "system";
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  pincodes: string[];
  shipping_charge: number;
  free_shipping_above: number | null;
  estimated_days: number;
  is_active: boolean;
}

// ─── UI / App Types ───────────────────────────────────────────────────────────

export interface CartState {
  items: CartItemUI[];
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  packagingCharge: number;
  shippingCharge: number;
  tax: number;
  total: number;
}

export interface CartItemUI {
  id: string;
  product: Product;
  quantity: number;
  kitConfig?: KitCustomization;
  price: number;
}

export interface CheckoutFormData {
  addressId?: string;
  newAddress?: Omit<Address, "id" | "user_id" | "created_at">;
  deliveryNotes?: string;
  invoiceGstin?: string;
  invoiceCompanyName?: string;
  couponCode?: string;
}

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
