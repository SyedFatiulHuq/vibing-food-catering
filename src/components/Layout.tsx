import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Layout() {
  const { cartCount } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-logo">
            Vibing Kitchen
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="nav-toggle__bar" aria-hidden />
          </button>
          <nav
            id="primary-nav"
            className={`nav${navOpen ? ' nav--open' : ''}`}
            aria-label="Primary"
          >
            <NavLink to="/" end onClick={() => setNavOpen(false)}>
              Menu
            </NavLink>
            <NavLink to="/cart" onClick={() => setNavOpen(false)} className="nav-cart">
              Cart
              {cartCount > 0 ? (
                <span className="badge" aria-label={`${cartCount} portions in cart`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </NavLink>
            <NavLink to="/about" onClick={() => setNavOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setNavOpen(false)}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet key={location.pathname} />
      <footer className="footer">
        <p>
          Homemade pickup catering · Demo content ·{' '}
          <Link to="/contact">Get in touch</Link>
        </p>
      </footer>
    </>
  );
}
