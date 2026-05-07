import type { Invoice } from "../types";

const ORDERS_KEY = "hh:orders";
const CART_KEY = "hh:cart";
const PICKUP_DATE_KEY = "hh:pickupDate";

const safeRead = <T,>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage may be unavailable (e.g. Safari private mode). */
  }
};

const safeRemove = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

export const loadOrders = (): Invoice[] => safeRead<Invoice[]>(ORDERS_KEY) ?? [];

export const saveOrder = (invoice: Invoice): void => {
  const orders = loadOrders();
  orders.unshift(invoice);
  safeWrite(ORDERS_KEY, orders.slice(0, 100));
};

export const loadCart = <T,>(): T | null => safeRead<T>(CART_KEY);
export const saveCart = (value: unknown): void => safeWrite(CART_KEY, value);
export const clearCart = (): void => safeRemove(CART_KEY);

export const loadPickupDate = (): string | null => safeRead<string>(PICKUP_DATE_KEY);
export const savePickupDate = (iso: string): void => safeWrite(PICKUP_DATE_KEY, iso);
