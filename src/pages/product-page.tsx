import { data, useFetcher } from "react-router";
import { Button, Container, Section, Separator } from "../components/ui";
import { getProduct } from "../services/product.service";
import { formatPrice } from "../lib/format-price";
import type { action as cartItemsAction } from "../routes/cart-items";
import { pageTitle } from "../lib/page-meta";
import type { Route } from "./+types/product-page";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  const product = await getProduct(slug);

  if (!product) {
    throw data("Producto no encontrado", { status: 404 });
  }
  return { product };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [pageTitle(loaderData.product.title)];
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const fetcher = useFetcher<typeof cartItemsAction>();

  const isAdding = fetcher.state !== "idle";
  const error = isAdding ? undefined : fetcher.data?.error;

  return (
    <Section>
      <Container className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="max-w-xl min-w-[min(100%,28rem)] grow basis-0 self-center rounded-xl bg-muted-background md:min-w-fit md:self-start">
          <img
            data-testid="product-name"
            src={product.imgSrc}
            alt={product.title}
            className="aspect-square w-full object-contain"
          />
        </div>
        <div className="grow basis-0">
          <h1 className="mb-3 text-3xl font-bold">{product.title}</h1>
          <p className="mb-6 text-3xl">{formatPrice(product.price)}</p>
          <p
            className="mb-10 text-sm text-muted-foreground"
            data-testid="product-description"
          >
            {product.description}
          </p>
          <fetcher.Form method="POST" action="/cart/items">
            <input type="hidden" name="intent" value="add" />
            <input type="hidden" name="productId" value={product.id} />
            <Button
              type="submit"
              size="xl"
              className="w-full md:w-80"
              disabled={isAdding}
            >
              {isAdding ? "Agregando..." : "Agregar al Carrito"}
            </Button>
          </fetcher.Form>
          {error && (
            <p className="mt-2 text-xs text-error" role="alert">
              {error}
            </p>
          )}
          <Separator className="my-6" />
          <div>
            <h2 className="mb-6 text-sm font-semibold text-accent-foreground">
              Características
            </h2>
            <ul
              className="list-disc pl-4 text-sm text-muted-foreground"
              data-testid="product-features"
            >
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
