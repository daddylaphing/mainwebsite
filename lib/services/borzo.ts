export interface BorzoShipmentPayload {
  order_id: string;
  order_number: string;
  total: number;
  pickup_address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  drop_address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{ name: string; quantity: number; price: number }>;
}

export interface BorzoShipmentResponse {
  shipment_id: string;
  tracking_url?: string;
  status: string;
  raw: unknown;
}

const BORZO_API_BASE_URL = process.env.BORZO_API_BASE_URL || "https://api.borzo.in/v1";
const BORZO_API_KEY = process.env.BORZO_API_KEY;
const BORZO_API_SECRET = process.env.BORZO_API_SECRET;

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: BORZO_API_KEY ? `Bearer ${BORZO_API_KEY}` : "",
  };
}

export const borzoService = {
  isConfigured() {
    return Boolean(BORZO_API_KEY && BORZO_API_SECRET);
  },

  async createShipment(payload: BorzoShipmentPayload): Promise<BorzoShipmentResponse> {
    if (!this.isConfigured()) {
      throw new Error("Borzo API is not configured. Please set BORZO_API_KEY and BORZO_API_SECRET.");
    }

    const response = await fetch(`${BORZO_API_BASE_URL}/shipments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        external_reference: payload.order_number,
        pickup_contact_name: payload.pickup_address.name,
        pickup_phone: payload.pickup_address.phone,
        pickup_address_line1: payload.pickup_address.line1,
        pickup_city: payload.pickup_address.city,
        pickup_state: payload.pickup_address.state,
        pickup_pincode: payload.pickup_address.pincode,
        drop_contact_name: payload.drop_address.name,
        drop_phone: payload.drop_address.phone,
        drop_address_line1: payload.drop_address.line1,
        drop_city: payload.drop_address.city,
        drop_state: payload.drop_address.state,
        drop_pincode: payload.drop_address.pincode,
        package_value: payload.total,
        package_items: payload.items,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Borzo shipment creation failed.");
    }

    return {
      shipment_id: data.id || data.shipment_id || payload.order_id,
      tracking_url: data.tracking_url || data.trackingLink || null,
      status: data.status || "created",
      raw: data,
    };
  },
};
