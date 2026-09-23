import camelcaseKeys from "camelcase-keys";
import type { PoolClient } from "pg";

import * as db from "../db/index.ts";

interface OrderRow {
  id: number;
  user_id: number | null;
  email: string;
  first_name: string;
  last_name: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zip_code: string;
  phone: string;
  total: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number | null;
  title: string;
  price: number;
  img_src: string;
  quantity: number;
  created_at: Date;
}

export type Order = ReturnType<typeof camelcaseKeys<OrderRow>>;
export type OrderItem = ReturnType<typeof camelcaseKeys<OrderItemRow>>;

export type CreateOrderData = Omit<
  Order,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export async function createOrder(
  data: CreateOrderData,
  client?: PoolClient,
): Promise<Order> {
  const result = await db.query<OrderRow>(
    `INSERT INTO orders
      (user_id, email, first_name, last_name, company, address, city, country, region, zip_code, phone, total)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      data.userId,
      data.email,
      data.firstName,
      data.lastName,
      data.company,
      data.address,
      data.city,
      data.country,
      data.region,
      data.zipCode,
      data.phone,
      data.total,
    ],
    client,
  );

  const row = result.rows[0];
  if (row === undefined) throw new Error("INSERT did not return a row");

  return camelcaseKeys(row);
}

export async function findById(id: number): Promise<Order | null> {
  const result = await db.query<OrderRow>(
    "SELECT * FROM orders WHERE id = $1",
    [id],
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}

export async function findItemsByOrderId(
  orderId: number,
): Promise<OrderItem[]> {
  const result = await db.query<OrderItemRow>(
    "SELECT * FROM order_items WHERE order_id = $1",
    [orderId],
  );

  return camelcaseKeys(result.rows);
}

export type CreateOrderItemData = Omit<OrderItem, "id" | "createdAt">;

export async function createOrderItems(
  items: CreateOrderItemData[],
  client?: PoolClient,
): Promise<OrderItem[]> {
  const rows: OrderItem[] = [];

  for (const item of items) {
    const result = await db.query<OrderItemRow>(
      `INSERT INTO order_items (order_id, product_id, title, price, img_src, quantity)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        item.orderId,
        item.productId,
        item.title,
        item.price,
        item.imgSrc,
        item.quantity,
      ],
      client,
    );

    const row = result.rows[0];
    if (row === undefined) throw new Error("INSERT did not return a row");

    rows.push(camelcaseKeys(row));
  }

  return rows;
}
