import { createBrowserRouter } from "react-router";
import RootLayout, { loader as rootLoader } from "./components/root-layout";
import CategoryPage, {
  loader as categoryPageLoader,
} from "./pages/category-page";
import HomePage, { loader as homePageLoader } from "./pages/home-page";
import ProductPage, { loader as productPageLoader } from "./pages/product-page";
import CartPage from "./pages/cart-page";
import CheckoutPage from "./pages/checkout-page";
import OrderConfirmationPage, {
  loader as orderConfirmationPageLoader,
} from "./pages/order-confirmation-page";
import AboutPage from "./pages/about-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";
import LoginPage, { action as loginAction } from "./pages/login-page";
import SignupPage, { action as signupAction } from "./pages/signup-page";
import NotFoundPage from "./pages/not-found-page";
import RouteErrorBoundary from "./components/route-error-boundary";
import { Spinner } from "./components/ui";
import { guestOnlyLoader } from "./lib/guest-only-loader";
import { logoutAction } from "./lib/logout-action";
import { cartItemsAction } from "./lib/cart-items-action";

export const router = createBrowserRouter([
  {
    id: "root",
    Component: RootLayout,
    loader: rootLoader,
    HydrateFallback: Spinner,
    // TODO: Definir si debemos incluir un ErrorBoundary aquí.
    children: [
      {
        ErrorBoundary: RouteErrorBoundary,
        HydrateFallback: Spinner,
        children: [
          { index: true, Component: HomePage, loader: homePageLoader },
          {
            path: "categories/:slug",
            Component: CategoryPage,
            loader: categoryPageLoader,
          },
          {
            path: "products/:slug",
            Component: ProductPage,
            loader: productPageLoader,
          },
          { path: "cart", Component: CartPage },
          { path: "checkout", Component: CheckoutPage },
          {
            path: "order-confirmation",
            Component: OrderConfirmationPage,
            loader: orderConfirmationPageLoader,
          },
          { path: "about", Component: AboutPage },
          { path: "terms", Component: TermsPage },
          { path: "privacy", Component: PrivacyPage },
          {
            loader: guestOnlyLoader,
            children: [
              { path: "login", Component: LoginPage, action: loginAction },
              { path: "signup", Component: SignupPage, action: signupAction },
            ],
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
  { path: "logout", action: logoutAction },
  { path: "cart/items", action: cartItemsAction },
]);
