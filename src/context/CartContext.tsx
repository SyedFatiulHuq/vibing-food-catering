import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "../types";
import {
  formatIsoLocal,
  getEarliestOrderDate,
  isValidCateringDate,
  weekdayFromIso,
} from "../lib/dates";
import { getMenuForWeekday } from "../data/menu";

const MIN_GUESTS = 6;
const MAX_GUESTS = 30;

interface CartContextValue {
  cateringDateIso: string;
  setCateringDateIso: (iso: string) => void;
  guestCount: number;
  setGuestCount: (n: number) => void;
  lines: CartLine[];
  addLine: (itemId: string, qty?: number) => void;
  setLineQuantity: (itemId: string, quantity: number) => void;
  removeLine: (itemId: string) => void;
  clearCart: () => void;
  minGuests: typeof MIN_GUESTS;
  maxGuests: typeof MAX_GUESTS;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cateringDateIso, setCateringDateIsoState] = useState(() =>
    formatIsoLocal(getEarliestOrderDate()),
  );
  const [guestCount, setGuestCountState] = useState(12);
  const [lines, setLines] = useState<CartLine[]>([]);

  const setCateringDateIso = useCallback((iso: string) => {
    if (!isValidCateringDate(iso)) return;
    setCateringDateIsoState(iso);
  }, []);

  const setGuestCount = useCallback((n: number) => {
    const clamped = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, Math.round(n)));
    setGuestCountState(clamped);
  }, []);

  const addLine = useCallback((itemId: string, qty = 1) => {
    const q = Math.max(1, Math.round(qty));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.itemId === itemId);
      if (i === -1) return [...prev, { itemId, quantity: q }];
      const next = [...prev];
      const cur = next[i]!;
      next[i] = { ...cur, quantity: cur.quantity + q };
      return next;
    });
  }, []);

  const setLineQuantity = useCallback((itemId: string, quantity: number) => {
    const q = Math.round(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.itemId !== itemId));
      return;
    }
    setLines((prev) => {
      const i = prev.findIndex((l) => l.itemId === itemId);
      if (i === -1) return [...prev, { itemId, quantity: q }];
      const next = [...prev];
      next[i] = { itemId, quantity: q };
      return next;
    });
  }, []);

  const removeLine = useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  useEffect(() => {
    const w = weekdayFromIso(cateringDateIso);
    const valid = new Set(getMenuForWeekday(w).map((i) => i.id));
    setLines((prev) => prev.filter((l) => valid.has(l.itemId)));
  }, [cateringDateIso]);

  const value = useMemo<CartContextValue>(
    () => ({
      cateringDateIso,
      setCateringDateIso,
      guestCount,
      setGuestCount,
      lines,
      addLine,
      setLineQuantity,
      removeLine,
      clearCart,
      minGuests: MIN_GUESTS,
      maxGuests: MAX_GUESTS,
    }),
    [
      cateringDateIso,
      setCateringDateIso,
      guestCount,
      setGuestCount,
      lines,
      addLine,
      setLineQuantity,
      removeLine,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
