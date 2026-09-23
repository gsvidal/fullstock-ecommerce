import * as db from "../db/index.ts";
import { ApiError } from "../lib/api-error.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import type { Order, OrderItem } from "../repositories/order.repository.ts";
import type { CheckoutFormValues } from "../schemas/checkout.ts";
import * as cartService from "../services/cart.service.ts";

export async function createOrder(
  cartId: number,
  shippingInfo: CheckoutFormValues,
  userId?: number,
): Promise<Order> {
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) {
    throw new ApiError("No se encontró carrito", 404);
  }

  if (cart.items.length === 0) {
    throw new ApiError("El carrito está vacío", 400);
  }

  const order = await db.withTransaction(async (client) => {
    const orderData = {
      ...shippingInfo,
      userId: userId ?? null,
      total: cart.totalPrice,
    };
    const order = await orderRepository.createOrder(orderData, client);

    const items = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      imgSrc: item.product.imgSrc,
      quantity: item.quantity,
    }));

    await orderRepository.createOrderItems(items, client);
    await cartRepository.remove(cartId, client);

    return order;
  });

  return order;
}

export type OrderWithItems = Order & { items: OrderItem[] };

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await orderRepository.findById(id);
  if (order === null) return null;

  const items = await orderRepository.findItemsByOrderId(id);
  return { ...order, items };
}
