import { FormEvent, useState } from "react";

const CONTACT_STORAGE = "vibing-contact-messages";

export function ContactPage() {
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
    <div className="shell" style={{ maxWidth: "720px", width: "100%", minWidth: 0 }}>
      <h1 className="display" style={{ fontSize: "2.25rem" }}>
        Contact
      </h1>
      <p style={{ color: "var(--color-muted)" }}>
        Reach us directly or leave a note — form submissions are saved in this browser for demo
        purposes so the owner can review them later.
      </p>

      <section
        className="card"
        aria-labelledby="reach-us-heading"
        style={{
          padding: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <h2 id="reach-us-heading" className="display" style={{ marginTop: 0, fontSize: "1.5rem" }}>
          Reach us
        </h2>
        <dl
          style={{
            margin: "0.5rem 0 0",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <dt className="display" style={{ margin: "0 0 0.35rem", fontSize: "1.25rem", fontWeight: 600 }}>
              Phone
            </dt>
            <dd style={{ margin: 0 }}>
              <a href="tel:+15555550123">(555) 555-0123</a>
            </dd>
          </div>
          <div>
            <dt className="display" style={{ margin: "0 0 0.35rem", fontSize: "1.25rem", fontWeight: 600 }}>
              Social
            </dt>
            <dd style={{ margin: 0 }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
              {" · "}
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="send-message-heading">
        <h2 id="send-message-heading" className="display" style={{ fontSize: "1.5rem" }}>
          Send a message
        </h2>

        {sent && (
          <p
            style={{ color: "var(--color-accent)", fontWeight: 600 }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Thanks — your note was saved locally for follow-up.
          </p>
        )}

        <form
          aria-labelledby="send-message-heading"
          onSubmit={handleSubmit}
          style={{ maxWidth: "520px", width: "100%", minWidth: 0 }}
        >
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
            />
          </div>
          <div className="field">
            <label htmlFor="c-topic">Topic</label>
            <select
              id="c-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
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
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
