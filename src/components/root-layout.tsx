import { Outlet, ScrollRestoration } from "react-router";
import Footer from "./footer";
import Header from "./header";
import { getCart, getCurrentUser } from "../services";

export async function loader() {
  const [user, cartResult] = await Promise.all([
    getCurrentUser().catch((error) => {
      console.error(error);
      return null;
    }),
    getCart()
      .then((cart) => ({
        ok: true as const,
        cart,
      }))
      .catch((error) => {
        console.error(error);
        return { ok: false as const };
      }),
  ]);

  return { user, cartResult };
}

export default function RootLayout() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <ScrollRestoration />
      <Header className="sticky top-0 z-50 border-b border-b-border bg-background" />
      <main>
        <Outlet />
      </main>
      <Footer className="border-t border-t-border" />
    </div>
  );
}
