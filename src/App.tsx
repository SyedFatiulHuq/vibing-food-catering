import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { PickupDateProvider } from "./context/PickupDateContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { SkipLink } from "./components/layout/SkipLink";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { FoodDetailPage } from "./pages/FoodDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { InvoicePage } from "./pages/InvoicePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const RouteAnnouncer = () => {
  const location = useLocation();

  useEffect(() => {
    // Reset focus and scroll on each route change so screen readers announce the new page.
    window.scrollTo(0, 0);
    const main = document.getElementById("main-content");
    if (main) {
      main.focus({ preventScroll: true });
    }
    // Update document title from h1, after render.
    requestAnimationFrame(() => {
      const h1 = document.querySelector("main h1");
      if (h1) {
        document.title = `${h1.textContent?.trim()} · Hearth & Honey Catering`;
      } else {
        document.title = "Hearth & Honey Catering";
      }
    });
  }, [location.pathname]);

  return null;
};

const App = () => (
  <CartProvider>
    <PickupDateProvider>
      <SkipLink />
      <Header />
      <RouteAnnouncer />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/item/:itemId" element={<FoodDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/invoice/:orderId" element={<InvoicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </PickupDateProvider>
  </CartProvider>
);

export default App;
