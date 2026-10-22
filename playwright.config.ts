import { defineConfig, devices } from "@playwright/test";
import { testDatabaseUrl } from "./test-database.ts";

const PORT = 4174;
const MERCADOPAGO_PORT = 4175;

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
  webServer: [
    {
      command: "node e2e/fake-mercadopago.ts",
      url: `http://localhost:${MERCADOPAGO_PORT}`,
      env: { PORT: String(MERCADOPAGO_PORT) },
    },
    {
      command: "npm run db:reset && npm run build && npm run start",
      url: `http://localhost:${PORT}`,
      env: {
        DATABASE_URL: testDatabaseUrl("e2e"),
        SESSION_SECRET: "e2e",
        PORT: String(PORT),
        APP_URL: `http://localhost:${PORT}`,
        MP_ACCESS_TOKEN: "e2e",
        MP_WEBHOOK_SECRET: "e2e",
        MP_API_URL: `http://localhost:${MERCADOPAGO_PORT}`,
        GEMINI_API_KEY: "test",
      },
    },
  ],
});
