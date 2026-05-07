import { useId } from "react";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Visible label for screen readers (e.g. "Quantity for Roast Chicken"). */
  ariaLabel: string;
}

export const QuantityControl = ({ value, onChange, min = 0, max = 99, ariaLabel }: Props) => {
  const id = useId();

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className="qty-control" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="sr-only">
        {ariaLabel}
      </span>
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel.toLowerCase()}`}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (Number.isNaN(n)) onChange(min);
          else onChange(clamp(n));
        }}
      />
      <button
        type="button"
        aria-label={`Increase ${ariaLabel.toLowerCase()}`}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};
