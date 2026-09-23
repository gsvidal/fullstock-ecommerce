import { redirect, data, type LoaderFunctionArgs } from "react-router";
import { Container, Section } from "../components/ui";
import { getOrderById } from "../services/order.service";
import { celebrate } from "../lib/confetti-celebration";
import { useEffect } from "react";
import { idSchema } from "../schemas/shared";
import { getSession } from "../lib/session.server";
import { pageTitle } from "../lib/page-meta";
import type { Route } from "./+types/order-confirmation-page";

export async function loader({ url, request }: LoaderFunctionArgs) {
  const { success, data: orderId } = idSchema.safeParse(
    url.searchParams.get("orderId"),
  );

  if (success === false) {
    return redirect("/");
  }

  const order = await getOrderById(orderId);

  if (order === null) {
    throw data("Orden no encontrada", { status: 404 });
  }

  const session = await getSession(request);
  const userId = session.get("userId");
  const isOwner = order.userId !== null && order.userId === userId;
  const isJustCreated = session.get("lastOrderId") === orderId;

  if (!isOwner && !isJustCreated) {
    throw data("Orden no encontrada", { status: 404 });
  }

  return { order };
}

export function meta() {
  return [pageTitle("Orden confirmada")];
}

export default function OrderConfirmationPage({
  loaderData,
}: Route.ComponentProps) {
  const { order } = loaderData;

  useEffect(() => celebrate(), []);

  return (
    <Section>
      <Container>
        <h1 className="mb-2 text-base font-medium text-accent-foreground">
          ¡Muchas gracias por tu compra!
        </h1>
        <p className="mb-2 text-4xl leading-none font-bold">
          Tu orden está en camino
        </p>
        <p className="mb-12 text-muted-foreground">
          Llegaremos a la puerta de tu domicilio lo antes posible
        </p>
        <p className="mb-2 text-sm font-medium">Número de orden</p>
        <p className="text-sm font-medium text-accent-foreground">{order.id}</p>
      </Container>
    </Section>
  );
}
