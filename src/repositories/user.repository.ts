import camelcaseKeys from "camelcase-keys";

import * as db from "../db/index.ts";

interface UserRow {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export type User = ReturnType<typeof camelcaseKeys<UserRow>>;
export type PublicUser = Omit<User, "password">;

export async function create(email: string, password: string): Promise<User> {
  const result = await db.query<UserRow>(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
    [email, password],
  );

  const row = result.rows[0];
  if (row === undefined) throw new Error("INSERT did not return a row");

  return camelcaseKeys(row);
}

export async function findById(id: number): Promise<User | null> {
  const result = await db.query<UserRow>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}

export async function findByEmail(email: string): Promise<User | null> {
  const result = await db.query<UserRow>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0] !== undefined ? camelcaseKeys(result.rows[0]) : null;
}
