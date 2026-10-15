import * as z from "zod";
import { idSchema, MAX_INTEGER } from "./shared";

export const createCartItemBodySchema = z.object({
  productId: idSchema,
  quantity: z.coerce.number().int().min(1).max(MAX_INTEGER).default(1), // TODO: validar si es necesario
});

export const updateCartItemBodySchema = z.object({
  itemId: idSchema,
  quantity: z.coerce.number().int().min(1).max(MAX_INTEGER),
});

export const removeCartItemBodySchema = z.object({
  itemId: idSchema,
});

export type CreateCartItemBody = z.infer<typeof createCartItemBodySchema>;
export type UpdateCartItemBody = z.infer<typeof updateCartItemBodySchema>;
export type RemoveCartItemBody = z.infer<typeof removeCartItemBodySchema>;
