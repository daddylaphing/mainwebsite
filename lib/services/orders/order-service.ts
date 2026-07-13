/**
 * Order Service
 * 
 * Comprehensive order management with payment, delivery, and WhatsApp integration
 */

import { createClient } from "@/lib/supabase/server";
import { createBrowserClient } from "@/lib/supabase/client";
import { razorpayService } from "../payment/razorpay";
import { whatsappService } from "../whatsapp/whatsapp-service";
import { deliveryService } from "../delivery/delivery-provider";

type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";

export interface CreateOrderData {
  user_id: string;
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    kit_config?: any;
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
  admin_notes?: string;
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
   */
  async createOrder(data: CreateOrderData): Promise<{ orderId: string; orderNumber: string; razorpayOrderId?: string }> {
    const supabase = await createClient();
    const orderNumber = this.generateOrderNumber();

    // Create Razorpay order if configured
    let razorpayOrderId: string | undefined;
    
    if (razorpayService.isConfigured()) {
      try {
        const razorpayOrder = await razorpayService.createOrder({
          amount: Math.round(data.total * 100), // Convert to paise
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
      }
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: data.user_id,
        status: "pending",
        payment_status: "pending",
        subtotal: data.subtotal,
        tax: data.tax,
        shipping_charge: data.shipping_charge,
        packaging_charge: data.packaging_charge,
        discount: data.discount,
        total: data.total,
        shipping_address: data.shipping_address,
        delivery_notes: data.delivery_notes,
        coupon_code: data.coupon_code,
        razorpay_order_id: razorpayOrderId,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
      kit_config: item.kit_config,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Send WhatsApp notification if configured
    try {
      if (whatsappService.isConfigured()) {
        await whatsappService.notifyOrderPlaced(
          data.shipping_address.phone,
          data.shipping_address.full_name,
          orderNumber,
          data.total.toString()
        );

        // Log WhatsApp notification
        await supabase
          .from("orders")
          .update({
            whatsapp_sent: true,
            whatsapp_log: [
              {
                type: "order_placed",
                timestamp: new Date().toISOString(),
                success: true,
              },
            ],
          })
          .eq("id", order.id);
      }
    } catch (error) {
      console.error("Failed to send WhatsApp notification:", error);
    }

    return {
      orderId: order.id,
      orderNumber,
      razorpayOrderId,
    };
  }

  /**
   * Update payment status after Razorpay verification
   */
  async updatePaymentStatus(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    razorpayOrderId: string
  ): Promise<boolean> {
    const supabase = await createClient();

    // Verify signature
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

    // Update order
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        payment_id: razorpayPaymentId,
      })
      .eq("id", orderId);

    return !error;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(data: UpdateOrderStatusData): Promise<boolean> {
    const supabase = await createClient();

    // Get order details
    const { data: order } = await supabase
      .from("orders")
      .select("*, shipping_address")
      .eq("id", data.order_id)
      .single();

    if (!order) return false;

    // Update status
    const updates: any = {
      status: data.status,
    };

    if (data.admin_notes) {
      updates.admin_notes = data.admin_notes;
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", data.order_id);

    if (error) return false;

    // Send WhatsApp notification based on status
    try {
      if (whatsappService.isConfigured() && order.shipping_address?.phone) {
        const customerName = order.shipping_address.full_name;
        const phone = order.shipping_address.phone;

        let whatsappResponse;
        switch (data.status) {
          case "accepted":
            whatsappResponse = await whatsappService.notifyOrderAccepted(
              phone,
              customerName,
              order.order_number
            );
            break;
          case "ready":
            whatsappResponse = await whatsappService.notifyOrderReady(
              phone,
              customerName,
              order.order_number
            );
            break;
          case "completed":
            whatsappResponse = await whatsappService.notifyOrderCompleted(
              phone,
              customerName,
              order.order_number
            );
            break;
          case "cancelled":
            whatsappResponse = await whatsappService.notifyOrderCancelled(
              phone,
              customerName,
              order.order_number,
              data.note || "No reason provided"
            );
            break;
        }

        // Log WhatsApp notification
        if (whatsappResponse) {
          const currentLog = order.whatsapp_log || [];
          await supabase
            .from("orders")
            .update({
              whatsapp_log: [
                ...currentLog,
                {
                  type: `status_${data.status}`,
                  timestamp: new Date().toISOString(),
                  success: whatsappResponse.success,
                  message_id: whatsappResponse.messageId,
                },
              ],
            })
            .eq("id", data.order_id);
        }
      }
    } catch (error) {
      console.error("Failed to send WhatsApp notification:", error);
    }

    // Create delivery if order is accepted
    if (data.status === "accepted" && !order.delivery_tracking_id) {
      try {
        const deliveryResponse = await deliveryService.createDelivery({
          orderId: order.id,
          orderNumber: order.order_number,
          customer: order.shipping_address,
          merchant: {
            name: "Laphing Daddy",
            phone: "9873052538",
            line1: "Shop Address",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
          },
          items: [], // Would populate from order_items
          totalAmount: order.total,
          paymentMode: order.payment_status === "paid" ? "prepaid" : "cod",
          notes: order.delivery_notes,
        });

        if (deliveryResponse.success) {
          await supabase
            .from("orders")
            .update({
              delivery_tracking_id: deliveryResponse.trackingId,
              delivery_provider: "self", // Or actual provider name
            })
            .eq("id", data.order_id);
        }
      } catch (error) {
        console.error("Failed to create delivery:", error);
      }
    }

    return true;
  }

  /**
   * Cancel order
   */
  async cancelOrder(
    orderId: string,
    reason: string,
    initiatedBy?: string
  ): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) return false;

    // Update status history
    await this.updateOrderStatus({
      order_id: orderId,
      status: "cancelled",
      note: reason,
    });

    return true;
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string) {
    const supabase = await createClient();

    const { data: order } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single();

    return order;
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string) {
    const supabase = await createClient();

    const { data: orders } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return orders || [];
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(filters?: {
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    limit?: number;
    offset?: number;
  }) {
    const supabase = await createClient();

    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `, { count: "exact" })
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
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data: orders, count } = await query;

    return { orders: orders || [], total: count || 0 };
  }

  /**
   * Initiate refund
   */
  async initiateRefund(orderId: string, amount?: number): Promise<boolean> {
    const supabase = await createClient();

    const { data: order } = await supabase
      .from("orders")
      .select("razorpay_payment_id, total")
      .eq("id", orderId)
      .single();

    if (!order || !order.razorpay_payment_id) return false;

    try {
      await razorpayService.createRefund(
        order.razorpay_payment_id,
        amount ? Math.round(amount * 100) : undefined
      );

      await supabase
        .from("orders")
        .update({ payment_status: "refunded" })
        .eq("id", orderId);

      return true;
    } catch (error) {
      console.error("Refund failed:", error);
      return false;
    }
  }
}

export const orderService = new OrderService();
