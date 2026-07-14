import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router";
import App from "./app";
import { AuthProvider } from "./providers/auth-provider";
import { CartProvider } from "./providers/cart-provider";
import ErrorFallback from "./components/error-fallback";
import { Button } from "./components/ui";
import { logError } from "./lib/log-error";
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
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
