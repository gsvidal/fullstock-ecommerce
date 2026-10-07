import { expect, test } from "vitest";
import { removeCartItemBodySchema } from "./cart-item.ts";

// const data: Record<"itemId", unknown> = { itemId: undefined };
// Evitar datos globales o compartidos entre tests, se recomienda definir los datos dentro de cada test.

test("valida el esquema de eliminación con datos válidos", () => {
  const data = { itemId: "123" };
  expect(() => removeCartItemBodySchema.parse(data)).not.toThrow();
});

test("valida el esquema de eliminación con itemId undefined", () => {
  const data = { itemId: undefined };
  expect(() => removeCartItemBodySchema.parse(data)).toThrow();
});
