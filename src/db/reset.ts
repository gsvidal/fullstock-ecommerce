// Borra la base de `DATABASE_URL` y la vuelve a crear vacía: el primer paso de
// `npm run db:reset`. Es lo que antes hacían `dbmate drop` y `dbmate create`.
//
// No se puede borrar una base estando conectado a ella, así que la conexión va
// a `postgres`, la base de mantenimiento que trae toda instalación.
import pg from "pg";

const url = new URL(process.env.DATABASE_URL!);
const database = url.pathname.slice(1);
url.pathname = "/postgres";

const client = new pg.Client({ connectionString: url.toString() });
await client.connect();

// `WITH (FORCE)` corta las conexiones abiertas, como la del `npm run dev`.
// Sin eso, el `DROP` falla mientras el servidor de desarrollo esté prendido.
await client.query(`DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`);
await client.query(`CREATE DATABASE "${database}"`);
await client.end();

console.log(`Base "${database}" recreada, vacía.`);
