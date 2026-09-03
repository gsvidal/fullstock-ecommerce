// eslint.config.js (el archivo completo, para que no se pierda nada al pegar)
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["build", ".react-router"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react-refresh/only-export-components": [
        "error",
        {
          allowConstantExport: true,
          // Los exports que una ruta declara en Framework Mode y que no son
          // componentes. Los que sí lo son (`Layout`, `ErrorBoundary`,
          // `HydrateFallback`) no hacen falta acá.
          allowExportNames: [
            "loader",
            "clientLoader",
            "action",
            "clientAction",
            "shouldRevalidate",
            "meta",
            "links",
            "headers",
            "handle",
          ],
        },
      ],
    },
  },
]);
