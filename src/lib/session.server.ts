import crypto from "node:crypto";
import { createSessionStorage, type Session } from "react-router";
import { db } from "../db/index.ts";
import { session } from "../db/schema.ts";
import { and, eq, gte, sql } from "drizzle-orm";
import { env } from "../env.server.ts";

// Espejo de `src/types/session.d.ts` de la API, que declaraba lo mismo
// aumentando el módulo de express-session.
export type SessionData = {
  cartId: number;
  userId: number;
  lastOrderId: number;
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const sessionStorage = createSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    maxAge: ONE_WEEK_MS / 1000,
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },

  async createData(data, expires) {
    // Mismo esquema de id que el `uid-safe(24)` de express-session.
    const sid = crypto.randomBytes(24).toString("base64url");
    const expire = expires ?? new Date(Date.now() + ONE_WEEK_MS);

    await db.insert(session).values({
      sid,
      sess: data,
      expire,
    });
    return sid;
  },

  async readData(sid) {
    const [sessionRow] = await db
      .select({ sess: session.sess })
      .from(session)
      .where(and(eq(session.sid, sid), gte(session.expire, sql`NOW()`)));
    return sessionRow?.sess ?? null;
  },

  async updateData(sid, data, expires) {
    const expire = expires ?? new Date(Date.now() + ONE_WEEK_MS);

    await db
      .insert(session)
      .values({
        sid,
        sess: data,
        expire,
      })
      .onConflictDoUpdate({
        target: session.sid,
        set: {
          sess: data,
          expire,
        },
      });
  },

  async deleteData(sid) {
    await db.delete(session).where(eq(session.sid, sid));
  },
});

export function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export function commitSession(session: Session<SessionData>) {
  return sessionStorage.commitSession(session);
}

export function destroySession(session: Session<SessionData>) {
  return sessionStorage.destroySession(session);
}

export type AppSession = Session<SessionData>;
