import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
} from "react-router";
import Header from "./components/header";
import ProgressBar from "./components/progress-bar";
import Footer from "./components/footer";
import type { ReactNode } from "react";
import { Spinner } from "./components/ui";
import RouteErrorBoundary from "./components/route-error-boundary";
import "./styles/index.css";
import { getSession, commitSession } from "./lib/session.server";
import { getCartFromSession, getUserFromSession } from "./lib/session-utils";
import ChatWidget from "./components/chat-widget";

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
  const session = await getSession(request);

  const [userResult, cartResult] = await Promise.all([
    getUserFromSession(session),
    getCartFromSession(session),
  ]);

  return data(
    { user: userResult.user, cart: cartResult.cart },
    {
      headers:
        userResult.sessionChanged || cartResult.sessionChanged
          ? { "Set-Cookie": await commitSession(session) }
          : undefined,
    },
  );
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
      <ChatWidget />
    </div>
  );
}
