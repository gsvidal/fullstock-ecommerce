import { redirect } from "react-router";
import * as cartService from "../services/cart.service";
import { commitSession, type AppSession } from "../lib/session.server";

export async function requireCart(session: AppSession) {
  const cartId = session.get("cartId");
  const cart = cartId === undefined ? null : await cartService.getCart(cartId);

  if (cart === null) {
    session.unset("cartId");

    throw redirect("/cart", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  return cart;
}
