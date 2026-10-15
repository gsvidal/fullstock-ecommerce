import { expect, test } from "@playwright/test";

// BLOQUE DE ENTEROS GRANDES
test("un precio mínimo enorme deja la lista vacía", async ({ page }) => {
  await page.goto("/categories/polos?minPrice=99999999");

  await expect(
    page.getByText("No hay productos en ese rango de precios."),
  ).toBeVisible();
});

test("un número de orden enorme lleva al inicio", async ({ page }) => {
  await page.goto("/order-confirmation?orderId=2147483648");

  await expect(page).toHaveURL("/");
});

test("un número de orden enorme (9999...) lleva al inicio", async ({
  page,
}) => {
  await page.goto("/order-confirmation?orderId=9999999999999999999");

  await expect(page).toHaveURL("/");
});

// BLOQUE DE PETICIONES CON CUERPO INVALIDOS
test("agregar un producto con un id enorme responde 400", async ({
  request,
}) => {
  const response = await request.post("/cart/items", {
    form: { intent: "add", productId: "99999999999999" },
  });

  expect(response.status()).toBe(400);
});

test("agregar un producto que no existe responde 404 y no crea un carrito", async ({
  request,
}) => {
  const response = await request.post("/cart/items", {
    form: { intent: "add", productId: "999999" },
  });

  expect(response.status()).toBe(404);
  expect(response.headers()["set-cookie"]).toBeUndefined();
});

test("un formulario con otra forma responde 400", async ({ request }) => {
  const response = await request.post("/cart/items", {
    form: { intent: "add", "productId[]": "18" },
  });

  expect(response.status()).toBe(400);
});

test("un intent desconocido responde 400", async ({ request }) => {
  const response = await request.post("/cart/items", {
    form: { "intent[]": "add", productId: "18" },
  });

  expect(response.status()).toBe(400);
});

test("un cuerpo en JSON responde 400", async ({ request }) => {
  const response = await request.post("/cart/items", {
    data: { intent: "add", productId: 18 },
  });

  expect(response.status()).toBe(400);
});

test("un cuerpo en JSON al iniciar sesión responde 400", async ({
  request,
}) => {
  const response = await request.post("/login", {
    data: { email: "ana@example.com", password: "secreto123" },
  });

  expect(response.status()).toBe(400);
});
