import { Button, MessageScreen } from "../components/ui";

export function meta() {
  return [
    {
      title: "Página no encontrada",
    },
  ];
}

export default function NotFoundPage() {
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
