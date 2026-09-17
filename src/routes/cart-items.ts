import { data, redirect, type ActionFunctionArgs } from "react-router";
import { logError } from "../lib/log-error";
import {
  commitSession,
  getSession,
  type AppSession,
} from "../lib/session.server";
import * as cartService from "../services/cart.service";
import * as cartItemService from "../services/cart-item.service";
import {
  createCartItemBodySchema,
  updateCartItemBodySchema,
  removeCartItemBodySchema,
} from "../schemas/cart-item";

const ADD_ERROR = "No pudimos agregar el producto. Intenta de nuevo.";
const UPDATE_ERROR = "No pudimos actualizar el carrito. Intenta de nuevo.";

export function loader() {
  return redirect("/cart");
}

async function requireCart(session: AppSession) {
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const session = await getSession(request);
  const initialCartId = session.get("cartId");

  async function sessionHeaders() {
    if (session.get("cartId") === initialCartId) return undefined;

    return { "Set-Cookie": await commitSession(session) };
  }

  try {
    switch (intent) {
      case "add": {
        const { productId, quantity } = createCartItemBodySchema.parse(
          Object.fromEntries(formData),
        );

        const existingCart =
          initialCartId === undefined
            ? null
            : await cartService.getCart(initialCartId);

        const cart =
          existingCart ?? (await cartService.createCart(session.get("userId")));

        if (existingCart === null) session.set("cartId", cart.id);

        await cartItemService.addProductToCart(cart.id, {
          productId,
          quantity,
        });

        return data(null, { headers: await sessionHeaders() });
      }

      case "update": {
        const cart = await requireCart(session);
        const { itemId, quantity } = updateCartItemBodySchema.parse(
          Object.fromEntries(formData),
        );

        const item = await cartItemService.updateCartItemQuantity(
          cart.id,
          itemId,
          quantity,
        );

        if (item === null) throw redirect("/cart");

        return data(null);
      }

      case "remove": {
        const cart = await requireCart(session);
        const { itemId } = removeCartItemBodySchema.parse(
          Object.fromEntries(formData),
        );

        const removed = await cartItemService.deleteCartItem(cart.id, itemId);

        if (!removed) throw redirect("/cart");

        return data(null);
      }

      default:
        logError(new Error(`Intent desconocido: ${String(intent)}`));

        return data({ error: UPDATE_ERROR });
    }
  } catch (error) {
    if (error instanceof Response) throw error;

    logError(error);

    return data(
      { error: intent === "add" ? ADD_ERROR : UPDATE_ERROR },
      { headers: await sessionHeaders() },
    );
  }
}
