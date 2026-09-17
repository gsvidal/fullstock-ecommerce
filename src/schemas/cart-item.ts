import * as z from "zod";

export const createCartItemBodySchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).default(1), // TODO: validar si es necesario
});

export const updateCartItemBodySchema = z.object({
  itemId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1),
});

export const removeCartItemBodySchema = z.object({
  itemId: z.coerce.number().int().positive(),
});

export type CreateCartItemBody = z.infer<typeof createCartItemBodySchema>;
export type UpdateCartItemBody = z.infer<typeof updateCartItemBodySchema>;
export type RemoveCartItemBody = z.infer<typeof removeCartItemBodySchema>;
