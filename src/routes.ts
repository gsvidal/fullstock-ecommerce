import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

const routes: RouteConfig = [
  layout("./pages/main-layout.tsx", [
    index("./pages/home-page.tsx"),
    route("categories/:slug", "./pages/category-page.tsx"),
    route("products/:slug", "./pages/product-page.tsx"),
    route("cart", "./pages/cart-page.tsx"),
    route("cart/items", "./routes/cart-items.ts"),
    route("checkout", "./pages/checkout-page/checkout-page.tsx"),
    route("order-confirmation", "./pages/order-confirmation-page.tsx"),
    route("about", "./pages/about-page/about-page.tsx"),
    route("terms", "./pages/terms-page/terms-page.tsx"),
    route("privacy", "./pages/privacy-page/privacy-page.tsx"),
    layout("./routes/guest-layout.tsx", [
      route("login", "./pages/login-page.tsx"),
      route("signup", "./pages/signup-page.tsx"),
    ]),
    route("logout", "./routes/logout.ts"),
    route("*", "./pages/not-found-page/not-found-page.tsx"),
  ]),
];

export default routes;
