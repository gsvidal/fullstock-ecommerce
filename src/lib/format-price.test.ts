import { expect, test } from "vitest";
import { formatPrice } from "./format-price.ts";

test("formatea céntimos como soles", () => {
  expect(formatPrice(5990)).toBe("S/\u00a059.90");
  expect(formatPrice(100000)).toBe("S/\u00a01,000.00");
});
