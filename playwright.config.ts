import { defineConfig, devices } from "@playwright/test";
import { testDatabaseUrl } from "./test-database.ts";

const PORT = 4174;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run db:reset && npm run build && npm run start",
    url: `http://localhost:${PORT}`,
    env: {
      DATABASE_URL: testDatabaseUrl("e2e"),
      SESSION_SECRET: "e2e",
      PORT: String(PORT),
    },
  },
});
