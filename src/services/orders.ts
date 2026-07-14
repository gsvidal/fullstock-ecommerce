import { request } from "../lib/api-client";
import type { Order, OrderWithItems, ShippingInfo } from "../types";

export function createOrder(shippingInfo: ShippingInfo): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(shippingInfo),
  });
}

export function getOrder(id: number): Promise<OrderWithItems> {
  // credentials para que la sesión autorice ver la orden recién creada.
  return request<OrderWithItems>(`/orders/${id}`, { credentials: "include" });
}
