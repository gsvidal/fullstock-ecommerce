import { Outlet, ScrollRestoration } from "react-router";
import Footer from "./footer";
import Header from "./header";

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
