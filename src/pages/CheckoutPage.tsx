import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { useCart } from "../context/CartContext";
import type { PaymentMethod } from "../types";
import { saveOrder } from "../data/localStore";
import { usePageTitle } from "../hooks/usePageTitle";
import { cartSubtotalCents, resolveCartLines } from "../utils/cartTotals";
import { formatDisplayDate, parseIsoDateOnly } from "../utils/dates";
import { formatUsd } from "../utils/money";
import { MAX_PARTY_SIZE, MIN_PARTY_SIZE } from "../context/CartContext";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash_pickup: "Cash at pickup",
  card_pickup: "Card on pickup (no online charge)",
  invoice_net30: "Invoice (Net 30, existing clients only)",
};

export function CheckoutPage() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const {
    lines,
    cateringDateIso,
    clearCart,
  } = useCart();

  const resolved = resolveCartLines(cateringDateIso, lines);
  const subtotal = cartSubtotalCents(resolved);
  const parsedDate = parseIsoDateOnly(cateringDateIso);

  const [partySize, setPartySize] = useState(MIN_PARTY_SIZE);
  const [pickupWindow, setPickupWindow] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_pickup");
  const [paymentNote, setPaymentNote] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const partySizeHint = useMemo(
    () =>
      `Party size must be at least ${MIN_PARTY_SIZE} and at most ${MAX_PARTY_SIZE} guests.`,
    [],
  );

  const partyInvalid =
    Number.isNaN(partySize) ||
    partySize < MIN_PARTY_SIZE ||
    partySize > MAX_PARTY_SIZE;

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (partyInvalid || resolved.length === 0 || !parsedDate) return;

    const orderLines = resolved.map((l) => ({
      itemId: l.itemId,
      quantity: l.quantity,
      name: l.name,
      category: l.category,
      unitPriceCents: l.unitPriceCents,
      lineTotalCents: l.lineTotalCents,
    }));

    const id = `ord_${crypto.randomUUID()}`;
    saveOrder({
      id,
      createdAtIso: new Date().toISOString(),
      cateringDateIso,
      pickupWindow,
      fullName,
      email,
      phone,
      paymentMethod,
      paymentNote,
      specialInstructions,
      partySize,
      lines: orderLines,
      subtotalCents: subtotal,
      totalCents: subtotal,
    });
    clearCart();
    navigate(`/order/${id}`);
  }

  return (
    <AppLayout>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs__list">
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li aria-current="page">Checkout</li>
        </ol>
      </nav>

      <div className="page-heading">
        <h1>Checkout</h1>
        <p>
          Provide pickup logistics and contact information. Payment selection helps our
          kitchen prepare the right documentation—card numbers are not collected or
          stored in this demo.
        </p>
      </div>

      <div className="checkout-grid">
        <form className="stack" onSubmit={onSubmit} noValidate>
          <fieldset>
            <legend>Event details</legend>
            {parsedDate ? (
              <p>
                Catering date:{" "}
                <strong>{formatDisplayDate(parsedDate)}</strong>
              </p>
            ) : (
              <p role="alert">Catering date is missing. Return to the menu.</p>
            )}
            <div className="field">
              <label htmlFor="party-size" className="field__label">
                Party size (guest count)
              </label>
              <p className="field__hint" id="party-size-hint">
                {partySizeHint}
              </p>
              <input
                id="party-size"
                className="field__input field__input--narrow"
                type="number"
                inputMode="numeric"
                min={MIN_PARTY_SIZE}
                max={MAX_PARTY_SIZE}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                aria-describedby="party-size-hint"
                aria-invalid={partyInvalid || undefined}
                required
              />
              {partyInvalid ? (
                <p className="field__error" role="alert">
                  Enter a guest count between {MIN_PARTY_SIZE} and {MAX_PARTY_SIZE}.
                </p>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor="pickup-window" className="field__label">
                Requested pickup window
              </label>
              <p className="field__hint" id="pickup-window-hint">
                Example: Friday 4:00–5:30 p.m. Specific confirmation arrives by email.
              </p>
              <textarea
                id="pickup-window"
                className="field__input"
                rows={3}
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                aria-describedby="pickup-window-hint"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="special" className="field__label">
                Special instructions or dietary notes
              </label>
              <textarea
                id="special"
                className="field__input"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Primary contact</legend>
            <div className="field">
              <label htmlFor="full-name" className="field__label">
                Full name
              </label>
              <input
                id="full-name"
                className="field__input"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email" className="field__label">
                Email address
              </label>
              <input
                id="email"
                className="field__input"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="phone" className="field__label">
                Phone number
              </label>
              <input
                id="phone"
                className="field__input"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment preference</legend>
            <p className="field__hint" id="payment-hint">
              This interface does not charge cards. Select how you prefer to settle on
              pickup or by invoice.
            </p>
            <div className="radio-list" aria-describedby="payment-hint">
              {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((method) => (
                <div className="field field--inline" key={method}>
                  <input
                    id={`pay-${method}`}
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <label htmlFor={`pay-${method}`}>{PAYMENT_LABEL[method]}</label>
                </div>
              ))}
            </div>
            <div className="field">
              <label htmlFor="payment-note" className="field__label">
                Payment notes (optional)
              </label>
              <p className="field__hint" id="payment-note-hint">
                For example: “Corporate cost center 442-B” or “Last four digits of card
                expected at pickup: 1234.” Never include full card numbers.
              </p>
              <textarea
                id="payment-note"
                className="field__input"
                rows={2}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                aria-describedby="payment-note-hint"
              />
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              className="button button--primary"
              type="submit"
              disabled={partyInvalid || resolved.length === 0}
            >
              Place order and generate invoice
            </button>
            <Link className="button button--ghost" to="/cart">
              Return to cart
            </Link>
          </div>
        </form>

        <aside className="summary-panel" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="section-heading">
            Order summary
          </h2>
          <ul className="summary-list">
            {resolved.map((l) => (
              <li key={l.itemId}>
                <span>
                  {l.name}{" "}
                  <span className="muted">
                    × {l.quantity} @ {formatUsd(l.unitPriceCents)}
                  </span>
                </span>
                <span>{formatUsd(l.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <p className="summary-total">
            Total due (estimate):{" "}
            <strong>{formatUsd(subtotal)}</strong>
          </p>
          <p className="muted">
            Taxes and service charges may be confirmed in your pickup email. This page is
            for planning only.
          </p>
        </aside>
      </div>
    </AppLayout>
  );
}
