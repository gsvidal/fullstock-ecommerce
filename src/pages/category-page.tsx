import { data, useSearchParams } from "react-router";
import PriceFilter from "../components/price-filter";
import ProductCard from "../components/product-card";
import { Container, Section } from "../components/ui";
import { getCategory } from "../services/category.service";
import { getProductsByCategory } from "../services/product.service";
import { pageTitle } from "../lib/page-meta";
import type { Route } from "./+types/category-page";
import { MAX_INTEGER } from "../schemas/shared";

function parsePrice(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0
    ? Math.min(Math.round(parsed * 100), MAX_INTEGER)
    : undefined;
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;

  const url = new URL(request.url);
  const minPriceParam = url.searchParams.get("minPrice");
  const maxPriceParam = url.searchParams.get("maxPrice");

  const minPrice = parsePrice(minPriceParam);
  const maxPrice = parsePrice(maxPriceParam);

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug, { minPrice, maxPrice }),
  ]);

  if (!category) {
    throw data("Categoría no encontrada", { status: 404 });
  }
  return { category, products };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [pageTitle(loaderData.category.title)];
}

export default function CategoryPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { category, products } = loaderData;
  const { slug } = params;

  return (
    <>
      <Section className="border-b">
        <Container>
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl leading-none font-bold">
              {category.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row">
            <PriceFilter
              key={slug}
              className="w-full max-w-sm lg:max-w-xs"
              defaultMinPrice={searchParams.get("minPrice") ?? undefined}
              defaultMaxPrice={searchParams.get("maxPrice") ?? undefined}
            />
            {products.length === 0 ? (
              <p className="grow text-muted-foreground">
                No hay productos en ese rango de precios.
              </p>
            ) : (
              <div className="grid grow grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
