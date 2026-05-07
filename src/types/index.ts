export type Category = "protein" | "vegetarian" | "side";

export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbsG: number;
  fiberG: number;
  sugarG: number;
  proteinG: number;
}

export interface FoodItem {
  id: string;
  day: DayKey;
  category: Category;
  name: string;
  shortDescription: string;
  description: string;
  /** Price per portion (USD). */
  price: number;
  /** Portion description shown to users (e.g., "1 cup", "6 oz"). */
  portion: string;
  imageUrl: string;
  imageAlt: string;
  ingredients: string[];
  allergens: string[];
  nutrition: NutritionFacts;
}

export interface CartItem {
  itemId: string;
  /** Number of portions of this item. */
  quantity: number;
}

export type PaymentMethod = "credit-card" | "debit-card" | "cash-on-pickup";

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:MM (24h)
  partySize: number;
  paymentMethod: PaymentMethod;
  cardNumberLast4?: string;
  cardholderName?: string;
  specialInstructions?: string;
}

export interface Invoice {
  id: string;
  createdAt: string; // ISO
  customer: CustomerDetails;
  lineItems: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
}
