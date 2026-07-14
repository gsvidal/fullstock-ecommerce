import { useState } from "react";
import { useCart } from "../../providers/cart-provider";
import type { CartItem as CartItemType } from "../../types";
import { Button } from "../ui";
import styles from "./styles.module.css";
import { formatPrice } from "../../lib/format-price";
import { MinusIcon, PlusIcon, TrashIcon } from "../ui/icons";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cualquier acción sobre este item deshabilita sus tres botones mientras
  // está en vuelo: evita dobles clics y carreras entre operaciones.
  async function runAction(action: () => Promise<void>) {
    setError(null); // limpia un error previo antes de reintentar
    setIsPending(true);
    try {
      await action();
    } catch (error) {
      console.error(error);
      setError("No pudimos actualizar el carrito. Intenta de nuevo.");
    } finally {
      setIsPending(false);
    }
  }

  function handleIncrement() {
    runAction(() => updateItem(item.id, item.quantity + 1));
  }

  function handleDecrement() {
    // Reducir por debajo de 1 equivale a quitar el item del carrito.
    if (item.quantity === 1) {
      runAction(() => removeItem(item.id));
    } else {
      runAction(() => updateItem(item.id, item.quantity - 1));
    }
  }

  function handleRemove() {
    runAction(() => removeItem(item.id));
  }

  return (
    <div className={styles["cart__item"]}>
      <div className={styles["cart__item-image"]}>
        <img
          src={item.product.imgSrc}
          alt={item.product.title}
          className={styles["cart__item-image-content"]}
        />
      </div>
      <div className={styles["cart__item-details"]}>
        <div className={styles["cart__item-header"]}>
          <h2 className={styles["cart__item-title"]}>{item.product.title}</h2>
          <Button
            type="button"
            variant="outline"
            size="sm-icon"
            aria-label="Eliminar artículo"
            onClick={handleRemove}
            disabled={isPending}
          >
            <TrashIcon className={styles["cart__item-icon"]} />
          </Button>
        </div>
        <div className={styles["cart__item-footer"]}>
          <p className={styles["cart__item-price"]}>
            {formatPrice(item.product.price)}
          </p>
          <div className={styles["cart__item-quantity"]}>
            <Button
              type="button"
              variant="outline"
              size="sm-icon"
              aria-label={
                item.quantity === 1 ? "Eliminar artículo" : "Reducir cantidad"
              }
              onClick={handleDecrement}
              disabled={isPending}
            >
              <MinusIcon className={styles["cart__item-icon"]} />
            </Button>
            <span className={styles["cart__item-quantity-display"]}>
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm-icon"
              aria-label="Aumentar cantidad"
              onClick={handleIncrement}
              disabled={isPending}
            >
              <PlusIcon className={styles["cart__item-icon"]} />
            </Button>
          </div>
        </div>
        {error && (
          <p className={styles["cart__item-error"]} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
