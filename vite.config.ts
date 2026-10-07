import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter(), tailwindcss()],
  test: {
    setupFiles: ["./src/vitest.setup.ts"],
    environment: "jsdom",
  },
});
