/**
 * Standard Indian Rupee (INR ₹) currency formatting.
 * Single source of truth for all prices across the storefront.
 */

export function formatCurrency(amountMinor: number): string {
  const rupees = Math.round(amountMinor / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Compatibility alias returning standard ₹ format (removes all legacy "Rs.").
 */
export const formatPriceRs = formatCurrency;

/**
 * Parses user rupee input to integer minor units (paise).
 * E.g., 1399 -> 139900
 */
export function toMinorUnits(rupees: number): number {
  return Math.round(rupees * 100);
}
