import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  carts: {
    items: r.many.cartItems(),
    user: r.one.users({
      from: r.carts.userId,
      to: r.users.id,
    }),
  },

  cartItems: {
    cart: r.one.carts({
      from: r.cartItems.cartId,
      to: r.carts.id,
      optional: false,
    }),
    product: r.one.products({
      from: r.cartItems.productId,
      to: r.products.id,
      optional: false,
    }),
  },

  products: {
    category: r.one.categories({
      from: r.products.categoryId,
      to: r.categories.id,
      optional: false,
    }),
  },

  users: {
    cart: r.one.carts({
      from: r.users.id,
      to: r.carts.userId,
    }),
    orders: r.many.orders(),
  },

  orders: {
    items: r.many.orderItems(),
    user: r.one.users({
      from: r.orders.userId,
      to: r.users.id,
    }),
  },

  orderItems: {
    order: r.one.orders({
      from: r.orderItems.orderId,
      to: r.orders.id,
      optional: false,
    }),
    product: r.one.products({
      from: r.orderItems.productId,
      to: r.products.id,
    }),
  },

  categories: {
    products: r.many.products(),
  },
}));
