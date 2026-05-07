import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { NutritionFactsTable } from "../components/NutritionFactsTable";
import { useCart } from "../context/CartContext";
import { getFoodItemForDate } from "../data/menuData";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  formatDisplayDate,
  isValidCateringDate,
  parseIsoDateOnly,
  toIsoDateOnly,
} from "../utils/dates";
import { formatUsd } from "../utils/money";

export function FoodDetailPage() {
  const { itemId: rawId } = useParams();
  const itemId = rawId ? decodeURIComponent(rawId) : "";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cateringDateIso, addToCartForDate } = useCart();

  const dateParam = searchParams.get("date");
  const parsedParam = dateParam ? parseIsoDateOnly(dateParam) : null;
  const resolvedIso =
    parsedParam && isValidCateringDate(parsedParam)
      ? toIsoDateOnly(parsedParam)
      : cateringDateIso;

  const date = parseIsoDateOnly(resolvedIso);
  const item = date && itemId ? getFoodItemForDate(date, itemId) : undefined;

  usePageTitle(item ? item.name : "Dish details");

  if (!item || !date) {
    return (
      <AppLayout>
        <div className="page-heading">
          <h1>Dish not available</h1>
          <p>
            This dish is not on the menu for the selected catering date, or the
            identifier is out of date.
          </p>
          <Link className="button button--primary" to="/menu">
            Return to menu
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs__list">
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li aria-current="page">{item.name}</li>
        </ol>
      </nav>

      <article>
        <div className="detail-grid">
          <div>
            <img
              className="detail-image"
              src={item.imageUrl}
              alt={item.imageAlt}
              width={640}
              height={480}
            />
          </div>
          <div className="detail-copy">
            <header>
              <p className="eyebrow">
                Catering date {formatDisplayDate(date)} (
                {toIsoDateOnly(date)})
              </p>
              <h1>{item.name}</h1>
              <p className="detail-price">{formatUsd(item.priceCents)} per tray</p>
              <p>
                Maximum trays per order for this menu day:{" "}
                <strong>{item.maxOrderQty}</strong>.
              </p>
            </header>
            <p>{item.description}</p>
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="section-heading">
                Ingredients
              </h2>
              <ul className="pills">
                {item.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </section>
            <div className="detail-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => addToCartForDate(resolvedIso, item.id, 1)}
              >
                Add one tray to cart
              </button>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => navigate(-1)}
              >
                Go back to previous page
              </button>
            </div>
          </div>
        </div>

        <NutritionFactsTable facts={item.nutrition} />
      </article>
    </AppLayout>
  );
}
