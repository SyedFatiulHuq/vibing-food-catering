import type { CheckoutPayload, Invoice, InvoiceLine, MenuItem } from '../types';

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function buildInvoice(
  menuItemsById: Map<string, MenuItem>,
  payload: CheckoutPayload,
  lines: { itemId: string; quantity: number }[],
): Invoice {
  const invoiceLines: InvoiceLine[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const item = menuItemsById.get(line.itemId);
    if (!item) continue;
    const lineTotal = Math.round(item.pricePerPerson * line.quantity * 100) / 100;
    subtotal += lineTotal;
    invoiceLines.push({
      itemId: line.itemId,
      name: item.name,
      category: item.category,
      quantity: line.quantity,
      pricePerPerson: item.pricePerPerson,
      lineTotal,
    });
  }

  const total = Math.round(subtotal * 100) / 100;

  return {
    id: `INV-${Date.now()}-${randomSuffix()}`.toUpperCase(),
    createdAt: new Date().toISOString(),
    cateringDate: payload.cateringDate,
    partySize: payload.partySize,
    lines: invoiceLines,
    subtotal,
    taxNote: 'Sales tax may apply. This demo shows food subtotal only.',
    total,
    pickupWindow: payload.pickupWindow,
    contactName: payload.contactName,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    paymentMethod: payload.paymentMethod,
    paymentNote: payload.paymentNote,
    specialInstructions: payload.specialInstructions,
  };
}
