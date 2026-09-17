import { getHydratedCart } from "../services/cart.service";
import { getUserById } from "../services/user.service";
import type { AppSession } from "./session.server";

export async function getUserFromSession(session: AppSession) {
  const userId = session.get("userId");

  if (userId === undefined) {
    return { user: null, sessionChanged: false };
  }

  const user = await getUserById(userId);

  if (user === null) {
    session.unset("userId");
    return { user: null, sessionChanged: true };
  }

  return { user, sessionChanged: false };
}

export async function getCartFromSession(session: AppSession) {
  const cartId = session.get("cartId");

  if (cartId === undefined) {
    return { cart: null, sessionChanged: false };
  }

  const cart = await getHydratedCart(cartId);

  if (cart === null) {
    session.unset("cartId");
    return { cart: null, sessionChanged: true };
  }

  return { cart, sessionChanged: false };
}
