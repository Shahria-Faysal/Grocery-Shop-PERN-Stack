import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  unit: z.string(),
  categoryId: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().min(0).optional(),
  image: z.string().optional()
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  unit: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  image: z.string().optional()
});