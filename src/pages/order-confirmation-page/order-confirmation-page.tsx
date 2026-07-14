import { Navigate, useSearchParams } from "react-router";
import {
  Button,
  Container,
  MessageScreen,
  Section,
  Spinner,
} from "../../components/ui";
import { useDocumentTitle, useFetch } from "../../hooks";
import { getOrder } from "../../services";
import styles from "./styles.module.css";

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("orderId"));
  useDocumentTitle("Orden confirmada");

  // Si el orderId no es válido, no pedimos nada (el guard de abajo redirige).
  const { data: order, status } = useFetch(
    async () => (orderId ? getOrder(orderId) : null),
    [orderId],
  );

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
    <Section className={styles["order-confirmation"]}>
      <Container>
        <h1 className={styles["order-confirmation__title"]}>
          ¡Muchas gracias por tu compra!
        </h1>
        <p className={styles["order-confirmation__heading"]}>
          Tu orden está en camino
        </p>
        <p className={styles["order-confirmation__description"]}>
          Llegaremos a la puerta de tu domicilio lo antes posible
        </p>
        <p className={styles["order-confirmation__tracking-label"]}>
          Número de orden
        </p>
        <p className={styles["order-confirmation__tracking-code"]}>
          {order.id}
        </p>
      </Container>
    </Section>
  );
}
