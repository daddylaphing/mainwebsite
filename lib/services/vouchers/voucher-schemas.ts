import { z } from "zod";

export const VoucherFormSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(30, "Code cannot exceed 30 characters")
      .regex(/^[A-Z0-9_-]+$/i, "Code can only contain letters, numbers, hyphens, and underscores"),
    description: z.string().max(500).optional().default(""),
    discount_type: z.enum(["percentage", "fixed_amount", "free_delivery", "buy_x_get_y"]),
    discount_value: z.coerce
      .number()
      .min(0, "Discount value must be positive")
      .max(100000, "Discount value too large"),
    max_discount: z.coerce.number().positive().nullable().optional(),
    min_order_value: z.coerce.number().min(0).nullable().optional(),
    max_order_value: z.coerce.number().positive().nullable().optional(),
    start_date: z.string().nullable().optional(),
    expiry_date: z.string().nullable().optional(),
    max_global_uses: z.coerce.number().int().positive().nullable().optional(),
    max_uses_per_user: z.coerce.number().int().min(1).default(1),
    applicable_product_ids: z.array(z.string().uuid()).default([]),
    excluded_product_ids: z.array(z.string().uuid()).default([]),
    applicable_category_ids: z.array(z.string().uuid()).default([]),
    excluded_category_ids: z.array(z.string().uuid()).default([]),
    applicable_user_roles: z.array(z.string()).default([]),
    first_order_only: z.boolean().default(false),
    new_customers_only: z.boolean().default(false),
    existing_customers_only: z.boolean().default(false),
    is_stackable: z.boolean().default(false),
    free_delivery: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.discount_type === "percentage" && data.discount_value > 100) {
        return false;
      }
      return true;
    },
    { message: "Percentage discount cannot exceed 100%", path: ["discount_value"] }
  )
  .refine(
    (data) => {
      if (data.new_customers_only && data.existing_customers_only) return false;
      return true;
    },
    {
      message: "Cannot require both new and existing customers at the same time",
      path: ["existing_customers_only"],
    }
  )
  .refine(
    (data) => {
      if (data.start_date && data.expiry_date) {
        return new Date(data.start_date) < new Date(data.expiry_date);
      }
      return true;
    },
    { message: "Start date must be before expiry date", path: ["expiry_date"] }
  );

export type VoucherFormInput = z.infer<typeof VoucherFormSchema>;

export const ValidateVoucherApiSchema = z.object({
  code: z.string().min(1, "Voucher code is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
  product_ids: z.array(z.string()).default([]),
  category_ids: z.array(z.string()).optional(),
});

export type ValidateVoucherApiInput = z.infer<typeof ValidateVoucherApiSchema>;
