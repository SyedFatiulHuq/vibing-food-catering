import type { Invoice } from '../types';

const STORAGE_KEY = 'vibing-catering-invoices';

export function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Invoice[];
  } catch {
    return [];
  }
}

export function saveInvoice(invoice: Invoice): void {
  const prev = loadInvoices();
  prev.unshift(invoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
}

export function downloadInvoiceJson(invoice: Invoice): void {
  const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoice.id}.json`;
  a.rel = 'noopener';
  a.click();
  URL.revokeObjectURL(url);
}
