import { useEffect, useId, useRef } from 'react';
import type { MenuItem } from '../types';

interface FoodDetailDialogProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export function FoodDetailDialog({ item, onClose, onAddToCart }: FoodDetailDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const n = item.nutrition;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="dialog__header">
          <h2 id={titleId} className="card__title" style={{ margin: 0 }}>
            {item.name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            aria-label="Close details"
          >
            Close
          </button>
        </div>
        <div className="dialog__body">
          <img
            className="card__media"
            src={item.imageUrl}
            alt=""
            width={800}
            height={600}
            loading="lazy"
          />
          <p style={{ marginTop: '1rem' }}>{item.description}</p>
          <h3 className="card__title" style={{ fontSize: '1rem', marginTop: '1.25rem' }}>
            Ingredients
          </h3>
          <ul>
            {item.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
          <h3 className="card__title" style={{ fontSize: '1rem', marginTop: '1.25rem' }}>
            Nutrition facts
          </h3>
          <table className="nutrition">
            <caption className="visually-hidden">Nutrition facts for {item.name}</caption>
            <tbody>
              <tr>
                <th scope="row">Serving size</th>
                <td>{n.servingSize}</td>
              </tr>
              <tr>
                <th scope="row">Calories</th>
                <td>{n.calories}</td>
              </tr>
              <tr>
                <th scope="row">Total fat</th>
                <td>{n.totalFat}</td>
              </tr>
              <tr>
                <th scope="row">Saturated fat</th>
                <td>{n.saturatedFat}</td>
              </tr>
              <tr>
                <th scope="row">Cholesterol</th>
                <td>{n.cholesterol}</td>
              </tr>
              <tr>
                <th scope="row">Sodium</th>
                <td>{n.sodium}</td>
              </tr>
              <tr>
                <th scope="row">Total carbohydrate</th>
                <td>{n.totalCarbohydrate}</td>
              </tr>
              <tr>
                <th scope="row">Dietary fiber</th>
                <td>{n.dietaryFiber}</td>
              </tr>
              <tr>
                <th scope="row">Total sugars</th>
                <td>{n.totalSugars}</td>
              </tr>
              <tr>
                <th scope="row">Protein</th>
                <td>{n.protein}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn--primary" onClick={() => onAddToCart(item)}>
              Add to cart
            </button>
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Back to menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
