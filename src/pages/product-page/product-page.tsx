import { useState } from "react";
import { useParams } from "react-router";
import { useCart } from "../../providers/cart-provider";
import {
  Button,
  Container,
  MessageScreen,
  Separator,
  Spinner,
} from "../../components/ui";
import { useDocumentTitle, useFetch } from "../../hooks";
import { ApiError } from "../../lib/api-error";
import { getProduct } from "../../services";
import NotFoundPage from "../not-found-page";
import styles from "./styles.module.css";
import { formatPrice } from "../../lib/format-price";

export default function ProductPage() {
  const { slug } = useParams();
  const { status: cartStatus, addItem } = useCart();

  const {
    data: product,
    error,
    status,
  } = useFetch(() => getProduct(slug!), [slug]);

  useDocumentTitle(product?.title ?? "Cargando...");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function handleAddToCart() {
    if (product === null) return;

    setAddError(null);
    setIsAdding(true);
    try {
      await addItem(product.id);
    } catch (error) {
      console.error(error);
      setAddError("No pudimos agregar el producto. Intenta de nuevo.");
    } finally {
      setIsAdding(false);
    }
  }

  if (status === "error") {
    // El producto no existe: eso no es un fallo, es una URL equivocada.
    if (error instanceof ApiError && error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar este producto."
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

  return (
    <section className={styles["product"]}>
      <Container className={styles["product__container"]}>
        <div className={styles["product__image"]}>
          <img
            src={product.imgSrc}
            alt={product.title}
            className={styles["product__image-content"]}
          />
        </div>
        <div className={styles["product__info"]}>
          <h1 className={styles["product__title"]}>{product.title}</h1>
          <p className={styles["product__price"]}>
            {formatPrice(product.price)}
          </p>
          <p className={styles["product__description"]}>
            {product.description}
          </p>
          <Button
            type="button"
            size="xl"
            className={styles["product__button"]}
            onClick={handleAddToCart}
            disabled={isAdding || cartStatus !== "success"}
          >
            {isAdding ? "Agregando..." : "Agregar al Carrito"}
          </Button>
          {cartStatus === "error" && (
            <p className={styles["product__error"]} role="status">
              No pudimos cargar tu carrito. Recarga la página para agregar
              productos.
            </p>
          )}
          {addError && (
            <p className={styles["product__error"]} role="alert">
              {addError}
            </p>
          )}
          <Separator className={styles["product__separator"]} />
          <div className={styles["product__features"]}>
            <h2 className={styles["product__features-title"]}>
              Características
            </h2>
            <ul className={styles["product__features-list"]}>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
