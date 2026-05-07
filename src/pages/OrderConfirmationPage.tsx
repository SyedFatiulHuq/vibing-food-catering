import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useOrders } from "../context/OrdersContext";
import { readableDate } from "../lib/dates";

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();

  const order = useMemo(
    () => orders.find((o) => o.id === orderId),
    [orders, orderId],
  );

  if (!order) {
    return (
      <div className="shell">
        <h1 className="display">Order not found</h1>
        <p>If you just placed an order, it may still be saving — try refreshing.</p>
        <Link to="/menu">Back to menu</Link>
      </div>
    );
  }

  const placed = new Date(order.placedAt);

  return (
    <div className="shell">
      <p className="badge" style={{ marginBottom: "0.75rem" }}>
        Order confirmed
      </p>
      <h1 className="display" style={{ fontSize: "2rem", marginTop: 0 }}>
        Thank you — here&apos;s your invoice
      </h1>
      <p style={{ color: "var(--color-muted)" }}>
        A copy is stored in this browser for the kitchen to reference later (local storage).
      </p>

      <div
        className="card"
        style={{
          padding: "1.5rem",
          marginTop: "1.5rem",
          width: "100%",
          maxWidth: "640px",
          minWidth: 0,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <strong style={{ fontSize: "1.1rem" }}>Vibing Kitchen</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--color-muted)" }}>
              Homemade catering · pickup
            </p>
          </div>
          <div style={{ textAlign: "right", minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>{order.id}</div>
            <div style={{ fontSize: "0.9rem", color: "var(--color-muted)" }}>
              {placed.toLocaleString()}
            </div>
          </div>
        </header>

        <section style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ fontSize: "1.15rem", margin: "0 0 0.5rem" }}>
            Pickup &amp; guest details
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Date:</strong>{" "}
              {readableDate(order.cateringDate)}
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Guests:</strong> {order.guestCount}
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Pickup window:</strong>{" "}
              {order.pickupWindow}
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ fontSize: "1.15rem", margin: "0 0 0.5rem" }}>
            Contact
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--color-muted)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem",
              alignItems: "baseline",
              minWidth: 0,
            }}
          >
            <span>{order.contactName}</span>
            <span aria-hidden="true">·</span>
            <span>{order.contactEmail}</span>
            <span aria-hidden="true">·</span>
            <span>{order.contactPhone}</span>
          </p>
        </section>

        <section style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ fontSize: "1.15rem", margin: "0 0 0.5rem" }}>
            Payment (record only)
          </h2>
          <p style={{ margin: 0, color: "var(--color-muted)" }}>
            Method: {order.paymentMethod}
            {order.paymentMethod === "card" && order.cardLastFour && (
              <> · ending {order.cardLastFour}</>
            )}
          </p>
        </section>

        {order.specialInstructions && (
          <section style={{ marginBottom: "1rem" }}>
            <h2 className="display" style={{ fontSize: "1.15rem", margin: "0 0 0.5rem" }}>
              Special instructions
            </h2>
            <p style={{ margin: 0 }}>{order.specialInstructions}</p>
          </section>
        )}

        <div className="table-scroll" style={{ marginTop: "1rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <caption className="visually-hidden">Line items</caption>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-ink)" }}>
                <th scope="col" style={{ textAlign: "left", padding: "0.5rem 0" }}>
                  Item
                </th>
                <th scope="col" style={{ textAlign: "right", padding: "0.5rem 0" }}>
                  Qty
                </th>
                <th scope="col" style={{ textAlign: "right", padding: "0.5rem 0" }}>
                  Line total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((l) => (
                <tr key={l.item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th
                    scope="row"
                    style={{ padding: "0.6rem 0", fontWeight: 600, textAlign: "left" }}
                  >
                    {l.item.name}
                  </th>
                  <td style={{ textAlign: "right" }}>{l.quantity}</td>
                  <td style={{ textAlign: "right" }}>${l.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl aria-label="Invoice totals" style={{ margin: "1rem 0 0", textAlign: "right", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "0.35rem 2rem",
            }}
          >
            <dt style={{ margin: 0, fontWeight: 600 }}>Subtotal</dt>
            <dd style={{ margin: 0 }}>
              ${order.subtotal.toFixed(2)}
            </dd>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "0.35rem 2rem",
              marginTop: "0.35rem",
              color: "var(--color-muted)",
              fontSize: "0.95rem",
            }}
          >
            <dt style={{ margin: 0 }}>Est. tax</dt>
            <dd style={{ margin: 0 }}>${order.estimatedTax.toFixed(2)}</dd>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "0.35rem 2rem",
              marginTop: "0.5rem",
              fontSize: "1.25rem",
              fontWeight: 800,
            }}
          >
            <dt style={{ margin: 0 }}>Total</dt>
            <dd style={{ margin: 0 }}>${order.total.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <p>
        <Link to="/menu">Place another order</Link>
      </p>
    </div>
  );
}
