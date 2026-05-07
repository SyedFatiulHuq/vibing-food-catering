import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types";
import { loadCart, saveCart, clearCart as clearCartStorage } from "../utils/storage";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  itemCount: number;
  addItem: (itemId: string, quantity?: number) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
  getQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCart<CartItem[]>() ?? []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((itemId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === itemId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { itemId, quantity }];
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.itemId !== itemId);
      return prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    clearCartStorage();
  }, []);

  const getQuantity = useCallback(
    (itemId: string) => items.find((i) => i.itemId === itemId)?.quantity ?? 0,
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
      getQuantity,
    }),
    [items, addItem, setQuantity, removeItem, clear, getQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
