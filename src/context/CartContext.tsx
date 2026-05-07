import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, CartState } from "../types";
import { getFoodItemForDate } from "../data/menuData";
import { cateringDateRange, parseIsoDateOnly, toIsoDateOnly } from "../utils/dates";

export const MIN_PARTY_SIZE = 6;
export const MAX_PARTY_SIZE = 30;

type CartContextValue = {
  cateringDateIso: string;
  setCateringDateIso: (iso: string) => void;
  lines: CartLine[];
  addToCart: (itemId: string, quantity?: number) => void;
  addToCartForDate: (cateringIso: string, itemId: string, quantity?: number) => void;
  setLineQuantity: (itemId: string, quantity: number) => void;
  removeLine: (itemId: string) => void;
  clearCart: () => void;
  statusMessage: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function initialDateIso(): string {
  const { min } = cateringDateRange();
  return toIsoDateOnly(min);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => ({
    cateringDateIso: initialDateIso(),
    lines: [],
  }));
  const [statusMessage, setStatusMessage] = useState("");

  const announce = useCallback((message: string) => {
    setStatusMessage(message);
  }, []);

  const setCateringDateIso = useCallback(
    (iso: string) => {
      setState((prev) => {
        if (prev.cateringDateIso === iso) return prev;
        const hadItems = prev.lines.length > 0;
        if (hadItems) {
          announce(
            "Catering date changed. Your cart was cleared because the menu is different for each day of the week.",
          );
        }
        return { cateringDateIso: iso, lines: [] };
      });
    },
    [announce],
  );

  const addToCart = useCallback(
    (itemId: string, quantity = 1) => {
      const date = parseIsoDateOnly(state.cateringDateIso);
      if (!date) return;
      const item = getFoodItemForDate(date, itemId);
      if (!item) return;
      const addQty = Math.max(1, Math.floor(quantity));
      setState((prev) => {
        const idx = prev.lines.findIndex((l) => l.itemId === itemId);
        const next = [...prev.lines];
        if (idx === -1) {
          const q = Math.min(addQty, item.maxOrderQty);
          next.push({ itemId, quantity: q });
          announce(`${item.name} added to cart. Quantity ${q}.`);
          return { ...prev, lines: next };
        }
        const current = next[idx].quantity;
        const merged = Math.min(current + addQty, item.maxOrderQty);
        next[idx] = { itemId, quantity: merged };
        announce(`${item.name} quantity updated to ${merged}.`);
        return { ...prev, lines: next };
      });
    },
    [announce, state.cateringDateIso],
  );

  const addToCartForDate = useCallback(
    (cateringIso: string, itemId: string, quantity = 1) => {
      const date = parseIsoDateOnly(cateringIso);
      if (!date) return;
      const item = getFoodItemForDate(date, itemId);
      if (!item) return;
      const addQty = Math.max(1, Math.floor(quantity));
      setState((prev) => {
        const dateChanged = prev.cateringDateIso !== cateringIso;
        const baseLines = dateChanged ? [] : prev.lines;
        const idx = baseLines.findIndex((l) => l.itemId === itemId);
        const next = [...baseLines];
        if (idx === -1) {
          const q = Math.min(addQty, item.maxOrderQty);
          next.push({ itemId, quantity: q });
          const prefix = dateChanged
            ? "Catering date updated; previous cart cleared. "
            : "";
          announce(`${prefix}${item.name} added to cart. Quantity ${q}.`);
          return { cateringDateIso: cateringIso, lines: next };
        }
        const current = next[idx].quantity;
        const merged = Math.min(current + addQty, item.maxOrderQty);
        next[idx] = { itemId, quantity: merged };
        const prefix = dateChanged
          ? "Catering date updated; previous cart cleared. "
          : "";
        announce(`${prefix}${item.name} quantity updated to ${merged}.`);
        return { cateringDateIso: cateringIso, lines: next };
      });
    },
    [announce],
  );

  const setLineQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const date = parseIsoDateOnly(state.cateringDateIso);
      if (!date) return;
      const item = getFoodItemForDate(date, itemId);
      if (!item) return;
      const q = Math.min(Math.max(0, Math.floor(quantity)), item.maxOrderQty);
      setState((prev) => {
        if (q === 0) {
          const lines = prev.lines.filter((l) => l.itemId !== itemId);
          announce(`${item.name} removed from cart.`);
          return { ...prev, lines };
        }
        const lines = prev.lines.map((l) =>
          l.itemId === itemId ? { itemId, quantity: q } : l,
        );
        announce(`${item.name} quantity set to ${q}.`);
        return { ...prev, lines };
      });
    },
    [announce, state.cateringDateIso],
  );

  const removeLine = useCallback(
    (itemId: string) => {
      const date = parseIsoDateOnly(state.cateringDateIso);
      const item = date ? getFoodItemForDate(date, itemId) : undefined;
      setState((prev) => ({
        ...prev,
        lines: prev.lines.filter((l) => l.itemId !== itemId),
      }));
      if (item) announce(`${item.name} removed from cart.`);
    },
    [announce],
  );

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, lines: [] }));
    announce("Cart emptied.");
  }, [announce]);

  const value = useMemo<CartContextValue>(
    () => ({
      cateringDateIso: state.cateringDateIso,
      setCateringDateIso,
      lines: state.lines,
      addToCart,
      addToCartForDate,
      setLineQuantity,
      removeLine,
      clearCart,
      statusMessage,
    }),
    [
      state.cateringDateIso,
      state.lines,
      setCateringDateIso,
      addToCart,
      addToCartForDate,
      setLineQuantity,
      removeLine,
      clearCart,
      statusMessage,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
