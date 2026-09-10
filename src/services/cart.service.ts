import * as db from "../db/index.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";

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
