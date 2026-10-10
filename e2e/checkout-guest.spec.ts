import { expect, test, type Locator, type Page } from "@playwright/test";
import { addToCart, uniqueEmail } from "./helpers.ts";

interface ShippingDetails {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  region?: string;
  zipCode?: string;
  phone?: string;
}

const DEFAULT_SHIPPING_DATA = {
  firstName: "Juan",
  lastName: "Pérez",
  company: "Codeable Labs",
  address: "Av. Las Camelias 456",
  city: "Lima",
  country: "PE",
  region: "Lima",
  zipCode: "15046",
  phone: "987654321",
};

// Llena el formulario de envío en /checkout con datos por defecto o personalizados.
async function fillShippingForm(
  page: Page,
  overrides: ShippingDetails = {},
): Promise<void> {
  const data = {
    email: overrides.email ?? uniqueEmail(),
    firstName: overrides.firstName ?? DEFAULT_SHIPPING_DATA.firstName,
    lastName: overrides.lastName ?? DEFAULT_SHIPPING_DATA.lastName,
    company:
      overrides.company !== undefined
        ? overrides.company
        : DEFAULT_SHIPPING_DATA.company,
    address: overrides.address ?? DEFAULT_SHIPPING_DATA.address,
    city: overrides.city ?? DEFAULT_SHIPPING_DATA.city,
    country: overrides.country ?? DEFAULT_SHIPPING_DATA.country,
    region: overrides.region ?? DEFAULT_SHIPPING_DATA.region,
    zipCode: overrides.zipCode ?? DEFAULT_SHIPPING_DATA.zipCode,
    phone: overrides.phone ?? DEFAULT_SHIPPING_DATA.phone,
  };

  await page.getByLabel("Correo electrónico").fill(data.email);
  await page.getByLabel("Nombre").fill(data.firstName);
  await page.getByLabel("Apellido").fill(data.lastName);
  await page.getByLabel("Compañía").fill(data.company);
  await page.getByLabel("Dirección").fill(data.address);
  await page.getByLabel("Ciudad").fill(data.city);
  await page.getByLabel("País").selectOption(data.country);
  await page.getByLabel("Provincia/Estado").fill(data.region);
  await page.getByLabel("Código Postal").fill(data.zipCode);
  await page.getByLabel("Teléfono").fill(data.phone);
}

// Bloque del ítem dentro del resumen de la orden (contiene título, cantidad y precio).
function summaryItem(page: Page, title: string): Locator {
  return page.getByRole("heading", { name: title }).locator("..");
}

// Bloque del total dentro del resumen de la orden.
function orderTotal(page: Page): Locator {
  return page.getByText("Total", { exact: true }).locator("..");
}

async function expectFieldError(
  page: Page,
  label: string,
  message: string,
  role: "textbox" | "combobox" = "textbox",
): Promise<void> {
  const field = page.getByRole(role, {
    name: label,
    description: message,
    exact: true,
  });

  await expect(field).toBeVisible();
  await expect(field).toHaveAttribute("aria-invalid", "true");
}

test("la compra completa: desde el carrito hasta la confirmación de orden", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await addToCart(page, "polo-react");

  await page.goto("/cart");
  await page.getByRole("link", { name: "Continuar Compra" }).click();

  await expect(page).toHaveURL("/checkout");

  // El resumen muestra cada producto con su cantidad y precio
  await expect(
    page.getByRole("heading", { name: "Resumen de la orden" }),
  ).toBeVisible();
  await expect(summaryItem(page, "Taza SQL")).toContainText("1");
  await expect(summaryItem(page, "Taza SQL")).toContainText("S/ 15.99");
  await expect(summaryItem(page, "Polo React")).toContainText("1");
  await expect(summaryItem(page, "Polo React")).toContainText("S/ 20.00");

  // El total correcto
  await expect(orderTotal(page)).toContainText("S/ 35.99");

  // Completar el formulario y confirmar
  await fillShippingForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();

  // Lleva a la confirmación con el mensaje y número de orden
  await expect(page).toHaveURL(/\/order-confirmation\?orderId=\d+/);
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();
  await expect(page.getByText("Número de orden")).toBeVisible();

  // El número de orden se lee de la URL y coincide con el mostrado en pantalla
  const orderId = new URL(page.url()).searchParams.get("orderId");
  expect(orderId).not.toBeNull();
  await expect(page.getByText(orderId!)).toBeVisible();
});

test("los campos obligatorios: enviar vacío muestra errores y permanece en checkout", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await page.goto("/checkout");

  await page.getByRole("button", { name: "Confirmar Orden" }).click();

  await expect(page).toHaveURL("/checkout");
  await expectFieldError(page, "Correo electrónico", "Ingresa un correo válido");
  await expectFieldError(page, "Nombre", "El nombre es obligatorio");
  await expectFieldError(page, "Apellido", "El apellido es obligatorio");
  await expectFieldError(page, "Dirección", "La dirección es obligatoria");
  await expectFieldError(page, "Ciudad", "La ciudad es obligatoria");
  await expectFieldError(page, "País", "Selecciona un país", "combobox");
  await expectFieldError(
    page,
    "Provincia/Estado",
    "La provincia/estado es obligatorio",
  );
  await expectFieldError(page, "Código Postal", "El código postal es obligatorio");
  await expectFieldError(page, "Teléfono", "El teléfono es obligatorio");
});

test("compañía es opcional: una compra sin compañía funciona correctamente", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await page.goto("/checkout");

  await fillShippingForm(page, { company: "" });
  await page.getByRole("button", { name: "Confirmar Orden" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?orderId=\d+/);
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();
});

test("el carrito después de comprar: contador vacío y /cart sin artículos", async ({
  page,
}) => {
  await addToCart(page, "taza-sql");
  await page.goto("/checkout");
  await fillShippingForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?orderId=\d+/);
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  // El contador del header no muestra número después de comprar
  const cartLink = page.getByRole("link", { name: "Carrito de compras" });
  await expect(cartLink).toHaveText("");

  // /cart está vacío
  await cartLink.click();
  await expect(page).toHaveURL("/cart");
  await expect(page.getByText("Total")).toBeVisible();
  await expect(page.getByText("S/ 0.00")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ir a la tienda" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Continuar Compra" }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Taza SQL" })).toHaveCount(0);
});

test("checkout sin carrito: ir a /checkout con carrito vacío redirige a /cart", async ({
  page,
}) => {
  await page.goto("/checkout");

  await expect(page).toHaveURL("/cart");
  await expect(
    page.getByRole("link", { name: "Ir a la tienda" }),
  ).toBeVisible();
});

test("la confirmación es privada: quien compró puede recargar pero otra persona ve orden no encontrada", async ({
  page,
  browser,
}) => {
  await addToCart(page, "taza-sql");
  await page.goto("/checkout");
  await fillShippingForm(page);
  await page.getByRole("button", { name: "Confirmar Orden" }).click();

  await expect(page).toHaveURL(/\/order-confirmation\?orderId=\d+/);
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  const confirmationUrl = page.url();

  // Quien compró puede recargar la confirmación y la sigue viendo
  await page.reload();
  await expect(page.getByText("Tu orden está en camino")).toBeVisible();

  // Otra persona en otro navegador (contexto limpio) ve "Orden no encontrada"
  const otherContext = await browser.newContext();
  try {
    const otherPage = await otherContext.newPage();
    await otherPage.goto(confirmationUrl);
    await expect(otherPage.getByText("Orden no encontrada")).toBeVisible();
    await expect(otherPage.getByText("Tu orden está en camino")).toHaveCount(0);
  } finally {
    await otherContext.close();
  }
});
