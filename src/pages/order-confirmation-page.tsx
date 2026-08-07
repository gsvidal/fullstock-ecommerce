import { Navigate, useSearchParams } from "react-router";
import {
  Button,
  Container,
  MessageScreen,
  Section,
  Spinner,
} from "../components/ui";
import { useDocumentTitle, useFetch } from "../hooks";
import { getOrder } from "../services";
import { celebrate } from "../lib/confetti-celebration";
import { useEffect } from "react";

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("orderId"));
  useDocumentTitle("Orden confirmada");

  // Si el orderId no es válido, no pedimos nada (el guard de abajo redirige).
  const { data: order, status } = useFetch(
    async () => (orderId ? getOrder(orderId) : null),
    [orderId],
  );

  useEffect(() => {
    if (!orderId || status !== "success") return;

    const clearConfettiInterval = celebrate();

    return clearConfettiInterval;
  }, [orderId, status]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  if (status === "error") {
    return (
      <MessageScreen
        title="No encontramos tu orden"
        description="El número de orden no corresponde a ninguna compra."
      >
        <Button href="/" size="lg">
          Volver al Inicio
        </Button>
      </MessageScreen>
    );
  }

  if (status === "loading" || order === null) {
    return <Spinner />;
  }

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
