import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorFallback from "./error-fallback";
import { Button, MessageScreen } from "./ui";

const STATUS_TITLES: Record<number, string> = {
  400: "Solicitud inválida",
  401: "Inicia sesión para continuar",
  403: "No tienes acceso",
  404: "Página no encontrada",
  409: "No pudimos completar la operación",
};

const DEFAULT_TITLE = "Algo salió mal";
const DEFAULT_DESCRIPTION =
  "No pudimos completar tu solicitud. Intenta de nuevo.";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const message = typeof error.data === "string" ? error.data : undefined;

    return (
      <MessageScreen
        title={STATUS_TITLES[error.status] ?? DEFAULT_TITLE}
        description={message ?? DEFAULT_DESCRIPTION}
      >
        <Button href="/" size="lg">
          Volver al Inicio
        </Button>
      </MessageScreen>
    );
  }

  return (
    <ErrorFallback>
      <Button href="/" size="lg">
        Volver al Inicio
      </Button>
    </ErrorFallback>
  );
}
