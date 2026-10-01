import { Pool } from "pg";
import { env } from "../env.server.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";

const globalForDb = globalThis as typeof globalThis & { pool?: Pool };

export const pool = (globalForDb.pool ??= new Pool({
  connectionString: env.DATABASE_URL,
}));

export const db = drizzle({ client: pool, relations });

// Lo que recibe el callback de `db.transaction`.
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Lo que acepta un repositorio: el `db` de siempre, o una transacción abierta.
export type Executor = typeof db | Transaction;
