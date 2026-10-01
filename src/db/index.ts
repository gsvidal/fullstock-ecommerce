import { Pool } from "pg";
import { env } from "../env.server.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";
import { logError } from "../lib/log-error.ts";

function createPool() {
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  // Una conexión inactiva del pool también puede morir: Postgres se reinicia,
  // o `npm run db:reset` la corta con `WITH (FORCE)`. `pg` avisa con un evento
  // `error` en el pool, y un `error` sin nadie que lo escuche termina el
  // proceso entero. Con el listener, el pool descarta esa conexión y abre otra
  // en la próxima consulta.
  //
  // Va acá y no suelto en el módulo: el guard de abajo reusa el pool entre
  // recargas, y cada recarga le sumaría un listener más.
  pool.on("error", logError);

  return pool;
}
const globalForDb = globalThis as typeof globalThis & { pool?: Pool };

const pool = (globalForDb.pool ??= createPool());

export const db = drizzle({ client: pool, relations });

// Lo que recibe el callback de `db.transaction`.
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Lo que acepta un repositorio: el `db` de siempre, o una transacción abierta.
export type Executor = typeof db | Transaction;
