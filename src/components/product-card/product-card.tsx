import { Link } from "react-router";
import type { Product } from "../../types";
import styles from "./styles.module.css";
import { formatPrice } from "../../lib/format-price";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className={styles["product-card"]}>
      <div className={styles["product-card__container"]}>
        <div className={styles["product-card__image-container"]}>
          <img
            src={product.imgSrc}
            alt={product.title}
            className={styles["product-card__image"]}
          />
        </div>
        <div className={styles["product-card__content"]}>
          <h2 className={styles["product-card__title"]}>{product.title}</h2>
          <p className={styles["product-card__description"]}>
            {product.description}
          </p>
          <p className={styles["product-card__price"]}>
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
