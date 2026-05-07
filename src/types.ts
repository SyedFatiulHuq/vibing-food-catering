export type FoodCategory = "protein" | "vegetarian" | "side";

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  transFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
  proteinG: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  /** Price per unit (one tray serves approximately the listed portion note). */
  priceCents: number;
  /** Maximum number of this item the customer may add per order for this menu day. */
  maxOrderQty: number;
  imageUrl: string;
  imageAlt: string;
  category: FoodCategory;
  nutrition: NutritionFacts;
}

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface CartState {
  cateringDateIso: string;
  lines: CartLine[];
}

export type PaymentMethod = "cash_pickup" | "card_pickup" | "invoice_net30";

export interface CheckoutPayload {
  pickupWindow: string;
  fullName: string;
  email: string;
  phone: string;
  paymentMethod: PaymentMethod;
  paymentNote: string;
  specialInstructions: string;
  partySize: number;
}

export interface SavedOrder extends CheckoutPayload {
  id: string;
  createdAtIso: string;
  cateringDateIso: string;
  lines: Array<
    CartLine & {
      name: string;
      category: FoodCategory;
      unitPriceCents: number;
      lineTotalCents: number;
    }
  >;
  subtotalCents: number;
  totalCents: number;
}
