import { useMemo } from "react";
import { PickupDatePicker } from "../components/menu/PickupDatePicker";
import { FoodCard } from "../components/menu/FoodCard";
import { usePickupDate } from "../context/PickupDateContext";
import { dayLabels, getMenuForDay } from "../data/menu";
import { dayKeyForDate, formatLongDate } from "../utils/dateUtils";
import type { Category } from "../types";

const categoryLabels: Record<Category, string> = {
  protein: "Proteins",
  vegetarian: "Vegetarian Mains",
  side: "Sides",
};

const categoryDescriptions: Record<Category, string> = {
  protein: "Five protein-forward dishes — grilled, roasted, or smoked.",
  vegetarian: "Three hearty vegetarian mains, generous in flavor.",
  side: "Two complementary sides to round out the meal.",
};

export const MenuPage = () => {
  const { pickupDate } = usePickupDate();
  const dayKey = dayKeyForDate(pickupDate);
  const items = useMemo(() => getMenuForDay(dayKey), [dayKey]);

  const grouped = useMemo(() => {
    return {
      protein: items.filter((i) => i.category === "protein"),
      vegetarian: items.filter((i) => i.category === "vegetarian"),
      side: items.filter((i) => i.category === "side"),
    } satisfies Record<Category, typeof items>;
  }, [items]);

  return (
    <div className="container section">
      <header className="page-intro">
        <p className="crumbs">
          <a href="/">Home</a> <span aria-hidden="true">/</span> Menu
        </p>
        <h1>Menu for {formatLongDate(pickupDate)}</h1>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "60ch" }}>
          Today&rsquo;s theme:{" "}
          <strong style={{ color: "var(--color-text)" }}>{dayLabels[dayKey]}</strong>. Each day
          we serve five proteins, three vegetarian mains, and two sides — homemade in small
          batches.
        </p>
      </header>

      <PickupDatePicker />

      {(Object.keys(grouped) as Category[]).map((cat) => (
        <section key={cat} className="category" aria-labelledby={`cat-${cat}-title`}>
          <header className="category__header">
            <h2 id={`cat-${cat}-title`} className="category__title">
              {categoryLabels[cat]}
            </h2>
            <span className="category__count">
              {grouped[cat].length} {grouped[cat].length === 1 ? "item" : "items"}
            </span>
          </header>
          <p style={{ color: "var(--color-text-muted)", marginTop: 0 }}>
            {categoryDescriptions[cat]}
          </p>
          <ul
            className="menu-grid"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
            aria-label={`${categoryLabels[cat]} for ${dayLabels[dayKey]}`}
          >
            {grouped[cat].map((item) => (
              <li key={item.id}>
                <FoodCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
