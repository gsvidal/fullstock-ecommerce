import { useCart } from "../../providers/cart-provider";
import ThemeToggler from "../theme-toggler";
import { Button } from "../ui";
import styles from "./styles.module.css";
import { CartIcon } from "../ui/icons";

export default function HeaderActions() {
  const { cart } = useCart();
  const cartItemsCount = cart?.totalQuantity ?? 0;

  return (
    <div className={styles["headerActions"]}>
      <ThemeToggler />
      <Button
        href="/cart"
        variant="ghost"
        size="xl-icon"
        className={styles["header-actions__cart"]}
        aria-label="Carrito de compras"
      >
        <CartIcon className={styles["header-actions__cart-icon"]} />
        {cartItemsCount > 0 && (
          <span className={styles["header-actions__cart-badge"]}>
            {cartItemsCount}
          </span>
        )}
      </Button>
    </div>
  );
}
