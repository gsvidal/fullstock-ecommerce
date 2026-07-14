import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, useLocation } from "react-router";
import { logError } from "../../lib/log-error";
import ErrorFallback from "../error-fallback";
import Footer from "../footer";
import Header from "../header";
import { Button } from "../ui";
import styles from "./styles.module.css";

export default function RootLayout() {
  // El navegador solo resetea el scroll cuando carga un documento nuevo, y en
  // una SPA eso ya no ocurre: al navegar, el scroll se queda donde estaba.
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.root}>
      <Header className={styles["root__header"]} />
      <main>
        <ErrorBoundary
          onError={logError}
          resetKeys={[pathname]}
          fallbackRender={() => (
            <ErrorFallback>
              <Button href="/" size="lg">
                Volver al Inicio
              </Button>
            </ErrorFallback>
          )}
        >
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer className={styles["root__footer"]} />
    </div>
  );
}
