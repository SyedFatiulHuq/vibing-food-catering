import { Link, useParams } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { getOrderById } from "../data/localStore";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDisplayDate, parseIsoDateOnly } from "../utils/dates";
import { formatUsd } from "../utils/money";
import type { PaymentMethod } from "../types";

const PAYMENT_COPY: Record<PaymentMethod, string> = {
  cash_pickup: "Cash at pickup",
  card_pickup: "Card on pickup (no online charge)",
  invoice_net30: "Invoice (Net 30)",
};

export function OrderPage() {
  const { orderId } = useParams();
  const order = orderId ? getOrderById(orderId) : undefined;
  usePageTitle(order ? `Invoice ${order.id}` : "Order");

  if (!order) {
    return (
      <AppLayout>
        <div className="page-heading">
          <h1>Invoice not found</h1>
          <p>
            We could not load this invoice. It may have been opened on a different
            device or browser profile since orders are stored locally.
          </p>
          <Link className="button button--primary" to="/menu">
            Start a new order
          </Link>
        </div>
      </AppLayout>
    );
  }

  const date = parseIsoDateOnly(order.cateringDateIso);

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>Thank you—order recorded</h1>
        <p>
          Keep this invoice number for pickup coordination:{" "}
          <strong>{order.id}</strong>. A copy remains available in this browser&apos;s
          storage for the business owner.
        </p>
      </div>

      <div className="invoice-toolbar">
        <button type="button" className="button button--ghost" onClick={() => window.print()}>
          Print or save as PDF
        </button>
        <Link className="button button--primary" to="/menu">
          Plan another event
        </Link>
      </div>

      <article className="invoice" aria-labelledby="invoice-heading">
        <header className="invoice__header">
          <div>
            <h2 id="invoice-heading">Catering invoice (sample)</h2>
            <p className="invoice__meta">
              Invoice ID: {order.id}
              <br />
              Placed on {formatDisplayDate(new Date(order.createdAtIso))}
            </p>
          </div>
          <div>
            <p className="invoice__meta">
              Catering date:{" "}
              {date ? formatDisplayDate(date) : order.cateringDateIso}
            </p>
            <p className="invoice__meta">Party size: {order.partySize} guests</p>
          </div>
        </header>

        <section aria-labelledby="customer-heading">
          <h3 id="customer-heading" className="section-heading">
            Customer
          </h3>
          <ul className="plain-list">
            <li>{order.fullName}</li>
            <li>
              <a href={`mailto:${order.email}`}>{order.email}</a>
            </li>
            <li>
              <a href={`tel:${order.phone.replace(/\D/g, "")}`}>{order.phone}</a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="pickup-heading">
          <h3 id="pickup-heading" className="section-heading">
            Pickup and notes
          </h3>
          <p>{order.pickupWindow}</p>
          {order.specialInstructions ? (
            <p>
              <strong>Special instructions:</strong> {order.specialInstructions}
            </p>
          ) : null}
          <p>
            <strong>Payment:</strong> {PAYMENT_COPY[order.paymentMethod]}
          </p>
          {order.paymentNote ? (
            <p>
              <strong>Payment notes:</strong> {order.paymentNote}
            </p>
          ) : null}
        </section>

        <section aria-labelledby="lines-heading">
          <h3 id="lines-heading" className="section-heading">
            Line items
          </h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Category</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={`${line.itemId}-${line.quantity}`}>
                    <th scope="row">{line.name}</th>
                    <td>{line.category}</td>
                    <td>{line.quantity}</td>
                    <td>{formatUsd(line.unitPriceCents)}</td>
                    <td>{formatUsd(line.lineTotalCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="invoice__total">
            Total due (estimate): <strong>{formatUsd(order.totalCents)}</strong>
          </p>
        </section>
      </article>
    </AppLayout>
  );
}
