import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getItemById } from "../data/menu";
import { readableDate } from "../lib/dates";

export function CartPage() {
  const {
    lines,
    setLineQuantity,
    removeLine,
    guestCount,
    setGuestCount,
    cateringDateIso,
    minGuests,
    maxGuests,
  } = useCart();

  const priced = lines
    .map((l) => {
      const item = getItemById(l.itemId);
      return item ? { ...l, item } : null;
    })
    .filter(Boolean) as { itemId: string; quantity: number; item: NonNullable<ReturnType<typeof getItemById>> }[];

  const subtotal = priced.reduce(
    (s, l) => s + l.item.pricePerPerson * guestCount * l.quantity,
    0,
  );

  return (
    <div className="shell">
      <h1 className="display" style={{ fontSize: "2rem" }}>Your cart</h1>
      <p style={{ color: "var(--color-muted)" }}>
        Pickup date: <strong>{readableDate(cateringDateIso)}</strong>
      </p>

      <section
        className="card"
        aria-label="Guests for cart pricing"
        style={{
          padding: "1rem",
          margin: "1.5rem 0",
          width: "100%",
          maxWidth: "320px",
          minWidth: 0,
        }}
      >
        <div className="field">
          <label htmlFor="cart-guests">Guest count ({minGuests}–{maxGuests})</label>
          <input
            id="cart-guests"
            type="number"
            min={minGuests}
            max={maxGuests}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
          />
        </div>
      </section>

      {priced.length === 0 ? (
        <p>Your cart is empty. <Link to="/menu">Browse the menu</Link>.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {priced.map((l) => (
              <li
                key={l.itemId}
                className="card cart-line"
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div className="cart-line__thumb">
                  <img
                    src={l.item.imageUrl}
                    alt=""
                    width={100}
                    height={75}
                    style={{ borderRadius: "8px", objectFit: "cover", width: 100, height: 75 }}
                  />
                </div>
                <div className="cart-line__body">
                  <strong>{l.item.name}</strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--color-muted)" }}>
                    ${l.item.pricePerPerson.toFixed(2)} × {guestCount} guests × {l.quantity}{" "}
                    unit{l.quantity !== 1 ? "s" : ""}
                  </p>
                  <p style={{ margin: "0.35rem 0 0", fontWeight: 700 }}>
                    $
                    {(l.item.pricePerPerson * guestCount * l.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="cart-line__controls">
                  <label htmlFor={`cart-qty-${l.itemId}`}>
                    Qty ({l.item.name})
                  </label>
                  <input
                    id={`cart-qty-${l.itemId}`}
                    type="number"
                    className="cart-line__qty"
                    min={1}
                    max={99}
                    value={l.quantity}
                    onChange={(e) =>
                      setLineQuantity(l.itemId, Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => removeLine(l.itemId)}
                    aria-label={`Remove ${l.item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside
            className="card"
            aria-labelledby="cart-summary-heading"
            style={{ padding: "1.25rem", width: "100%", maxWidth: "420px", minWidth: 0 }}
          >
            <h2 id="cart-summary-heading" className="display" style={{ margin: "0 0 0.65rem", fontSize: "1.25rem" }}>
              Summary
            </h2>
            <p style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>
              Subtotal (estimate):{" "}
              <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>
              Taxes and final total are confirmed at checkout.
            </p>
            <Link to="/checkout" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
              Proceed to checkout
            </Link>
          </aside>
        </>
      )}
    </div>
  );
}
