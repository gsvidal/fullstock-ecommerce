import { Link } from "react-router";
import type { Category as CategoryType } from "../repositories/category.repository";

type CategoryProps = {
  category: CategoryType;
};

export default function Category({ category }: CategoryProps) {
  return (
    <Link to={`/categories/${category.slug}`} className="group flex-1">
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={category.imgSrc}
          alt={category.alt ?? category.title}
          className="aspect-3/2 w-full object-cover"
        />
      </div>
      <div>
        <h3 className="mb-2 font-semibold group-hover:underline group-focus-visible:underline">
          {category.title}
        </h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
    </Link>
  );
}
