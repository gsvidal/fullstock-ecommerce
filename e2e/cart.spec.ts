import { expect, test, type Locator, type Page } from "@playwright/test";
import { addToCart, login, logout, signup } from "./helpers.ts";

const heading = (page: Page, title: string) =>
  page.getByRole("heading", { name: title, exact: true });

const cartLink = (page: Page) =>
  page.getByRole("link", { name: "Carrito de compras" });

// El artículo: el elemento de lista identificado por su título.
function cartItem(page: Page, title: string): Locator {
  return page.getByRole("listitem").filter({ has: heading(page, title) });
}

// Los controles de cantidad (reducir, cantidad, aumentar), agrupados por rol accesible.
function quantityControls(page: Page, title: string): Locator {
  return cartItem(page, title).getByRole("group", { name: "Cantidad" });
}

// El tacho: el botón "Eliminar artículo" en la cabecera del artículo (junto al título).
function trashButton(page: Page, title: string): Locator {
  return cartItem(page, title)
    .locator("header")
    .getByRole("button", { name: "Eliminar artículo" });
}

// El total: el texto con el precio, dentro del bloque con nombre accesible "Total".
function total(page: Page): Locator {
  return page.getByRole("group", { name: "Total" }).getByText(/^S\//);
}

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

test("aumentar y reducir cambian la cantidad, el total y el contador", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await page.goto("/cart");

  const controls = quantityControls(page, "Taza SQL");
  await expect(controls).toHaveText("1");
  await expect(total(page)).toHaveText("S/ 15.99");

  await page.getByRole("button", { name: "Aumentar cantidad" }).click();
  await expect(controls).toHaveText("2");
  await expect(total(page)).toHaveText("S/ 31.98");
  await expect(cartLink(page)).toHaveText("2");

  await page.getByRole("button", { name: "Aumentar cantidad" }).click();
  await expect(controls).toHaveText("3");
  await expect(total(page)).toHaveText("S/ 47.97");
  await expect(cartLink(page)).toHaveText("3");

  await page.getByRole("button", { name: "Reducir cantidad" }).click();
  await expect(controls).toHaveText("2");
  await expect(total(page)).toHaveText("S/ 31.98");
  await expect(cartLink(page)).toHaveText("2");
});

test("eliminar un artículo deja el otro y actualiza el total", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await addToCart(page, "polo-react");
  await page.goto("/cart");

  await expect(heading(page, "Taza SQL")).toBeVisible();
  await expect(heading(page, "Polo React")).toBeVisible();
  await expect(total(page)).toHaveText("S/ 35.99");
  await expect(cartLink(page)).toHaveText("2");

  await trashButton(page, "Taza SQL").click();

  await expect(heading(page, "Taza SQL")).toHaveCount(0);
  await expect(heading(page, "Polo React")).toBeVisible();
  await expect(total(page)).toHaveText("S/ 20.00");
  await expect(cartLink(page)).toHaveText("1");
});

test("reducir la última unidad elimina el artículo", async ({ page }) => {
  await addToCart(page, "taza-sql");
  await page.goto("/cart");

  // Con una sola unidad, "Reducir cantidad" pasa a llamarse "Eliminar
  // artículo", y el tacho tiene el mismo nombre: hay dos.
  await expect(
    page.getByRole("button", { name: "Reducir cantidad" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Eliminar artículo" }),
  ).toHaveCount(2);

  await quantityControls(page, "Taza SQL")
    .getByRole("button", { name: "Eliminar artículo" })
    .click();

  await expect(heading(page, "Taza SQL")).toHaveCount(0);
  await expect(total(page)).toHaveText("S/ 0.00");
  await expect(cartLink(page)).toHaveText("");
});

test("el carrito vacío lleva a la tienda", async ({ page }) => {
  await page.goto("/cart");

  await expect(total(page)).toHaveText("S/ 0.00");
  await expect(cartLink(page)).toHaveText("");
  await expect(
    page.getByRole("link", { name: "Continuar Compra" }),
  ).toHaveCount(0);

  await page.getByRole("link", { name: "Ir a la tienda" }).click();

  await expect(page).toHaveURL("/");
});

test("con artículos, el botón lleva al checkout", async ({ page }) => {
  await addToCart(page, "taza-sql");
  await page.goto("/cart");

  await expect(page.getByRole("link", { name: "Ir a la tienda" })).toHaveCount(
    0,
  );

  await page.getByRole("link", { name: "Continuar Compra" }).click();

  await expect(page).toHaveURL("/checkout");
});

test("el carrito de invitado pasa a la cuenta nueva al registrarse", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await addToCart(page, "polo-react");

  await signup(page);

  await expect(cartLink(page)).toHaveText("2");
  await cartLink(page).click();

  await expect(heading(page, "Taza SQL")).toBeVisible();
  await expect(heading(page, "Polo React")).toBeVisible();
  await expect(total(page)).toHaveText("S/ 35.99");
});

test("el carrito de una cuenta sobrevive al logout", async ({ page }) => {
  const email = await signup(page);
  await addToCart(page, "taza-sql");
  await addToCart(page, "polo-react");
  await logout(page);

  await expect(cartLink(page)).toHaveText("");
  await cartLink(page).click();
  await expect(heading(page, "Taza SQL")).toHaveCount(0);
  await expect(heading(page, "Polo React")).toHaveCount(0);
  await expect(total(page)).toHaveText("S/ 0.00");

  await login(page, email);

  await expect(cartLink(page)).toHaveText("2");
  await cartLink(page).click();
  await expect(heading(page, "Taza SQL")).toBeVisible();
  await expect(heading(page, "Polo React")).toBeVisible();
  await expect(total(page)).toHaveText("S/ 35.99");
});
