import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  json,
  index,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { MetaCookie, SessionData } from "../lib/session.server";

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial().primaryKey(),
    cartId: integer("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    unique("cart_items_cart_id_product_id_unique").on(
      table.cartId,
      table.productId,
    ),
    check("cart_items_quantity_check", sql`(${table.quantity} > 0)`),
  ],
);

export const carts = pgTable("carts", {
  id: serial().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique(),
});

export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  title: text().notNull(),
  slug: text().notNull(),
  imgSrc: text("img_src").notNull(),
  alt: text(),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial().primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    title: text().notNull(),
    price: integer().notNull(),
    imgSrc: text("img_src").notNull(),
    quantity: integer().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    check("order_items_price_check", sql`(${table.price} >= 0)`),
    check("order_items_quantity_check", sql`(${table.quantity} > 0)`),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: serial().primaryKey(),
    email: text().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    company: text(),
    address: text().notNull(),
    city: text().notNull(),
    country: text().notNull(),
    region: text().notNull(),
    zipCode: text("zip_code").notNull(),
    phone: text().notNull(),
    total: integer().notNull(),
    status: text().default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (table) => [check("orders_total_check", sql`(${table.total} >= 0)`)],
);

export const products = pgTable(
  "products",
  {
    id: serial().primaryKey(),
    title: text().notNull(),
    slug: text().notNull().unique(),
    imgSrc: text("img_src").notNull(),
    price: integer().notNull(),
    description: text().notNull(),
    features: text().array().default([]).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => [check("products_price_check", sql`(${t.price} >= 0)`)],
);

export const session = pgTable(
  "session",
  {
    sid: varchar().primaryKey(),
    sess: json()
      .$type<Partial<SessionData> & { cookie: MetaCookie }>()
      .notNull(),
    expire: timestamp().notNull(),
  },
  (table) => [
    index("IDX_session_expire").using("btree", table.expire.asc().nullsLast()),
  ],
);

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
