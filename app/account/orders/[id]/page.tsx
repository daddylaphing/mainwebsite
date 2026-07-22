import { createClient } from "@/lib/supabase/server";
import { OrderDetail } from "@/components/order/order-detail";
import { redirect } from "next/navigation";

interface OrderPageProps {
  params: { id: string };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/account/orders/${params.id}`);
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`*, order_items(*)`)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    return redirect("/account");
  }

  return <OrderDetail order={order} />;
}
