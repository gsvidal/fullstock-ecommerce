import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

export function testDatabaseUrl(suffix: "test" | "e2e"): string {
  const developmentUrl =
    process.env.DATABASE_URL ??
    parseEnv(readFileSync(".env", "utf8")).DATABASE_URL;

  if (developmentUrl === undefined) {
    throw new Error("Falta DATABASE_URL, en el entorno o en el .env");
  }

  const url = new URL(developmentUrl);
  url.pathname = `${url.pathname}_${suffix}`;
  return url.toString();
}
