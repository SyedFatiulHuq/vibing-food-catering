import type { MenuCategory } from "../types";

/** Human-readable labels for menu categories (presentation + programmatic consistency). */
export const MENU_CATEGORY_LABEL: Record<MenuCategory, string> = {
  protein: "Protein",
  vegetarian: "Vegetarian",
  sides: "Sides",
};

export const MENU_CATEGORY_ORDER: MenuCategory[] = ["protein", "vegetarian", "sides"];
