import { Outlet, ScrollRestoration } from "react-router";
import Footer from "./footer";
import Header from "./header";
import { getCurrentUser } from "../services";
import { CartProvider } from "../providers/cart-provider";
import { logError } from "../lib/log-error";

export async function loader() {
  try {
    const user = await getCurrentUser();
    return { user };
  } catch (error) {
    logError(error);
    return { user: null };
  }
}

export default function RootLayout() {
  return (
    <CartProvider>
      <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
        <ScrollRestoration />
        <Header className="sticky top-0 z-50 border-b border-b-border bg-background" />
        <main>
          <Outlet />
        </main>
        <Footer className="border-t border-t-border" />
      </div>
    </CartProvider>
  );
}
