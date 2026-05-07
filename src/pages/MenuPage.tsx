import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  listSelectableDates,
  readableDate,
  weekdayFromIso,
} from "../lib/dates";
import { getMenuForWeekday } from "../data/menu";
import { MENU_CATEGORY_LABEL } from "../lib/menuCategory";
import type { MenuCategory, MenuItem } from "../types";

const categoryOrder: MenuCategory[] = ["protein", "vegetarian", "sides"];

function groupByCategory(items: MenuItem[]): Record<MenuCategory, MenuItem[]> {
  const empty: Record<MenuCategory, MenuItem[]> = {
    protein: [],
    vegetarian: [],
    sides: [],
  };
  for (const it of items) {
    empty[it.category].push(it);
  }
  return empty;
}

export function MenuPage() {
  const {
    cateringDateIso,
    setCateringDateIso,
    guestCount,
    setGuestCount,
    addLine,
    minGuests,
    maxGuests,
  } = useCart();

  const w = weekdayFromIso(cateringDateIso);
  const menu = getMenuForWeekday(w);
  const grouped = groupByCategory(menu);

  return (
    <div className="shell">
      <section aria-labelledby="menu-page-title" style={{ marginBottom: "2rem" }}>
        <h1 id="menu-page-title" className="display" style={{ fontSize: "2.25rem", margin: "0 0 0.5rem" }}>
          Menu for your event date
        </h1>
        <p style={{ color: "var(--color-muted)", margin: 0, maxWidth: "62ch" }}>
          Pickups can be scheduled between{" "}
          <strong>two days and two weeks</strong> from today. Each day of the week has its own
          menu — <strong>5 proteins</strong>, <strong>3 vegetarian</strong>, and{" "}
          <strong>2 sides</strong>.
        </p>
      </section>

      <div
        className="card"
        style={{
          padding: "1.25rem",
          marginBottom: "2rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          alignItems: "end",
        }}
      >
        <div className="field">
          <label htmlFor="catering-date">Catering date</label>
          <select
            id="catering-date"
            value={cateringDateIso}
            onChange={(e) => setCateringDateIso(e.target.value)}
          >
            {listSelectableDates().map((iso) => (
              <option key={iso} value={iso}>
                {readableDate(iso)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="guests">Guest count ({minGuests}–{maxGuests})</label>
          <input
            id="guests"
            type="number"
            min={minGuests}
            max={maxGuests}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            aria-describedby="menu-guest-hint"
          />
        </div>
        <p id="menu-guest-hint" style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>
          Menu day: <strong style={{ color: "var(--color-ink)" }}>{readableDate(cateringDateIso)}</strong>{" "}
          · Cart pricing uses your guest count for per-guest items.
        </p>
      </div>

      {categoryOrder.map((cat) => (
        <section key={cat} style={{ marginBottom: "2.5rem" }}>
          <h2 className="display" style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
            {MENU_CATEGORY_LABEL[cat]}
          </h2>
          <div className="grid-menu">
            {grouped[cat].map((item) => (
              <article key={item.id} className="card" style={{ overflow: "hidden" }}>
                <Link to={`/item/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={item.imageUrl}
                    alt=""
                    width={640}
                    height={480}
                    style={{ aspectRatio: "4/3", objectFit: "cover", width: "100%" }}
                    loading="lazy"
                  />
                  <div style={{ padding: "1rem" }}>
                    <span className="badge">{MENU_CATEGORY_LABEL[item.category]}</span>
                    <h3 style={{ margin: "0.5rem 0 0.25rem", fontSize: "1.15rem" }}>{item.name}</h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>
                      {item.portionNote}
                    </p>
                    <p style={{ margin: "0.75rem 0 0", fontWeight: 700 }}>
                      ${item.pricePerPerson.toFixed(2)}{" "}
                      <span style={{ fontWeight: 500, color: "var(--color-muted)" }}>/ guest</span>
                    </p>
                  </div>
                </Link>
                <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => addLine(item.id, 1)}
                  >
                    Add to cart
                  </button>
                  <Link to={`/item/${item.id}`} className="btn btn-ghost" aria-label={`${item.name}, full details`}>
                    Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
