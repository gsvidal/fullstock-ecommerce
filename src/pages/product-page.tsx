import { data, useFetcher } from "react-router";
import { Button, Container, Section, Separator } from "../components/ui";
import { getProduct } from "../services/product.service";
import { formatPrice } from "../lib/format-price";
import type { action as cartItemsAction } from "../routes/cart-items";
import { useCurrentCart } from "../hooks";
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
  const cartResult = useCurrentCart();

  const isAdding = fetcher.state !== "idle";
  const error = isAdding ? undefined : fetcher.data?.error;
  const isCartOk = cartResult.ok;

  return (
    <Section>
      <Container className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="max-w-xl min-w-[min(100%,28rem)] grow basis-0 self-center rounded-xl bg-muted-background md:min-w-fit md:self-start">
          <img
            src={product.imgSrc}
            alt={product.title}
            className="aspect-square w-full object-contain"
          />
        </div>
        <div className="grow basis-0">
          <h1 className="mb-3 text-3xl font-bold">{product.title}</h1>
          <p className="mb-6 text-3xl">{formatPrice(product.price)}</p>
          <p className="mb-10 text-sm text-muted-foreground">
            {product.description}
          </p>
          <fetcher.Form method="POST" action="/cart/items">
            <input type="hidden" name="intent" value="add" />
            <input type="hidden" name="productId" value={product.id} />
            <Button
              type="submit"
              size="xl"
              className="w-full md:w-80"
              disabled={isAdding || !isCartOk}
            >
              {isAdding ? "Agregando..." : "Agregar al Carrito"}
            </Button>
          </fetcher.Form>
          {!isCartOk && (
            <p className="mt-2 text-xs text-error" role="status">
              No pudimos cargar tu carrito. Recarga la página para agregar
              productos.
            </p>
          )}
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
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
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
