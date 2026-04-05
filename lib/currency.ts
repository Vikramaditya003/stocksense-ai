// ── Currency utilities for Forestock ─────────────────────────────────────────
// Single source of truth for all money formatting across the app.

export interface Currency {
  code: string;
  symbol: string;
  locale: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",    locale: "en-US", label: "US Dollar ($)" },
  { code: "INR", symbol: "₹",   locale: "en-IN", label: "Indian Rupee (₹)" },
  { code: "GBP", symbol: "£",   locale: "en-GB", label: "British Pound (£)" },
  { code: "EUR", symbol: "€",   locale: "de-DE", label: "Euro (€)" },
  { code: "AUD", symbol: "A$",  locale: "en-AU", label: "Australian Dollar (A$)" },
  { code: "CAD", symbol: "C$",  locale: "en-CA", label: "Canadian Dollar (C$)" },
  { code: "SGD", symbol: "S$",  locale: "en-SG", label: "Singapore Dollar (S$)" },
  { code: "AED", symbol: "AED ", locale: "ar-AE", label: "UAE Dirham (AED)" },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY;
}

/**
 * Format a monetary amount using the given currency.
 * Uses compact notation for large numbers (1.2K, 45K, 1.2L for INR).
 */
export function formatMoney(amount: number, currencyCode: string): string {
  const cur = getCurrency(currencyCode);

  if (currencyCode === "INR") {
    // Indian compact notation: L (lakh) and K
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000)   return `₹${Math.round(amount / 100) * 100}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    return `₹${Math.round(amount)}`;
  }

  // International compact notation
  if (amount >= 1_000_000) return `${cur.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `${cur.symbol}${(amount / 1_000).toFixed(1)}K`;
  return `${cur.symbol}${Math.round(amount).toLocaleString(cur.locale)}`;
}

/**
 * Auto-detect currency from a CSV string by scanning the price column.
 * Returns the detected currency code, or "USD" as default.
 */
export function detectCurrencyFromCsv(csv: string): string {
  const sample = csv.slice(0, 4000); // only scan first 4KB

  // Check for explicit currency column header
  const headerLine = sample.split(/\r?\n/)[0]?.toLowerCase() ?? "";
  const currencyHeaderMatch = headerLine.match(/currency|curr/);
  if (currencyHeaderMatch) {
    // try to find the value in data rows
    const lines = sample.split(/\r?\n/).slice(1, 5);
    const headers = headerLine.split(",");
    const colIdx = headers.findIndex((h) => h.includes("currency") || h === "curr");
    for (const line of lines) {
      const val = line.split(",")[colIdx]?.trim().toUpperCase();
      if (val && CURRENCIES.find((c) => c.code === val)) return val;
    }
  }

  // Detect from price column symbol prefixes
  if (/£[\d,.]/.test(sample))       return "GBP";
  if (/€[\d,.]/.test(sample))       return "EUR";
  if (/A\$[\d,.]/.test(sample))     return "AUD";
  if (/C\$[\d,.]/.test(sample))     return "CAD";
  if (/S\$[\d,.]/.test(sample))     return "SGD";
  if (/AED\s*[\d,.]/.test(sample))  return "AED";
  if (/₹[\d,.]/.test(sample))       return "INR";
  if (/\$[\d,.]/.test(sample))      return "USD";

  return "USD"; // safe global default
}

/**
 * Returns the currency symbol for use in AI prompts.
 */
export function currencySymbol(code: string): string {
  return getCurrency(code).symbol;
}
