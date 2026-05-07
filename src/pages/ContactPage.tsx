import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { business } from "../data/business";

interface MessageState {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type Errors = Partial<Record<keyof MessageState, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactPage = () => {
  const formId = useId();
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<MessageState>({
    fullName: "",
    email: "",
    phone: "",
    topic: "general",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const update =
    <K extends keyof MessageState>(key: K) =>
    (value: MessageState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (submitted) {
        setErrors((prev) => {
          const { [key]: _r, ...rest } = prev;
          return rest;
        });
      }
    };

  const validate = (state: MessageState): Errors => {
    const e: Errors = {};
    if (!state.fullName.trim()) e.fullName = "Please enter your name.";
    if (!state.email.trim()) e.email = "Please enter your email.";
    else if (!emailRegex.test(state.email.trim())) e.email = "Please enter a valid email.";
    if (!state.message.trim()) e.message = "Please add a short message.";
    else if (state.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    return e;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setSuccess(false);
    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSuccess(true);
    setForm({ fullName: "", email: "", phone: "", topic: "general", message: "" });
    setSubmitted(false);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const errorEntries = Object.entries(errors);

  return (
    <div className="container section">
      <p className="crumbs">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> Contact
      </p>
      <h1>Contact us</h1>
      <p style={{ color: "var(--color-text-muted)", maxWidth: "60ch" }}>
        Got a question, a custom request, or want to chat about your event? Reach out directly,
        or send us a message below.
      </p>

      <div className="contact-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <section className="contact-block" aria-labelledby="contact-direct-title">
            <h2 id="contact-direct-title" style={{ margin: 0 }}>
              Reach us directly
            </h2>
            <dl>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${business.phoneTel}`}>{business.phone}</a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </dd>
              <dt>Address</dt>
              <dd>
                {business.address.line1}, {business.address.line2}
                <br />
                {business.address.city}, {business.address.region} {business.address.postalCode}
              </dd>
            </dl>

            <h3 style={{ marginBottom: "0.25rem" }}>Pickup hours</h3>
            <ul className="hours-list">
              {business.pickupHours.map((row) => (
                <li key={row.day}>
                  <span>{row.day}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="contact-block" aria-labelledby="contact-social-title">
            <h2 id="contact-social-title" style={{ margin: 0 }}>
              Find us on social
            </h2>
            <ul className="social-list">
              {business.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.label}, ${s.handle}, opens in a new tab`}
                  >
                    {s.label}
                    <span style={{ color: "var(--color-text-muted)" }}> · {s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="contact-block" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" style={{ margin: 0 }}>
            Send us a message
          </h2>
          <p style={{ marginTop: 0, color: "var(--color-text-muted)" }}>
            We&rsquo;ll get back to you within one business day. Required fields are marked with
            an asterisk (*).
          </p>

          {success && (
            <div
              ref={successRef}
              className="notice notice--info"
              role="status"
              tabIndex={-1}
              aria-live="polite"
            >
              <strong>Thanks for reaching out!</strong> Your message has been sent. We&rsquo;ll
              reply soon.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {submitted && errorEntries.length > 0 && (
              <div
                ref={errorRef}
                className="notice notice--error"
                role="alert"
                tabIndex={-1}
                style={{ marginBottom: "1rem" }}
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

            <div className="field">
              <label htmlFor={`${formId}-fullName`}>
                Name <span aria-hidden="true">*</span>
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
                aria-describedby={errors.fullName ? `${formId}-fullName-err` : undefined}
              />
              {errors.fullName && (
                <span id={`${formId}-fullName-err`} className="field-error">
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
                  aria-describedby={errors.email ? `${formId}-email-err` : undefined}
                />
                {errors.email && (
                  <span id={`${formId}-email-err`} className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="field">
                <label htmlFor={`${formId}-phone`}>Phone (optional)</label>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone")(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor={`${formId}-topic`}>Topic</label>
              <select
                id={`${formId}-topic`}
                value={form.topic}
                onChange={(e) => update("topic")(e.target.value)}
              >
                <option value="general">General question</option>
                <option value="catering">Custom catering inquiry</option>
                <option value="dietary">Dietary or allergen question</option>
                <option value="feedback">Feedback on a recent order</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor={`${formId}-message`}>
                Message <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id={`${formId}-message`}
                value={form.message}
                onChange={(e) => update("message")(e.target.value)}
                required
                maxLength={1000}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={`${formId}-message-hint${
                  errors.message ? ` ${formId}-message-err` : ""
                }`}
              />
              <span id={`${formId}-message-hint`} className="field-hint">
                Up to 1000 characters.
              </span>
              {errors.message && (
                <span id={`${formId}-message-err`} className="field-error">
                  {errors.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn">
              Send message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
