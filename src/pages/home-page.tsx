import Categories from "../components/categories";
import Features from "../components/features";
import Hero from "../components/hero";
import { getCategories } from "../services/category.service";
import { pageTitle } from "../lib/page-meta";
import type { Route } from "./+types/home-page";

export async function loader() {
  const categories = await getCategories();

  return { categories };
}

export function meta() {
  return [pageTitle("Inicio")];
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <Features />
    </>
  );
}
