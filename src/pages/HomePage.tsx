import { Link } from "react-router-dom";
import { business } from "../data/business";
import { dayLabels } from "../data/menu";
import { dayKeyForDate, formatLongDate, minOrderDate } from "../utils/dateUtils";

export const HomePage = () => {
  const earliestPickup = minOrderDate();
  const earliestDayKey = dayKeyForDate(earliestPickup);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div>
            <h1 id="hero-title">{business.tagline}</h1>
            <p className="hero__lead">
              {business.shortDescription} Order at least 2 days ahead and up to 2 weeks in
              advance. We&rsquo;ll have it warm and ready for pickup at your chosen time.
            </p>

            <div className="hero__actions">
              <Link to="/menu" className="btn">
                Browse the menu
              </Link>
              <Link to="/about" className="btn btn--secondary">
                About us
              </Link>
            </div>
          </div>

          <aside className="hero__visual" aria-labelledby="next-pickup-title">
            <h2 id="next-pickup-title" style={{ fontSize: "1.1rem", margin: 0 }}>
              Earliest pickup
            </h2>
            <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>
              {formatLongDate(earliestPickup)}
            </p>
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              That day&rsquo;s menu: <strong>{dayLabels[earliestDayKey]}</strong>
            </p>
            <Link to="/menu" className="btn btn--secondary btn--sm" style={{ alignSelf: "flex-start" }}>
              See the menu
            </Link>
          </aside>
        </div>
      </section>

      <section className="container section" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title">How it works</h2>
        <p style={{ maxWidth: "60ch", color: "var(--color-text-muted)" }}>
          A small business with a small process — from your kitchen to ours.
        </p>

        <ol className="feature-grid" style={{ listStyle: "none", padding: 0 }}>
          <li className="feature">
            <span className="feature__icon" aria-hidden="true">
              1
            </span>
            <h3>Pick a day</h3>
            <p style={{ margin: 0 }}>
              Each day of the week has its own menu — Mediterranean Mondays, Taco Tuesdays, BBQ
              Saturdays, and more. Choose any day from 2 days to 2 weeks out.
            </p>
          </li>
          <li className="feature">
            <span className="feature__icon" aria-hidden="true">
              2
            </span>
            <h3>Build your order</h3>
            <p style={{ margin: 0 }}>
              Add proteins, vegetarian mains, and sides for 6&ndash;30 people. We&rsquo;ll handle
              the cooking, packaging, and reheating instructions.
            </p>
          </li>
          <li className="feature">
            <span className="feature__icon" aria-hidden="true">
              3
            </span>
            <h3>Pick up warm</h3>
            <p style={{ margin: 0 }}>
              Stop by our kitchen at your scheduled time. Pay with card or cash on pickup —
              your meal is hot, packed, and ready.
            </p>
          </li>
        </ol>
      </section>

      <section
        className="container section"
        aria-labelledby="weekly-rotation-title"
        style={{ paddingTop: 0 }}
      >
        <h2 id="weekly-rotation-title">This week&rsquo;s rotation</h2>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "60ch" }}>
          A peek at our regular weekly themes. Visit the menu page to see the full lineup for
          your chosen pickup day.
        </p>
        <ul
          className="feature-grid"
          style={{
            listStyle: "none",
            padding: 0,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {(Object.entries(dayLabels) as [keyof typeof dayLabels, string][]).map(([k, label]) => (
            <li key={k} className="feature" style={{ gap: "0.25rem" }}>
              <span className="cat-pill" data-cat="protein" aria-hidden="true">
                {label.split("—")[0].trim()}
              </span>
              <strong style={{ marginTop: "0.25rem" }}>{label.split("—")[1]?.trim()}</strong>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
