import { Link } from "react-router-dom";
import { business } from "../data/business";

export const AboutPage = () => (
  <div className="container section">
    <p className="crumbs">
      <Link to="/">Home</Link> <span aria-hidden="true">/</span> About
    </p>
    <h1>About {business.name}</h1>
    <p style={{ color: "var(--color-text-muted)", maxWidth: "60ch" }}>
      Founded in {business.founded} by chef {business.ownerName}, we cook the way we&rsquo;d cook
      for our own family.
    </p>

    <section aria-labelledby="story-title" style={{ marginTop: "1rem" }}>
      <h2 id="story-title">Our story</h2>
      {business.about.story.map((paragraph, idx) => (
        <p key={idx} style={{ maxWidth: "65ch" }}>
          {paragraph}
        </p>
      ))}
    </section>

    <section aria-labelledby="stats-title">
      <h2 id="stats-title" className="sr-only">
        By the numbers
      </h2>
      <div className="stat-grid" role="list">
        {business.about.stats.map((s) => (
          <div key={s.label} role="listitem">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>

    <section aria-labelledby="values-title">
      <h2 id="values-title">What we care about</h2>
      <ul className="values-grid" style={{ listStyle: "none", padding: 0 }}>
        {business.about.values.map((v) => (
          <li key={v.title} className="feature">
            <h3 style={{ marginTop: 0 }}>{v.title}</h3>
            <p style={{ margin: 0 }}>{v.body}</p>
          </li>
        ))}
      </ul>
    </section>

    <section style={{ marginTop: "2rem" }}>
      <h2>Ready to taste it?</h2>
      <p>Browse the menu for your chosen pickup day and put together your order.</p>
      <Link to="/menu" className="btn">
        See the menu
      </Link>
    </section>
  </div>
);
