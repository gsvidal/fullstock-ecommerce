import { useState } from "react";
import { useCart } from "../providers/cart-provider";
import type { CartItem as CartItemType } from "../types";
import { Button } from "./ui";
import { formatPrice } from "../lib/format-price";
import { MinusIcon, PlusIcon, TrashIcon } from "./ui/icons";

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
    <div className="flex gap-6 border-b border-b-border p-6">
      <div className="w-20 rounded-xl bg-muted-background">
        <img
          src={item.product.imgSrc}
          alt={item.product.title}
          className="aspect-2/3 w-full object-contain"
        />
      </div>
      <div className="flex grow flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm">{item.product.title}</h2>
          <Button
            type="button"
            variant="outline"
            size="sm-icon"
            aria-label="Eliminar artículo"
            onClick={handleRemove}
            disabled={isPending}
          >
            <TrashIcon />
          </Button>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium">
            {formatPrice(item.product.price)}
          </p>
          <div className="flex items-center gap-4">
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
              <MinusIcon />
            </Button>
            <span className="flex size-8 items-center justify-center rounded-md border border-border px-4 py-2">
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
              <PlusIcon />
            </Button>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
