/**
 * Single source of truth for delivery promises across the entire storefront.
 * Used in announcement tickers, product pages, cart drawers, footer, and checkout.
 */

export const SHIPPING_CONFIG = {
  DELIVERY_PROMISE: 'Dispatched in 24-48h, delivered in 3-5 business days',
  DISPATCH_TIMELINE: 'Dispatched in 24-48 hours',
  DELIVERY_TIMELINE: 'Delivered in 3-5 business days',
  PRIMARY_COURIER: 'Bluedart Express Air',
  SECONDARY_COURIER: 'Delhivery Air',
  FREE_SHIPPING_THRESHOLD_MINORS: 99900, // ₹999
  PARTIAL_COD_ADVANCE_MINOR: 14900, // ₹149 advance
  PARTIAL_COD_ADVANCE_RUPEES: 149,
  PARTIAL_COD_LABEL: 'Partial COD (₹149 Advance, ₹850 at Doorstep)',
} as const;

export const DELIVERY_PROMISE = SHIPPING_CONFIG.DELIVERY_PROMISE;
export const PARTIAL_COD_ADVANCE_MINOR = SHIPPING_CONFIG.PARTIAL_COD_ADVANCE_MINOR;
export const PARTIAL_COD_ADVANCE_RUPEES = SHIPPING_CONFIG.PARTIAL_COD_ADVANCE_RUPEES;

