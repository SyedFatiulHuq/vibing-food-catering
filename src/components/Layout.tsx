import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  fontWeight: isActive ? 700 : 500,
  color: isActive ? "var(--color-accent)" : "var(--color-ink)",
  textDecoration: isActive ? "underline" : "none",
  textUnderlineOffset: "0.18em",
  display: "inline-flex",
  alignItems: "center",
  minHeight: "44px",
  padding: "0.25rem 0.55rem",
  borderRadius: "8px",
});

export function Layout() {
  const { lines } = useCart();
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          const mainEl = document.getElementById("main-content");
          if (!mainEl) return;
          e.preventDefault();
          mainEl.focus();
          mainEl.scrollIntoView({ block: "start" });
        }}
      >
        Skip to main content
      </a>
      <header
        style={{
          borderBottom: "2px solid var(--color-border)",
          background: "rgba(255, 253, 248, 0.92)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          className="shell"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1rem 0",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="display" style={{ fontSize: "1.5rem" }}>
              Vibing Kitchen
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.8rem",
                color: "var(--color-muted)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Homemade catering · pickup only
            </span>
          </Link>
          <nav aria-label="Primary" style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
            <NavLink to="/menu" style={navLinkStyle}>
              Menu
            </NavLink>
            <NavLink to="/cart" style={navLinkStyle}>
              Cart{count > 0 ? ` (${count})` : ""}
            </NavLink>
            <NavLink to="/about" style={navLinkStyle}>
              About
            </NavLink>
            <NavLink to="/contact" style={navLinkStyle}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} style={{ flex: 1, padding: "2rem 0 3rem" }}>
        <Outlet />
      </main>
      <footer
        role="contentinfo"
        aria-label="Site footer"
        style={{
          borderTop: "2px solid var(--color-border)",
          padding: "1.5rem 0",
          color: "var(--color-muted)",
          fontSize: "0.9rem",
        }}
      >
        <div className="shell">
          <p style={{ margin: "0 0 1rem" }}>
            © {new Date().getFullYear()} Vibing Kitchen. Crafted for gatherings,
            served with care.
          </p>
          {/* 2.4.5 Multiple Ways — auxiliary navigation */}
          <nav aria-label="Site">
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem 1.5rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li style={{ margin: 0 }}>
                <Link to="/">Home</Link>
              </li>
              <li style={{ margin: 0 }}>
                <Link to="/menu">Full menu</Link>
              </li>
              <li style={{ margin: 0 }}>
                <Link to="/about">About</Link>
              </li>
              <li style={{ margin: 0 }}>
                <Link to="/contact">Contact</Link>
              </li>
              <li style={{ margin: 0 }}>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
