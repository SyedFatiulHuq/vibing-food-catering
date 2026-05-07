import { FormEvent, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { BUSINESS, SOCIAL_LINKS } from "../data/businessInfo";
import { saveContactMessage } from "../data/localStore";
import { usePageTitle } from "../hooks/usePageTitle";

const TOPICS = [
  { id: "menu", label: "Menu or ingredients question" },
  { id: "pickup", label: "Pickup logistics" },
  { id: "allergy", label: "Allergen or dietary needs" },
  { id: "partners", label: "Partnerships or events" },
] as const;

export function ContactPage() {
  usePageTitle("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["id"]>("menu");
  const [message, setMessage] = useState("");
  const [sentId, setSentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email, and a message are required.");
      return;
    }
    const entry = saveContactMessage({ name, email, topic, message });
    setSentId(entry.id);
    setMessage("");
  }

  return (
    <AppLayout>
      <div className="page-heading">
        <h1>Contact the kitchen</h1>
        <p>
          Reach us by phone, social channels, or the form below. Messages sent through the
          form stay in this browser for demo purposes—production launches will route to
          email or a help desk.
        </p>
      </div>

      <div className="contact-grid">
        <section aria-labelledby="direct-heading">
          <h2 id="direct-heading" className="section-heading">
            Direct lines
          </h2>
          <ul className="plain-list">
            <li>
              Phone:{" "}
              <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phone}</a>
            </li>
            <li>
              Email:{" "}
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </li>
            <li>
              {BUSINESS.addressLine1}
              <br />
              {BUSINESS.addressLine2}
            </li>
          </ul>
          <h3 className="subsection-heading">Social media</h3>
          <ul className="plain-list">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.id}>
                <a href={s.href} rel="noreferrer noopener" target="_blank">
                  {s.label} profile for {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="section-heading">
            Message form
          </h2>
          {sentId ? (
            <p role="status" className="success-banner">
              Message saved locally with reference <strong>{sentId}</strong>. Our team will
              respond using your email on file once a workflow is connected.
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="field__error">
              {error}
            </p>
          ) : null}
          <form className="stack" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="contact-name" className="field__label">
                Name
              </label>
              <input
                id="contact-name"
                className="field__input"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="contact-email" className="field__label">
                Email
              </label>
              <input
                id="contact-email"
                className="field__input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="topic" className="field__label">
                Topic
              </label>
              <select
                id="topic"
                className="field__input"
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value as (typeof TOPICS)[number]["id"])
                }
              >
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="contact-message" className="field__label">
                Message
              </label>
              <textarea
                id="contact-message"
                className="field__input"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button className="button button--primary" type="submit">
              Send message (stored locally)
            </button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
