import type { CartItem as CartItemType } from "../types";
import { Button } from "./ui";
import { formatPrice } from "../lib/format-price";
import { MinusIcon, PlusIcon, TrashIcon } from "./ui/icons";
import { useFetcher } from "react-router";
import type { cartItemsAction } from "../lib/cart-items-action";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const fetcher = useFetcher<typeof cartItemsAction>();

  const isPending = fetcher.state !== "idle";
  const error = isPending ? undefined : fetcher.data?.error;

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
          <fetcher.Form method="post" action="/cart/items">
            <input type="hidden" name="intent" value="remove" />
            <input type="hidden" name="itemId" value={item.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm-icon"
              aria-label="Eliminar artículo"
              disabled={isPending}
            >
              <TrashIcon />
            </Button>
          </fetcher.Form>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium">
            {formatPrice(item.product.price)}
          </p>
          <div className="flex items-center gap-4">
            <fetcher.Form method="post" action="/cart/items">
              <input type="hidden" name="itemId" value={item.id} />
              {item.quantity === 1 ? (
                <input type="hidden" name="intent" value="remove" />
              ) : (
                <>
                  <input type="hidden" name="intent" value="update" />
                  <input
                    type="hidden"
                    name="quantity"
                    value={item.quantity - 1}
                  />
                </>
              )}
              <Button
                type="submit"
                variant="outline"
                size="sm-icon"
                aria-label={
                  item.quantity === 1 ? "Eliminar artículo" : "Reducir cantidad"
                }
                disabled={isPending}
              >
                <MinusIcon />
              </Button>
            </fetcher.Form>
            <span className="flex size-8 items-center justify-center rounded-md border border-border px-4 py-2">
              {item.quantity}
            </span>
            <fetcher.Form method="post" action="/cart/items">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="itemId" value={item.id} />
              <input type="hidden" name="quantity" value={item.quantity + 1} />
              <Button
                type="submit"
                variant="outline"
                size="sm-icon"
                aria-label="Aumentar cantidad"
                disabled={isPending}
              >
                <PlusIcon />
              </Button>
            </fetcher.Form>
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
