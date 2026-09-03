import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import Header from "./components/header";
import ProgressBar from "./components/progress-bar";
import Footer from "./components/footer";
import { getCart, getCurrentUser } from "./services";
import { logError } from "./lib/log-error";
import type { ReactNode } from "react";
import { Spinner } from "./components/ui";
import RouteErrorBoundary from "./components/route-error-boundary";
import "./styles/index.css";
import { apiCookies } from "./lib/api-cookies";

// Aplica el tema antes de que React monte, para evitar el parpadeo (FOUC).
// Venía del `<script>` inline de `index.html`, que ya no existe.
const THEME_SCRIPT = `(function () {
  const theme = localStorage.getItem("theme");
  const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (theme === "dark" || (!theme && systemIsDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.add("light");
  }
})();`;

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = apiCookies(request);
  const [user, cartResult] = await Promise.all([
    getCurrentUser(cookies).catch((error) => {
      logError(error);
      return null;
    }),
    getCart(cookies)
      .then((cart) => ({
        ok: true as const,
        cart,
      }))
      .catch((error) => {
        logError(error);
        return { ok: false as const };
      }),
  ]);

  return { user, cartResult };
}

export function shouldRevalidate({
  formMethod,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod != null && formMethod.toUpperCase() !== "GET") return true;

  return nextUrl.pathname === "/cart" || nextUrl.pathname === "/checkout";
}

export function meta() {
  return [
    {
      title: "Full Stock",
    },
  ];
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Vienen del <head> de index.html, que ya no existe. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Protest+Guerrilla&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <Spinner />;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default function Root() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <div className="sticky top-0 z-50">
        <Header className="border-b border-b-border bg-background" />
        <ProgressBar />
      </div>
      <main>
        <Outlet />
      </main>
      <Footer className="border-t border-t-border" />
    </div>
  );
}
