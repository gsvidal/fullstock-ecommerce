import Categories from "../../components/categories";
import Features from "../../components/features";
import Hero from "../../components/hero";
import { Button, MessageScreen, Spinner } from "../../components/ui";
import { useDocumentTitle, useFetch } from "../../hooks";
import { getCategories } from "../../services";

export default function HomePage() {
  const { data: categories, status } = useFetch(() => getCategories(), []);
  useDocumentTitle("Inicio");

  return (
    <>
      <Hero />
      {status === "loading" && <Spinner />}
      {status === "error" && (
        <MessageScreen
          title="Algo salió mal"
          description="No pudimos cargar las categorías."
        >
          <Button size="lg" onClick={() => window.location.reload()}>
            Recargar la página
          </Button>
        </MessageScreen>
      )}
      {status === "success" && <Categories categories={categories} />}
      <Features />
    </>
  );
}
