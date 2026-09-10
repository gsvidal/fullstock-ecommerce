import camelcaseKeys from "camelcase-keys";
import type { PoolClient } from "pg";

import * as db from "../db/index.ts";

interface CartRow {
  id: number;
  user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export type Cart = ReturnType<typeof camelcaseKeys<CartRow>>;

export async function create(userId?: number): Promise<Cart> {
  const result = await db.query<CartRow>(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [userId ?? null],
  );

  const row = result.rows[0];
  if (row === undefined) throw new Error("INSERT did not return a row");

  return camelcaseKeys(row);
}

export async function findByUserId(userId: number): Promise<Cart | null> {
  const result = await db.query<CartRow>(
    "SELECT * FROM carts WHERE user_id = $1",
    [userId],
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}

export async function linkToUser(
  cartId: number,
  userId: number,
): Promise<void> {
  await db.query("UPDATE carts SET user_id = $1 WHERE id = $2", [
    userId,
    cartId,
  ]);
}

export async function touch(id: number): Promise<void> {
  await db.query("UPDATE carts SET updated_at = NOW() WHERE id = $1", [id]);
}

export async function remove(id: number, client?: PoolClient): Promise<void> {
  await db.query("DELETE FROM carts WHERE id = $1", [id], client);
}

export async function findById(id: number): Promise<Cart | null> {
  const result = await db.query<CartRow>("SELECT * FROM carts WHERE id = $1", [
    id,
  ]);

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}
