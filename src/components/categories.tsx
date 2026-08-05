import { type Category as CategoryType } from "../types";
import Category from "./category";
import { Container } from "./ui";

type CategoriesProps = {
  categories: CategoryType[];
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-12 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold md:text-4xl">
            Compra por categoría
          </h2>
          <p className="mb-10 text-muted-foreground">
            Explora nuestra selección de productos especialmente diseñados para
            desarrolladores web.
            <br className="hidden md:block" />
            Encuentra lo que buscas navegando por nuestras categorías de polos,
            tazas, stickers y más.
          </p>
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
