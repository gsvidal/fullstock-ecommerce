import type { ActionFunctionArgs } from "react-router";
import { isValidWebhookSignature } from "../lib/mercadopago.server";
import { syncPayment } from "../services/payments.service";

// Mercado Pago avisa acá cada vez que cambia una orden. El aviso no dice cómo
// quedó el pago con autoridad: solo dice "andá a preguntar por esta orden".
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const dataId = url.searchParams.get("data.id");

  // Otros avisos (órdenes comerciales, por ejemplo) no nos interesan. Se
  // responde 200 igual: si no, Mercado Pago los reintenta.
  if (type !== "order" || dataId === null) {
    return new Response(null, { status: 200 });
  }

  const isValid = isValidWebhookSignature({
    signature: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId,
  });

  if (!isValid) {
    return new Response("Firma inválida", { status: 401 });
  }

  // Si esto falla (Mercado Pago no responde, la base se cayó), el error sube,
  // `handleError` lo reporta, la respuesta es un 500 y Mercado Pago reintenta.
  await syncPayment(dataId);

  return new Response(null, { status: 200 });
}
