import { expect, test } from "vitest";
import { cn } from "./cn.ts";

test("deja solo la última utilidad en conflicto", () => {
  expect(cn("p-2", "p-4")).toBe("p-4");
});

test("descarta los valores falsy", () => {
  expect(cn("font-medium", false, null, undefined, "text-sm")).toBe(
    "font-medium text-sm",
  );
});
