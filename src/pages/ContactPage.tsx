import { FormEvent, useId, useState } from 'react';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const statusId = useId();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <main id="main-content">
      <h1 className="page-title">Contact</h1>
      <p className="lede">
        Reach out for custom events, dietary questions, or pickup logistics. This demo form does not
        send email — it confirms locally so you can wire it to a backend later.
      </p>

      <div className="banner" style={{ marginBottom: '1.5rem', display: 'block' }}>
        <h2 className="card__title" style={{ fontSize: '1.1rem', marginTop: 0 }}>
          Call or follow
        </h2>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Phone:</strong>{' '}
          <a href="tel:+14155550123">(415) 555-0123</a>
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Instagram:</strong>{' '}
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener">
            @vibingkitchen demo
          </a>
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Facebook:</strong>{' '}
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopener">
            Vibing Kitchen demo
          </a>
        </p>
      </div>

      <form className="stack" onSubmit={onSubmit} aria-describedby={sent ? statusId : undefined}>
        {sent ? (
          <p id={statusId} className="status" role="status">
            Thanks — your message is recorded in this demo. Connect the form to your email service
            when you go live.
          </p>
        ) : null}

        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
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
          <label htmlFor="c-msg">Message</label>
          <textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn--primary">
          Send message
        </button>
      </form>
    </main>
  );
}
