import * as cartItemRepository from "../repositories/cart-item.repository";
import type { CartItem } from "../repositories/cart-item.repository";
import * as cartRepository from "../repositories/cart.repository";
import type { CreateCartItemBody } from "../schemas/cart-item";

export interface HydratedCartItem {
  id: number;
  quantity: number;
  lineTotal: number;
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    imgSrc: string;
  };
}

export async function getHydratedItemsByCartId(
  cartId: number,
): Promise<HydratedCartItem[]> {
  const rows = await cartItemRepository.getItemsWithProductByCartId(cartId);

  return rows.map((row) => ({
    id: row.id,
    quantity: row.quantity,
    lineTotal: row.quantity * row.price,
    product: {
      id: row.productId,
      title: row.title,
      slug: row.slug,
      price: row.price,
      imgSrc: row.imgSrc,
    },
  }));
}

export async function addProductToCart(
  cartId: number,
  { productId, quantity }: CreateCartItemBody,
): Promise<CartItem> {
  const existing = await cartItemRepository.findByCartAndProduct(
    cartId,
    productId,
  );

  const item =
    existing === null
      ? await cartItemRepository.create({ cartId, productId, quantity })
      : await cartItemRepository.updateQuantity(
          existing.id,
          existing.quantity + quantity,
        );

  await cartRepository.touch(cartId);

  return item;
}

export async function updateCartItemQuantity(
  cartId: number,
  id: number,
  quantity: number,
): Promise<CartItem | null> {
  const item = await cartItemRepository.findById(id);

  if (item === null || item.cartId !== cartId) return null;

  const updatedItem = await cartItemRepository.updateQuantity(id, quantity);
  await cartRepository.touch(cartId);

  return updatedItem;
}

export async function deleteCartItem(
  cartId: number,
  id: number,
): Promise<boolean> {
  const item = await cartItemRepository.findById(id);

  if (item === null || item.cartId !== cartId) return false;

  await cartItemRepository.remove(id);
  await cartRepository.touch(cartId);

  return true;
}
