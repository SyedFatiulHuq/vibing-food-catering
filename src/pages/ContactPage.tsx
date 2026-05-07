import { FormEvent, useState } from "react";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const CONTACT_STORAGE = "vibing-contact-messages";

export function ContactPage() {
  useDocumentTitle("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const entry = {
      at: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      topic,
      message: message.trim(),
    };
    try {
      const prevRaw = localStorage.getItem(CONTACT_STORAGE);
      const prev = prevRaw ? (JSON.parse(prevRaw) as unknown[]) : [];
      localStorage.setItem(CONTACT_STORAGE, JSON.stringify([entry, ...prev]));
    } catch {
      localStorage.setItem(CONTACT_STORAGE, JSON.stringify([entry]));
    }
    setSent(true);
    setName("");
    setEmail("");
    setTopic("general");
    setMessage("");
  };

  return (
    <div className="shell reading-flow" style={{ maxWidth: "720px" }}>
      <h1 className="display" style={{ fontSize: "2.25rem" }}>
        Contact
      </h1>
      <p style={{ color: "var(--color-muted)" }}>
        Reach us directly or leave a note — form submissions are saved in this browser for demo
        purposes so the owner can review them later.
      </p>

      <section
        className="card"
        style={{
          padding: "1.25rem",
          marginBottom: "2rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <div>
          <h2 className="display" style={{ marginTop: 0, fontSize: "1.25rem" }}>Phone</h2>
          <a href="tel:+15555550123">(555) 555-0123</a>
        </div>
        <div>
          <h2 className="display" style={{ marginTop: 0, fontSize: "1.25rem" }}>Social</h2>
          <p style={{ margin: 0 }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            {" · "}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </section>

      <h2 className="display" style={{ fontSize: "1.5rem" }}>Send a message</h2>

      {sent && (
        <p style={{ color: "var(--color-accent)", fontWeight: 600 }} role="status" aria-live="polite">
          Thanks — your note was saved locally for follow-up.
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "520px" }}>
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="c-topic">Topic</label>
          <select
            id="c-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            autoComplete="off"
          >
            <option value="general">General question</option>
            <option value="menu">Menu &amp; dietary</option>
            <option value="corporate">Corporate / large order</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-msg">Message</label>
          <textarea
            id="c-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
          Send
        </button>
      </form>
    </div>
  );
}
