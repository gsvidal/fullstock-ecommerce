import { Button, MessageScreen } from "../../components/ui";
import { useDocumentTitle } from "../../hooks";

export default function NotFoundPage() {
  useDocumentTitle("Página no encontrada");

  return (
    <MessageScreen
      title="Página no encontrada"
      description="La página que buscas no existe o fue movida."
    >
      {/* La app está sana: solo la URL estaba mal, así que navegar la arregla. */}
      <Button href="/" size="lg">
        Volver al Inicio
      </Button>
    </MessageScreen>
  );
}
