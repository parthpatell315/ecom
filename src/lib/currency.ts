/**
 * Converts minor integer units (paise) to human-readable INR format.
 * E.g., 139900 -> "₹1,399"
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
 * Authentic WhiteLayer Indian Rupee format.
 * E.g., 84900 -> "Rs. 849.00"
 */
export function formatPriceRs(amountMinor: number): string {
  const rupees = Math.round(amountMinor / 100);
  return `Rs. ${rupees.toLocaleString('en-IN')}.00`;
}

/**
 * Parses user rupee input to integer minor units (paise).
 * E.g., 1399 -> 139900
 */
export function toMinorUnits(rupees: number): number {
  return Math.round(rupees * 100);
}
