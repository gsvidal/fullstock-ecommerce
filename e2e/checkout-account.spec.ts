import { expect, test, type Page } from "@playwright/test";
import { addToCart, login, logout, signup } from "./helpers.ts";

async function fillCheckoutForm(
  page: Page,
  overrides: Partial<{
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    city: string;
    country: string;
    region: string;
    zipCode: string;
    phone: string;
  }> = {},
) {
  const values = {
    email: "",
    firstName: "Ada",
    lastName: "Lovelace",
    company: "Codeable",
    address: "Avenida Siempre Viva 123",
    city: "Córdoba",
    country: "AR",
    region: "Córdoba",
    zipCode: "5000",
    phone: "1122334455",
    ...overrides,
  };

  if (values.email) {
    await page.getByLabel("Correo electrónico").fill(values.email);
  }

  await page.getByLabel("Nombre").fill(values.firstName);
  await page.getByLabel("Apellido").fill(values.lastName);
  await page.getByLabel("Compañía").fill(values.company);
  await page.getByLabel("Dirección").fill(values.address);
  await page.getByLabel("Ciudad").fill(values.city);
  await page.getByLabel("País").selectOption(values.country);
  await page.getByLabel("Provincia/Estado").fill(values.region);
  await page.getByLabel("Código Postal").fill(values.zipCode);
  await page.getByLabel("Teléfono").fill(values.phone);
}

test("el correo de la cuenta ya viene cargado y no se puede editar", async ({
  page,
}) => {
  const email = await signup(page);

  await addToCart(page, "polo-react");
  await page.goto("/checkout");

  const emailField = page.getByLabel("Correo electrónico");

  await expect(emailField).toHaveValue(email);
  await expect(emailField).not.toBeEditable();
});

test("la compra completa con cuenta termina en la confirmación y limpia el contador", async ({
  page,
}) => {
  const email = await signup(page);

  await addToCart(page, "polo-react");
  await page.goto("/checkout");
  await fillCheckoutForm(page);

  await page.getByRole("button", { name: "Confirmar Orden" }).click();
  // interactuar con mercado pago
  await page.getByRole("button", { name: "Pagar" }).click();

  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  const orderId = new URL(page.url()).searchParams.get("orderId");
  expect(orderId).not.toBeNull();

  await expect(page.getByText("Número de orden")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Carrito de compras" }),
  ).not.toContainText(/\d/);
  await expect(page.getByText(`Número de orden`)).toBeVisible();

  await logout(page);
  await login(page, email);
  await page.goto(`/order-confirmation?orderId=${orderId}`);
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();
});

test("la dueña de la orden puede volver a verla después de cerrar sesión", async ({
  page,
}) => {
  const email = await signup(page);

  await addToCart(page, "polo-react");
  await page.goto("/checkout");
  await fillCheckoutForm(page);

  await page.getByRole("button", { name: "Confirmar Orden" }).click();
  // interactuar con mercado pago
  await page.getByRole("button", { name: "Pagar" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?orderId=/, {
    timeout: 15000,
  });
  const orderUrl = page.url();
  await logout(page);
  await login(page, email);
  await page.goto(orderUrl);

  await expect(page.getByText("Tu orden está en camino")).toBeVisible();
});

test("otra cuenta no puede ver la orden ajena", async ({ page, browser }) => {
  await signup(page);

  await addToCart(page, "polo-react");
  await page.goto("/checkout");
  await fillCheckoutForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();
  // interactuar con mercado pago
  await page.getByRole("button", { name: "Pagar" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?orderId=/, {
    timeout: 15000,
  });
  const orderUrl = page.url();
  await logout(page);

  const context = await browser.newContext();
  const otherPage = await context.newPage();
  const otherEmail = await signup(otherPage);
  await otherPage.goto(orderUrl);

  await expect(otherPage.getByText("Orden no encontrada")).toBeVisible();
  await expect(otherPage).toHaveURL(
    new RegExp(`${orderUrl.replace(/\?.*$/, "")}`),
  );
  await expect(otherPage.getByText(`Bienvenido ${otherEmail}`)).toBeVisible();

  await context.close();
});

test("después de comprar, el carrito de la cuenta queda vacío", async ({
  page,
}) => {
  const email = await signup(page);

  await addToCart(page, "polo-react");
  await page.goto("/checkout");
  await fillCheckoutForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();
  // interactuar con mercado pago
  await page.getByRole("button", { name: "Pagar" }).click();

  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  await logout(page);
  await login(page, email);

  await page.getByRole("link", { name: "Carrito de compras" }).click();
  await expect(
    page.getByRole("link", { name: "Ir a la tienda" }),
  ).toBeVisible();
});

test("un carrito de invitado se combina con la cuenta antes del checkout", async ({
  page,
}) => {
  const email = await signup(page);
  await logout(page);

  await addToCart(page, "polo-react");
  await addToCart(page, "taza-javascript");
  await login(page, email);

  await page.getByRole("link", { name: "Carrito de compras" }).click();
  await expect(page.getByRole("heading", { name: "Polo React" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Taza JavaScript" }),
  ).toBeVisible();

  await page.goto("/checkout");
  await fillCheckoutForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();
  // interactuar con mercado pago
  await page.getByRole("button", { name: "Pagar" }).click();

  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  const orderUrl = page.url();
  await logout(page);
  await login(page, email);
  await page.goto(orderUrl);

  await expect(page.getByText("Tu orden está en camino")).toBeVisible();
});
