import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Invoice } from '../types';
import { downloadInvoiceJson } from '../lib/invoices';
import { LAST_INVOICE_SESSION_KEY } from '../lib/sessionInvoice';

const PAYMENT_LABEL: Record<Invoice['paymentMethod'], string> = {
  card_on_pickup: 'Card on pickup',
  cash: 'Cash on pickup',
  venmo: 'Venmo',
  zelle: 'Zelle',
};

export function OrderConfirmationPage() {
  const location = useLocation();
  const invoice = useMemo(() => {
    const fromState = (location.state as { invoice?: Invoice } | null)?.invoice;
    if (fromState) return fromState;
    try {
      const raw = sessionStorage.getItem(LAST_INVOICE_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Invoice;
    } catch {
      return null;
    }
  }, [location.state]);

  if (!invoice) {
    return (
      <main id="main-content">
        <h1 className="page-title">Order confirmation</h1>
        <p className="status status--error" role="alert">
          No order found. If you just completed checkout, try going back — otherwise start a new order
          from the menu.
        </p>
        <p>
          <Link to="/">Go to menu</Link>
        </p>
      </main>
    );
  }

  const d = new Date(invoice.cateringDate + 'T12:00:00');

  return (
    <main id="main-content">
      <h1 className="page-title">Thank you!</h1>
      <p className="lede">
        Your pickup order is recorded. The kitchen copy stacks in this browser&apos;s offline storage
        under the key <strong>vibing-catering-invoices</strong> (exportable from developer tools when
        you connect a backend). A JSON invoice download should also have started automatically.
      </p>

      <div className="invoice">
        <p style={{ marginTop: 0 }}>
          <strong>Invoice ID:</strong> {invoice.id}
        </p>
        <p>
          <strong>Placed:</strong>{' '}
          {new Date(invoice.createdAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
        <p>
          <strong>Catering date:</strong>{' '}
          {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p>
          <strong>Party size:</strong> {invoice.partySize} guests
        </p>
        <p>
          <strong>Pickup:</strong> {invoice.pickupWindow}
        </p>
        <p>
          <strong>Contact:</strong> {invoice.contactName} · {invoice.contactEmail} ·{' '}
          {invoice.contactPhone}
        </p>
        <p>
          <strong>Payment:</strong> {PAYMENT_LABEL[invoice.paymentMethod]}
          {invoice.paymentNote ? ` — ${invoice.paymentNote}` : ''}
        </p>
        {invoice.specialInstructions ? (
          <p>
            <strong>Notes:</strong> {invoice.specialInstructions}
          </p>
        ) : null}

        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Portions</th>
              <th scope="col">Price / guest</th>
              <th scope="col">Line</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, idx) => (
              <tr key={`${line.itemId}-${idx}`}>
                <td>{line.name}</td>
                <td>{line.quantity}</td>
                <td>${line.pricePerPerson.toFixed(2)}</td>
                <td>${line.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Subtotal</td>
              <td>${invoice.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3}>Total (demo)</td>
              <td>${invoice.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="field-hint">{invoice.taxNote}</p>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => downloadInvoiceJson(invoice)}
        >
          Download invoice JSON again
        </button>
      </div>

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="btn btn--primary">
          Order for another date
        </Link>
      </p>
    </main>
  );
}
