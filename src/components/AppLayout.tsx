import type { ReactNode } from "react";
import { SkipLink } from "./SkipLink";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useCart } from "../context/CartContext";

export function AppLayout({ children }: { children: ReactNode }) {
  const { statusMessage } = useCart();

  return (
    <>
      <SkipLink />
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {statusMessage}
      </div>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="site-main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
