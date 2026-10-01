import { db, type Executor } from "../db/index.ts";
import { orderItems, orders } from "../db/schema.ts";

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type CreateOrderData = Omit<
  typeof orders.$inferInsert,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export async function createOrder(
  data: CreateOrderData,
  executor: Executor = db,
): Promise<Order> {
  const [order] = await executor.insert(orders).values(data).returning();

  if (order === undefined) throw new Error("INSERT did not return a row");

  return order;
}

export type CreateOrderItemData = Omit<
  typeof orderItems.$inferInsert,
  "id" | "createdAt"
>;

export async function createOrderItems(
  items: CreateOrderItemData[],
  executor: Executor = db,
): Promise<OrderItem[]> {
  if (items.length === 0) return [];

  return await executor.insert(orderItems).values(items).returning();
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
