import { useId } from "react";
import { usePickupDate } from "../../context/PickupDateContext";
import { dayLabels } from "../../data/menu";
import {
  dayKeyForDate,
  formatLongDate,
  formatRelativeOffset,
  fromIsoDate,
  maxOrderDate,
  minOrderDate,
  toIsoDate,
} from "../../utils/dateUtils";

interface Props {
  /** Show as a horizontal row in toolbars (default: true). */
  compact?: boolean;
}

export const PickupDatePicker = ({ compact = true }: Props) => {
  const { pickupDateIso, setPickupDateIso } = usePickupDate();
  const id = useId();
  const hintId = `${id}-hint`;
  const summaryId = `${id}-summary`;

  const selected = fromIsoDate(pickupDateIso);
  const dayKey = dayKeyForDate(selected);

  return (
    <div className={compact ? "menu-toolbar" : "menu-toolbar"}>
      <div className="field menu-toolbar__date">
        <label htmlFor={id}>Pickup date</label>
        <input
          id={id}
          type="date"
          value={pickupDateIso}
          min={toIsoDate(minOrderDate())}
          max={toIsoDate(maxOrderDate())}
          onChange={(e) => setPickupDateIso(e.target.value)}
          aria-describedby={`${hintId} ${summaryId}`}
          required
        />
        <span id={hintId} className="field-hint">
          Order at least 2 days ahead and up to 2 weeks in advance.
        </span>
      </div>

      <p
        id={summaryId}
        className="menu-toolbar__summary"
        aria-live="polite"
      >
        Selected: {formatLongDate(selected)} ({formatRelativeOffset(selected)})
        <span className="menu-toolbar__summary-day">{dayLabels[dayKey]}</span>
      </p>
    </div>
  );
};
