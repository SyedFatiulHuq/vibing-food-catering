import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { CateringDateField } from "../components/CateringDateField";
import { useCart } from "../context/CartContext";
import { getMenuForDate } from "../data/menuData";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDisplayDate, parseIsoDateOnly } from "../utils/dates";
import { formatUsd } from "../utils/money";
import type { FoodCategory, FoodItem } from "../types";

const CATEGORY_ORDER: FoodCategory[] = ["protein", "vegetarian", "side"];

const CATEGORY_LABEL: Record<FoodCategory, string> = {
  protein: "Protein",
  vegetarian: "Vegetarian",
  side: "Sides",
};

function FoodCard({
  item,
  dateIso,
}: {
  item: FoodItem;
  dateIso: string;
}) {
  const { addToCart } = useCart();
  const detailTo = `/menu/item/${encodeURIComponent(item.id)}?date=${encodeURIComponent(dateIso)}`;

  return (
    <article className="food-card" aria-labelledby={`food-${item.id}-title`}>
      <div className="food-card__media food-card__link">
        <Link to={detailTo} tabIndex={-1} aria-hidden="true">
          <img
            className="food-card__image"
            src={item.imageUrl}
            alt=""
            width={640}
            height={480}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="food-card__body">
        <h3 className="food-card__title" id={`food-${item.id}-title`}>
          <Link
            to={detailTo}
            aria-label={`View full description and nutrition for ${item.name}`}
          >
            {item.name}
          </Link>
        </h3>
        <p className="food-card__meta">
          <span className="badge">{CATEGORY_LABEL[item.category]}</span>
          <span className="food-card__price">{formatUsd(item.priceCents)} per tray</span>
        </p>
        <p className="food-card__qty">
          Maximum trays per order: <strong>{item.maxOrderQty}</strong>
        </p>
        <div className="food-card__actions">
          <button
            type="button"
            className="button button--primary food-card__add"
            onClick={() => addToCart(item.id, 1)}
          >
            Add one tray to cart
          </button>
          <Link className="button button--ghost" to={detailTo}>
            View dish details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function MenuPage() {
  usePageTitle("Weekly menu");
  const { cateringDateIso, setCateringDateIso } = useCart();
  const parsed = parseIsoDateOnly(cateringDateIso);
  const menu = parsed ? getMenuForDate(parsed) : [];

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: CATEGORY_LABEL[cat],
    items: menu.filter((i) => i.category === cat),
  }));

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>Menu by catering date</h1>
        <p>
          Rotate through seven unique menus—one for each day of the week. Prices listed
          are per tray. Use cart controls to adjust quantities before checkout.
        </p>
      </div>

      <div className="stack">
        <CateringDateField
          id="menu-catering-date"
          valueIso={cateringDateIso}
          onChange={setCateringDateIso}
        />

        {parsed ? (
          <p className="menu-summary">
            Showing menu for{" "}
            <strong>{formatDisplayDate(parsed)}</strong> ({parsed.toLocaleDateString("en-US", { weekday: "long" })}).
          </p>
        ) : (
          <p role="alert">Please choose a valid catering date.</p>
        )}
      </div>

      {parsed && menu.length === 0 ? (
        <p role="alert">No menu items are available for the selected date.</p>
      ) : null}

      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <section
              key={group.cat}
              className="menu-section"
              aria-labelledby={`cat-${group.cat}`}
            >
              <h2 id={`cat-${group.cat}`} className="section-heading">
                {group.label}
              </h2>
              <div className="food-grid">
                {group.items.map((item) => (
                  <FoodCard key={item.id} item={item} dateIso={cateringDateIso} />
                ))}
              </div>
            </section>
          ),
      )}
    </AppLayout>
  );
}
