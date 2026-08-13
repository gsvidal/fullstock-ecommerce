import { useState } from "react";
import { useLoaderData, data, type LoaderFunctionArgs } from "react-router";
import { useCart } from "../providers/cart-provider";
import { Button, Container, Section, Separator } from "../components/ui";
import { useDocumentTitle } from "../hooks";
import { getProduct } from "../services";
import { formatPrice } from "../lib/format-price";
import { ApiError } from "../lib/api-error";

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

  const { status: cartStatus, addItem } = useCart();

  useDocumentTitle(product?.title ?? "Cargando...");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function handleAddToCart() {
    if (product === null) return;

    setAddError(null);
    setIsAdding(true);
    try {
      await addItem(product.id);
    } catch (error) {
      console.error(error);
      setAddError("No pudimos agregar el producto. Intenta de nuevo.");
    } finally {
      setIsAdding(false);
    }
  }

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
          <Button
            type="button"
            size="xl"
            className="w-full md:w-80"
            onClick={handleAddToCart}
            disabled={isAdding || cartStatus !== "success"}
          >
            {isAdding ? "Agregando..." : "Agregar al Carrito"}
          </Button>
          {cartStatus === "error" && (
            <p className="mt-2 text-xs text-error" role="status">
              No pudimos cargar tu carrito. Recarga la página para agregar
              productos.
            </p>
          )}
          {addError && (
            <p className="mt-2 text-xs text-error" role="alert">
              {addError}
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
