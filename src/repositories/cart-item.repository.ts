import camelcaseKeys from "camelcase-keys";
import type { PoolClient } from "pg";

import * as db from "../db/index.ts";

interface CartItemRow {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export type CartItem = ReturnType<typeof camelcaseKeys<CartItemRow>>;

interface CartItemWithProductRow extends CartItemRow {
  title: string;
  slug: string;
  price: number;
  img_src: string;
}

type CartItemWithProduct = ReturnType<
  typeof camelcaseKeys<CartItemWithProductRow>
>;

export async function getItemsWithProductByCartId(
  cartId: number,
): Promise<CartItemWithProduct[]> {
  const result = await db.query<CartItemWithProductRow>(
    `SELECT ci.*, p.title, p.slug, p.price, p.img_src
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at ASC`,
    [cartId],
  );

  return camelcaseKeys(result.rows);
}

export async function getByCartId(
  cartId: number,
  client?: PoolClient,
): Promise<CartItem[]> {
  const result = await db.query<CartItemRow>(
    "SELECT * FROM cart_items WHERE cart_id = $1",
    [cartId],
    client,
  );

  return camelcaseKeys(result.rows);
}

export async function findByCartAndProduct(
  cartId: number,
  productId: number,
  client?: PoolClient,
): Promise<CartItem | null> {
  const result = await db.query<CartItemRow>(
    "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cartId, productId],
    client,
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}

type CreateCartItemData = Omit<CartItem, "id" | "createdAt" | "updatedAt">;

export async function create(
  data: CreateCartItemData,
  client?: PoolClient,
): Promise<CartItem> {
  const result = await db.query<CartItemRow>(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.cartId, data.productId, data.quantity],
    client,
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("INSERT did not return a row");

  return camelcaseKeys(row);
}

export async function findById(id: number): Promise<CartItem | null> {
  const result = await db.query<CartItemRow>(
    "SELECT * FROM cart_items WHERE id = $1",
    [id],
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}

export async function updateQuantity(
  id: number,
  quantity: number,
  client?: PoolClient,
): Promise<CartItem> {
  const result = await db.query<CartItemRow>(
    "UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [quantity, id],
    client,
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("UPDATE did not return a row");

  return camelcaseKeys(row);
}

export async function moveToCart(
  id: number,
  cartId: number,
  client?: PoolClient,
): Promise<void> {
  await db.query(
    "UPDATE cart_items SET cart_id = $1 WHERE id = $2",
    [cartId, id],
    client,
  );
}

export async function remove(id: number): Promise<void> {
  await db.query("DELETE FROM cart_items WHERE id = $1", [id]);
}
