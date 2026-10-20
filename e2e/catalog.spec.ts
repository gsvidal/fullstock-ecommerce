import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

type Props =
  | {
      category: string;
      min?: number | undefined;
      max?: number | undefined;
    }
  | undefined;
type QueryProps = {
  queryResult: Locator[] | undefined;
  expectedTotal: number;
  expectedPrices: string[];
};
async function searchsProductBy(
  page: Page | null = null,
  options: Props = {
    category: "Polos",
    min: undefined,
    max: undefined,
  },
) {
  const { category, max, min } = options;
  if (page == null) return;
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: category })
    .click();
  if (min)
    await page.getByRole("spinbutton", { name: "Min" }).fill(min?.toString());
  if (max)
    await page.getByRole("spinbutton", { name: "Max" }).fill(max?.toString());

  await page.getByRole("button", { name: "Filtrar Productos" }).click();
  await page.waitForTimeout(2000);
  const result = await page
    .locator(
      "div[class='grid grow grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8'] > a[class='group block rounded-xl']",
    )
    .all();
  return result;
}
async function expectedQuery(
  props: QueryProps = {
    queryResult: undefined,
    expectedTotal: 0,
    expectedPrices: [],
  },
) {
  const { queryResult, expectedPrices, expectedTotal } = props;
  if (queryResult == undefined) return expect(false).toBe(true);
  expect(queryResult).toHaveLength(expectedTotal);
  for (const element of queryResult) {
    const paragrap = await element.locator(
      "p[class='mt-auto text-base font-medium']",
    );
    await expect(paragrap).toContainText(expectedPrices);
  }
}

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
test("Filtro con mínimo y máximo", async ({ page }) => {
  const queryResult = await searchsProductBy(page, {
    category: "Polos",
    min: 20,
    max: 20,
  });
  await expectedQuery({
    queryResult,
    expectedTotal: 4,
    expectedPrices: ["20.00"],
  });
  await page.reload();
  expect(
    await page.getByRole("spinbutton", { name: "Max" }).inputValue(),
  ).toContain("20");
  expect(
    await page.getByRole("spinbutton", { name: "Min" }).inputValue(),
  ).toContain("20");
});
test("Filtro con un solo límite Maximo", async ({ page }) => {
  const queryByMax = await searchsProductBy(page, {
    category: "stickers",
    max: 2.5,
  });
  await expectedQuery({
    queryResult: queryByMax,
    expectedTotal: 3,
    expectedPrices: ["2.49"],
  });

  const queryByMin = await searchsProductBy(page, {
    category: "tazas",
    min: 15,
  });
  await expectedQuery({
    queryResult: queryByMin,
    expectedTotal: 1,
    expectedPrices: ["15.99"],
  });
});
test("Filtro con un solo límite Minimo", async ({ page }) => {
  const queryByMin = await searchsProductBy(page, {
    category: "tazas",
    min: 15,
  });
  await expectedQuery({
    queryResult: queryByMin,
    expectedTotal: 1,
    expectedPrices: ["15.99"],
  });
});
test("Busqueda con filtro con rango inexistente y productos no encontrados", async ({
  page,
}) => {
  const querywithoutProductsMin = await searchsProductBy(page, {
    category: "tazas",
    min: 16666,
  });
  expect(querywithoutProductsMin).toHaveLength(0);
  //verificar mensaje
  await page
    .getByRole("paragraph", {
      name: "No hay productos en ese rango de precios.",
    })
    .isVisible();
  await page.goto("/");
  const querywithoutProductsMax = await searchsProductBy(page, {
    category: "tazas",
    min: 15,
  });
  expect(querywithoutProductsMax).toHaveLength(1);
  //verificar mensaje
  await page
    .getByRole("paragraph", {
      name: "No hay productos en ese rango de precios.",
    })
    .isVisible();

  const querywithoutProductsMaxAndMin = await searchsProductBy(page, {
    category: "tazas",
    min: 1,
    max: 1,
  });
  expect(querywithoutProductsMaxAndMin).toHaveLength(0);
  //verificar mensaje
  await page
    .getByRole("paragraph", {
      name: "No hay productos en ese rango de precios.",
    })
    .isVisible();
});
test("De la categoría a un producto, cargado y con la informacion correspondiente", async ({
  page,
}) => {
  await searchsProductBy(page);
  await page.getByRole("heading", { name: "Polo React" }).click();
  await page.getByRole("heading", { name: "Polo React" }).isVisible();
  await expect(page.getByTestId("product-description")).toContainText(
    "Viste tu pasión por React con estilo y comodidad en cada línea de código.",
  );
  await expect(
    page.getByTestId("product-features").getByRole("listitem"),
  ).toHaveText([
    "Estampado resistente que mantiene sus colores vibrantes lavado tras lavado.",
    "Hecho de algodón suave que asegura comodidad y frescura.",
    "Costuras reforzadas para una mayor durabilidad.",
    "Corte moderno que se adapta perfectamente al cuerpo.",
  ]);
});
test("Una categoría o un producto que no existen", async ({ page }) => {
  await page.goto("/categories/una-categoria-que-no-existe");

  await expect(page.getByText("Página no encontrada")).toBeVisible();
  await expect(page.getByText("Categoría no encontrada")).toBeVisible();
  await page.getByRole("link", { name: "Volver al Inicio" }).click();
  await expect(page).toHaveURL("/");

  await page.goto("/products/un-producto-que-no-existe");

  await expect(page.getByText("Página no encontrada")).toBeVisible();
  await expect(page.getByText("Producto no encontrado")).toBeVisible();
  await page.getByRole("link", { name: "Volver al Inicio" }).click();
  await expect(page).toHaveURL("/");
});
