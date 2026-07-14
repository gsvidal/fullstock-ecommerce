import { useEffect, useState, type ReactNode } from "react";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../services";
import type { Cart, Status } from "../../types";
import { useAuth } from "../auth-provider";
import { CartContext } from "./cart-context";

type CartProviderProps = {
  children: ReactNode;
};

export default function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const { user } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    let ignore = false;

    async function runEffect() {
      try {
        const cart = await getCart();
        if (ignore) return;
        setCart(cart);
        setStatus("success");
      } catch (error) {
        if (ignore) return;
        console.error(error);
        setStatus("error");
      }
    }

    runEffect();

    return () => {
      ignore = true;
    };
  }, [userId]);

  async function refresh() {
    setCart(await getCart());
  }

  async function addItem(productId: number) {
    const existingItem = cart?.items.find(
      (item) => item.product.id === productId,
    );

    if (existingItem) {
      await updateCartItem(existingItem.id, existingItem.quantity + 1);
    } else {
      await addCartItem(productId, 1);
    }

    await refresh();
  }

  async function updateItem(itemId: number, quantity: number) {
    await updateCartItem(itemId, quantity);
    await refresh();
  }

  async function removeItem(itemId: number) {
    await removeCartItem(itemId);
    await refresh();
  }

  return (
    <CartContext.Provider
      value={{ cart, status, addItem, updateItem, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}
