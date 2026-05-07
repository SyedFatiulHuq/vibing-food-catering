import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FoodImage } from "../components/FoodImage";
import { QuantityControl } from "../components/QuantityControl";
import { useCart } from "../context/CartContext";
import { usePickupDate } from "../context/PickupDateContext";
import { dayLabels, getItemById } from "../data/menu";
import {
  dayKeyForDate,
  formatLongDate,
  formatRelativeOffset,
} from "../utils/dateUtils";
import { TAX_RATE, formatCurrency } from "../utils/format";

export const CartPage = () => {
  const { items, setQuantity, removeItem, totalQuantity } = useCart();
  const { pickupDate } = usePickupDate();
  const navigate = useNavigate();

  const dayKey = dayKeyForDate(pickupDate);

  const enriched = useMemo(
    () =>
      items
        .map((ci) => {
          const food = getItemById(ci.itemId);
          if (!food) return null;
          return {
            ...ci,
            food,
            lineTotal: food.price * ci.quantity,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [items],
  );

  const onPickupDay = enriched.filter((row) => row.food.day === dayKey);
  const otherDays = enriched.filter((row) => row.food.day !== dayKey);

  const subtotal = enriched.reduce((sum, row) => sum + row.lineTotal, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  if (enriched.length === 0) {
    return (
      <div className="container section">
        <h1>Your cart</h1>
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            🥣
          </div>
          <h2 style={{ margin: "0 0 0.5rem" }}>Your cart is empty</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Pick a pickup day on the menu and add a few favorites.
          </p>
          <div className="empty-state__actions">
            <Link to="/menu" className="btn">
              Browse the menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <p className="crumbs">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> Cart
      </p>
      <h1>Your cart</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        {totalQuantity} {totalQuantity === 1 ? "portion" : "portions"} for pickup on{" "}
        <strong style={{ color: "var(--color-text)" }}>{formatLongDate(pickupDate)}</strong> ({formatRelativeOffset(pickupDate)})
      </p>

      <div className="layout-2col">
        <div>
          {otherDays.length > 0 && (
            <div className="notice" role="alert" style={{ marginBottom: "1rem" }}>
              Some items in your cart are from other days&rsquo; menus and won&rsquo;t be
              available for {dayLabels[dayKey]}. Update your pickup date on the{" "}
              <Link to="/menu" style={{ color: "inherit", fontWeight: 700 }}>
                menu page
              </Link>{" "}
              or remove them below.
            </div>
          )}

          <h2 style={{ fontSize: "1.1rem" }}>For {dayLabels[dayKey]}</h2>
          <CartList
            rows={onPickupDay}
            onSetQty={(id, q) => setQuantity(id, q)}
            onRemove={removeItem}
          />

          {otherDays.length > 0 && (
            <>
              <h2 style={{ fontSize: "1.1rem", marginTop: "2rem" }}>From other menus</h2>
              <CartList
                rows={otherDays}
                onSetQty={(id, q) => setQuantity(id, q)}
                onRemove={removeItem}
              />
            </>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/menu" className="btn btn--ghost">
              ← Continue shopping
            </Link>
          </div>
        </div>

        <aside className="summary-card" aria-labelledby="order-summary-title">
          <h2 id="order-summary-title" style={{ marginTop: 0 }}>
            Order summary
          </h2>
          <dl>
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
            <dt>Estimated tax (6.25%)</dt>
            <dd>{formatCurrency(tax)}</dd>
          </dl>
          <dl className="summary-total">
            <dt>
              <strong>Total</strong>
            </dt>
            <dd>
              <strong>{formatCurrency(total)}</strong>
            </dd>
          </dl>
          <button
            type="button"
            className="btn btn--full"
            onClick={() => navigate("/checkout")}
            disabled={onPickupDay.length === 0}
            aria-disabled={onPickupDay.length === 0}
          >
            Proceed to checkout
          </button>
          {onPickupDay.length === 0 && (
            <p
              className="field-error"
              style={{ marginTop: "0.75rem", textAlign: "center" }}
              role="status"
            >
              Add at least one item that&rsquo;s on the {dayLabels[dayKey]} menu to continue.
            </p>
          )}
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              marginTop: "0.75rem",
              marginBottom: 0,
            }}
          >
            We require a party size between 6 and 30 at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
};

interface CartListProps {
  rows: Array<{
    itemId: string;
    quantity: number;
    food: ReturnType<typeof getItemById> & {};
    lineTotal: number;
  }>;
  onSetQty: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartList = ({ rows, onSetQty, onRemove }: CartListProps) => (
  <ul className="cart-list" aria-label="Cart items">
    {rows.map((row) => (
      <li key={row.itemId} className="cart-row">
        <div className="cart-row__media" aria-hidden="true">
          <FoodImage item={row.food} />
        </div>
        <div className="cart-row__details">
          <h3 className="cart-row__name">
            <Link to={`/menu/item/${row.food.id}`}>{row.food.name}</Link>
          </h3>
          <p className="cart-row__meta">
            {formatCurrency(row.food.price)} · {row.food.portion}
          </p>
          <p className="cart-row__meta">{dayLabels[row.food.day]}</p>
          <div className="cart-row__controls">
            <QuantityControl
              value={row.quantity}
              onChange={(q) => onSetQty(row.itemId, q)}
              min={0}
              max={60}
              ariaLabel={`Quantity for ${row.food.name}`}
            />
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onRemove(row.itemId)}
              aria-label={`Remove ${row.food.name} from cart`}
            >
              Remove
            </button>
          </div>
        </div>
        <div className="cart-row__line-total" aria-label={`Line total: ${formatCurrency(row.lineTotal)}`}>
          {formatCurrency(row.lineTotal)}
        </div>
      </li>
    ))}
  </ul>
);
