export function AboutPage() {
  return (
    <main id="main-content">
      <h1 className="page-title">About Vibing Kitchen</h1>
      <p className="lede">
        We are a small home kitchen in the Bay Area turning weekly market hauls into generous,
        pickup-ready spreads for gatherings, team lunches, and family milestones.
      </p>
      <div className="stack" style={{ maxWidth: '65ch' }}>
        <p>
          Everything is cooked in small batches the day before pickup, cooled safely, and packed
          with reheating notes so your food tastes as vibrant at your table as it did when it left
          our stove.
        </p>
        <p>
          Our menus rotate by day of the week — that lets us shop tightly, minimize waste, and
          obsess over a short list of dishes instead of an endless catalog. You will always see five
          hearty proteins, three vegetarian centerpieces, and two sides crafted to round out the
          meal.
        </p>
        <p>
          We believe catering should feel personal: clear ingredients, honest portions, and a direct
          line to the person who actually made your food. That is why pickup happens at our home
          kitchen window and why we cap party sizes — so we never overpromise.
        </p>
        <p className="field-hint">
          The story above is placeholder copy for this demo; we will swap in your real details when
          you are ready.
        </p>
      </div>
    </main>
  );
}
