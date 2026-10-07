import { expect, test } from "vitest";
import { hash, compare } from "./password.server.ts";

test("acepta la contraseña correcta", async () => {
  const hashed = await hash("secreto");
  expect(await compare("secreto", hashed)).toBe(true);
});

test("rechaza una contraseña distinta", async () => {
  const hashed = await hash("secreto");
  expect(await compare("invalido", hashed)).toBe(false);
});
