// import { createHmac, timingSafeEqual } from "node:crypto";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../env.server.ts";

// Lo que usamos de una orden de Mercado Pago. La respuesta trae mucho más.
export type MercadoPagoOrder = {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  total_amount: string;
  total_paid_amount?: string;
  checkout_url?: string;
};

export type CheckoutRequest = {
  orderId: number;
  items: { title: string; price: number; quantity: number }[];
  total: number;
};

// La base guarda céntimos (1599); Mercado Pago espera soles, como texto ("15.99").
export function toSoles(cents: number): string {
  return (cents / 100).toFixed(2);
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env.MP_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Mercado Pago respondió ${response.status}: ${await response.text()}`,
    );
  }

  return (await response.json()) as MercadoPagoOrder;
}

// Crea la orden de pago en Mercado Pago. La persona paga en `checkout_url`, en
// la página de Mercado Pago, y vuelve a la confirmación de nuestra orden.
export async function createOrder(
  checkout: CheckoutRequest,
): Promise<MercadoPagoOrder> {
  const returnUrl = `${env.APP_URL}/order-confirmation?orderId=${checkout.orderId}`;

  return request("/v1/orders", {
    method: "POST",
    headers: {
      // Si este pedido se repite (un reintento, un doble clic), Mercado Pago
      // devuelve la orden que ya creó en vez de crear otra.
      "X-Idempotency-Key": `fullstock-order-${checkout.orderId}`,
    },
    body: JSON.stringify({
      type: "online",
      processing_mode: "manual",
      total_amount: toSoles(checkout.total),
      currency: "PEN",
      external_reference: String(checkout.orderId),
      items: checkout.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: toSoles(item.price),
      })),
      config: {
        online: {
          success_url: returnUrl,
          failure_url: returnUrl,
          pending_url: returnUrl,
          auto_return: "approved",
        },
      },
    }),
  });
}

export async function getOrder(id: string): Promise<MercadoPagoOrder> {
  return request(`/v1/orders/${encodeURIComponent(id)}`);
}

export type WebhookSignature = {
  signature: string | null;
  requestId: string | null;
  dataId: string;
};

export function isValidWebhookSignature({
  signature,
  requestId,
  dataId,
}: WebhookSignature): boolean {
  if (signature === null || requestId === null) return false;

  // "ts=1792107851,v1=47c2d2…" → { ts: "1792107851", v1: "47c2d2…" }
  const parts = Object.fromEntries(
    signature.split(",").map((part) => part.trim().split("=")),
  );
  const { ts, v1 } = parts;
  if (ts === undefined || v1 === undefined) return false;

  // El id va en minúsculas: así lo firma Mercado Pago.
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  // Compara sin cortar en el primer carácter distinto: así el tiempo de la
  // respuesta no le dice a nadie cuántos caracteres acertó.
  return (
    v1.length === expected.length &&
    timingSafeEqual(Buffer.from(v1), Buffer.from(expected))
  );
}
