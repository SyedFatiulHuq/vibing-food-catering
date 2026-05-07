const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatCurrency = (value: number): string => usd.format(value);

export const TAX_RATE = 0.0625; // 6.25% (example for MA)
