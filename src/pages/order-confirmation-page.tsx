import {
  redirect,
  useLoaderData,
  data,
  type LoaderFunctionArgs,
} from "react-router";
import { Container, Section } from "../components/ui";
import { useDocumentTitle } from "../hooks";
import { getOrder } from "../services";
import { celebrate } from "../lib/confetti-celebration";
import { ApiError } from "../lib/api-error";
import { useEffect } from "react";
import { idSchema } from "../schemas/shared";

export async function loader({ url }: LoaderFunctionArgs) {
  const { success, data: orderId } = idSchema.safeParse(
    url.searchParams.get("orderId"),
  );

  if (success === false) {
    return redirect("/");
  }

  try {
    const order = await getOrder(orderId);
    return { order };
  } catch (error) {
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }
    throw error;
  }
}

export default function OrderConfirmationPage() {
  const { order } = useLoaderData<typeof loader>();
  useDocumentTitle("Orden confirmada");

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
