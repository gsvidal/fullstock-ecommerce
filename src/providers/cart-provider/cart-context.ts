import { createContext } from "react";
import type { Cart, Status } from "../../types";

export type CartContextValue = {
  cart: Cart | null;
  status: Status;
  addItem: (productId: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);
