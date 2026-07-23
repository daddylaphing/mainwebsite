import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { orderService } from "@/lib/services/orders/order-service";
import { sendOrderStatusEmail } from "@/lib/emails";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const body = await request.json();
    if (!body.order_id || !body.status) return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });

    const success = await orderService.updateOrderStatus({
      order_id: body.order_id,
      status: body.status,
      note: body.note,
    });

    if (!success) return NextResponse.json({ error: "Failed to update order status" }, { status: 400 });

    // Send status email to customer (non-blocking)
    try {
      const serviceSupabase = createServiceClient();

      const { data: order } = await serviceSupabase
        .from("orders")
        .select("order_number, user_id")
        .eq("id", body.order_id)
        .single();

      if (order) {
        const { data: customerProfile } = await serviceSupabase
          .from("profiles")
          .select("full_name")
          .eq("id", order.user_id)
          .single();

        // Use service role client for auth admin access
        const { data: { user: customerUser } } = await serviceSupabase.auth.admin.getUserById(order.user_id);
        const customerEmail = customerUser?.email;
        const customerName = customerProfile?.full_name || customerUser?.user_metadata?.full_name || "Customer";

        if (customerEmail) {
          await sendOrderStatusEmail({
            email: customerEmail,
            name: customerName,
            orderNumber: order.order_number,
            orderId: body.order_id,
            status: body.status,
            note: body.note,
          });
        }
      }
    } catch (emailErr) {
      console.error("Status email failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
