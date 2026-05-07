import { AppLayout } from "../components/AppLayout";
import { BUSINESS } from "../data/businessInfo";
import { usePageTitle } from "../hooks/usePageTitle";

export function AboutPage() {
  usePageTitle("About our kitchen");

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>About {BUSINESS.legalName}</h1>
        <p>
          Thoughtful, small-batch catering built for neighborhood gatherings and weekday
          team meals alike.
        </p>
      </div>

      <div className="prose">
        {BUSINESS.story.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <section className="band" aria-labelledby="values-heading">
        <h2 id="values-heading" className="section-heading">
          What guides us
        </h2>
        <ul className="card-list">
          {BUSINESS.values.map((v) => (
            <li key={v.title} className="card">
              <h3 className="card__title">{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="hours-heading">
        <h2 id="hours-heading" className="section-heading">
          Hours and logistics
        </h2>
        <p>{BUSINESS.hoursNote}</p>
        <p>
          Our kitchen operates under the demonstration ingredient labels shown on each
          menu item. Replace narrative copy when transitioning to production content.
        </p>
      </section>

      <section aria-labelledby="a11y-heading">
        <h2 id="a11y-heading" className="section-heading">
          <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> alignment
        </h2>
        <p>
          This experience is designed for keyboard navigation, screen reader clarity, and
          readable contrast. If you encounter a barrier, please reach out through the{" "}
          <a href="/contact">contact page</a> so we can improve.
        </p>
      </section>
    </AppLayout>
  );
}
