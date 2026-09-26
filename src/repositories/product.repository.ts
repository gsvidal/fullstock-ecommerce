import { and, eq, getColumns, gte, lte } from "drizzle-orm";

import { db } from "../db/index.ts";
import { categories, products } from "../db/schema.ts";

export type Product = typeof products.$inferSelect;

export async function getByCategorySlug(
  categorySlug: string,
  filters: { minPrice?: number; maxPrice?: number } = {},
): Promise<Product[]> {
  return await db
    .select(getColumns(products))
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(categories.slug, categorySlug),
        filters.minPrice !== undefined
          ? gte(products.price, filters.minPrice)
          : undefined,
        filters.maxPrice !== undefined
          ? lte(products.price, filters.maxPrice)
          : undefined,
      ),
    );
}

export async function findBySlug(slug: string): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  return product ?? null;
}
