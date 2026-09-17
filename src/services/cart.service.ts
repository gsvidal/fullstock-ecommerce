import * as db from "../db/index.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import type { Cart } from "../repositories/cart.repository.ts";
import * as cartItemService from "./cart-item.service.ts";
import type { HydratedCartItem } from "./cart-item.service.ts";

export type { HydratedCartItem };

export interface HydratedCart {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  items: HydratedCartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export async function createCart(userId?: number): Promise<Cart> {
  return cartRepository.create(userId);
}

export async function getCart(id: number): Promise<Cart | null> {
  return cartRepository.findById(id);
}

export async function getHydratedCart(
  id: number,
): Promise<HydratedCart | null> {
  const cart = await cartRepository.findById(id);

  if (cart === null) return null;

  const items = await cartItemService.getHydratedItemsByCartId(id);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return { ...cart, items, totalQuantity, totalPrice };
}

export async function resolveCartId(
  visitorCartId: number | undefined,
  userId: number,
): Promise<number | undefined> {
  const userCart = await cartRepository.findByUserId(userId);

  if (visitorCartId === undefined) {
    return userCart?.id;
  }

  if (userCart === null) {
    await cartRepository.linkToUser(visitorCartId, userId);
    return visitorCartId;
  }

  await mergeVisitorCartIntoUserCart(visitorCartId, userCart.id);
  return userCart.id;
}

async function mergeVisitorCartIntoUserCart(
  visitorCartId: number,
  userCartId: number,
): Promise<void> {
  await db.withTransaction(async (client) => {
    const visitorItems = await cartItemRepository.getByCartId(
      visitorCartId,
      client,
    );

    for (const visitorItem of visitorItems) {
      const existingItem = await cartItemRepository.findByCartAndProduct(
        userCartId,
        visitorItem.productId,
        client,
      );

      if (existingItem === null) {
        await cartItemRepository.moveToCart(visitorItem.id, userCartId, client);
      } else {
        await cartItemRepository.updateQuantity(
          existingItem.id,
          existingItem.quantity + visitorItem.quantity,
          client,
        );
      }
    }

    await cartRepository.remove(visitorCartId, client);
  });
}
