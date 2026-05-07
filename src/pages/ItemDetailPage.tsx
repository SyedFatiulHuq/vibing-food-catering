import { Link, useNavigate, useParams } from "react-router-dom";
import { NutritionTable } from "../components/NutritionTable";
import { getItemById } from "../data/menu";
import { MENU_CATEGORY_LABEL } from "../lib/menuCategory";
import { useCart } from "../context/CartContext";

export function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { addLine } = useCart();

  const item = itemId ? getItemById(itemId) : undefined;

  if (!item) {
    return (
      <div className="shell">
        <h1 className="display">Dish not found</h1>
        <p>We couldn&apos;t find that dish.</p>
        <button type="button" className="btn btn-ghost" onClick={() => navigate("/menu")}>
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="shell">
      <p style={{ marginTop: 0 }}>
        <Link to="/menu">Back to menu</Link>
      </p>
      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={item.imageUrl}
            alt={item.name}
            width={640}
            height={480}
            style={{
              width: "100%",
              borderRadius: "var(--radius)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow)",
            }}
          />
        </div>
        <div>
          <span className="badge">{MENU_CATEGORY_LABEL[item.category]}</span>
          <h1 className="display" style={{ fontSize: "2rem", margin: "0.5rem 0" }}>
            {item.name}
          </h1>
          <p style={{ color: "var(--color-muted)" }}>{item.portionNote}</p>
          <p style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            ${item.pricePerPerson.toFixed(2)}{" "}
            <span style={{ fontWeight: 500, fontSize: "1rem", color: "var(--color-muted)" }}>
              per guest
            </span>
          </p>
          <p>{item.description}</p>
          <h2 className="display" style={{ fontSize: "1.35rem" }}>
            Ingredients
          </h2>
          <ul>
            {item.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <button type="button" className="btn btn-primary" onClick={() => addLine(item.id, 1)}>
              Add to cart
            </button>
            <Link to="/cart" className="btn btn-ghost">
              View cart
            </Link>
          </div>
        </div>
      </div>
      <section style={{ marginTop: "2.5rem", maxWidth: "520px" }}>
        <NutritionTable n={item.nutrition} />
      </section>
    </div>
  );
}
