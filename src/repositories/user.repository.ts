import { users } from "../db/schema";

import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type PublicUser = Omit<User, "password">;

export async function create(email: string, password: string): Promise<User> {
  const [user] = await db.insert(users).values({ email, password }).returning();

  if (user === undefined) throw new Error("INSERT did not return a row");

  return user;
}

export async function findById(id: number): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  return user ?? null;
}

export async function findByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user ?? null;
}
