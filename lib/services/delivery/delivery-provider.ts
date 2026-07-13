/**
 * Abstract Delivery Provider Interface
 * 
 * Pluggable architecture for delivery integrations
 * New providers can be added by implementing this interface
 */

export interface DeliveryAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface DeliveryOrder {
  orderId: string;
  orderNumber: string;
  customer: DeliveryAddress;
  merchant: DeliveryAddress;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMode: "prepaid" | "cod";
  notes?: string;
}

export interface DeliveryResponse {
  success: boolean;
  trackingId?: string;
  estimatedDeliveryTime?: string;
  error?: string;
  providerData?: any;
}

export interface TrackingInfo {
  trackingId: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  history: Array<{
    status: string;
    timestamp: string;
    location?: string;
    description?: string;
  }>;
}

/**
 * Abstract Delivery Provider
 * All delivery integrations must implement this interface
 */
export abstract class DeliveryProvider {
  abstract name: string;
  
  /**
   * Check if provider is properly configured
   */
  abstract isConfigured(): boolean;

  /**
   * Create a delivery order
   */
  abstract createDelivery(order: DeliveryOrder): Promise<DeliveryResponse>;

  /**
   * Track delivery status
   */
  abstract trackDelivery(trackingId: string): Promise<TrackingInfo>;

  /**
   * Cancel delivery
   */
  abstract cancelDelivery(trackingId: string, reason?: string): Promise<DeliveryResponse>;

  /**
   * Get delivery rate/quote
   */
  abstract getQuote?(
    pickup: DeliveryAddress,
    delivery: DeliveryAddress
  ): Promise<{ amount: number; estimatedTime?: string }>;
}

/**
 * Placeholder Delivery Provider
 * Used when no provider is configured
 */
export class PlaceholderDeliveryProvider extends DeliveryProvider {
  name = "placeholder";

  isConfigured(): boolean {
    return false;
  }

  async createDelivery(order: DeliveryOrder): Promise<DeliveryResponse> {
    console.log("[Delivery] Would create delivery:", order);
    
    return {
      success: true,
      trackingId: `PLACEHOLDER_${Date.now()}`,
      estimatedDeliveryTime: "30-45 minutes",
    };
  }

  async trackDelivery(trackingId: string): Promise<TrackingInfo> {
    console.log("[Delivery] Would track:", trackingId);
    
    return {
      trackingId,
      status: "in_transit",
      currentLocation: "En route",
      estimatedDelivery: "30 minutes",
      history: [
        {
          status: "order_placed",
          timestamp: new Date().toISOString(),
          description: "Order placed",
        },
        {
          status: "picked_up",
          timestamp: new Date().toISOString(),
          description: "Picked up from merchant",
        },
      ],
    };
  }

  async cancelDelivery(trackingId: string, reason?: string): Promise<DeliveryResponse> {
    console.log("[Delivery] Would cancel:", trackingId, reason);
    
    return {
      success: true,
    };
  }

  async getQuote(
    pickup: DeliveryAddress,
    delivery: DeliveryAddress
  ): Promise<{ amount: number; estimatedTime?: string }> {
    console.log("[Delivery] Would get quote for:", { pickup, delivery });
    
    return {
      amount: 50,
      estimatedTime: "30-45 minutes",
    };
  }
}

/**
 * Self-Delivery Provider
 * For orders delivered by own delivery team
 */
export class SelfDeliveryProvider extends DeliveryProvider {
  name = "self";

  isConfigured(): boolean {
    return true;
  }

  async createDelivery(order: DeliveryOrder): Promise<DeliveryResponse> {
    // Self-managed delivery
    // Could integrate with internal delivery management system
    
    return {
      success: true,
      trackingId: `SELF_${order.orderNumber}_${Date.now()}`,
      estimatedDeliveryTime: "30-45 minutes",
    };
  }

  async trackDelivery(trackingId: string): Promise<TrackingInfo> {
    // Would query internal delivery management system
    
    return {
      trackingId,
      status: "assigned",
      currentLocation: "Preparing for delivery",
      history: [
        {
          status: "assigned",
          timestamp: new Date().toISOString(),
          description: "Delivery assigned to team",
        },
      ],
    };
  }

  async cancelDelivery(trackingId: string, reason?: string): Promise<DeliveryResponse> {
    // Handle internal cancellation
    
    return {
      success: true,
    };
  }

  async getQuote(
    pickup: DeliveryAddress,
    delivery: DeliveryAddress
  ): Promise<{ amount: number; estimatedTime?: string }> {
    return {
      amount: 40,
      estimatedTime: "30-45 minutes",
    };
  }
}

/**
 * Delivery Service Manager
 * Manages delivery providers and routing
 */
class DeliveryService {
  private providers: Map<string, DeliveryProvider> = new Map();
  private defaultProvider: string = "placeholder";

  constructor() {
    // Register built-in providers
    this.registerProvider(new PlaceholderDeliveryProvider());
    this.registerProvider(new SelfDeliveryProvider());
  }

  /**
   * Register a new delivery provider
   */
  registerProvider(provider: DeliveryProvider) {
    this.providers.set(provider.name, provider);
  }

  /**
   * Set default provider
   */
  setDefaultProvider(providerName: string) {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider ${providerName} not registered`);
    }
    this.defaultProvider = providerName;
  }

  /**
   * Get provider instance
   */
  getProvider(providerName?: string): DeliveryProvider {
    const name = providerName || this.defaultProvider;
    const provider = this.providers.get(name);
    
    if (!provider) {
      throw new Error(`Provider ${name} not found`);
    }
    
    return provider;
  }

  /**
   * Create delivery with specified or default provider
   */
  async createDelivery(
    order: DeliveryOrder,
    providerName?: string
  ): Promise<DeliveryResponse> {
    const provider = this.getProvider(providerName);
    return provider.createDelivery(order);
  }

  /**
   * Track delivery
   */
  async trackDelivery(
    trackingId: string,
    providerName?: string
  ): Promise<TrackingInfo> {
    const provider = this.getProvider(providerName);
    return provider.trackDelivery(trackingId);
  }

  /**
   * Cancel delivery
   */
  async cancelDelivery(
    trackingId: string,
    providerName?: string,
    reason?: string
  ): Promise<DeliveryResponse> {
    const provider = this.getProvider(providerName);
    return provider.cancelDelivery(trackingId, reason);
  }

  /**
   * Get delivery quote
   */
  async getQuote(
    pickup: DeliveryAddress,
    delivery: DeliveryAddress,
    providerName?: string
  ): Promise<{ amount: number; estimatedTime?: string }> {
    const provider = this.getProvider(providerName);
    
    if (!provider.getQuote) {
      return { amount: 50, estimatedTime: "30-45 minutes" };
    }
    
    return provider.getQuote(pickup, delivery);
  }

  /**
   * List available providers
   */
  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if provider is configured
   */
  isProviderConfigured(providerName: string): boolean {
    const provider = this.providers.get(providerName);
    return provider ? provider.isConfigured() : false;
  }
}

// Export singleton instance
export const deliveryService = new DeliveryService();
