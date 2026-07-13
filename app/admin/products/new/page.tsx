import { requireAdmin } from "@/lib/admin/auth";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="py-6">
      <ProductForm />
    </div>
  );
}
