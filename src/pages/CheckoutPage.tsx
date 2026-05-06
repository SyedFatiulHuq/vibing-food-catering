import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMenuForDate } from '../data/menu';
import { useCart, cartConstants } from '../context/CartContext';
import { buildInvoice } from '../utils/checkout';
import { downloadInvoiceJson, saveInvoice } from '../lib/invoices';
import { LAST_INVOICE_SESSION_KEY } from '../lib/sessionInvoice';
import { isValidCateringDate, parseISODate } from '../utils/dates';
import type { PaymentMethod } from '../types';

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  card_on_pickup: 'Card on pickup',
  cash: 'Cash on pickup',
  venmo: 'Venmo',
  zelle: 'Zelle',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cateringDateISO,
    partySize,
    lines,
    clearCart,
  } = useCart();

  const [pickupWindow, setPickupWindow] = useState('4:00 PM – 6:00 PM');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card_on_pickup');
  const [paymentNote, setPaymentNote] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [error, setError] = useState('');

  const date = parseISODate(cateringDateISO);
  const menu = date ? getMenuForDate(date) : [];
  const byId = new Map(menu.map((m) => [m.id, m]));

  const rows = lines
    .map((l) => {
      const item = byId.get(l.itemId);
      if (!item) return null;
      const lineTotal = Math.round(item.pricePerPerson * l.quantity * 100) / 100;
      return { ...l, item, lineTotal };
    })
    .filter(Boolean) as { itemId: string; quantity: number; item: (typeof menu)[0]; lineTotal: number }[];

  const subtotal = Math.round(rows.reduce((s, r) => s + r.lineTotal, 0) * 100) / 100;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !isValidCateringDate(date)) {
      setError('Catering date is not valid. Go back to the menu and pick an allowed date.');
      return;
    }
    if (partySize < cartConstants.PARTY_MIN || partySize > cartConstants.PARTY_MAX) {
      setError(`Party size must be between ${cartConstants.PARTY_MIN} and ${cartConstants.PARTY_MAX}.`);
      return;
    }
    if (lines.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setError('Please fill in your name, email, and phone.');
      return;
    }
    if (!pickupWindow.trim()) {
      setError('Please choose or describe a pickup window.');
      return;
    }

    const invoice = buildInvoice(
      byId,
      {
        cateringDate: cateringDateISO,
        partySize,
        pickupWindow: pickupWindow.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        paymentMethod,
        paymentNote: paymentNote.trim(),
        specialInstructions: specialInstructions.trim(),
      },
      lines,
    );

    saveInvoice(invoice);
    downloadInvoiceJson(invoice);
    try {
      sessionStorage.setItem(LAST_INVOICE_SESSION_KEY, JSON.stringify(invoice));
    } catch {
      /* ignore quota */
    }
    clearCart();
    navigate('/order-confirmation', { state: { invoice } });
  };

  if (lines.length === 0) {
    return (
      <main id="main-content">
        <h1 className="page-title">Checkout</h1>
        <p className="status">Your cart is empty.</p>
        <p>
          <Link to="/">Browse the menu</Link>
        </p>
      </main>
    );
  }

  return (
    <main id="main-content">
      <h1 className="page-title">Checkout</h1>
      <p className="lede">
        Review your order and tell us how to reach you. Payment is arranged for pickup — no card is
        charged online in this demo.
      </p>

      <div className="invoice" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card__title" style={{ fontSize: '1.1rem' }}>
          Order summary
        </h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Portions</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.itemId}>
                <td>{r.item.name}</td>
                <td>{r.quantity}</td>
                <td>${r.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Subtotal</td>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="field-hint" style={{ marginBottom: 0 }}>
          {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} ·{' '}
          {partySize} guests
        </p>
      </div>

      <form className="stack" onSubmit={onSubmit} noValidate>
        {error ? (
          <p className="status status--error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="field">
          <label htmlFor="pickup">Pickup window</label>
          <input
            id="pickup"
            value={pickupWindow}
            onChange={(e) => setPickupWindow(e.target.value)}
            autoComplete="off"
            required
            aria-required="true"
          />
          <p className="field-hint">Example: 4:00–6:00 PM at our kitchen counter.</p>
        </div>

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            autoComplete="name"
            required
            aria-required="true"
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            autoComplete="email"
            required
            aria-required="true"
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            autoComplete="tel"
            required
            aria-required="true"
          />
        </div>

        <div className="field">
          <label htmlFor="payment">Payment method</label>
          <select
            id="payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((k) => (
              <option key={k} value={k}>
                {PAYMENT_LABEL[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="payment-note">Payment details (optional)</label>
          <textarea
            id="payment-note"
            value={paymentNote}
            onChange={(e) => setPaymentNote(e.target.value)}
            placeholder="Last 4 digits, Venmo handle, etc."
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Special instructions</label>
          <textarea
            id="notes"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Allergies, dietary notes, gate codes…"
          />
        </div>

        <button type="submit" className="btn btn--primary btn-block">
          Place order
        </button>
      </form>

      <p style={{ marginTop: '1.25rem' }}>
        <Link to="/cart">← Back to cart</Link>
      </p>
    </main>
  );
}
