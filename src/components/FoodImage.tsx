import type { Category, FoodItem } from "../types";

const CAT_PALETTE: Record<Category, { from: string; to: string; accent: string; ring: string }> = {
  protein: { from: "#fff0e3", to: "#f5c89a", accent: "#7a3215", ring: "#b04a25" },
  vegetarian: { from: "#e9f4ec", to: "#bfe3c8", accent: "#1f4d2d", ring: "#2f6f3f" },
  side: { from: "#fbf3df", to: "#e9d4a4", accent: "#6a4a14", ring: "#8a6a3e" },
};

const hash = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

interface Props {
  item: FoodItem;
  className?: string;
}

/**
 * Renders a deterministic, decorative SVG illustration for a food item.
 * The image is decorative; the meaningful description lives in `imageAlt`
 * which the parent should render as alt text on a wrapping <img> or as an
 * adjacent caption. We expose the alt as both `aria-label` and `<title>`
 * so that screen readers can read it when this SVG is the only image.
 */
export const FoodImage = ({ item, className }: Props) => {
  const palette = CAT_PALETTE[item.category];
  const seed = hash(item.id);
  const dotCount = 16;
  const dots = Array.from({ length: dotCount }, (_, i) => {
    const angle = (i / dotCount) * Math.PI * 2;
    const radius = 70 + ((seed >> (i % 6)) & 7) * 5;
    const cx = 200 + Math.cos(angle + (seed % 10) * 0.1) * radius;
    const cy = 130 + Math.sin(angle + (seed % 7) * 0.1) * radius * 0.55;
    const r = 6 + ((seed >> i) & 5);
    return { cx, cy, r, key: i };
  });

  const titleId = `food-img-title-${item.id}`;
  const descId = `food-img-desc-${item.id}`;

  return (
    <svg
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <title id={titleId}>{item.name}</title>
      <desc id={descId}>{item.imageAlt}</desc>

      <defs>
        <linearGradient id={`bg-${item.id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
      </defs>

      <rect width="400" height="250" fill={`url(#bg-${item.id})`} />

      {/* "Plate" */}
      <ellipse cx="200" cy="155" rx="120" ry="38" fill="rgba(0,0,0,0.06)" />
      <ellipse cx="200" cy="148" rx="120" ry="36" fill="#ffffff" />
      <ellipse
        cx="200"
        cy="148"
        rx="98"
        ry="28"
        fill="none"
        stroke={palette.ring}
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* Decorative "food bits" */}
      {dots.map((d) => (
        <circle
          key={d.key}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={palette.ring}
          opacity={0.16 + ((seed >> d.key) & 3) * 0.07}
        />
      ))}

      {/* Center initials chip */}
      <g transform="translate(200 110)">
        <circle r="34" fill={palette.accent} />
        <text
          x="0"
          y="0"
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="26"
          fontWeight="700"
          fill="#ffffff"
        >
          {initials(item.name)}
        </text>
      </g>
    </svg>
  );
};
