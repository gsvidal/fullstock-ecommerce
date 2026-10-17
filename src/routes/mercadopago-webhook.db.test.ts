import { createHmac, randomUUID } from "node:crypto";
import { RouterContextProvider } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { env } from "../env.server.ts";
import type { MercadoPagoOrder } from "../lib/mercadopago.server.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import { action } from "./mercadopago-webhook.ts";

// Una orden nuestra que ya se mandó a Mercado Pago, esperando el pago.
async function createPendingOrder(total: number) {
  const order = await orderRepository.createOrder({
    email: `webhook-${randomUUID()}@example.com`,
    firstName: "Ana",
    lastName: "Díaz",
    company: null,
    address: "Av. Arequipa 123",
    city: "Lima",
    country: "PE",
    region: "Lima",
    zipCode: "15001",
    phone: "987654321",
    total,
    userId: null,
  });
  const mercadopagoOrderId = `ORDTST${randomUUID()}`.toUpperCase();
  await orderRepository.setMercadopagoOrderId(order.id, mercadopagoOrderId);

  return { orderId: order.id, mercadopagoOrderId };
}

// Lo que manda Mercado Pago cuando cambia una orden: el id en la URL y la
// firma en los headers, calculada con la clave secreta del webhook.
function notify(dataId: string, secret = env.MP_WEBHOOK_SECRET) {
  const requestId = randomUUID();
  const ts = String(Math.floor(Date.now() / 1000));
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const v1 = createHmac("sha256", secret).update(manifest).digest("hex");

  const request = new Request(
    `http://localhost/webhooks/mercadopago?data.id=${dataId}&type=order`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": requestId,
        "x-signature": `ts=${ts},v1=${v1}`,
      },
      body: JSON.stringify({ type: "order", data: { id: dataId } }),
    },
  );

  return action({
    request,
    url: new URL(request.url),
    pattern: "/webhooks/mercadopago",
    params: {},
    context: new RouterContextProvider(),
  });
}

// Lo que contesta la API de Mercado Pago al preguntarle por la orden. El test
// no sale a internet: `fetch` devuelve esta respuesta.
function mercadopagoAnswers(order: Partial<MercadoPagoOrder>) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async () => Response.json(order));
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("un aviso firmado de una orden pagada la marca como pagada", async () => {
  const { orderId, mercadopagoOrderId } = await createPendingOrder(3599);
  const fetch = mercadopagoAnswers({
    id: mercadopagoOrderId,
    status: "processed",
    total_paid_amount: "35.99",
  });

  const response = await notify(mercadopagoOrderId);

  expect(response.status).toBe(200);
  expect(fetch).toHaveBeenCalledWith(
    `${env.MP_API_URL}/v1/orders/${mercadopagoOrderId}`,
    expect.anything(),
  );
  const order = await orderRepository.findByIdWithItems(orderId);
  expect(order?.status).toBe("paid");
  expect(order?.paidAt).not.toBeNull();
});

test("un aviso con otra firma responde 401 y no pregunta nada", async () => {
  const { orderId, mercadopagoOrderId } = await createPendingOrder(3599);
  const fetch = mercadopagoAnswers({
    id: mercadopagoOrderId,
    status: "processed",
    total_paid_amount: "35.99",
  });

  const response = await notify(mercadopagoOrderId, "otra-clave");

  expect(response.status).toBe(401);
  expect(fetch).not.toHaveBeenCalled();
  const order = await orderRepository.findByIdWithItems(orderId);
  expect(order?.status).toBe("pending");
});

test("el mismo aviso dos veces marca la orden una sola vez", async () => {
  const { orderId, mercadopagoOrderId } = await createPendingOrder(3599);
  const fetch = mercadopagoAnswers({
    id: mercadopagoOrderId,
    status: "processed",
    total_paid_amount: "35.99",
  });

  await notify(mercadopagoOrderId);
  const paidAt = (await orderRepository.findByIdWithItems(orderId))?.paidAt;
  const response = await notify(mercadopagoOrderId);

  expect(response.status).toBe(200);
  expect(fetch).toHaveBeenCalledTimes(1);
  const order = await orderRepository.findByIdWithItems(orderId);
  expect(order?.paidAt).toEqual(paidAt);
});

test("un pago rechazado deja la orden pendiente", async () => {
  const { orderId, mercadopagoOrderId } = await createPendingOrder(3599);
  mercadopagoAnswers({
    id: mercadopagoOrderId,
    status: "action_required",
    total_paid_amount: "0",
  });

  const response = await notify(mercadopagoOrderId);

  expect(response.status).toBe(200);
  const order = await orderRepository.findByIdWithItems(orderId);
  expect(order?.status).toBe("pending");
});

test("una orden cobrada por otro monto no se marca", async () => {
  const { orderId, mercadopagoOrderId } = await createPendingOrder(3599);
  mercadopagoAnswers({
    id: mercadopagoOrderId,
    status: "processed",
    total_paid_amount: "1.00",
  });
  // Mockea console.error para que no ensucie la salida del test.
  vi.spyOn(console, "error").mockImplementation(() => {});

  const response = await notify(mercadopagoOrderId);

  expect(response.status).toBe(200);
  const order = await orderRepository.findByIdWithItems(orderId);
  expect(order?.status).toBe("pending");
});

// Si dos avisos llegan a la vez, los dos pueden leer la orden como pendiente
// antes de que alguno la marque. Lo que decide es el `UPDATE`.
test("marcar como pagada una orden ya pagada no hace nada", async () => {
  const { orderId } = await createPendingOrder(3599);

  expect(await orderRepository.markAsPaid(orderId)).toBe(true);
  expect(await orderRepository.markAsPaid(orderId)).toBe(false);
});
