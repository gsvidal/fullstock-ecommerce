import * as z from "zod";

console.log("Evaluar environment variables");

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  // SESSION_SECRET: z.string().min(1),
  // PORT: z.coerce.number().int().positive().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
