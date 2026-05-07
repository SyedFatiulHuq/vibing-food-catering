import { Link, NavLink } from "react-router-dom";
import { BUSINESS } from "../data/businessInfo";
import { useCart } from "../context/CartContext";

function cartCount(lines: { quantity: number }[]): number {
  return lines.reduce((a, b) => a + b.quantity, 0);
}

export function SiteHeader() {
  const { lines } = useCart();
  const count = cartCount(lines);
  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <Link to="/" className="site-logo">
          <span className="site-logo__name">{BUSINESS.legalName}</span>
          <span className="site-logo__tagline">{BUSINESS.tagline}</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `site-nav__link${isActive ? " is-active" : ""}`
                }
                to="/menu"
              >
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink className="site-nav__link" to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink className="site-nav__link" to="/contact">
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink className="site-nav__link site-nav__cart" to="/cart">
                Cart
                {count > 0 ? (
                  <span className="site-nav__badge" aria-label={`${count} items in cart`}>
                    {count}
                  </span>
                ) : null}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
