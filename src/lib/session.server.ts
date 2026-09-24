import crypto from "node:crypto";
import { createSessionStorage, type Session } from "react-router";
import { pool } from "../db";

// Espejo de `src/types/session.d.ts` de la API, que declaraba lo mismo
// aumentando el módulo de express-session.
export type SessionData = {
  cartId: number;
  userId: number;
  lastOrderId: number;
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ⚠️ Esta metadata NO es dato de la aplicación, y NO es opcional.
// Ver la prueba 2: sin ella, `express-session` revienta al leer la fila.
const expressCookieMeta = (expires: Date) => ({
  originalMaxAge: ONE_WEEK_MS,
  expires: expires.toISOString(),
  httpOnly: true,
  path: "/",
});

const sessionStorage = createSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    maxAge: ONE_WEEK_MS / 1000,
  },

  async createData(data, expires) {
    // Mismo esquema de id que el `uid-safe(24)` de express-session.
    const sid = crypto.randomBytes(24).toString("base64url");
    const expire = expires ?? new Date(Date.now() + ONE_WEEK_MS);
    await pool.query(
      `INSERT INTO session (sid, sess, expire) VALUES ($1, $2, $3)`,
      [
        sid,
        JSON.stringify({ ...data, cookie: expressCookieMeta(expire) }),
        expire,
      ],
    );
    return sid;
  },

  async readData(sid) {
    // `sess - 'cookie'` descarta la metadata de express-session en la consulta:
    // no es dato nuestro y no queremos que se vea como si lo fuera. El `::jsonb`
    // hace falta porque la columna es `json`, y ese operador es de `jsonb`.
    const { rows } = await pool.query<{ sess: SessionData }>(
      `SELECT sess::jsonb - 'cookie' AS sess
         FROM session
        WHERE sid = $1 AND expire >= NOW()`,
      [sid],
    );
    return rows[0]?.sess ?? null;
  },

  async updateData(sid, data, expires) {
    const expire = expires ?? new Date(Date.now() + ONE_WEEK_MS);
    // Se preserva la metadata que la fila ya tenía: reescribirla en cada commit
    // volvería la sesión "rolling", que no es lo que hace express-session con
    // `resave: false`.
    const { rows } = await pool.query<{ cookie: unknown }>(
      `SELECT sess -> 'cookie' AS cookie FROM session WHERE sid = $1`,
      [sid],
    );
    const cookie = rows[0]?.cookie ?? expressCookieMeta(expire);
    await pool.query(
      `INSERT INTO session (sid, sess, expire) VALUES ($1, $2, $3)
       ON CONFLICT (sid) DO UPDATE SET sess = $2, expire = $3`,
      [sid, JSON.stringify({ ...data, cookie }), expire],
    );
  },

  async deleteData(sid) {
    await pool.query(`DELETE FROM session WHERE sid = $1`, [sid]);
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
