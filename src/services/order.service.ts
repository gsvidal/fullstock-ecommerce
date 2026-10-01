import { db } from "../db/index.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import type {
  Order,
  OrderWithItems,
} from "../repositories/order.repository.ts";
import type { CheckoutFormValues } from "../schemas/checkout.ts";
import * as cartService from "../services/cart.service.ts";

export async function createOrder(
  cartId: number,
  shippingInfo: CheckoutFormValues,
  userId?: number,
): Promise<Order | null> {
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) {
    return null;
  }

  if (cart.items.length === 0) {
    return null;
  }

  const order = await db.transaction(async (tx) => {
    const orderData = {
      ...shippingInfo,
      userId: userId ?? null,
      total: cart.totalPrice,
    };
    const order = await orderRepository.createOrder(orderData, tx);

    const items = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      imgSrc: item.product.imgSrc,
      quantity: item.quantity,
    }));

    await orderRepository.createOrderItems(items, tx);
    await cartRepository.remove(cartId, tx);

    return order;
  });

  return order;
}

export type { OrderWithItems };

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  return await orderRepository.findByIdWithItems(id);
}
