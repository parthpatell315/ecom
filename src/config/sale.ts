/**
 * Sale & Promotional Event Configuration
 * Controls top announcement bar, countdown timers, and promotional badges.
 */

export const SALE_CONFIG = {
  // Set to an ISO 8601 date string (e.g. '2026-11-05T23:59:59+05:30') to enable a real countdown.
  // When null or expired, countdown is hidden.
  SALE_END_DATE: null as string | null,

  // Fallback text when SALE_END_DATE is null or in the past
  DEFAULT_ANNOUNCEMENT: 'Studio Drop: Free Pan-India Air Delivery | Cash on Delivery Available',

  // Label shown on promotional cards when sale is active
  PROMOTION_LABEL: 'Limited Edition',
} as const;

/**
 * Returns true only if SALE_END_DATE is defined, valid, and strictly in the future.
 */
export function isSaleActive(saleEndDate: string | null = SALE_CONFIG.SALE_END_DATE): boolean {
  if (!saleEndDate) return false;
  const target = new Date(saleEndDate).getTime();
  if (isNaN(target)) return false;
  return target > Date.now();
}
