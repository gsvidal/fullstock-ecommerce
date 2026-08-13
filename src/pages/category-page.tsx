import {
  useLoaderData,
  data,
  type LoaderFunctionArgs,
  useSearchParams,
  useParams,
} from "react-router";
import PriceFilter from "../components/price-filter";
import ProductCard from "../components/product-card";
import { Container, Section } from "../components/ui";
import { useDocumentTitle } from "../hooks";
import { ApiError } from "../lib/api-error";
import { getCategory, getCategoryProducts } from "../services";

function parsePrice(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;

  const url = new URL(request.url);
  const minPriceParam = url.searchParams.get("minPrice");
  const maxPriceParam = url.searchParams.get("maxPrice");

  const minPriceSoles = parsePrice(minPriceParam);
  const maxPriceSoles = parsePrice(maxPriceParam);

  const minPrice =
    minPriceSoles !== undefined ? Math.round(minPriceSoles * 100) : undefined;
  const maxPrice =
    maxPriceSoles !== undefined ? Math.round(maxPriceSoles * 100) : undefined;

  try {
    const [category, products] = await Promise.all([
      getCategory(slug!),
      getCategoryProducts(slug!, { minPrice, maxPrice }),
    ]);
    return { category, products };
  } catch (error) {
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }
    throw error;
  }
}

export default function CategoryPage() {
  const { category, products } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();

  useDocumentTitle(category.title);

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
