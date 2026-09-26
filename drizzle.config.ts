import { defineConfig } from "drizzle-kit";
import { env } from "./src/env.server.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: env.DATABASE_URL },
  // La tabla de control de dbmate no es parte del dominio.
  tablesFilter: ["!schema_migrations"],
});
