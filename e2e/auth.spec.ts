import { expect, test } from "@playwright/test";
import {
  expectFieldError,
  login,
  logout,
  signup,
  uniqueEmail,
} from "./helpers.ts";

test("una persona nueva crea su cuenta", async ({ page }) => {
  await signup(page);

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("button", { name: "Cerrar sesión" }),
  ).toBeVisible();
});

test("enviar el registro vacío muestra los errores y sigue en /signup", async ({
  page,
}) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expectFieldError(
    page,
    "Correo electrónico",
    "Ingresa un correo válido",
  );
  await expectFieldError(page, "Contraseña", "Usa al menos 6 caracteres");
  await expect(page).toHaveURL("/signup");
  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
});

test("contraseñas distintas muestran error y sigue en /signup", async ({
  page,
}) => {
  await page.goto("/signup");

  const email = uniqueEmail();
  const password = "secreto123";
  const passwordConfirmation = "secreto124";

  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByLabel("Confirma tu contraseña").fill(passwordConfirmation);
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expectFieldError(
    page,
    "Confirma tu contraseña",
    "Las contraseñas no coinciden",
  );
  await expect(page).toHaveURL("/signup");
  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
});

test("no se puede registrar un correo que ya existe", async ({ page }) => {
  const email = await signup(page);
  await logout(page);

  await page.goto("/signup");

  const password = "secreto123";
  const passwordConfirmation = "secreto123";

  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(password);
  await page.getByLabel("Confirma tu contraseña").fill(passwordConfirmation);
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expectFieldError(
    page,
    "Correo electrónico",
    "El email ya está registrado",
  );
  await expect(page).toHaveURL("/signup");
  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
});

test("iniciar sesión lleva a / y muestra Bienvenido", async ({ page }) => {
  const email = await signup(page);
  await logout(page);
  await login(page, email);

  await expect(page).toHaveURL("/");
  await expect(page.getByText(`Bienvenido ${email}`)).toBeVisible();
});

test("contraseña equivocada muestra credenciales inválidas", async ({
  page,
}) => {
  const email = await signup(page);
  await logout(page);

  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill("otra-clave");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page.getByText("Credenciales inválidas")).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("un correo que no existe muestra credenciales inválidas", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(uniqueEmail());
  await page.getByLabel("Contraseña", { exact: true }).fill("otra-clave");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();

  await expect(page.getByText("Credenciales inválidas")).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("cerrar sesión muestra los links de invitado y al recargar no vuelve", async ({
  page,
}) => {
  await signup(page);
  await logout(page);

  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Crear una cuenta" }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Crear una cuenta" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toHaveCount(
    0,
  );
});

test("con la sesión iniciada al ir a '/login' o '/signup' redirige a '/'", async ({
  page,
}) => {
  await signup(page);

  await page.goto("/login");

  await expect(page).toHaveURL("/");

  await page.goto("/signup");

  await expect(page).toHaveURL("/");
});
