// Carga el catálogo en una base recién migrada: `npm run db:seed`.
//
// Corre con `node` directo, fuera de Vite y de React Router. Por eso los
// imports llevan `.ts` y por eso no usa el `db` de `./index`: ese pasa por
// `env.server`, y acá alcanza con la variable que ya cargó `--env-file`.
import { drizzle } from "drizzle-orm/node-postgres";

import * as catalog from "./catalog.ts";
import { categories, products } from "./schema.ts";

const db = drizzle(process.env.DATABASE_URL!);

await db.transaction(async (tx) => {
  // El seed no pisa nada: sobre una base que ya tiene catálogo no hace nada.
  if ((await tx.$count(categories)) > 0) {
    console.log("La base ya tiene catálogo: no se cargó nada.");
    return;
  }

  const inserted = await tx
    .insert(categories)
    .values(catalog.categories)
    .returning({ id: categories.id, slug: categories.slug });

  const categoryIdBySlug = new Map(inserted.map((c) => [c.slug, c.id]));

  await tx.insert(products).values(
    catalog.products.map(({ category, ...product }) => {
      const categoryId = categoryIdBySlug.get(category);
      if (categoryId === undefined) {
        throw new Error(`Categoría desconocida en el catálogo: ${category}`);
      }
      return { ...product, categoryId };
    }),
  );

  console.log(
    `Catálogo cargado: ${inserted.length} categorías y ${catalog.products.length} productos.`,
  );
});

await db.$client.end();
