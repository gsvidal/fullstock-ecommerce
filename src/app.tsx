import { Route, Routes } from "react-router";
import GuestRoute from "./components/guest-route";
import RootLayout from "./components/root-layout";
import HomePage from "./pages/home-page";
import CategoryPage from "./pages/category-page";
import ProductPage from "./pages/product-page";
import CartPage from "./pages/cart-page";
import CheckoutPage from "./pages/checkout-page";
import OrderConfirmationPage from "./pages/order-confirmation-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import NotFoundPage from "./pages/not-found-page";
import AboutPage from "./pages/about-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="categories/:slug" element={<CategoryPage />} />
        <Route path="products/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
