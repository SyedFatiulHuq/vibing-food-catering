import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FoodImage } from "../components/FoodImage";
import { QuantityControl } from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { dayLabels, getItemById } from "../data/menu";
import { formatCurrency } from "../utils/format";
import type { NutritionFacts } from "../types";

const nutritionRows: { key: keyof Omit<NutritionFacts, "servingSize" | "calories">; label: string; unit: string }[] = [
  { key: "totalFatG", label: "Total Fat", unit: "g" },
  { key: "saturatedFatG", label: "Saturated Fat", unit: "g" },
  { key: "cholesterolMg", label: "Cholesterol", unit: "mg" },
  { key: "sodiumMg", label: "Sodium", unit: "mg" },
  { key: "totalCarbsG", label: "Total Carbohydrates", unit: "g" },
  { key: "fiberG", label: "Dietary Fiber", unit: "g" },
  { key: "sugarG", label: "Sugars", unit: "g" },
  { key: "proteinG", label: "Protein", unit: "g" },
];

export const FoodDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = itemId ? getItemById(itemId) : undefined;
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  if (!item) return <Navigate to="/menu" replace />;

  const handleAdd = () => {
    if (qty < 1) return;
    addItem(item.id, qty);
    setConfirmation(`Added ${qty} ${qty === 1 ? "portion" : "portions"} of ${item.name} to your cart.`);
    setQty(1);
  };

  return (
    <div className="container section">
      <p className="crumbs">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link to="/menu">Menu</Link> <span aria-hidden="true">/</span> {item.name}
      </p>

      <article className="detail">
        <div>
          <div className="detail__media" aria-hidden="true">
            <FoodImage item={item} />
          </div>

          <h1 style={{ marginTop: "1.25rem" }}>{item.name}</h1>
          <p
            className="cat-pill"
            data-cat={item.category}
            style={{ display: "inline-flex" }}
            aria-label={`Category: ${item.category}, served on ${dayLabels[item.day]}`}
          >
            {item.category} · {dayLabels[item.day]}
          </p>

          <p className="detail__price" aria-label={`Price: ${formatCurrency(item.price)} per ${item.portion}`}>
            {formatCurrency(item.price)}{" "}
            <span style={{ fontSize: "1rem", color: "var(--color-text-muted)", fontWeight: 400 }}>
              per {item.portion}
            </span>
          </p>

          <p>{item.description}</p>

          <div className="qty-row">
            <span id="qty-label" style={{ fontWeight: 600 }}>
              Portions to add
            </span>
            <QuantityControl
              value={qty}
              onChange={setQty}
              min={1}
              max={30}
              ariaLabel={`Portions of ${item.name} to add`}
            />
            <button type="button" className="btn" onClick={handleAdd}>
              Add to cart
            </button>
          </div>
          <p
            className="sr-only"
            role="status"
            aria-live="polite"
          >
            {confirmation}
          </p>
          {confirmation && (
            <p
              className="notice notice--info"
              style={{ marginTop: "1rem" }}
              aria-hidden="true"
            >
              {confirmation}{" "}
              <Link to="/cart" style={{ color: "inherit" }}>
                View cart
              </Link>
              .
            </p>
          )}
        </div>

        <div>
          <section className="detail__section" aria-labelledby="ingredients-title">
            <h2 id="ingredients-title">Ingredients</h2>
            <ul className="tag-list">
              {item.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </section>

          {item.allergens.length > 0 && (
            <section className="detail__section" aria-labelledby="allergens-title">
              <h2 id="allergens-title">Allergens</h2>
              <ul className="tag-list">
                {item.allergens.map((a) => (
                  <li key={a} style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}>
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="detail__section" aria-labelledby="nutrition-title">
            <h2 id="nutrition-title">Nutrition Facts</h2>
            <div
              className="nutrition"
              role="region"
              aria-labelledby="nutrition-title"
            >
              <p className="nutrition__title">Nutrition Facts</p>
              <p className="nutrition__serving">
                Serving size {item.nutrition.servingSize}
              </p>
              <table>
                <caption className="sr-only">
                  Nutrition information per serving for {item.name}
                </caption>
                <tbody>
                  <tr className="nutrition__calories">
                    <th scope="row">Calories</th>
                    <td>{item.nutrition.calories}</td>
                  </tr>
                  {nutritionRows.map((row) => (
                    <tr key={row.key}>
                      <th scope="row">{row.label}</th>
                      <td>
                        {item.nutrition[row.key]}
                        {row.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.5rem", marginBottom: 0 }}>
                Values are approximate and based on standard recipes.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
