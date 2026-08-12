import { isRouteErrorResponse, useRouteError } from "react-router";
import NotFoundPage from "../pages/not-found-page";
import ErrorFallback from "./error-fallback";
import { Button } from "./ui";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <ErrorFallback>
      <Button href="/" size="lg">
        Volver al Inicio
      </Button>
    </ErrorFallback>
  );
}
