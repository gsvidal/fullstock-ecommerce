import { useCart } from "../providers/cart-provider";
import ThemeToggler from "./theme-toggler";
import { Button } from "./ui";
import { CartIcon } from "./ui/icons";

export default function HeaderActions() {
  const { cart } = useCart();
  const cartItemsCount = cart?.totalQuantity ?? 0;

  return (
    <div className="flex items-center gap-2">
      <ThemeToggler />
      <Button
        href="/cart"
        variant="ghost"
        size="xl-icon"
        className="relative"
        aria-label="Carrito de compras"
      >
        <CartIcon />
        {cartItemsCount > 0 && (
          <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-primary-background text-xs text-primary-foreground">
            {cartItemsCount}
          </span>
        )}
      </Button>
    </div>
  );
}
