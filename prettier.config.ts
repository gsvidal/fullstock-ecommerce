import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

const config: Config & PluginOptions = {
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 no tiene config JS: el plugin necesita el CSS entry para
  // conocer las utilidades del @theme.
  tailwindStylesheet: "./src/styles/index.css",
  tailwindFunctions: ["cva", "cn", "clsx"],
};

export default config;
