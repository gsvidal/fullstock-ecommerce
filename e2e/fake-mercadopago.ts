// Un Mercado Pago de mentira para los E2E. Responde lo mismo que la API de
// verdad en las dos llamadas que hace la app (crear una orden y consultarla) y
// tiene una página de pago con dos botones. Guarda todo en memoria: cada
// corrida de Playwright lo levanta de cero.
import { createServer, type IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT);

type FakeOrder = {
  id: string;
  externalReference: string;
  totalAmount: string;
  successUrl: string;
  failureUrl: string;
  paid: boolean;
};

const orders = new Map<string, FakeOrder>();
const orderIdsByIdempotencyKey = new Map<string, string>();

// Lo que devolvería la API de Mercado Pago para esta orden.
function toApi(order: FakeOrder) {
  return {
    id: order.id,
    status: order.paid ? "processed" : "action_required",
    status_detail: order.paid ? "accredited" : "waiting_payment",
    external_reference: order.externalReference,
    total_amount: order.totalAmount,
    total_paid_amount: order.paid ? order.totalAmount : "0.00",
    checkout_url: `http://localhost:${PORT}/checkout/${order.id}`,
  };
}

async function readJson(request: IncomingMessage) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return JSON.parse(body);
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  const [, first, second, third] = url.pathname.split("/");

  // Para que Playwright sepa que el servidor ya arrancó.
  if (url.pathname === "/") {
    response.writeHead(200).end("Mercado Pago (simulado)");
    return;
  }

  // POST /v1/orders: crear la orden, una sola vez por clave de idempotencia.
  if (request.method === "POST" && first === "v1" && second === "orders") {
    const key = String(request.headers["x-idempotency-key"]);
    let order = orders.get(orderIdsByIdempotencyKey.get(key) ?? "");

    if (order === undefined) {
      const body = await readJson(request);
      order = {
        id: `ORDFAKE${randomUUID()}`,
        externalReference: body.external_reference,
        totalAmount: body.total_amount,
        successUrl: body.config.online.success_url,
        failureUrl: body.config.online.failure_url,
        paid: false,
      };
      orders.set(order.id, order);
      orderIdsByIdempotencyKey.set(key, order.id);
    }

    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify(toApi(order)));
    return;
  }

  // GET /v1/orders/:id: consultar cómo está.
  if (request.method === "GET" && first === "v1" && second === "orders") {
    const order = orders.get(third ?? "");
    response.writeHead(order ? 200 : 404, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(order ? toApi(order) : { error: "not_found" }));
    return;
  }

  // /checkout/:id: la página de pago, donde la persona paga o se arrepiente.
  const order = orders.get(second ?? "");
  if (first === "checkout" && order !== undefined) {
    if (request.method === "POST") {
      order.paid = true;
      response.writeHead(303, { Location: order.successUrl }).end();
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
<title>Mercado Pago (simulado)</title>
<h1>Mercado Pago (simulado)</h1>
<p>Total: S/ ${order.totalAmount}</p>
<form method="post"><button>Pagar</button></form>
<a href="${order.failureUrl}">Volver a la tienda</a>`);
    return;
  }

  response.writeHead(404).end();
}).listen(PORT);
