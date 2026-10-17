import { logError } from "../lib/log-error.ts";
import * as mercadopago from "../lib/mercadopago.server.ts";
import * as orderRepository from "../repositories/order.repository.ts";

// Devuelve la URL de Mercado Pago donde la persona paga la orden.
export async function startPayment(orderId: number): Promise<string> {
  const order = await orderRepository.findByIdWithItems(orderId);

  if (order === null) throw new Error(`No existe la orden ${orderId}`);

  const mercadopagoOrder = await mercadopago.createOrder({
    orderId: order.id,
    items: order.items,
    total: order.total,
  });

  if (mercadopagoOrder.checkout_url === undefined) {
    throw new Error(`La orden ${mercadopagoOrder.id} no trae checkout_url`);
  }

  await orderRepository.setMercadopagoOrderId(order.id, mercadopagoOrder.id);

  return mercadopagoOrder.checkout_url;
}

export async function syncPayment(
  mercadopagoOrderId: string,
): Promise<boolean> {
  const order =
    await orderRepository.findByMercadopagoOrderId(mercadopagoOrderId);

  // Una orden de Mercado Pago que no es nuestra: no hay nada que actualizar.
  if (order === null) return false;
  if (order.status === "paid") return false;

  const mercadopagoOrder = await mercadopago.getOrder(mercadopagoOrderId);

  if (mercadopagoOrder.status !== "processed") return false;

  // Lo cobrado tiene que ser lo que cuesta la orden, en céntimos. Si no, algo
  // está muy mal y lo tiene que mirar una persona: se reporta y no se marca.
  const paid = Math.round(Number(mercadopagoOrder.total_paid_amount) * 100);
  if (paid !== order.total) {
    logError(
      new Error(
        `La orden ${order.id} cuesta ${order.total} y se cobró ${paid}`,
      ),
    );
    return false;
  }

  return orderRepository.markAsPaid(order.id);
}
