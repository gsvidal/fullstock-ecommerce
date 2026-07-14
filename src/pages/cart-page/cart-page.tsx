import { useCart } from "../../providers/cart-provider";
import CartItem from "../../components/cart-item";
import {
  Button,
  Container,
  MessageScreen,
  Section,
  Spinner,
} from "../../components/ui";
import styles from "./styles.module.css";
import { formatPrice } from "../../lib/format-price";
import { useDocumentTitle } from "../../hooks";

export default function CartPage() {
  const { cart, status } = useCart();
  useDocumentTitle("Carrito");

  if (status === "error") {
    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar tu carrito."
      >
        <Button size="lg" onClick={() => window.location.reload()}>
          Recargar la página
        </Button>
      </MessageScreen>
    );
  }

  if (status === "loading") {
    return <Spinner />;
  }

  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  return (
    <Section>
      <Container>
        <div className={styles["cart"]}>
          <h1 className={styles["cart__title"]}>Carrito de compras</h1>
          <div className={styles["cart__container"]}>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <div className={styles["cart__total"]}>
              <p>Total</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            <div className={styles["cart__action"]}>
              {items.length === 0 ? (
                <Button
                  href="/"
                  size="lg"
                  className={styles["cart__action-button"]}
                >
                  Ir a la tienda
                </Button>
              ) : (
                <Button
                  href="/checkout"
                  size="lg"
                  className={styles["cart__action-button"]}
                >
                  Continuar Compra
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
