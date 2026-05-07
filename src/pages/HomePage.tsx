import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="shell">
      <section className="home-hero-grid">
        <div style={{ minWidth: 0 }}>
          <p className="badge" style={{ marginBottom: "0.75rem" }}>
            Pickup · Made to order
          </p>
          <h1 className="display" style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", margin: "0 0 1rem" }}>
            Homemade catering for busy weeks and big tables
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "1.05rem", maxWidth: "38ch" }}>
            Browse a rotating weekly menu, build your cart for your headcount, and pick up
            everything ready to serve — no storefront lines, no mystery ingredients.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Link to="/menu" className="btn btn-primary">
              View menu by date
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Our story
            </Link>
          </div>
        </div>
        <div
          className="card"
          style={{
            padding: "1.5rem",
            background: "linear-gradient(145deg, #fffdf8, #e8dcc8)",
            minWidth: 0,
          }}
        >
          <h2 className="display" style={{ marginTop: 0 }}>How it works</h2>
          <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--color-muted)" }}>
            <li style={{ marginBottom: "0.75rem" }}>
              Choose your pickup date (2–14 days out).
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              Each weekday has its own 10-item menu: proteins, vegetarian mains, and sides.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              Tell us your guest count (6–30). Pricing is per guest for each selection.
            </li>
            <li>Check out with pickup details — your invoice saves locally for our kitchen.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
