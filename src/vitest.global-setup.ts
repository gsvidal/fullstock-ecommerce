import { execSync } from "node:child_process";
import { testDatabaseUrl } from "../test-database";

export default function setup() {
  execSync("npm run db:reset", {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl("test") },
    stdio: "inherit",
  });
}
