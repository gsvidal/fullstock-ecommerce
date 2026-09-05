import camelcaseKeys from "camelcase-keys";

import * as db from "../db/index.ts";

interface ProductRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  price: number;
  description: string;
  features: string[];
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

export type Product = ReturnType<typeof camelcaseKeys<ProductRow>>;

export async function getByCategorySlug(
  categorySlug: string,
  filters: { minPrice?: number; maxPrice?: number } = {},
): Promise<Product[]> {
  const params: (string | number)[] = [categorySlug];
  const conditions: string[] = ["c.slug = $1"];

  if (filters.minPrice !== undefined) {
    params.push(filters.minPrice);
    conditions.push(`p.price >= $${params.length}`);
  }

  if (filters.maxPrice !== undefined) {
    params.push(filters.maxPrice);
    conditions.push(`p.price <= $${params.length}`);
  }

  const result = await db.query<ProductRow>(
    `SELECT p.*
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE ${conditions.join(" AND ")}`,
    params,
  );
  return camelcaseKeys(result.rows);
}

export async function findBySlug(slug: string): Promise<Product | null> {
  const result = await db.query<ProductRow>(
    "SELECT * FROM products WHERE slug = $1",
    [slug],
  );
  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}
