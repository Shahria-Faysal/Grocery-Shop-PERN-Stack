import { z } from "zod";

export const createOrderSchema = z.object({
  product_ids: z.array(z.number()).min(1),
  payment: z.enum(["COD", "Cash", "Card"])
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
});