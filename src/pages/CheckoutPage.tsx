import { useId, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { usePickupDate } from "../context/PickupDateContext";
import { dayLabels, getItemById } from "../data/menu";
import {
  dayKeyForDate,
  fromIsoDate,
  isWithinOrderWindow,
  maxOrderDate,
  minOrderDate,
  toIsoDate,
} from "../utils/dateUtils";
import { TAX_RATE, formatCurrency } from "../utils/format";
import { saveOrder } from "../utils/storage";
import type { CustomerDetails, Invoice, PaymentMethod } from "../types";

const MIN_PARTY = 6;
const MAX_PARTY = 30;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  partySize: string;
  paymentMethod: PaymentMethod;
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  specialInstructions: string;
}

type FieldErrors = Partial<Record<keyof FormState | "general", string>>;

const phoneRegex = /^[+\d\s().-]{7,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cardRegex = /^[\d\s-]{13,19}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
const cvcRegex = /^\d{3,4}$/;

export const CheckoutPage = () => {
  const { items, clear } = useCart();
  const { pickupDateIso, setPickupDateIso, pickupDate } = usePickupDate();
  const navigate = useNavigate();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  const dayKey = dayKeyForDate(pickupDate);

  const enriched = useMemo(
    () =>
      items
        .map((ci) => {
          const food = getItemById(ci.itemId);
          return food ? { ...ci, food } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [items],
  );

  const onPickupDay = enriched.filter((row) => row.food.day === dayKey);
  const subtotal = onPickupDay.reduce((sum, row) => sum + row.food.price * row.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    pickupDate: pickupDateIso,
    pickupTime: "12:00",
    partySize: "",
    paymentMethod: "credit-card",
    cardholderName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (onPickupDay.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const update =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (submitted) {
        setErrors((prev) => {
          const { [key]: _removed, ...rest } = prev;
          return rest;
        });
      }
    };

  const validate = (state: FormState): FieldErrors => {
    const e: FieldErrors = {};
    if (!state.fullName.trim()) e.fullName = "Please enter your full name.";
    if (!state.email.trim()) e.email = "Please enter your email.";
    else if (!emailRegex.test(state.email.trim())) e.email = "Please enter a valid email address.";
    if (!state.phone.trim()) e.phone = "Please enter a phone number where we can reach you.";
    else if (!phoneRegex.test(state.phone.trim())) e.phone = "Please enter a valid phone number.";

    if (!state.pickupDate) e.pickupDate = "Please choose a pickup date.";
    else {
      const d = fromIsoDate(state.pickupDate);
      if (!isWithinOrderWindow(d)) {
        e.pickupDate = "Pickup must be 2 to 14 days from today.";
      }
    }
    if (!state.pickupTime) e.pickupTime = "Please choose a pickup time.";
    else {
      const [h] = state.pickupTime.split(":").map(Number);
      if (Number.isNaN(h) || h < 10 || h >= 19) {
        e.pickupTime = "Pickup must be between 10:00 AM and 7:00 PM.";
      }
    }

    const partyNum = Number.parseInt(state.partySize, 10);
    if (!state.partySize) e.partySize = "How many people will this serve?";
    else if (Number.isNaN(partyNum)) e.partySize = "Please enter a number.";
    else if (partyNum < MIN_PARTY || partyNum > MAX_PARTY)
      e.partySize = `Party size must be between ${MIN_PARTY} and ${MAX_PARTY}.`;

    if (state.paymentMethod === "credit-card" || state.paymentMethod === "debit-card") {
      if (!state.cardholderName.trim()) e.cardholderName = "Please enter the name on the card.";
      if (!state.cardNumber.trim()) e.cardNumber = "Please enter your card number.";
      else if (!cardRegex.test(state.cardNumber.trim()))
        e.cardNumber = "Card numbers are typically 13–19 digits.";
      if (!state.cardExpiry.trim()) e.cardExpiry = "Please enter expiry as MM/YY.";
      else if (!expiryRegex.test(state.cardExpiry.trim()))
        e.cardExpiry = "Use MM/YY (for example 09/28).";
      if (!state.cardCvc.trim()) e.cardCvc = "Please enter the security code.";
      else if (!cvcRegex.test(state.cardCvc.trim()))
        e.cardCvc = "Security codes are 3 or 4 digits.";
    }
    return e;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    if (form.pickupDate !== pickupDateIso) {
      setPickupDateIso(form.pickupDate);
    }

    const customer: CustomerDetails = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      partySize: Number.parseInt(form.partySize, 10),
      paymentMethod: form.paymentMethod,
      specialInstructions: form.specialInstructions.trim() || undefined,
      cardNumberLast4:
        form.paymentMethod === "cash-on-pickup"
          ? undefined
          : form.cardNumber.replace(/\D/g, "").slice(-4),
      cardholderName:
        form.paymentMethod === "cash-on-pickup" ? undefined : form.cardholderName.trim(),
    };

    const lineItems = onPickupDay.map((row) => ({
      itemId: row.food.id,
      name: row.food.name,
      quantity: row.quantity,
      unitPrice: row.food.price,
      lineTotal: row.food.price * row.quantity,
    }));

    const orderId = `HH-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 10_000,
    )
      .toString()
      .padStart(4, "0")}`;

    const invoice: Invoice = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      lineItems,
      subtotal,
      taxRate: TAX_RATE,
      tax,
      total,
    };

    saveOrder(invoice);
    clear();
    navigate(`/invoice/${orderId}`, { state: { invoice } });
  };

  const errorEntries = Object.entries(errors).filter(([k]) => k !== "general");

  return (
    <div className="container section">
      <p className="crumbs">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link to="/cart">Cart</Link> <span aria-hidden="true">/</span> Checkout
      </p>
      <h1>Checkout</h1>
      <p style={{ color: "var(--color-text-muted)", maxWidth: "60ch" }}>
        Confirm your pickup details below. We&rsquo;ll send a confirmation to your email.
        Required fields are marked with an asterisk (*).
      </p>

      <div className="layout-2col">
        <form
          id={formId}
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={errorEntries.length > 0 ? `${formId}-summary` : undefined}
        >
          {submitted && errorEntries.length > 0 && (
            <div
              ref={errorSummaryRef}
              id={`${formId}-summary`}
              className="notice notice--error"
              role="alert"
              tabIndex={-1}
              style={{ marginBottom: "1.5rem" }}
            >
              <strong>
                There {errorEntries.length === 1 ? "is 1 problem" : `are ${errorEntries.length} problems`}{" "}
                with your submission:
              </strong>
              <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem" }}>
                {errorEntries.map(([key, msg]) => (
                  <li key={key}>
                    <a href={`#${formId}-${key}`} style={{ color: "inherit" }}>
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <fieldset className="checkout-fieldset">
            <legend>Contact information</legend>

            <div className="field">
              <label htmlFor={`${formId}-fullName`}>
                Full name <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id={`${formId}-fullName`}
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => update("fullName")(e.target.value)}
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${formId}-fullName-error` : undefined}
              />
              {errors.fullName && (
                <span id={`${formId}-fullName-error`} className="field-error">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor={`${formId}-email`}>
                  Email <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email")(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                />
                {errors.email && (
                  <span id={`${formId}-email-error`} className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor={`${formId}-phone`}>
                  Phone <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone")(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
                />
                {errors.phone && (
                  <span id={`${formId}-phone-error`} className="field-error">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend>Pickup details</legend>

            <div className="field-row">
              <div className="field">
                <label htmlFor={`${formId}-pickupDate`}>
                  Pickup date <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-pickupDate`}
                  type="date"
                  value={form.pickupDate}
                  min={toIsoDate(minOrderDate())}
                  max={toIsoDate(maxOrderDate())}
                  onChange={(e) => update("pickupDate")(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.pickupDate)}
                  aria-describedby={`${formId}-pickupDate-hint${
                    errors.pickupDate ? ` ${formId}-pickupDate-error` : ""
                  }`}
                />
                <span id={`${formId}-pickupDate-hint`} className="field-hint">
                  Currently showing the {dayLabels[dayKeyForDate(fromIsoDate(form.pickupDate))]} menu.
                </span>
                {errors.pickupDate && (
                  <span id={`${formId}-pickupDate-error`} className="field-error">
                    {errors.pickupDate}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor={`${formId}-pickupTime`}>
                  Pickup time <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={`${formId}-pickupTime`}
                  type="time"
                  value={form.pickupTime}
                  min="10:00"
                  max="19:00"
                  step="900"
                  onChange={(e) => update("pickupTime")(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.pickupTime)}
                  aria-describedby={`${formId}-pickupTime-hint${
                    errors.pickupTime ? ` ${formId}-pickupTime-error` : ""
                  }`}
                />
                <span id={`${formId}-pickupTime-hint`} className="field-hint">
                  Open daily 10:00 AM – 7:00 PM.
                </span>
                {errors.pickupTime && (
                  <span id={`${formId}-pickupTime-error`} className="field-error">
                    {errors.pickupTime}
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor={`${formId}-partySize`}>
                Party size <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id={`${formId}-partySize`}
                type="number"
                inputMode="numeric"
                min={MIN_PARTY}
                max={MAX_PARTY}
                value={form.partySize}
                onChange={(e) => update("partySize")(e.target.value)}
                required
                aria-invalid={Boolean(errors.partySize)}
                aria-describedby={`${formId}-partySize-hint${
                  errors.partySize ? ` ${formId}-partySize-error` : ""
                }`}
              />
              <span id={`${formId}-partySize-hint`} className="field-hint">
                Between {MIN_PARTY} and {MAX_PARTY} people. We don&rsquo;t take orders smaller or
                larger.
              </span>
              {errors.partySize && (
                <span id={`${formId}-partySize-error`} className="field-error">
                  {errors.partySize}
                </span>
              )}
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend>Payment</legend>

            <div role="radiogroup" aria-labelledby={`${formId}-payment-label`} className="radio-list">
              <span
                id={`${formId}-payment-label`}
                className="field-label"
                style={{ marginBottom: "0.5rem" }}
              >
                Payment method <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </span>
              <PaymentRadio
                id={`${formId}-pay-credit`}
                name={`${formId}-payment`}
                value="credit-card"
                checked={form.paymentMethod === "credit-card"}
                onChange={(v) => update("paymentMethod")(v)}
                title="Credit card"
                hint="Visa, Mastercard, AmEx, Discover."
              />
              <PaymentRadio
                id={`${formId}-pay-debit`}
                name={`${formId}-payment`}
                value="debit-card"
                checked={form.paymentMethod === "debit-card"}
                onChange={(v) => update("paymentMethod")(v)}
                title="Debit card"
                hint="Charges authorize at pickup."
              />
              <PaymentRadio
                id={`${formId}-pay-cash`}
                name={`${formId}-payment`}
                value="cash-on-pickup"
                checked={form.paymentMethod === "cash-on-pickup"}
                onChange={(v) => update("paymentMethod")(v)}
                title="Cash on pickup"
                hint="Pay in person when you collect your order."
              />
            </div>

            {(form.paymentMethod === "credit-card" || form.paymentMethod === "debit-card") && (
              <div style={{ marginTop: "1rem" }}>
                <p className="notice notice--info" style={{ fontSize: "0.9rem" }}>
                  This is a demo — no real payment is processed. We never store full card numbers.
                </p>

                <div className="field">
                  <label htmlFor={`${formId}-cardholderName`}>
                    Name on card <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id={`${formId}-cardholderName`}
                    type="text"
                    autoComplete="cc-name"
                    value={form.cardholderName}
                    onChange={(e) => update("cardholderName")(e.target.value)}
                    aria-invalid={Boolean(errors.cardholderName)}
                    aria-describedby={
                      errors.cardholderName ? `${formId}-cardholderName-error` : undefined
                    }
                  />
                  {errors.cardholderName && (
                    <span id={`${formId}-cardholderName-error`} className="field-error">
                      {errors.cardholderName}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor={`${formId}-cardNumber`}>
                    Card number <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id={`${formId}-cardNumber`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={form.cardNumber}
                    onChange={(e) => update("cardNumber")(e.target.value)}
                    aria-invalid={Boolean(errors.cardNumber)}
                    aria-describedby={
                      errors.cardNumber ? `${formId}-cardNumber-error` : undefined
                    }
                  />
                  {errors.cardNumber && (
                    <span id={`${formId}-cardNumber-error`} className="field-error">
                      {errors.cardNumber}
                    </span>
                  )}
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor={`${formId}-cardExpiry`}>
                      Expiry (MM/YY) <span aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={`${formId}-cardExpiry`}
                      type="text"
                      autoComplete="cc-exp"
                      placeholder="09/28"
                      value={form.cardExpiry}
                      onChange={(e) => update("cardExpiry")(e.target.value)}
                      aria-invalid={Boolean(errors.cardExpiry)}
                      aria-describedby={
                        errors.cardExpiry ? `${formId}-cardExpiry-error` : undefined
                      }
                    />
                    {errors.cardExpiry && (
                      <span id={`${formId}-cardExpiry-error`} className="field-error">
                        {errors.cardExpiry}
                      </span>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor={`${formId}-cardCvc`}>
                      Security code <span aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={`${formId}-cardCvc`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={form.cardCvc}
                      onChange={(e) => update("cardCvc")(e.target.value)}
                      aria-invalid={Boolean(errors.cardCvc)}
                      aria-describedby={errors.cardCvc ? `${formId}-cardCvc-error` : undefined}
                    />
                    {errors.cardCvc && (
                      <span id={`${formId}-cardCvc-error`} className="field-error">
                        {errors.cardCvc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="checkout-fieldset">
            <legend>Special instructions</legend>
            <div className="field">
              <label htmlFor={`${formId}-special`}>
                Anything we should know? (allergies, occasion, parking, etc.)
              </label>
              <textarea
                id={`${formId}-special`}
                value={form.specialInstructions}
                onChange={(e) => update("specialInstructions")(e.target.value)}
                maxLength={600}
                aria-describedby={`${formId}-special-hint`}
              />
              <span id={`${formId}-special-hint`} className="field-hint">
                Optional. Up to 600 characters.
              </span>
            </div>
          </fieldset>

          <button type="submit" className="btn btn--full">
            Place order ({formatCurrency(total)})
          </button>
        </form>

        <aside className="summary-card" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title" style={{ marginTop: 0 }}>
            Your order
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {onPickupDay.map((row) => (
              <li
                key={row.itemId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span>
                  <span style={{ fontWeight: 600 }}>{row.food.name}</span>
                  <br />
                  <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                    {row.quantity} × {formatCurrency(row.food.price)}
                  </span>
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                  {formatCurrency(row.food.price * row.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl style={{ marginTop: "1rem" }}>
            <dt>Subtotal</dt>
            <dd>{formatCurrency(subtotal)}</dd>
            <dt>Tax (6.25%)</dt>
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
        </aside>
      </div>
    </div>
  );
};

interface RadioProps {
  id: string;
  name: string;
  value: PaymentMethod;
  checked: boolean;
  onChange: (value: PaymentMethod) => void;
  title: string;
  hint: string;
}

const PaymentRadio = ({ id, name, value, checked, onChange, title, hint }: RadioProps) => (
  <label className="radio-option" htmlFor={id}>
    <input
      id={id}
      name={name}
      type="radio"
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      aria-label={title}
      aria-describedby={`${id}-hint`}
    />
    <span className="radio-option__label">
      <span className="radio-option__title">{title}</span>
      <span id={`${id}-hint`} className="radio-option__hint">
        {hint}
      </span>
    </span>
  </label>
);
