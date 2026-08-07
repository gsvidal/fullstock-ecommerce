import { useParams, useSearchParams } from "react-router";
import PriceFilter from "../components/price-filter";
import ProductCard from "../components/product-card";
import {
  Button,
  Container,
  MessageScreen,
  Section,
  Spinner,
} from "../components/ui";
import { useDocumentTitle, useFetch } from "../hooks";
import { ApiError } from "../lib/api-error";
import { getCategory, getCategoryProducts } from "../services";
import NotFoundPage from "./not-found-page";

function parsePrice(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, error, status } = useFetch(
    () => Promise.all([getCategory(slug!), getCategoryProducts(slug!)]),
    [slug],
  );

  useDocumentTitle(data?.[0].title ?? "Cargando...");

  function handleFilter(formData: FormData) {
    const min = formData.get("minPrice");
    const max = formData.get("maxPrice");

    const next = new URLSearchParams(searchParams);

    if (typeof min === "string" && min.trim() !== "") next.set("minPrice", min);
    else next.delete("minPrice");

    if (typeof max === "string" && max.trim() !== "") next.set("maxPrice", max);
    else next.delete("maxPrice");

    setSearchParams(next);
  }

  if (status === "error") {
    // La categoría no existe: eso no es un fallo, es una URL equivocada.
    if (error instanceof ApiError && error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar esta categoría."
      >
        <Button size="lg" onClick={() => window.location.reload()}>
          Recargar la página
        </Button>
      </MessageScreen>
    );
  }

  if (status === "loading") {
    return <Spinner />;
  }

  const [category, products] = data;

  const minPrice = parsePrice(searchParams.get("minPrice"));
  const maxPrice = parsePrice(searchParams.get("maxPrice"));
  const visibleProducts = products.filter((product) => {
    const priceInSoles = product.price / 100; // el precio viene en centavos
    if (minPrice !== undefined && priceInSoles < minPrice) return false;
    if (maxPrice !== undefined && priceInSoles > maxPrice) return false;
    return true;
  });

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
              onFilter={handleFilter}
            />
            {visibleProducts.length === 0 ? (
              <p className="grow text-muted-foreground">
                No hay productos en ese rango de precios.
              </p>
            ) : (
              <div className="grid grow grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
                {visibleProducts.map((product) => (
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
