import { createBrowserRouter } from "react-router";
import RootLayout from "./components/root-layout";
import HomePage from "./pages/home-page";
import CategoryPage, {
  loader as categoryPageLoader,
} from "./pages/category-page";
import ProductPage, { loader as productPageLoader } from "./pages/product-page";
import CartPage from "./pages/cart-page";
import CheckoutPage from "./pages/checkout-page";
import OrderConfirmationPage from "./pages/order-confirmation-page";
import AboutPage from "./pages/about-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import NotFoundPage from "./pages/not-found-page";
import GuestRoute from "./components/guest-route";
import RouteErrorBoundary from "./components/route-error-boundary";
import { Spinner } from "./components/ui";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    // TODO: Definir si debemos incluir un ErrorBoundary aquí.
    children: [
      {
        ErrorBoundary: RouteErrorBoundary,
        HydrateFallback: Spinner,
        children: [
          { index: true, Component: HomePage },
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
          { path: "order-confirmation", Component: OrderConfirmationPage },
          { path: "about", Component: AboutPage },
          { path: "terms", Component: TermsPage },
          { path: "privacy", Component: PrivacyPage },
          {
            Component: GuestRoute,
            children: [
              { path: "login", Component: LoginPage },
              { path: "signup", Component: SignupPage },
            ],
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
