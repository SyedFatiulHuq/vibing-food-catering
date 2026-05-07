import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { business } from "../../data/business";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navId = useId();
  const togglerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { totalQuantity } = useCart();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        togglerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="brand" aria-label={`${business.name} — home`}>
          <span className="brand__mark" aria-hidden="true">
            H
          </span>
          <span>{business.name}</span>
        </NavLink>

        <button
          type="button"
          ref={togglerRef}
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>

        <nav
          id={navId}
          className="primary-nav"
          aria-label="Primary"
          data-open={open ? "true" : "false"}
        >
          <ul className="primary-nav__list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="primary-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/cart" className="primary-nav__link">
                <span>Cart</span>
                <span
                  className="primary-nav__badge"
                  aria-label={
                    totalQuantity === 0
                      ? "no items in cart"
                      : `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} in cart`
                  }
                >
                  {totalQuantity}
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
