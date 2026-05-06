import { Link } from 'react-router-dom';
import { getMenuForDate } from '../data/menu';
import { useCart, cartConstants } from '../context/CartContext';
import { formatLongDate, parseISODate } from '../utils/dates';

export function CartPage() {
  const {
    cateringDateISO,
    partySize,
    lines,
    setLineQuantity,
    removeLine,
  } = useCart();

  const date = parseISODate(cateringDateISO);
  const menu = date ? getMenuForDate(date) : [];
  const byId = new Map(menu.map((m) => [m.id, m]));

  const rows = lines
    .map((l) => {
      const item = byId.get(l.itemId);
      if (!item) return null;
      const lineTotal = Math.round(item.pricePerPerson * l.quantity * 100) / 100;
      return { line: l, item, lineTotal };
    })
    .filter(Boolean) as { line: { itemId: string; quantity: number }; item: (typeof menu)[0]; lineTotal: number }[];

  const subtotal = Math.round(rows.reduce((s, r) => s + r.lineTotal, 0) * 100) / 100;

  return (
    <main id="main-content">
      <h1 className="page-title">Your cart</h1>
      <p className="lede">
        {date
          ? `Pickup menu day: ${formatLongDate(date)} · ${partySize} guests (min ${cartConstants.PARTY_MIN}, max ${cartConstants.PARTY_MAX}).`
          : 'Set a catering date on the menu page.'}
      </p>

      {rows.length === 0 ? (
        <p className="status">Your cart is empty. Browse the menu to add dishes.</p>
      ) : (
        <>
          <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rows.map(({ line, item, lineTotal }) => (
              <li key={line.itemId} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <img
                    src={item.imageUrl}
                    alt=""
                    width={120}
                    height={90}
                    style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{ flex: '1 1 200px' }}>
                    <h2 className="card__title" style={{ fontSize: '1.05rem' }}>
                      {item.name}
                    </h2>
                    <p className="meta-row">
                      ${item.pricePerPerson.toFixed(2)} per guest ×{' '}
                      <label htmlFor={`qty-${line.itemId}`} className="visually-hidden">
                        Portions for {item.name}
                      </label>
                      <input
                        id={`qty-${line.itemId}`}
                        type="number"
                        min={1}
                        max={partySize}
                        value={line.quantity}
                        onChange={(e) => setLineQuantity(line.itemId, Number(e.target.value))}
                        style={{ width: '4rem', padding: '0.35rem' }}
                        aria-describedby={`sub-${line.itemId}`}
                      />{' '}
                      guest portions
                    </p>
                    <p id={`sub-${line.itemId}`} style={{ fontWeight: 700, margin: '0.5rem 0 0' }}>
                      Line total: ${lineTotal.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      className="btn btn--danger"
                      style={{ marginTop: '0.75rem' }}
                      onClick={() => removeLine(line.itemId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="invoice" style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>
              <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
            </p>
            <p className="field-hint">Taxes and fees may be confirmed at pickup (demo).</p>
            <Link to="/checkout" className="btn btn--primary btn-block" style={{ marginTop: '1rem' }}>
              Continue to checkout
            </Link>
          </div>
        </>
      )}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/">← Back to menu</Link>
      </p>
    </main>
  );
}
