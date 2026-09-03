import { data, redirect } from "react-router";

export function loader() {
  return redirect("/cart");
}

import type { ActionFunctionArgs } from "react-router";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services";
import { ApiError } from "../lib/api-error";
import { logError } from "../lib/log-error";
import {
  apiCookies,
  setCookieHeaders,
  type ApiCookies,
} from "../lib/api-cookies";

const ADD_ERROR = "No pudimos agregar el producto. Intenta de nuevo.";
const UPDATE_ERROR = "No pudimos actualizar el carrito. Intenta de nuevo.";

async function addItem(formData: FormData, cookies: ApiCookies) {
  const productId = Number(formData.get("productId"));

  const cart = await getCart(cookies);
  const existingItem = cart?.items.find(
    (item) => item.product.id === productId,
  );

  if (existingItem) {
    await updateCartItem(existingItem.id, existingItem.quantity + 1, cookies);
    return null;
  }

  try {
    await addCartItem(productId, 1, cookies);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 409) throw error;

    const latestCart = await getCart(cookies);
    const item = latestCart?.items.find(
      (item) => item.product.id === productId,
    );
    if (!item) throw error;
    await updateCartItem(item.id, item.quantity + 1, cookies);
  }

  return null;
}

async function updateItem(formData: FormData, cookies: ApiCookies) {
  const itemId = Number(formData.get("itemId"));
  const quantity = Number(formData.get("quantity"));

  await updateCartItem(itemId, quantity, cookies);
  return null;
}

async function removeItem(formData: FormData, cookies: ApiCookies) {
  const itemId = Number(formData.get("itemId"));

  await removeCartItem(itemId, cookies);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookies = apiCookies(request);

  try {
    switch (intent) {
      case "add":
        return data(await addItem(formData, cookies), {
          headers: setCookieHeaders(cookies),
        });
      case "update":
        return data(await updateItem(formData, cookies), {
          headers: setCookieHeaders(cookies),
        });
      case "remove":
        return data(await removeItem(formData, cookies), {
          headers: setCookieHeaders(cookies),
        });
      default:
        return data(
          { error: UPDATE_ERROR },
          {
            headers: setCookieHeaders(cookies),
          },
        );
    }
  } catch (error) {
    logError(error);
    return data(
      { error: intent === "add" ? ADD_ERROR : UPDATE_ERROR },
      {
        headers: setCookieHeaders(cookies),
      },
    );
  }
}
