import type { CartLine, FoodCategory } from "../types";
import { getFoodItemForDate } from "../data/menuData";
import { parseIsoDateOnly } from "../utils/dates";

export type CartLineResolved = CartLine & {
  name: string;
  category: FoodCategory;
  unitPriceCents: number;
  maxOrderQty: number;
  lineTotalCents: number;
};

export function resolveCartLines(
  cateringDateIso: string,
  lines: CartLine[],
): CartLineResolved[] {
  const date = parseIsoDateOnly(cateringDateIso);
  if (!date) return [];
  return lines
    .map((line) => {
      const item = getFoodItemForDate(date, line.itemId);
      if (!item) return null;
      return {
        ...line,
        name: item.name,
        category: item.category,
        unitPriceCents: item.priceCents,
        maxOrderQty: item.maxOrderQty,
        lineTotalCents: item.priceCents * line.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export function cartSubtotalCents(resolved: CartLineResolved[]): number {
  return resolved.reduce((a, l) => a + l.lineTotalCents, 0);
}
