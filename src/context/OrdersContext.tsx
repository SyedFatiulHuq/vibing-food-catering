import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CheckoutPayload, OrderInvoice } from "../types";
import { getItemById } from "../data/menu";

const STORAGE_KEY = "vibing-catering-orders";

function loadStored(): OrderInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderInvoice[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(orders: OrderInvoice[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function newId(): string {
  return `ORD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

export function buildInvoice(
  payload: CheckoutPayload,
  lines: { itemId: string; quantity: number }[],
): OrderInvoice | null {
  const resolved: OrderInvoice["lines"] = [];
  for (const ln of lines) {
    const item = getItemById(ln.itemId);
    if (!item) return null;
    const lineTotal =
      item.pricePerPerson * payload.guestCount * ln.quantity;
    resolved.push({
      item,
      quantity: ln.quantity,
      lineTotal: Math.round(lineTotal * 100) / 100,
    });
  }
  const subtotal =
    Math.round(resolved.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const estimatedTax = Math.round(subtotal * 0.0825 * 100) / 100;
  const total = Math.round((subtotal + estimatedTax) * 100) / 100;

  return {
    id: newId(),
    placedAt: new Date().toISOString(),
    ...payload,
    lines: resolved,
    subtotal,
    estimatedTax,
    total,
  };
}

interface OrdersContextValue {
  orders: OrderInvoice[];
  placeOrder: (
    payload: CheckoutPayload,
    lines: { itemId: string; quantity: number }[],
  ) => OrderInvoice | null;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderInvoice[]>(() => loadStored());

  const placeOrder = useCallback(
    (payload: CheckoutPayload, lines: { itemId: string; quantity: number }[]) => {
      const invoice = buildInvoice(payload, lines);
      if (!invoice) return null;
      setOrders((prev) => {
        const next = [invoice, ...prev];
        persist(next);
        return next;
      });
      return invoice;
    },
    [],
  );

  const value = useMemo(
    () => ({ orders, placeOrder }),
    [orders, placeOrder],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
