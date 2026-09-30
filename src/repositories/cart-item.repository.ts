import type { PoolClient } from "pg";
import { cartItems, products } from "../db/schema.ts";
import { db, dbFor } from "../db/index.ts";
import { and, asc, eq, getColumns, sql } from "drizzle-orm";
import type { Product } from "./product.repository.ts";

export type CartItem = typeof cartItems.$inferSelect;
type ProductFields = Pick<Product, "title" | "slug" | "price" | "imgSrc">;
type CartItemWithProduct = CartItem & ProductFields;

export async function getItemsWithProductByCartId(
  cartId: number,
): Promise<CartItemWithProduct[]> {
  const result = await db
    .select({
      ...getColumns(cartItems),
      title: products.title,
      slug: products.slug,
      imgSrc: products.imgSrc,
      price: products.price,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.cartId, cartId))
    .orderBy(asc(cartItems.createdAt));

  return result;
}

export async function getByCartId(
  cartId: number,
  client?: PoolClient,
): Promise<CartItem[]> {
  return dbFor(client)
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId));
}

export async function findByCartAndProduct(
  cartId: number,
  productId: number,
  client?: PoolClient,
): Promise<CartItem | null> {
  const [cartItem] = await dbFor(client)
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
    );

  return cartItem ?? null;
}

type CreateCartItemData = Omit<CartItem, "id" | "createdAt" | "updatedAt">;

export async function create(
  data: CreateCartItemData,
  client?: PoolClient,
): Promise<CartItem> {
  const [newCartItem] = await dbFor(client)
    .insert(cartItems)
    .values(data)
    .returning();

  if (newCartItem === undefined) throw new Error("INSERT did not return a row");
  return newCartItem;
}

export async function findById(id: number): Promise<CartItem | null> {
  const [cartItem] = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, id));
  return cartItem ?? null;
}

export async function updateQuantity(
  id: number,
  quantity: number,
  client?: PoolClient,
): Promise<CartItem> {
  const [updatedCartItem] = await dbFor(client)
    .update(cartItems)
    .set({
      quantity,
      updatedAt: sql`NOW()`,
    })
    .where(eq(cartItems.id, id))
    .returning();

  if (updatedCartItem === undefined)
    throw new Error("UPDATE did not return a row");

  return updatedCartItem;
}

export async function moveToCart(
  id: number,
  cartId: number,
  client?: PoolClient,
): Promise<void> {
  await dbFor(client)
    .update(cartItems)
    .set({
      cartId,
    })
    .where(eq(cartItems.id, id));
}

export async function remove(id: number): Promise<void> {
  await db.delete(cartItems).where(eq(cartItems.id, id));
}
