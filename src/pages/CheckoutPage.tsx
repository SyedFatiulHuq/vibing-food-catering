import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import type { CheckoutPayload } from "../types";
import { readableDate } from "../lib/dates";

const PICKUP_WINDOW_VALUES = ["12-14", "14-16", "16-18", "18-20"] as const;

const pickupWindowLabel: Record<(typeof PICKUP_WINDOW_VALUES)[number], string> = {
  "12-14": "12:00 PM – 2:00 PM",
  "14-16": "2:00 PM – 4:00 PM",
  "16-18": "4:00 PM – 6:00 PM",
  "18-20": "6:00 PM – 8:00 PM",
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const {
    lines,
    guestCount,
    cateringDateIso,
    clearCart,
    minGuests,
    maxGuests,
  } = useCart();

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [pickupWindow, setPickupWindow] = useState<(typeof PICKUP_WINDOW_VALUES)[number]>("16-18");
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPayload["paymentMethod"]>("card");
  const [cardLastFour, setCardLastFour] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (guestCount < minGuests || guestCount > maxGuests) {
      setError(`Guest count must be between ${minGuests} and ${maxGuests}.`);
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setError("Please enter your name, email, and phone.");
      return;
    }
    if (paymentMethod === "card" && (!cardLastFour.trim() || cardLastFour.length !== 4)) {
      setError("For demo checkout, enter any 4 digits as the card last four.");
      return;
    }

    const payload: CheckoutPayload = {
      cateringDate: cateringDateIso,
      guestCount,
      pickupWindow: pickupWindowLabel[pickupWindow],
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      paymentMethod,
      cardLastFour: paymentMethod === "card" ? cardLastFour.trim() : undefined,
      billingZip: paymentMethod === "card" ? billingZip.trim() : undefined,
      specialInstructions: specialInstructions.trim(),
    };

    const inv = placeOrder(payload, lines);
    if (!inv) {
      setError("Something went wrong creating your order.");
      return;
    }
    clearCart();
    navigate(`/order/${inv.id}`, { replace: true });
  };

  return (
    <div className="shell">
      <h1 id="checkout-page-title" className="display" style={{ fontSize: "2rem" }}>
        Checkout
      </h1>
      <p style={{ color: "var(--color-muted)" }}>
        Pickup date: <strong>{readableDate(cateringDateIso)}</strong> · Guests:{" "}
        <strong>{guestCount}</strong>
      </p>

      {lines.length === 0 ? (
        <p>
          Nothing to check out. <Link to="/menu">Return to menu</Link>.
        </p>
      ) : (
        <form
          aria-labelledby="checkout-page-title"
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            alignItems: "start",
            width: "100%",
            minWidth: 0,
          }}
        >
          <section className="card" aria-labelledby="checkout-pickup-heading" style={{ padding: "1.25rem" }}>
            <h2 className="display" id="checkout-pickup-heading" style={{ marginTop: 0 }}>
              Pickup
            </h2>
            <div className="field">
              <label htmlFor="pickup-window">Pickup window</label>
              <select
                id="pickup-window"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value as (typeof PICKUP_WINDOW_VALUES)[number])}
              >
                {PICKUP_WINDOW_VALUES.map((key) => (
                  <option key={key} value={key}>
                    {pickupWindowLabel[key]}
                  </option>
                ))}
              </select>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--color-muted)" }}>
              We&apos;ll confirm the exact pickup slot by phone or email.
            </p>
          </section>

          <section className="card" aria-labelledby="checkout-contact-heading" style={{ padding: "1.25rem" }}>
            <h2 className="display" id="checkout-contact-heading" style={{ marginTop: 0 }}>
              Contact
            </h2>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                autoComplete="name"
                required
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
              />
            </div>
          </section>

          <section className="card" aria-labelledby="checkout-payment-heading" style={{ padding: "1.25rem" }}>
            <h2 className="display" id="checkout-payment-heading" style={{ marginTop: 0 }}>
              Payment (demo)
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-muted)" }}>
              No real charges are processed. Choose a method for the invoice record.
            </p>
            <div className="field">
              <label htmlFor="pay">Payment method</label>
              <select
                id="pay"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as CheckoutPayload["paymentMethod"])
                }
              >
                <option value="card">Card (demo)</option>
                <option value="cash">Cash on pickup</option>
                <option value="invoice">Invoice / net terms</option>
              </select>
            </div>
            {paymentMethod === "card" && (
              <>
                <div className="field">
                  <label htmlFor="last4">Card last four digits</label>
                  <input
                    id="last4"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-required={paymentMethod === "card"}
                    required={paymentMethod === "card"}
                    maxLength={4}
                    placeholder="4242"
                    value={cardLastFour}
                    onChange={(e) =>
                      setCardLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="zip">Billing ZIP (optional)</label>
                  <input
                    id="zip"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                  />
                </div>
              </>
            )}
          </section>

          <section
            className="card"
            aria-labelledby="checkout-notes-heading"
            style={{ padding: "1.25rem", gridColumn: "1 / -1" }}
          >
            <h2 className="display" id="checkout-notes-heading" style={{ marginTop: 0 }}>
              Special instructions
            </h2>
            <div className="field">
              <label htmlFor="notes">Allergies, dietary notes, packaging</label>
              <textarea
                id="notes"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
            {error && (
              <p id="checkout-form-error" style={{ color: "#9a3412", fontWeight: 600 }} role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary" aria-describedby={error ? "checkout-form-error" : undefined}>
              Place order &amp; view invoice
            </button>
          </section>
        </form>
      )}
    </div>
  );
}
