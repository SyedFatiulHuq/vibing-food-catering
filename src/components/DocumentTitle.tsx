import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

const ROUTE_TITLES: { pattern: string; title: string }[] = [
  { pattern: "/", title: "Homemade catering — Vibing Kitchen" },
  { pattern: "/menu", title: "Weekly menu — Vibing Kitchen" },
  { pattern: "/cart", title: "Your cart — Vibing Kitchen" },
  { pattern: "/checkout", title: "Checkout — Vibing Kitchen" },
  { pattern: "/about", title: "About us — Vibing Kitchen" },
  { pattern: "/contact", title: "Contact — Vibing Kitchen" },
  { pattern: "/item/:itemId", title: "Dish details — Vibing Kitchen" },
  { pattern: "/order/:orderId", title: "Order confirmed — Vibing Kitchen" },
];

const DEFAULT_TITLE = "Vibing Kitchen — Homemade catering";

export function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    for (const { pattern, title } of ROUTE_TITLES) {
      if (matchPath(pattern, pathname)) {
        document.title = title;
        return;
      }
    }
    document.title = DEFAULT_TITLE;
  }, [pathname]);

  return null;
}
