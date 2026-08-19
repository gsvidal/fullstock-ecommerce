import {
  useLoaderData,
  data,
  type LoaderFunctionArgs,
  useFetcher,
} from "react-router";
import { Button, Container, Section, Separator } from "../components/ui";
import { useDocumentTitle } from "../hooks";
import { getProduct } from "../services";
import { formatPrice } from "../lib/format-price";
import { ApiError } from "../lib/api-error";
import type { cartItemsAction } from "../lib/cart-items-action";
import { useCurrentCart } from "../hooks/use-current-cart";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { slug } = params;
    const product = await getProduct(slug!);
    return { product };
  } catch (error) {
    // Que el producto no exista no es un fallo de la app: es una URL equivocada.
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }
    throw error;
  }
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof cartItemsAction>();
  const cartResult = useCurrentCart();
  useDocumentTitle(product?.title ?? "Cargando...");

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
