import {
  Outlet,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import Footer from "./footer";
import Header from "./header";
import { getCart, getCurrentUser } from "../services";
import ProgressBar from "./progress-bar";
import { logError } from "../lib/log-error";

export async function loader() {
  const [user, cartResult] = await Promise.all([
    getCurrentUser().catch((error) => {
      logError(error);
      return null;
    }),
    getCart()
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

export default function RootLayout() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <ScrollRestoration />
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
