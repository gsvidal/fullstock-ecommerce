import { ApiError } from "../lib/api-error";
import { request } from "../lib/api-client";
import type { Cart, CartItem } from "../types";

export async function getCart(): Promise<Cart | null> {
  try {
    return await request<Cart>("/cart", { credentials: "include" });
  } catch (error) {
    // 404: la sesión todavía no tiene un carrito.
    // 409: la sesión apunta a un carrito que ya no existe.
    // Los dos casos significan lo mismo en el dominio: no hay carrito.
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.status === 409)
    ) {
      return null;
    }
    throw error;
  }
}

export function addCartItem(
  productId: number,
  quantity: number,
): Promise<CartItem> {
  return request<CartItem>("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(
  itemId: number,
  quantity: number,
): Promise<CartItem> {
  return request<CartItem>(`/cart/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: number): Promise<void> {
  return request<void>(`/cart/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
}
