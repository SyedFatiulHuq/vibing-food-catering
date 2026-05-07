import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  fontWeight: isActive ? 700 : 500,
  color: isActive ? "var(--color-accent)" : "var(--color-ink)",
});

export function Layout() {
  const { lines } = useCart();
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
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
          <Link to="/" style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}>
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
          <nav
            aria-label="Primary navigation"
            style={{
              display: "flex",
              gap: "1.25rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
      <main style={{ flex: 1, padding: "2rem 0 3rem", minWidth: 0, width: "100%", boxSizing: "border-box" }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1.5rem 0",
          color: "var(--color-muted)",
          fontSize: "0.9rem",
        }}
      >
        <div className="shell">
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Vibing Kitchen. Crafted for gatherings,
            served with care.
          </p>
        </div>
      </footer>
    </div>
  );
}
