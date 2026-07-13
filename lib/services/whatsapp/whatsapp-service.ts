/**
 * WhatsApp Service Layer
 * 
 * Abstract service for sending WhatsApp messages
 * Supports multiple providers and template management
 */

export interface WhatsAppMessage {
  to: string; // Phone number with country code
  template?: string;
  variables?: string[];
  message?: string;
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WhatsAppTemplate {
  name: string;
  variables: string[];
  preview: string;
}

/**
 * WhatsApp Message Templates
 * Configure your templates here
 */
export const WHATSAPP_TEMPLATES = {
  ORDER_PLACED: {
    name: "order_placed",
    variables: ["customer_name", "order_number", "total_amount"],
    preview: "Hi {{1}}, your order #{{2}} has been placed successfully! Total: ₹{{3}}. We'll notify you once it's ready. - Laphing Daddy",
  },
  ORDER_ACCEPTED: {
    name: "order_accepted",
    variables: ["customer_name", "order_number"],
    preview: "Hi {{1}}, great news! Your order #{{2}} has been accepted and is being prepared. - Laphing Daddy",
  },
  ORDER_READY: {
    name: "order_ready",
    variables: ["customer_name", "order_number"],
    preview: "Hi {{1}}, your order #{{2}} is ready for pickup/delivery! - Laphing Daddy",
  },
  ORDER_COMPLETED: {
    name: "order_completed",
    variables: ["customer_name", "order_number"],
    preview: "Hi {{1}}, your order #{{2}} has been delivered! Thank you for choosing Laphing Daddy. We'd love your feedback! - Laphing Daddy",
  },
  ORDER_CANCELLED: {
    name: "order_cancelled",
    variables: ["customer_name", "order_number", "reason"],
    preview: "Hi {{1}}, unfortunately your order #{{2}} has been cancelled. Reason: {{3}}. If you have questions, please contact us. - Laphing Daddy",
  },
  PAYMENT_FAILED: {
    name: "payment_failed",
    variables: ["customer_name", "order_number"],
    preview: "Hi {{1}}, payment for order #{{2}} failed. Please retry or contact us for assistance. - Laphing Daddy",
  },
} as const;

export type TemplateName = keyof typeof WHATSAPP_TEMPLATES;

/**
 * Abstract WhatsApp Service
 */
export abstract class WhatsAppProvider {
  abstract sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse>;
  abstract sendTemplate(
    to: string,
    templateName: TemplateName,
    variables: string[]
  ): Promise<WhatsAppResponse>;
  abstract isConfigured(): boolean;
}

/**
 * Placeholder WhatsApp Provider
 * Replace with actual provider implementation (Twilio, WhatsApp Business API, etc.)
 */
export class PlaceholderWhatsAppProvider extends WhatsAppProvider {
  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    console.log("[WhatsApp] Would send message:", message);
    
    // Simulate success
    return {
      success: true,
      messageId: `placeholder_${Date.now()}`,
    };
  }

  async sendTemplate(
    to: string,
    templateName: TemplateName,
    variables: string[]
  ): Promise<WhatsAppResponse> {
    const template = WHATSAPP_TEMPLATES[templateName];
    
    console.log("[WhatsApp] Would send template:", {
      to,
      template: template.name,
      variables,
    });

    // Simulate success
    return {
      success: true,
      messageId: `placeholder_${Date.now()}`,
    };
  }

  isConfigured(): boolean {
    return false; // Not configured until credentials are added
  }
}

/**
 * WhatsApp Service Singleton
 * Manages provider instance and provides helper methods
 */
class WhatsAppService {
  private provider: WhatsAppProvider;

  constructor() {
    // Initialize with placeholder provider
    // Replace with actual provider when credentials are configured
    this.provider = new PlaceholderWhatsAppProvider();
  }

  /**
   * Set custom provider
   */
  setProvider(provider: WhatsAppProvider) {
    this.provider = provider;
  }

  /**
   * Check if WhatsApp is configured
   */
  isConfigured(): boolean {
    return this.provider.isConfigured();
  }

  /**
   * Send order placed notification
   */
  async notifyOrderPlaced(
    phone: string,
    customerName: string,
    orderNumber: string,
    totalAmount: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "ORDER_PLACED", [
      customerName,
      orderNumber,
      totalAmount,
    ]);
  }

  /**
   * Send order accepted notification
   */
  async notifyOrderAccepted(
    phone: string,
    customerName: string,
    orderNumber: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "ORDER_ACCEPTED", [
      customerName,
      orderNumber,
    ]);
  }

  /**
   * Send order ready notification
   */
  async notifyOrderReady(
    phone: string,
    customerName: string,
    orderNumber: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "ORDER_READY", [
      customerName,
      orderNumber,
    ]);
  }

  /**
   * Send order completed notification
   */
  async notifyOrderCompleted(
    phone: string,
    customerName: string,
    orderNumber: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "ORDER_COMPLETED", [
      customerName,
      orderNumber,
    ]);
  }

  /**
   * Send order cancelled notification
   */
  async notifyOrderCancelled(
    phone: string,
    customerName: string,
    orderNumber: string,
    reason: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "ORDER_CANCELLED", [
      customerName,
      orderNumber,
      reason,
    ]);
  }

  /**
   * Send payment failed notification
   */
  async notifyPaymentFailed(
    phone: string,
    customerName: string,
    orderNumber: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendTemplate(phone, "PAYMENT_FAILED", [
      customerName,
      orderNumber,
    ]);
  }

  /**
   * Send custom message
   */
  async sendCustomMessage(
    phone: string,
    message: string
  ): Promise<WhatsAppResponse> {
    return this.provider.sendMessage({ to: phone, message });
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
