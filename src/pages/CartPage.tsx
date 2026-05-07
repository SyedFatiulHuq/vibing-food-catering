import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getItemById } from "../data/menu";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { readableDate } from "../lib/dates";

export function CartPage() {
  useDocumentTitle("Cart");
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

      <div
        className="card"
        style={{
          padding: "1rem",
          margin: "1.5rem 0",
          maxWidth: "min(380px, 100%)",
        }}
      >
        <div className="field">
          <label htmlFor="cart-guests">
            Guest count ({minGuests}–{maxGuests})
          </label>
          <input
            id="cart-guests"
            type="number"
            min={minGuests}
            max={maxGuests}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            autoComplete="off"
            inputMode="numeric"
            aria-describedby="guest-count-hint"
          />
          <span id="guest-count-hint" style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
            Used with each line item&apos;s per-guest price.
          </span>
        </div>
      </div>

      {priced.length === 0 ? (
        <p>Your cart is empty. <Link to="/menu">Browse the menu</Link>.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {priced.map((l) => (
              <li
                key={l.itemId}
                className="card cart-line-item"
                style={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "clamp(72px, 18vw, 100px) 1fr auto",
                  alignItems: "center",
                }}
              >
                <img
                  src={l.item.imageUrl}
                  alt=""
                  width={100}
                  height={75}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: 100,
                  }}
                />
                <div>
                  <strong>
                    <Link to={`/item/${l.item.id}`}>{l.item.name}</Link>
                  </strong>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--color-muted)" }}>
                    ${l.item.pricePerPerson.toFixed(2)} × {guestCount} guests × {l.quantity}{" "}
                    unit{l.quantity !== 1 ? "s" : ""}
                  </p>
                  <p style={{ margin: "0.35rem 0 0", fontWeight: 700 }}>
                    $
                    {(l.item.pricePerPerson * guestCount * l.quantity).toFixed(2)}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "stretch" }}>
                  <label htmlFor={`qty-${l.itemId}`}>Quantity ({l.item.name})</label>
                  <input
                    id={`qty-${l.itemId}`}
                    type="number"
                    min={1}
                    max={99}
                    inputMode="numeric"
                    aria-describedby={`qty-help-${l.itemId}`}
                    value={l.quantity}
                    onChange={(e) =>
                      setLineQuantity(l.itemId, Number(e.target.value))
                    }
                    style={{ width: "4.75rem", minHeight: "44px", padding: "0.35rem" }}
                  />
                  <span id={`qty-help-${l.itemId}`} className="visually-hidden">
                    Line quantity for cart line ({l.item.name}). Minimum 1, maximum 99.
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => removeLine(l.itemId)}
                  >
                    Remove
                    <span className="visually-hidden">{` (${l.item.name})`}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="card" style={{ padding: "1.25rem", maxWidth: "420px" }}>
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
          </div>
        </>
      )}
    </div>
  );
}
