import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="container section">
    <p className="crumbs">
      <Link to="/">Home</Link> <span aria-hidden="true">/</span> Page not found
    </p>
    <h1>We couldn&rsquo;t find that page</h1>
    <p>The link may be broken, or the page may have been moved.</p>
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Link to="/" className="btn">
        Back home
      </Link>
      <Link to="/menu" className="btn btn--secondary">
        See the menu
      </Link>
    </div>
  </div>
);
