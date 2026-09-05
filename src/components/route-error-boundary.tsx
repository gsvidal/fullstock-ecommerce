import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorFallback from "./error-fallback";
import { Button, MessageScreen } from "./ui";
import {
  STATUS_TITLES,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
} from "../lib/error";

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
