/**
 * Order Helper Utilities
 */

export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";

/**
 * Get status display configuration
 */
export const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "yellow",
    icon: "Clock",
    description: "Order placed, awaiting confirmation",
  },
  accepted: {
    label: "Accepted",
    color: "blue",
    icon: "CheckCircle",
    description: "Order accepted and being prepared",
  },
  preparing: {
    label: "Preparing",
    color: "purple",
    icon: "Package",
    description: "Your order is being prepared",
  },
  ready: {
    label: "Ready",
    color: "green",
    icon: "Check",
    description: "Order is ready for pickup/delivery",
  },
  completed: {
    label: "Completed",
    color: "green",
    icon: "CheckCircle",
    description: "Order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    icon: "XCircle",
    description: "Order has been cancelled",
  },
} as const;

/**
 * Get payment status display configuration
 */
export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "yellow",
    description: "Payment not yet received",
  },
  processing: {
    label: "Processing",
    color: "blue",
    description: "Payment is being processed",
  },
  paid: {
    label: "Paid",
    color: "green",
    description: "Payment received successfully",
  },
  failed: {
    label: "Failed",
    color: "red",
    description: "Payment failed",
  },
  refunded: {
    label: "Refunded",
    color: "gray",
    description: "Payment has been refunded",
  },
} as const;

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return ["pending", "accepted"].includes(status);
}

/**
 * Check if order status can be changed to target status
 */
export function canChangeStatus(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    pending: ["accepted", "cancelled"],
    accepted: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["completed"],
    completed: [],
    cancelled: [],
  };

  return statusFlow[currentStatus]?.includes(targetStatus) || false;
}

/**
 * Get next possible statuses
 */
export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    pending: ["accepted", "cancelled"],
    accepted: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["completed"],
    completed: [],
    cancelled: [],
  };

  return statusFlow[currentStatus] || [];
}

/**
 * Format order number for display
 */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.toUpperCase();
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0); // No tax for now
  const packagingCharge = 30; // Base packaging
  const shippingCharge = 0; // Customer arranges delivery
  
  // Bulk packaging charge
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const finalPackagingCharge = totalItems > 10 ? 50 : packagingCharge;

  const total = subtotal + tax + finalPackagingCharge + shippingCharge;

  return {
    subtotal,
    tax,
    packagingCharge: finalPackagingCharge,
    shippingCharge,
    total,
  };
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Format phone number for WhatsApp (with country code)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  
  // Add India country code if not present
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Validate pincode
 */
export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9]\d{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Check if order is in terminal status
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return ["completed", "cancelled"].includes(status);
}

/**
 * Get estimated preparation time based on items
 */
export function getEstimatedPreparationTime(itemCount: number): string {
  if (itemCount <= 2) return "15-20 minutes";
  if (itemCount <= 5) return "20-30 minutes";
  if (itemCount <= 10) return "30-45 minutes";
  return "45-60 minutes";
}

/**
 * Generate order summary text
 */
export function generateOrderSummary(order: {
  order_number: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
}): string {
  const itemsSummary = order.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(", ");

  return `Order ${order.order_number}: ${itemsSummary}. Total: ₹${order.total}`;
}
