import type { ActionFunctionArgs } from "react-router";
import { ApiError } from "./api-error";
import { logError } from "./log-error";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services";

const ADD_ERROR = "No pudimos agregar el producto. Intenta de nuevo.";
const UPDATE_ERROR = "No pudimos actualizar el carrito. Intenta de nuevo.";

async function addItem(formData: FormData) {
  const productId = Number(formData.get("productId"));

  const cart = await getCart();
  const existingItem = cart?.items.find(
    (item) => item.product.id === productId,
  );

  if (existingItem) {
    await updateCartItem(existingItem.id, existingItem.quantity + 1);
    return null;
  }

  try {
    await addCartItem(productId, 1);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 409) throw error;

    const latestCart = await getCart();
    const item = latestCart?.items.find(
      (item) => item.product.id === productId,
    );
    if (!item) throw error;
    await updateCartItem(item.id, item.quantity + 1);
  }

  return null;
}

async function updateItem(formData: FormData) {
  const itemId = Number(formData.get("itemId"));
  const quantity = Number(formData.get("quantity"));

  await updateCartItem(itemId, quantity);
  return null;
}

async function removeItem(formData: FormData) {
  const itemId = Number(formData.get("itemId"));

  await removeCartItem(itemId);
  return null;
}

export async function cartItemsAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "add":
        return await addItem(formData);
      case "update":
        return await updateItem(formData);
      case "remove":
        return await removeItem(formData);
      default:
        return { error: UPDATE_ERROR };
    }
  } catch (error) {
    logError(error);
    return { error: intent === "add" ? ADD_ERROR : UPDATE_ERROR };
  }
}
