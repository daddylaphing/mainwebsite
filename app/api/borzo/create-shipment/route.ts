import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { borzoService } from "@/lib/services/borzo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, order_number, shipping_address, total } = body;

    if (!order_id || !order_number || !shipping_address || !total) {
      return NextResponse.json({ error: "Missing required shipment data" }, { status: 400 });
    }

    if (!borzoService.isConfigured()) {
      return NextResponse.json({ error: "Borzo is not configured on the server" }, { status: 501 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const pickupName = process.env.BORZO_PICKUP_NAME;
    const pickupPhone = process.env.BORZO_PICKUP_PHONE;
    const pickupLine1 = process.env.BORZO_PICKUP_LINE1;
    const pickupCity = process.env.BORZO_PICKUP_CITY;
    const pickupState = process.env.BORZO_PICKUP_STATE;
    const pickupPincode = process.env.BORZO_PICKUP_PINCODE;

    if (!pickupName || !pickupPhone || !pickupLine1 || !pickupCity || !pickupState || !pickupPincode) {
      return NextResponse.json({ error: "Borzo pickup address is not configured" }, { status: 500 });
    }

    const shipment = await borzoService.createShipment({
      order_id,
      order_number,
      total,
      pickup_address: {
        name: pickupName,
        phone: pickupPhone,
        line1: pickupLine1,
        city: pickupCity,
        state: pickupState,
        pincode: pickupPincode,
      },
      drop_address: {
        name: shipping_address.full_name,
        phone: shipping_address.phone,
        line1: shipping_address.line1,
        city: shipping_address.city,
        state: shipping_address.state,
        pincode: shipping_address.pincode,
      },
      items: (order.order_items || []).map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return NextResponse.json({ success: true, shipment });
  } catch (error) {
    console.error("Borzo shipment error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create shipment" }, { status: 500 });
  }
}
