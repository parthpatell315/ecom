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
} as const;

export const DELIVERY_PROMISE = SHIPPING_CONFIG.DELIVERY_PROMISE;
