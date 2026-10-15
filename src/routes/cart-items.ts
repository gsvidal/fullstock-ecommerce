import { data, redirect, type ActionFunctionArgs } from "react-router";
import { logError } from "../lib/log-error";
import { commitSession, getSession } from "../lib/session.server";
import { getCart, createCart } from "../services/cart.service";
import {
  addProductToCart,
  updateCartItemQuantity,
  deleteCartItem,
} from "../services/cart-item.service";
import {
  createCartItemBodySchema,
  updateCartItemBodySchema,
  removeCartItemBodySchema,
} from "../schemas/cart-item";
import { requireCart } from "../guards/cart.guard";
import { readFormData } from "../lib/read-form-data";
import { getProductById } from "../services/product.service";
import * as z from "zod";

const ADD_ERROR = "No pudimos agregar el producto. Intenta de nuevo.";
const UPDATE_ERROR = "No pudimos actualizar el carrito. Intenta de nuevo.";

export function loader() {
  return redirect("/cart");
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await readFormData(request);

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

        // obtener el producto por su Id
        // si no existe, manejar el error apropiadamente (retornar)
        const product = await getProductById(productId);
        if (product === null) {
          return data({ error: ADD_ERROR }, { status: 404 });
        }

        const existingCart =
          initialCartId === undefined ? null : await getCart(initialCartId);

        const cart = existingCart ?? (await createCart(session.get("userId")));

        if (existingCart === null) session.set("cartId", cart.id);

        await addProductToCart(cart.id, {
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

        const item = await updateCartItemQuantity(cart.id, itemId, quantity);

        if (item === null) throw redirect("/cart");

        return data(null);
      }

      case "remove": {
        const cart = await requireCart(session);
        const { itemId } = removeCartItemBodySchema.parse(
          Object.fromEntries(formData),
        );

        const removed = await deleteCartItem(cart.id, itemId);

        if (!removed) throw redirect("/cart");

        return data(null);
      }

      default:
        return data({ error: UPDATE_ERROR }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Response) throw error;

    const message = intent === "add" ? ADD_ERROR : UPDATE_ERROR;

    if (error instanceof z.ZodError) {
      return data({ error: message }, { status: 400 });
    }

    logError(error);

    return data(
      { error: message },
      { headers: await sessionHeaders(), status: 500 },
    );
  }
}
