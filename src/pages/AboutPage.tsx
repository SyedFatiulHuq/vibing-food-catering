export function AboutPage() {
  return (
    <div className="shell" style={{ maxWidth: "720px" }}>
      <h1 className="display" style={{ fontSize: "2.25rem" }}>
        About Vibing Kitchen
      </h1>
      <p className="badge">Small batch · Local ingredients · Pickup friendly</p>

      <p>
        Vibing Kitchen started as a weekend project in a home kitchen: slow braises, bright
        salads, and the kind of sides people actually talk about. Today we cook for offices,
        family milestones, and neighborhood gatherings — always prepared for pickup so you can
        focus on hosting.
      </p>

      <h2 className="display" style={{ fontSize: "1.5rem" }}>What we believe</h2>
      <ul>
        <li>
          <strong>Menus should move.</strong> Each weekday features a fresh lineup so regulars
          always have something new to try.
        </li>
        <li>
          <strong>Portions should make sense.</strong> We price per guest with clear minimums so
          planning a crowd stays predictable.
        </li>
        <li>
          <strong>Pickup should feel calm.</strong> Your order is packed by time window, labeled,
          and ready to travel.
        </li>
      </ul>

      <h2 className="display" style={{ fontSize: "1.5rem" }}>Allergens &amp; dietary notes</h2>
      <p style={{ color: "var(--color-muted)" }}>
        Our kitchen handles common allergens. Please list allergies and dietary needs at checkout;
        we&apos;ll confirm what we can accommodate for your selected menu day.
      </p>
    </div>
  );
}
