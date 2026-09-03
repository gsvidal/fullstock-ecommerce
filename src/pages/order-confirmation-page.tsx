import {
  redirect,
  useLoaderData,
  data,
  type LoaderFunctionArgs,
} from "react-router";
import { Container, Section } from "../components/ui";
import { getOrder } from "../services";
import { celebrate } from "../lib/confetti-celebration";
import { ApiError } from "../lib/api-error";
import { useEffect } from "react";
import { idSchema } from "../schemas/shared";
import { apiCookies } from "../lib/api-cookies";
import { pageTitle } from "../lib/page-meta";

export async function loader({ url, request }: LoaderFunctionArgs) {
  const { success, data: orderId } = idSchema.safeParse(
    url.searchParams.get("orderId"),
  );

  if (success === false) {
    return redirect("/");
  }

  try {
    const cookies = apiCookies(request);
    const order = await getOrder(orderId, cookies);
    return { order };
  } catch (error) {
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }
    throw error;
  }
}

export function meta() {
  return [pageTitle("Orden confirmada")];
}

export default function OrderConfirmationPage() {
  const { order } = useLoaderData<typeof loader>();

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
