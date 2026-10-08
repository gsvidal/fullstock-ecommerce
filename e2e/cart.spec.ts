import { expect, test } from "@playwright/test";
import { addToCart, login, logout, signup } from "./helpers.ts";

test("lo que se agregó como invitado se suma al carrito de la cuenta", async ({
  page,
}) => {
  const email = await signup(page);
  await addToCart(page, "polo-react");
  await logout(page);

  await addToCart(page, "polo-react");
  await addToCart(page, "taza-javascript");
  await login(page, email);

  await page.getByRole("link", { name: "Carrito de compras" }).click();
  await expect(page.getByRole("heading", { name: "Polo React" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Taza JavaScript" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Carrito de compras" }),
  ).toHaveText("3");
});
