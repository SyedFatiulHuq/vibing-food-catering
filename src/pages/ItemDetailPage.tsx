import { Link, useNavigate, useParams } from "react-router-dom";
import { NutritionTable } from "../components/NutritionTable";
import { getItemById, MENU_CATEGORY_LABEL } from "../data/menu";
import { useCart } from "../context/CartContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { addLine } = useCart();

  const item = itemId ? getItemById(itemId) : undefined;

  useDocumentTitle(item?.name ?? "Menu item not found");

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

  const categoryName = MENU_CATEGORY_LABEL[item.category];

  return (
    <div className="shell reading-flow">
      <nav aria-label="Breadcrumb">
        <p style={{ marginTop: 0 }}>
          <Link to="/menu">
            <span aria-hidden="true">← </span>
            Back to menu
          </Link>
          <span style={{ margin: "0 0.5rem", color: "var(--color-muted)" }} aria-hidden="true">
            /
          </span>
          <span aria-current="page">{item.name}</span>
        </p>
      </nav>
      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          alignItems: "start",
        }}
      >
        <div>
          {/* Photo is illustrative; dish name appears in heading (1.1.1). */}
          <img
            src={item.imageUrl}
            alt=""
            width={640}
            height={480}
            style={{
              width: "100%",
              borderRadius: "var(--radius)",
              border: "2px solid var(--color-border)",
              boxShadow: "var(--shadow)",
            }}
          />
        </div>
        <div>
          <p className="badge">{categoryName}</p>
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
              <span className="visually-hidden">: {item.name}</span>
            </button>
            <Link to="/cart" className="btn btn-ghost">
              View cart
            </Link>
          </div>
        </div>
      </div>
      <section
        aria-label={`Nutrition facts for ${item.name}`}
        style={{ marginTop: "2.5rem", maxWidth: "min(520px, 100%)" }}
      >
        <NutritionTable n={item.nutrition} />
      </section>
    </div>
  );
}
