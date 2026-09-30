import type { PoolClient } from "pg";

import { db, dbFor } from "../db/index.ts";
import { orderItems, orders } from "../db/schema.ts";

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type CreateOrderData = Omit<
  typeof orders.$inferInsert,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export async function createOrder(
  data: CreateOrderData,
  client?: PoolClient,
): Promise<Order> {
  const [order] = await dbFor(client).insert(orders).values(data).returning();

  if (order === undefined) throw new Error("INSERT did not return a row");

  return order;
}

export type CreateOrderItemData = Omit<
  typeof orderItems.$inferInsert,
  "id" | "createdAt"
>;

export async function createOrderItems(
  items: CreateOrderItemData[],
  client?: PoolClient,
): Promise<OrderItem[]> {
  if (items.length === 0) return [];

  return await dbFor(client).insert(orderItems).values(items).returning();
}

export type OrderWithItems = Order & { items: OrderItem[] };

export async function findByIdWithItems(
  id: number,
): Promise<OrderWithItems | null> {
  const order = await db.query.orders.findFirst({
    where: { id },
    with: { items: true },
  });

  return order ?? null;
}
