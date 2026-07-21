/**
 * Order Service
 *
 * Order management scoped to the actual database schema.
 * Orders table columns: order_number, user_id, status, subtotal, tax,
 * shipping_charge, packaging_charge, discount, total, coupon_code,
 * payment_status, payment_id, payment_method, shipping_address (JSONB),
 * delivery_notes
 */

import { createClient } from "@/lib/supabase/server";
import { razorpayService } from "../payment/razorpay";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface CreateOrderData {
  user_id: string;
  items: Array<{
    product_id: string | null;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    kit_config?: Record<string, unknown>;
  }>;
  shipping_address: {
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  tax: number;
  shipping_charge: number;
  packaging_charge: number;
  discount: number;
  total: number;
  delivery_notes?: string;
  coupon_code?: string;
}

export interface UpdateOrderStatusData {
  order_id: string;
  status: OrderStatus;
  note?: string;
}

class OrderService {
  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `LD${timestamp}${random}`;
  }

  /**
   * Create new order
   * Returns orderId, orderNumber, and razorpayOrderId (if Razorpay is configured)
   */
  async createOrder(
    data: CreateOrderData
  ): Promise<{ orderId: string; orderNumber: string; razorpayOrderId?: string }> {
    const supabase = await createClient();
    const orderNumber = this.generateOrderNumber();

    // Create Razorpay order if configured
    let razorpayOrderId: string | undefined;

    if (razorpayService.isConfigured()) {
      try {
        const razorpayOrder = await razorpayService.createOrder({
          amount: Math.round(data.total * 100), // convert ₹ → paise
          currency: "INR",
          receipt: orderNumber,
          notes: {
            order_number: orderNumber,
            user_id: data.user_id,
          },
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (error) {
        console.error("Failed to create Razorpay order:", error);
        throw new Error(`Razorpay order creation failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      throw new Error("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }

    // Insert order using only real schema columns
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: data.user_id,
        status: "pending" as OrderStatus,
        payment_status: "pending",
        payment_method: "razorpay",
        subtotal: data.subtotal,
        tax: data.tax,
        shipping_charge: data.shipping_charge,
        packaging_charge: data.packaging_charge,
        discount: data.discount,
        total: data.total,
        shipping_address: data.shipping_address,
        delivery_notes: data.delivery_notes ?? null,
        coupon_code: data.coupon_code ?? null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url ?? null,
      kit_config: item.kit_config ?? null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return {
      orderId: order.id,
      orderNumber,
      razorpayOrderId,
    };
  }

  /**
   * Verify Razorpay payment signature and mark order as paid.
   * Returns true on success, false if signature is invalid.
   */
  async updatePaymentStatus(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    razorpayOrderId: string
  ): Promise<boolean> {
    const supabase = await createClient();

    // Verify HMAC-SHA256 signature
    const isValid = razorpayService.verifySignature({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    });

    if (!isValid) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);
      return false;
    }

    // Mark as paid — use only real schema columns
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: razorpayPaymentId,
        status: "confirmed" as OrderStatus,
      })
      .eq("id", orderId);

    return !error;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(data: UpdateOrderStatusData): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.order_id);

    return !error;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" as OrderStatus })
      .eq("id", orderId);

    return !error;
  }

  /**
   * Get a single order with its items
   */
  async getOrder(orderId: string) {
    const supabase = await createClient();

    const { data: order } = await supabase
      .from("orders")
      .select(`*, order_items (*)`)
      .eq("id", orderId)
      .single();

    return order;
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string) {
    const supabase = await createClient();

    const { data: orders } = await supabase
      .from("orders")
      .select(`*, order_items (*)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return orders || [];
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(filters?: {
    status?: OrderStatus;
    payment_status?: string;
    limit?: number;
    offset?: number;
  }) {
    const supabase = await createClient();

    let query = supabase
      .from("orders")
      .select(`*, order_items (*)`, { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.payment_status) {
      query = query.eq("payment_status", filters.payment_status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data: orders, count } = await query;

    return { orders: orders || [], total: count || 0 };
  }
}

export const orderService = new OrderService();
