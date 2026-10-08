import { expect, test } from "@playwright/test";

test("se llega a una categoría desde la navegación principal", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Polos" })
    .click();

  await expect(page).toHaveURL("/categories/polos");
  await expect(page.getByRole("heading", { name: "Polos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Polo React" })).toBeVisible();
});
