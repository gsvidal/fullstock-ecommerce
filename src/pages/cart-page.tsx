import CartItem from "../components/cart-item";
import { Button, Container, MessageScreen, Section } from "../components/ui";
import { formatPrice } from "../lib/format-price";
import { useDocumentTitle } from "../hooks";
import { useCurrentCart } from "../hooks/use-current-cart";

export default function CartPage() {
  const cartResult = useCurrentCart();

  useDocumentTitle("Carrito");

  if (!cartResult.ok) {
    return (
      <MessageScreen
        title="Algo salió mal"
        description="No pudimos cargar tu carrito."
      >
        <Button size="lg" onClick={() => window.location.reload()}>
          Recargar la página
        </Button>
      </MessageScreen>
    );
  }

  const cart = cartResult.cart;
  const items = cart?.items ?? [];
  const totalPrice = cart?.totalPrice ?? 0;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-xl">
          <h1 className="mb-12 text-center text-3xl/8 font-bold">
            Carrito de compras
          </h1>
          <div className="flex flex-col rounded-xl border border-border">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <div className="flex justify-between border-b border-border p-6 text-base font-medium">
              <p>Total</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            <div className="p-6">
              <Button
                href={items.length === 0 ? "/" : "/checkout"}
                size="lg"
                className="w-full"
              >
                {items.length === 0 ? "Ir a la tienda" : "Continuar Compra"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
