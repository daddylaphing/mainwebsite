/**
 * Razorpay Payment Service
 * 
 * Handles payment processing with Razorpay
 */

import crypto from "crypto";

export interface RazorpayOrderOptions {
  amount: number; // in paise (₹100 = 10000 paise)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class RazorpayService {
  private baseUrl: string = "https://api.razorpay.com/v1";

  private get keyId(): string {
    return process.env.RAZORPAY_KEY_ID || "";
  }

  private get keySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || "";
  }

  constructor() {
    // Credentials read lazily via getters — no stale values on serverless cold starts
  }

  /**
   * Check if Razorpay is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.keyId && this.keySecret);
  }

  /**
   * Get Razorpay Key ID for client-side
   */
  getKeyId(): string {
    return this.keyId;
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(options: RazorpayOrderOptions): Promise<RazorpayOrder> {
    if (!this.isConfigured()) {
      throw new Error("Razorpay not configured");
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || "INR",
        receipt: options.receipt,
        notes: options.notes || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Error: ${error.error?.description || "Unknown error"}`);
    }

    return response.json();
  }

  /**
   * Verify payment signature
   */
  verifySignature(verification: RazorpayPaymentVerification): boolean {
    if (!this.isConfigured()) {
      throw new Error("Razorpay not configured");
    }

    const secret = this.keySecret;
    const body = `${verification.razorpay_order_id}|${verification.razorpay_payment_id}`;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const receivedSignature = String(verification.razorpay_signature || "").trim();
    const receivedBuffer = Buffer.from(receivedSignature, "utf8");
    const generatedBuffer = Buffer.from(generatedSignature, "utf8");

    const match =
      receivedBuffer.length === generatedBuffer.length &&
      crypto.timingSafeEqual(generatedBuffer, receivedBuffer);

    if (!match) {
      console.error("[Razorpay] Signature mismatch", {
        receivedSignatureLength: receivedBuffer.length,
        generatedSignatureLength: generatedBuffer.length,
        generated: generatedSignature,
        body,
      });
    }

    return match;
  }

  /**
   * Fetch payment details
   */
  async getPayment(paymentId: string): Promise<RazorpayOrder> {
    if (!this.isConfigured()) {
      throw new Error("Razorpay not configured");
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");

    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Error: ${error.error?.description || "Unknown error"}`);
    }

    return response.json();
  }

  /**
   * Initiate refund
   */
  async createRefund(paymentId: string, amount?: number): Promise<RazorpayOrder> {
    if (!this.isConfigured()) {
      throw new Error("Razorpay not configured");
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");

    const body: { amount?: number } = {};
    if (amount) {
      body.amount = amount;
    }

    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Error: ${error.error?.description || "Unknown error"}`);
    }

    return response.json();
  }

  /**
   * Capture payment (for authorized payments)
   */
  async capturePayment(paymentId: string, amount: number): Promise<RazorpayOrder> {
    if (!this.isConfigured()) {
      throw new Error("Razorpay not configured");
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");

    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay Error: ${error.error?.description || "Unknown error"}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const razorpayService = new RazorpayService();
