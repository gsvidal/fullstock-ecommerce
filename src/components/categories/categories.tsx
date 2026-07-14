import { type Category as CategoryType } from "../../types";
import Category from "../category";
import { Container } from "../ui";
import styles from "./styles.module.css";

type CategoriesProps = {
  categories: CategoryType[];
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className={styles["categories"]}>
      <Container>
        <div className={styles["categories__header"]}>
          <h2 className={styles["categories__title"]}>Compra por categoría</h2>
          <p className={styles["categories__description"]}>
            Explora nuestra selección de productos especialmente diseñados para
            desarrolladores web.
            <br className={styles["categories__description-break"]} />
            Encuentra lo que buscas navegando por nuestras categorías de polos,
            tazas, stickers y más.
          </p>
        </div>
        <div className={styles["categories__grid"]}>
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
