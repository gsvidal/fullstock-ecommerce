import { Link } from "react-router";
import type { RecommendedProduct } from "../services/chatbot.service";

type RecommendedProductCardProps = {
  product: RecommendedProduct;
};

// La versión chica de `ProductCard`, para que entre en el panel del chat. Es un
// `Link` y no un `<a>`: navegar sin recargar la página mantiene la
// conversación, que vive en memoria.
export default function RecommendedProductCard({
  product,
}: RecommendedProductCardProps) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="flex items-center gap-3 rounded-lg border border-border bg-background p-2 hover:bg-muted-background"
    >
      <img
        src={product.imgSrc}
        alt=""
        className="size-12 shrink-0 rounded-md bg-muted-background object-contain"
      />
      <span className="flex flex-col">
        <span className="text-sm font-medium">{product.title}</span>
        <span className="text-sm text-muted-foreground">{product.price}</span>
      </span>
    </Link>
  );
}
