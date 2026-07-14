import { useContext } from "react";
import { CartContext } from "./cart-context";

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
}
