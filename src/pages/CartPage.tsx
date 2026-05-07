import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { useCart } from "../context/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { cartSubtotalCents, resolveCartLines } from "../utils/cartTotals";
import { formatDisplayDate, parseIsoDateOnly } from "../utils/dates";
import { formatUsd } from "../utils/money";

export function CartPage() {
  usePageTitle("Cart");
  const {
    lines,
    cateringDateIso,
    setLineQuantity,
    removeLine,
    clearCart,
  } = useCart();
  const parsed = parseIsoDateOnly(cateringDateIso);
  const resolved = resolveCartLines(cateringDateIso, lines);
  const subtotal = cartSubtotalCents(resolved);

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>Your cart</h1>
        <p>
          Update tray quantities or remove dishes. Changes save instantly for this
          browser session. Party size limits are confirmed during checkout (minimum six,
          maximum thirty guests).
        </p>
      </div>

      {parsed ? (
        <p className="cart-date">
          Catering date:{" "}
          <strong>{formatDisplayDate(parsed)}</strong> (
          <Link to="/menu">change on the menu page</Link>)
        </p>
      ) : null}

      {resolved.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link className="button button--primary" to="/menu">
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <caption className="visually-hidden">
                Line items in your catering cart
              </caption>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Category</th>
                  <th scope="col">Tray price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Line total</th>
                  <th scope="col">
                    <span className="visually-hidden">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {resolved.map((line) => (
                  <tr key={line.itemId}>
                    <th scope="row">{line.name}</th>
                    <td>{line.category}</td>
                    <td>{formatUsd(line.unitPriceCents)}</td>
                    <td>
                      <label className="visually-hidden" htmlFor={`qty-${line.itemId}`}>
                        Quantity for {line.name}
                      </label>
                      <input
                        id={`qty-${line.itemId}`}
                        className="field__input field__input--narrow"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={line.maxOrderQty}
                        value={line.quantity}
                        onChange={(e) =>
                          setLineQuantity(line.itemId, Number(e.target.value))
                        }
                      />
                    </td>
                    <td>{formatUsd(line.lineTotalCents)}</td>
                    <td>
                      <button
                        type="button"
                        className="button button--danger-ghost"
                        onClick={() => removeLine(line.itemId)}
                      >
                        Remove {line.name}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-footer">
            <p className="cart-total">
              Subtotal: <strong>{formatUsd(subtotal)}</strong>
            </p>
            <div className="cart-footer__actions">
              <button type="button" className="button button--ghost" onClick={clearCart}>
                Empty cart
              </button>
              <Link className="button button--primary" to="/checkout">
                Continue to checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
