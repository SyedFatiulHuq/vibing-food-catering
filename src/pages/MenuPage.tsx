import { useMemo, useState } from 'react';
import { getMenuForDate } from '../data/menu';
import { useCart, cartConstants } from '../context/CartContext';
import { FoodDetailDialog } from '../components/FoodDetailDialog';
import {
  formatISODate,
  formatLongDate,
  isValidCateringDate,
  maxCateringDate,
  minCateringDate,
  parseISODate,
} from '../utils/dates';
import type { Category, MenuItem } from '../types';

const CATEGORY_ORDER: Category[] = ['protein', 'vegetarian', 'sides'];

const CATEGORY_LABEL: Record<Category, string> = {
  protein: 'Protein',
  vegetarian: 'Vegetarian',
  sides: 'Sides',
};

const PILL: Record<Category, string> = {
  protein: 'pill',
  vegetarian: 'pill pill--veg',
  sides: 'pill pill--side',
};

export function MenuPage() {
  const {
    cateringDateISO,
    setCateringDate,
    partySize,
    setPartySize,
    addLine,
  } = useCart();
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [announce, setAnnounce] = useState('');

  const selectedDate = parseISODate(cateringDateISO);
  const menu = useMemo(
    () => (selectedDate ? getMenuForDate(selectedDate) : []),
    [selectedDate],
  );

  const grouped = useMemo(() => {
    const map: Record<Category, MenuItem[]> = {
      protein: [],
      vegetarian: [],
      sides: [],
    };
    for (const item of menu) {
      map[item.category].push(item);
    }
    return map;
  }, [menu]);

  const minD = minCateringDate();
  const maxD = maxCateringDate();
  const dateValid = selectedDate ? isValidCateringDate(selectedDate) : false;

  const onDateChange = (iso: string) => {
    setCateringDate(iso);
    const d = parseISODate(iso);
    setAnnounce(d ? `Menu updated for ${formatLongDate(d)}` : '');
  };

  return (
    <main id="main-content">
      <h1 className="page-title">Menu by date</h1>
      <p className="lede">
        Pick your pickup day — each day has its own lineup. Orders open from{' '}
        {cartConstants.PARTY_MIN} to {cartConstants.PARTY_MAX} guests, placed between 2 and 14 days
        ahead.
      </p>

      <div className="banner" role="region" aria-label="Order settings">
        <div className="field" style={{ flex: '1 1 200px' }}>
          <label htmlFor="catering-date">Catering date</label>
          <input
            id="catering-date"
            type="date"
            min={formatISODate(minD)}
            max={formatISODate(maxD)}
            value={cateringDateISO}
            onChange={(e) => onDateChange(e.target.value)}
            required
            aria-describedby="date-hint"
          />
          <p id="date-hint" className="field-hint">
            Must be between {formatLongDate(minD)} and {formatLongDate(maxD)}.
          </p>
        </div>
        <div className="field" style={{ flex: '1 1 160px' }}>
          <label htmlFor="party-size">Party size (guests)</label>
          <input
            id="party-size"
            type="number"
            min={cartConstants.PARTY_MIN}
            max={cartConstants.PARTY_MAX}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            aria-describedby="party-hint"
          />
          <p id="party-hint" className="field-hint">
            Minimum {cartConstants.PARTY_MIN}, maximum {cartConstants.PARTY_MAX} people.
          </p>
        </div>
      </div>

      <div role="status" aria-live="polite" className="visually-hidden">
        {announce}
      </div>

      {!dateValid ? (
        <p className="status status--error" role="alert">
          Choose a valid catering date to load that day&apos;s menu.
        </p>
      ) : (
        <>
          <p className="lede" style={{ marginTop: 0 }}>
            Showing menu for <strong>{selectedDate && formatLongDate(selectedDate)}</strong> —{' '}
            {menu.length} items.
          </p>
          {CATEGORY_ORDER.map((cat) => (
            <section key={cat} aria-labelledby={`heading-${cat}`} style={{ marginBottom: '2rem' }}>
              <h2 id={`heading-${cat}`} className="card__title" style={{ fontSize: '1.35rem' }}>
                {CATEGORY_LABEL[cat]}
              </h2>
              <div className="grid-menu" style={{ marginTop: '1rem' }}>
                {grouped[cat].map((item) => (
                  <article key={item.id} className="card">
                    <img
                      className="card__media"
                      src={item.imageUrl}
                      alt=""
                      width={400}
                      height={300}
                      loading="lazy"
                    />
                    <div className="card__body">
                      <span className={PILL[cat]}>{CATEGORY_LABEL[cat]}</span>
                      <h3 className="card__title">{item.name}</h3>
                      <div className="meta-row">
                        <span className="price">${item.pricePerPerson.toFixed(2)} / guest</span>
                        <span aria-label={`${item.unitsAvailable} portions available today`}>
                          Qty avail. {item.unitsAvailable}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                        {item.description.slice(0, 120)}
                        {item.description.length > 120 ? '…' : ''}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn--secondary"
                          onClick={() => setDetailItem(item)}
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => {
                            addLine(item.id);
                            setAnnounce(`${item.name} added to cart`);
                          }}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <FoodDetailDialog
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAddToCart={(item) => {
          addLine(item.id);
          setAnnounce(`${item.name} added to cart`);
          setDetailItem(null);
        }}
      />
    </main>
  );
}
