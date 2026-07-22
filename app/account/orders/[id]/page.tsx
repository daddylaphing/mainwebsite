import { createClient } from "@/lib/supabase/server";
import { OrderDetail } from "@/components/order/order-detail";
import { notFound } from "next/navigation";

interface OrderPageProps {
  params: { id: string };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`*, order_items(*)`)
    .eq("id", params.id)
    .single();

  if (error || !order || order.user_id !== user.id) {
    notFound();
  }

  return <OrderDetail order={order} />;
}
