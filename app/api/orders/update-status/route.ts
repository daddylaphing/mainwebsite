import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { orderService } from "@/lib/services/orders/order-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.order_id || !body.status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    // Update order status
    const success = await orderService.updateOrderStatus({
      order_id: body.order_id,
      status: body.status,
      note: body.note,
      admin_notes: body.admin_notes,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
