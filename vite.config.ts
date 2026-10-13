import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import { testDatabaseUrl } from "./test-database";

// https://vite.dev/config/
export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter(), tailwindcss()],
  test: {
    setupFiles: ["./src/vitest.setup.ts"],
    environment: "jsdom",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.db.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "db",
          include: ["src/**/*.db.test.ts"],
          globalSetup: ["./src/vitest.global-setup.ts"],
          env: process.env.VITEST
            ? { DATABASE_URL: testDatabaseUrl("test"), SESSION_SECRET: "test" }
            : undefined,
        },
      },
    ],
  },
});
