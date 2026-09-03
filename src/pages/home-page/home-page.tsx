import { data, useLoaderData } from "react-router";
import Categories from "../../components/categories";
import Features from "../../components/features";
import Hero from "../../components/hero";
import { getCategories } from "../../services";
import { ApiError } from "../../lib/api-error";
import { pageTitle } from "../../lib/page-meta";

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

export function meta() {
  return [pageTitle("Inicio")];
}

export default function HomePage() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <Features />
    </>
  );
}
