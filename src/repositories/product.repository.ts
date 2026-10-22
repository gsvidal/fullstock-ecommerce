import { and, eq, getColumns, gte, ilike, inArray, lte, or } from "drizzle-orm";

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

export async function findById(id: number): Promise<Product | null> {
  const [product] = await db.select().from(products).where(eq(products.id, id));

  return product ?? null;
}

export async function search(filters: {
  query?: string;
  categorySlug?: string;
  maxPrice?: number;
}): Promise<(Product & { categorySlug: string })[]> {
  return await db
    .select({ ...getColumns(products), categorySlug: categories.slug })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        filters.query !== undefined
          ? or(
              ilike(products.title, `%${filters.query}%`),
              ilike(products.description, `%${filters.query}%`),
            )
          : undefined,
        filters.categorySlug !== undefined
          ? eq(categories.slug, filters.categorySlug)
          : undefined,
        filters.maxPrice !== undefined
          ? lte(products.price, filters.maxPrice)
          : undefined,
      ),
    )
    // Del más barato al más caro: sin orden, la base devuelve el que quiera.
    .orderBy(products.price, products.id);
}

export async function findBySlugs(slugs: string[]): Promise<Product[]> {
  return await db.select().from(products).where(inArray(products.slug, slugs));
}
