export type MenuCategory = "protein" | "vegetarian" | "sides";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
  proteinG: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  /** Price per guest for this selection */
  pricePerPerson: number;
  /** Short label for list cards, e.g. “half tray · feeds ~12” */
  portionNote: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
}

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface CheckoutPayload {
  cateringDate: string;
  guestCount: number;
  pickupWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod: "card" | "cash" | "invoice";
  /** Dummy fields — not processed */
  cardLastFour?: string;
  billingZip?: string;
  specialInstructions: string;
}

export interface OrderInvoice extends CheckoutPayload {
  id: string;
  placedAt: string;
  lines: { item: MenuItem; quantity: number; lineTotal: number }[];
  subtotal: number;
  estimatedTax: number;
  total: number;
}
