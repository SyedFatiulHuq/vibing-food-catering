import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '../types';
import { formatISODate, maxCateringDate, minCateringDate, parseISODate } from '../utils/dates';

const PARTY_MIN = 6;
const PARTY_MAX = 30;

interface CartState {
  cateringDateISO: string;
  partySize: number;
  lines: CartLine[];
}

interface CartContextValue extends CartState {
  setCateringDate: (iso: string) => void;
  setPartySize: (n: number) => void;
  addLine: (itemId: string, quantity?: number) => void;
  setLineQuantity: (itemId: string, quantity: number) => void;
  removeLine: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function defaultDateISO(): string {
  return formatISODate(minCateringDate());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cateringDateISO, setCateringDateISOState] = useState(defaultDateISO);
  const cateringDateRef = useRef(cateringDateISO);
  cateringDateRef.current = cateringDateISO;
  const [partySize, setPartySizeState] = useState(PARTY_MIN);
  const [lines, setLines] = useState<CartLine[]>([]);

  const setCateringDate = useCallback((iso: string) => {
    const d = parseISODate(iso);
    if (!d) return;
    const min = minCateringDate();
    const max = maxCateringDate();
    if (d < min || d > max) return;
    if (iso !== cateringDateRef.current) setLines([]);
    setCateringDateISOState(iso);
  }, []);

  const setPartySize = useCallback((n: number) => {
    const clamped = Math.min(PARTY_MAX, Math.max(PARTY_MIN, Math.round(n)));
    setPartySizeState(clamped);
    setLines((prev) =>
      prev.map((l) => ({
        ...l,
        quantity: Math.min(clamped, Math.max(1, l.quantity)),
      })),
    );
  }, []);

  const addLine = useCallback(
    (itemId: string, quantity?: number) => {
      const q = Math.min(partySize, Math.max(1, quantity ?? partySize));
      setLines((prev) => {
        const i = prev.findIndex((l) => l.itemId === itemId);
        if (i === -1) return [...prev, { itemId, quantity: q }];
        const next = [...prev];
        next[i] = { itemId, quantity: Math.min(partySize, next[i].quantity + q) };
        return next;
      });
    },
    [partySize],
  );

  const setLineQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const q = Math.min(partySize, Math.max(1, Math.round(quantity)));
      setLines((prev) => {
        const i = prev.findIndex((l) => l.itemId === itemId);
        if (i === -1) return prev;
        const next = [...prev];
        next[i] = { itemId, quantity: q };
        return next;
      });
    },
    [partySize],
  );

  const removeLine = useCallback((itemId: string) => {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const cartCount = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({
      cateringDateISO,
      partySize,
      lines,
      setCateringDate,
      setPartySize,
      addLine,
      setLineQuantity,
      removeLine,
      clearCart,
      cartCount,
    }),
    [
      cateringDateISO,
      partySize,
      lines,
      setCateringDate,
      setPartySize,
      addLine,
      setLineQuantity,
      removeLine,
      clearCart,
      cartCount,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export const cartConstants = { PARTY_MIN, PARTY_MAX };
