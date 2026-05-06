export type Category = 'protein' | 'vegetarian' | 'sides';

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  totalFat: string;
  saturatedFat: string;
  cholesterol: string;
  sodium: string;
  totalCarbohydrate: string;
  dietaryFiber: string;
  totalSugars: string;
  protein: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  /** Price per guest for this dish */
  pricePerPerson: number;
  /** Dummy “available today” count shown on the menu */
  unitsAvailable: number;
  description: string;
  ingredients: string[];
  nutrition: NutritionFacts;
  imageUrl: string;
}

export interface CartLine {
  itemId: string;
  /** Number of guest portions for this line (1 … partySize) */
  quantity: number;
}

export type PaymentMethod = 'card_on_pickup' | 'cash' | 'venmo' | 'zelle';

export interface CheckoutPayload {
  cateringDate: string;
  partySize: number;
  pickupWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod: PaymentMethod;
  paymentNote: string;
  specialInstructions: string;
}

export interface InvoiceLine {
  itemId: string;
  name: string;
  category: Category;
  quantity: number;
  pricePerPerson: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  cateringDate: string;
  partySize: number;
  lines: InvoiceLine[];
  subtotal: number;
  taxNote: string;
  total: number;
  pickupWindow: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod: PaymentMethod;
  paymentNote: string;
  specialInstructions: string;
}
