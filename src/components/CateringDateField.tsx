import {
  cateringDateRange,
  formatDisplayDate,
  isValidCateringDate,
  parseIsoDateOnly,
  toIsoDateOnly,
} from "../utils/dates";

export function CateringDateField({
  id,
  valueIso,
  onChange,
}: {
  id: string;
  valueIso: string;
  onChange: (iso: string) => void;
}) {
  const { min, max } = cateringDateRange();
  const minIso = toIsoDateOnly(min);
  const maxIso = toIsoDateOnly(max);
  const parsed = parseIsoDateOnly(valueIso);
  const invalid =
    valueIso.length > 0 && (!parsed || !isValidCateringDate(parsed));

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        Catering date
      </label>
      <p className="field__hint" id={`${id}-hint`}>
        Choose a date between {formatDisplayDate(min)} and {formatDisplayDate(max)}
        . Each day of the week has its own menu, so changing the date will clear your
        cart.
      </p>
      <input
        id={id}
        type="date"
        className="field__input"
        value={valueIso}
        min={minIso}
        max={maxIso}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-describedby={`${id}-hint`}
        aria-invalid={invalid || undefined}
      />
    </div>
  );
}
