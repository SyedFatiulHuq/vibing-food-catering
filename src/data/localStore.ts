import type { SavedOrder } from "../types";

const ORDERS_KEY = "hkc_orders_v1";

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as unknown;
  } catch {
    return [];
  }
}

export function loadOrders(): SavedOrder[] {
  const raw = readRaw();
  if (!Array.isArray(raw)) return [];
  return raw.filter((o) => typeof o === "object" && o !== null) as SavedOrder[];
}

export function saveOrder(order: SavedOrder): void {
  const all = loadOrders();
  all.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
}

export function getOrderById(id: string): SavedOrder | undefined {
  return loadOrders().find((o) => o.id === id);
}

const MESSAGES_KEY = "hkc_contact_messages_v1";

export interface ContactMessage {
  id: string;
  createdAtIso: string;
  name: string;
  email: string;
  topic: string;
  message: string;
}

export function saveContactMessage(message: Omit<ContactMessage, "id" | "createdAtIso">): ContactMessage {
  const entry: ContactMessage = {
    ...message,
    id: `msg_${crypto.randomUUID()}`,
    createdAtIso: new Date().toISOString(),
  };
  let list: ContactMessage[] = [];
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) list = JSON.parse(raw) as ContactMessage[];
  } catch {
    list = [];
  }
  list.unshift(entry);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));
  return entry;
}
