import { data, useLoaderData } from "react-router";
import Categories from "../../components/categories";
import Features from "../../components/features";
import Hero from "../../components/hero";
import { useDocumentTitle } from "../../hooks";
import { getCategories } from "../../services";
import { ApiError } from "../../lib/api-error";

export async function loader() {
  try {
    const categories = await getCategories();
    return { categories };
  } catch (error) {
    if (error instanceof ApiError) {
      throw data(error.message, { status: error.status });
    }
    throw error;
  }
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
