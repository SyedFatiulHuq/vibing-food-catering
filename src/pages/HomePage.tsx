import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { BUSINESS } from "../data/businessInfo";
import { usePageTitle } from "../hooks/usePageTitle";

export function HomePage() {
  usePageTitle("Homemade catering for pickup");

  return (
    <AppLayout>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <h1 id="hero-heading">{BUSINESS.legalName}</h1>
          <p className="hero__lead">{BUSINESS.tagline}</p>
          <p>
            Build an order from a rotating weekly menu, choose a pickup-friendly date,
            and receive a printable invoice for your records. Minimum party size is six
            guests; maximum is thirty.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/menu">
              Browse the menu
            </Link>
            <Link className="button button--ghost" to="/about">
              Learn about our kitchen
            </Link>
          </div>
        </div>
      </section>
      <section className="band" aria-labelledby="promises-heading">
        <div className="band__inner two-col">
          <div>
            <h2 id="promises-heading">How ordering works</h2>
            <ol className="step-list">
              <li>
                Select a catering date between two days and two weeks from today. Each
                weekday receives its own carefully scaled menu.
              </li>
              <li>
                Add trays from protein, vegetarian, and side categories. Adjust
                quantities or remove dishes anytime before checkout.
              </li>
              <li>
                Share pickup details, contact information, and payment preference. No
                charges are processed online—this is a planning and coordination flow
                only.
              </li>
            </ol>
          </div>
          <aside className="callout" aria-label="Planning reminder">
            <h3 className="callout__title">Accessibility commitment</h3>
            <p>
              Layout, color, and interaction patterns follow WCAG&nbsp;2.2 guidance:
              descriptive headings, visible focus, adequate contrast, and touch targets
              sized for mobile use.
            </p>
          </aside>
        </div>
      </section>
    </AppLayout>
  );
}
