import { request } from "../lib/api-client";
import type { ApiCookies } from "../lib/api-cookies";
import type { Order, OrderWithItems, ShippingInfo } from "../types";

export function createOrder(
  shippingInfo: ShippingInfo,
  cookies: ApiCookies,
): Promise<Order> {
  return request<Order>(
    "/orders",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(shippingInfo),
    },
    cookies,
  );
}

export function getOrder(
  id: number,
  cookies: ApiCookies,
): Promise<OrderWithItems> {
  // credentials para que la sesión autorice ver la orden recién creada.
  return request<OrderWithItems>(
    `/orders/${id}`,
    { credentials: "include" },
    cookies,
  );
}
