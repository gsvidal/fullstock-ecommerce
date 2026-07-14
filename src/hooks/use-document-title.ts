import { useEffect } from "react";

const SITE_NAME = "Full Stock";

/**
 * Pone el título de la pestaña. En una SPA el documento nunca se recarga, así
 * que el `<title>` del index.html se queda pegado en todas las rutas si nadie
 * lo cambia.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    // Al desmontar, devolvemos el título a su estado neutro. Sin esto, una
    // página sin título dejaría en la pestaña el de la página anterior.
    return () => {
      document.title = SITE_NAME;
    };
  }, [title]);
}
