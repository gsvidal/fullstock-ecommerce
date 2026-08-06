import { useState } from "react";
import { useParams } from "react-router";
import { useCart } from "../providers/cart-provider";
import {
  Button,
  Container,
  MessageScreen,
  Section,
  Separator,
  Spinner,
} from "../components/ui";
import { useDocumentTitle, useFetch } from "../hooks";
import { ApiError } from "../lib/api-error";
import { getProduct } from "../services";
import NotFoundPage from "./not-found-page";
import { formatPrice } from "../lib/format-price";

export default function ProductPage() {
  const { slug } = useParams();
  const { status: cartStatus, addItem } = useCart();

  const {
    data: product,
    error,
    status,
  } = useFetch(() => getProduct(slug!), [slug]);

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

  if (status === "error") {
    // El producto no existe: eso no es un fallo, es una URL equivocada.
    if (error instanceof ApiError && error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar este producto."
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
