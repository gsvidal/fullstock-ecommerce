import camelcaseKeys from "camelcase-keys";

import * as db from "../db/index.ts";

interface CategoryRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  alt: string | null;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export type Category = ReturnType<typeof camelcaseKeys<CategoryRow>>;

export async function getAll(): Promise<Category[]> {
  const result = await db.query<CategoryRow>("SELECT * FROM categories");
  return camelcaseKeys(result.rows);
}

export async function findBySlug(slug: string): Promise<Category | null> {
  const result = await db.query<CategoryRow>(
    "SELECT * FROM categories WHERE slug = $1",
    [slug],
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}
