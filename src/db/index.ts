import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { env } from "../env.server.ts";

const globalForDb = globalThis as typeof globalThis & { pool?: Pool };

export const pool = (globalForDb.pool ??= new Pool({
  connectionString: env.DATABASE_URL,
}));

export function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
  client?: PoolClient,
) {
  const runner = client ?? pool;
  console.log("Executing query:", text);
  return runner.query<T>(text, params);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
