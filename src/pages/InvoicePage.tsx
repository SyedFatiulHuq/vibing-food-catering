import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { business } from "../data/business";
import { formatLongDate, fromIsoDate } from "../utils/dateUtils";
import { formatCurrency } from "../utils/format";
import { loadOrders } from "../utils/storage";
import type { Invoice } from "../types";

const paymentMethodLabel: Record<Invoice["customer"]["paymentMethod"], string> = {
  "credit-card": "Credit card",
  "debit-card": "Debit card",
  "cash-on-pickup": "Cash on pickup",
};

export const InvoicePage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const stateInvoice = (location.state as { invoice?: Invoice } | null)?.invoice;

  const [invoice, setInvoice] = useState<Invoice | undefined>(stateInvoice);

  useEffect(() => {
    if (!invoice && orderId) {
      const stored = loadOrders().find((o) => o.id === orderId);
      if (stored) setInvoice(stored);
    }
  }, [orderId, invoice]);

  const formattedDate = useMemo(() => {
    if (!invoice) return "";
    return new Date(invoice.createdAt).toLocaleString();
  }, [invoice]);

  if (!invoice) {
    return (
      <div className="container section">
        <h1>Order not found</h1>
        <p>We couldn&rsquo;t find the order you&rsquo;re looking for.</p>
        <Link to="/menu" className="btn">
          Back to menu
        </Link>
      </div>
    );
  }

  const { customer } = invoice;
  const pickupDateLabel = formatLongDate(fromIsoDate(customer.pickupDate));

  return (
    <div className="container section">
      <p
        className="notice notice--info"
        role="status"
        aria-live="polite"
        style={{ marginBottom: "1.5rem" }}
      >
        <strong>Thanks, {customer.fullName.split(" ")[0]}!</strong> Your order has been placed
        and saved on this device. We&rsquo;ll see you at pickup.
      </p>

      <h1>Order confirmation</h1>

      <article className="invoice" aria-labelledby="invoice-heading">
        <header className="invoice__head">
          <div>
            <h2 id="invoice-heading" style={{ marginTop: 0 }}>
              {business.name}
            </h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              {business.address.line1}, {business.address.line2}
              <br />
              {business.address.city}, {business.address.region} {business.address.postalCode}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <a href={`tel:${business.phoneTel}`}>{business.phone}</a>
            </p>
          </div>
          <div>
            <p className="invoice__id">Order #{invoice.id}</p>
            <p style={{ margin: 0 }}>
              <strong>Placed:</strong> {formattedDate}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Pickup:</strong> {pickupDateLabel} at {customer.pickupTime}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Party size:</strong> {customer.partySize}
            </p>
          </div>
        </header>

        <section aria-labelledby="invoice-customer">
          <h3 id="invoice-customer" style={{ marginTop: 0 }}>
            Customer
          </h3>
          <p style={{ margin: 0 }}>{customer.fullName}</p>
          <p style={{ margin: 0 }}>
            <a href={`mailto:${customer.email}`}>{customer.email}</a> ·{" "}
            <a href={`tel:${customer.phone}`}>{customer.phone}</a>
          </p>
        </section>

        <section aria-labelledby="invoice-items" style={{ marginTop: "1.5rem" }}>
          <h3 id="invoice-items">Items</h3>
          <table>
            <caption className="sr-only">Items in this order</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((line) => (
                <tr key={line.itemId}>
                  <th scope="row">{line.name}</th>
                  <td>{line.quantity}</td>
                  <td>{formatCurrency(line.unitPrice)}</td>
                  <td>{formatCurrency(line.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Subtotal</td>
                <td>{formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Tax ({(invoice.taxRate * 100).toFixed(2)}%)</td>
                <td>{formatCurrency(invoice.tax)}</td>
              </tr>
              <tr className="invoice__total">
                <td colSpan={3}>Total</td>
                <td>{formatCurrency(invoice.total)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section aria-labelledby="invoice-payment" style={{ marginTop: "1.5rem" }}>
          <h3 id="invoice-payment">Payment</h3>
          <p style={{ margin: 0 }}>
            {paymentMethodLabel[customer.paymentMethod]}
            {customer.cardNumberLast4
              ? ` ending in •••• ${customer.cardNumberLast4}`
              : ""}
          </p>
        </section>

        {customer.specialInstructions && (
          <section aria-labelledby="invoice-instructions" style={{ marginTop: "1.5rem" }}>
            <h3 id="invoice-instructions">Special instructions</h3>
            <p style={{ margin: 0 }}>{customer.specialInstructions}</p>
          </section>
        )}
      </article>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn"
          onClick={() => window.print()}
        >
          Print or save as PDF
        </button>
        <Link to="/menu" className="btn btn--secondary">
          Back to menu
        </Link>
      </div>
    </div>
  );
};
