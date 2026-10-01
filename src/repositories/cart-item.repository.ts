import { cartItems, products } from "../db/schema.ts";
import { db, type Executor } from "../db/index.ts";
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
  executor: Executor = db,
): Promise<CartItem[]> {
  return executor.select().from(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function findByCartAndProduct(
  cartId: number,
  productId: number,
  executor: Executor = db,
): Promise<CartItem | null> {
  const [cartItem] = await executor
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
  executor: Executor = db,
): Promise<CartItem> {
  const [newCartItem] = await executor
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
  executor: Executor = db,
): Promise<CartItem> {
  const [updatedCartItem] = await executor
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
  executor: Executor = db,
): Promise<void> {
  await executor
    .update(cartItems)
    .set({
      cartId,
    })
    .where(eq(cartItems.id, id));
}

export async function remove(id: number): Promise<void> {
  await db.delete(cartItems).where(eq(cartItems.id, id));
}
