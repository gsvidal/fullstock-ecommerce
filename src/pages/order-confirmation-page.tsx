import {
  redirect,
  data,
  type LoaderFunctionArgs,
  Form,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { Button, Container, Section } from "../components/ui";
import { getOrderById } from "../services/order.service";
import { celebrate } from "../lib/confetti-celebration";
import { useEffect } from "react";
import { idSchema } from "../schemas/shared";
import { getSession } from "../lib/session.server";
import { pageTitle } from "../lib/page-meta";
import type { Route } from "./+types/order-confirmation-page";
import { logError } from "../lib/log-error";
import { startPayment, syncPayment } from "../services/payments.service";

async function getOwnOrder(url: URL, request: Request) {
  const { success, data: orderId } = idSchema.safeParse(
    url.searchParams.get("orderId"),
  );

  if (success === false) {
    throw redirect("/");
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

  return order;
}

export async function loader({ url, request }: LoaderFunctionArgs) {
  const order = await getOwnOrder(url, request);

  if (order.status === "pending" && order.mercadopagoOrderId !== null) {
    try {
      if (await syncPayment(order.mercadopagoOrderId)) {
        return { order: await getOwnOrder(url, request) };
      }
    } catch (error) {
      // Sin respuesta de Mercado Pago, la orden se muestra como está.
      logError(error);
    }
  }

  return { order };
}

export async function action({ url, request }: ActionFunctionArgs) {
  const order = await getOwnOrder(url, request);

  if (order.status !== "pending") {
    return redirect(`/order-confirmation?orderId=${order.id}`);
  }

  return redirect(await startPayment(order.id));
}

export function meta() {
  return [pageTitle("Orden confirmada")];
}

export default function OrderConfirmationPage({
  loaderData,
}: Route.ComponentProps) {
  const { order } = loaderData;
  const navigation = useNavigation();
  const isPaid = order.status === "paid";

  useEffect(() => {
    if (isPaid) return celebrate();
  }, [isPaid]);

  return (
    <Section>
      <Container>
        {isPaid ? (
          <>
            <h1 className="mb-2 text-base font-medium text-accent-foreground">
              ¡Muchas gracias por tu compra!
            </h1>
            <p className="mb-2 text-4xl leading-none font-bold">
              Tu orden está en camino
            </p>
            <p className="mb-12 text-muted-foreground">
              Llegaremos a la puerta de tu domicilio lo antes posible
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-base font-medium text-accent-foreground">
              Tu orden está reservada
            </h1>
            <p className="mb-2 text-4xl leading-none font-bold">
              Falta el pago
            </p>
            <p className="mb-6 text-muted-foreground">
              Si ya pagaste, la confirmación puede tardar unos segundos: recarga
              la página.
            </p>
            <Form method="post" className="mb-12">
              <Button
                size="lg"
                type="submit"
                disabled={navigation.state !== "idle"}
              >
                Pagar
              </Button>
            </Form>
          </>
        )}
        <p className="mb-2 text-sm font-medium">Número de orden</p>
        <p className="text-sm font-medium text-accent-foreground">{order.id}</p>
      </Container>
    </Section>
  );
}
