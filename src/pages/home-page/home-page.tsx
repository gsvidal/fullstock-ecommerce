import { useLoaderData } from "react-router";
import Categories from "../../components/categories";
import Features from "../../components/features";
import Hero from "../../components/hero";
import { useDocumentTitle } from "../../hooks";
import { getCategories } from "../../services";

export async function loader() {
  const categories = await getCategories();
  return { categories };
}

export default function HomePage() {
  const { categories } = useLoaderData<typeof loader>();
  useDocumentTitle("Inicio");

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <Features />
    </>
  );
}
