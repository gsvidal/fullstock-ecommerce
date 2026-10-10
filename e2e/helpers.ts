import { randomUUID } from "node:crypto";
import { expect, type Page } from "@playwright/test";

// Las acciones que más de un flujo necesita. Es el único archivo de `e2e/` que
// tocan todos los equipos: un cambio acá se discute antes, no se mete en el PR
// de un flujo.

export const PASSWORD = "secreto123";

// Un correo que ningún otro test usa, en esta corrida ni en ninguna otra. Es lo
// que deja correr en paralelo a dos tests que crean cuentas.
export function uniqueEmail(): string {
  return `e2e-${randomUUID()}@example.com`;
}

export async function expectFieldError(
  page: Page,
  label: string,
  message: string,
): Promise<void> {
  const field = page.getByLabel(label, { exact: true });

  await expect(field).toBeVisible();
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(field).toHaveAccessibleDescription(message);
}

export async function signup(
  page: Page,
  email = uniqueEmail(),
): Promise<string> {
  await page.goto("/signup");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirma tu contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.getByText(`Bienvenido ${email}`)).toBeVisible();
  return email;
}

export async function login(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page.getByText(`Bienvenido ${email}`)).toBeVisible();
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
}

// El contador del header es lo que ve la persona: agregar terminó cuando el
// número subió en uno (cada clic agrega una unidad).
export async function addToCart(
  page: Page,
  productSlug: string,
): Promise<void> {
  await page.goto(`/products/${productSlug}`);
  const cartLink = page.getByRole("link", { name: "Carrito de compras" });
  const before = Number(await cartLink.textContent());

  await page.getByRole("button", { name: "Agregar al Carrito" }).click();

  await expect(cartLink).toHaveText(String(before + 1));
}
