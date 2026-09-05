import { Link } from "react-router";
import type { Product } from "../repositories/product.repository";
import { formatPrice } from "../lib/format-price";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className="group block rounded-xl">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-separator">
        <div className="aspect-3/4 bg-muted-background">
          <img
            src={product.imgSrc}
            alt={product.title}
            className="size-full object-contain transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
          />
        </div>
        <div className="flex grow flex-col gap-2 p-4">
          <h2 className="text-sm font-medium">{product.title}</h2>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="mt-auto text-base font-medium">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
