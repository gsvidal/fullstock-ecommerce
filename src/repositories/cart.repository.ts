import { carts } from "../db/schema.ts";
import { db, type Executor } from "../db/index.ts";
import { eq, sql } from "drizzle-orm";

export type Cart = typeof carts.$inferSelect;
export async function create(userId?: number): Promise<Cart> {
  const [newCart] = await db.insert(carts).values({ userId }).returning();
  if (newCart === undefined) throw new Error("INSERT did not return a row");
  return newCart;
}

export async function findByUserId(userId: number): Promise<Cart | null> {
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId));
  return cart ?? null;
}

export async function linkToUser(
  cartId: number,
  userId: number,
): Promise<void> {
  await db.update(carts).set({ userId }).where(eq(carts.id, cartId));
}

export async function touch(id: number): Promise<void> {
  await db
    .update(carts)
    .set({ updatedAt: sql`NOW()` })
    .where(eq(carts.id, id));
}

export async function remove(
  id: number,
  executor: Executor = db,
): Promise<void> {
  await executor.delete(carts).where(eq(carts.id, id));
}

export async function findById(id: number): Promise<Cart | null> {
  const [cart] = await db.select().from(carts).where(eq(carts.id, id));
  return cart ?? null;
}
