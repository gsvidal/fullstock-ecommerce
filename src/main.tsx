import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { ErrorBoundary } from "react-error-boundary";
import { AuthProvider } from "./providers/auth-provider";
import { CartProvider } from "./providers/cart-provider";
import ErrorFallback from "./components/error-fallback";
import { Button } from "./components/ui";
import { logError } from "./lib/log-error";
import { router } from "./routes";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={logError}
      fallbackRender={() => (
        <ErrorFallback>
          <Button size="lg" onClick={() => window.location.reload()}>
            Recargar la página
          </Button>
        </ErrorFallback>
      )}
    >
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} onError={logError} />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
