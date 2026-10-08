import { expect, test } from "@playwright/test";
import { signup } from "./helpers.ts";

test("una persona nueva crea su cuenta", async ({ page }) => {
  await signup(page);

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("button", { name: "Cerrar sesión" }),
  ).toBeVisible();
});
