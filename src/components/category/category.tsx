import { Link } from "react-router";
import { type Category } from "../../types";
import styles from "./styles.module.css";

type CategoryProps = {
  category: Category;
};

export default function Category({ category }: CategoryProps) {
  return (
    <Link to={`/categories/${category.slug}`} className={styles["category"]}>
      <div className={styles["category__image"]}>
        <img src={category.imgSrc} alt={category.alt ?? category.title} />
      </div>
      <div>
        <h3 className={styles["category__title"]}>{category.title}</h3>
        <p className={styles["category__description"]}>
          {category.description}
        </p>
      </div>
    </Link>
  );
}
