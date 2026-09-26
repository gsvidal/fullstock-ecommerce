import { categories } from "../db/schema";

import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";

export type Category = typeof categories.$inferSelect;

export async function getAll(): Promise<Category[]> {
  return await db.select().from(categories);
}

export async function findBySlug(slug: string): Promise<Category | null> {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));

  return category ?? null;
}
