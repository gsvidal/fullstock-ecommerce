import type { ReactNode } from "react";
import { MessageScreen } from "./ui";

type ErrorFallbackProps = {
  children: ReactNode;
};

/**
 * La pantalla de un ErrorBoundary. No consume ningún contexto ni nada que viva
 * por debajo del boundary: a un fallback no lo atrapa su propio boundary.
 */
export default function ErrorFallback({ children }: ErrorFallbackProps) {
  return (
    <MessageScreen
      title="Algo salió mal"
      description="Tuvimos un problema y no pudimos mostrar esta página."
    >
      {children}
    </MessageScreen>
  );
}
