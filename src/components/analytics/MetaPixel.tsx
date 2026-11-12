'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2214305502449277';

const PURCHASE_TRACKED_PREFIX = 'flirta_pixel_purchased_';

/**
 * Retrieves Meta cookies (_fbp, _fbc) from browser document.cookie for CAPI enrichment
 */
export function getMetaBrowserCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const cookies = document.cookie.split(';');
  let fbp: string | undefined;
  let fbc: string | undefined;

  for (const c of cookies) {
    const [key, val] = c.trim().split('=');
    if (key === '_fbp') fbp = decodeURIComponent(val || '');
    if (key === '_fbc') fbc = decodeURIComponent(val || '');
  }

  return { fbp, fbc };
}

/**
 * Checks whether a Purchase event has already been tracked for a given orderNumber.
 * Guards against duplicate Purchase events on page refreshes, back navigation, or revisits.
 */
export function isPurchaseAlreadyTracked(orderNumber: string): boolean {
  if (typeof window === 'undefined' || !orderNumber) return false;
  try {
    return localStorage.getItem(`${PURCHASE_TRACKED_PREFIX}${orderNumber}`) === 'true';
  } catch {
    return false;
  }
}

/**
 * Records that a Purchase event has been tracked for this orderNumber in browser storage.
 */
export function markPurchaseTracked(orderNumber: string): void {
  if (typeof window === 'undefined' || !orderNumber) return;
  try {
    localStorage.setItem(`${PURCHASE_TRACKED_PREFIX}${orderNumber}`, 'true');
  } catch {
    // ignore
  }
}

export interface PixelPurchaseItem {
  productId: string;
  title?: string;
  quantity?: number;
  price?: number;
}

export interface PixelPurchaseData {
  orderNumber: string;
  value: number; // in INR (e.g. 999.00)
  currency?: string;
  items: PixelPurchaseItem[];
  customerEmail?: string;
  customerPhone?: string;
  eventId?: string;
}

/**
 * Standard Meta AddPaymentInfo Event Tracker
 */
export function trackAddPaymentInfo(data: {
  value: number;
  currency?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price: number }>;
  payment_type?: string;
}) {
  const numValue = Math.max(1, Number(data.value) || 0);
  const currency = data.currency || 'INR';

  trackPixelEvent('AddPaymentInfo', {
    content_type: 'product',
    content_ids: data.content_ids || [],
    contents: data.contents || [],
    value: numValue,
    currency,
    payment_type: data.payment_type || 'UPI',
  });
}

export function trackPixelEvent(
  eventName: string,
  params?: Record<string, any>,
  options?: { eventID?: string }
) {
  if (typeof window === 'undefined') return;

  const tryTrack = (): boolean => {
    if (typeof window.fbq === 'function') {
      try {
        const hasParams = params && Object.keys(params).length > 0;
        if (options?.eventID) {
          window.fbq('track', eventName, hasParams ? params : {}, { eventID: options.eventID });
        } else if (hasParams) {
          window.fbq('track', eventName, params);
        } else {
          window.fbq('track', eventName);
        }
        console.log(`[Meta Pixel] Successfully tracked ${eventName}:`, params || {});
        return true;
      } catch (err) {
        console.warn(`[Meta Pixel] Error tracking ${eventName}:`, err);
      }
    }
    return false;
  };

  // 1. If fbq is already initialized by Meta's script, fire immediately
  if (tryTrack()) return;

  // 2. Otherwise retry every 100ms for up to 5 seconds while Meta's fbevents.js downloads
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (tryTrack() || attempts >= 50) {
      clearInterval(timer);
    }
  }, 100);
}

/**
 * Standard Meta Purchase Event Tracker
 * Ensures value > 0, currency, content_ids, and contents are strictly formatted for Meta Ads
 * Enforces order-level idempotency via localStorage to prevent duplicate events on refresh/revisit
 */
export function trackPurchaseEvent(data: PixelPurchaseData): boolean {
  if (typeof window === 'undefined' || !data.orderNumber) return false;

  if (isPurchaseAlreadyTracked(data.orderNumber)) {
    console.log(`[Meta Pixel] Purchase for order ${data.orderNumber} already tracked. Skipping.`);
    return false;
  }

  const numValue = Math.max(1, Number(data.value) || 999);
  const currency = data.currency || 'INR';

  const validItems = Array.isArray(data.items) && data.items.length > 0 ? data.items : [];
  const contentIds = validItems.map((it) => String(it.productId)).filter(Boolean);
  const contents = validItems.map((it) => ({
    id: String(it.productId),
    quantity: Math.max(1, Number(it.quantity) || 1),
    item_price: Math.max(1, Number(it.price) || numValue),
  }));

  const totalNumItems = validItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0) || 1;

  const payload: Record<string, any> = {
    content_type: 'product',
    content_ids: contentIds.length > 0 ? contentIds : [data.orderNumber],
    contents:
      contents.length > 0
        ? contents
        : [{ id: data.orderNumber, quantity: 1, item_price: numValue }],
    value: numValue,
    currency: currency,
    num_items: totalNumItems,
    order_id: data.orderNumber,
  };

  markPurchaseTracked(data.orderNumber);
  trackPixelEvent('Purchase', payload, { eventID: data.eventId || data.orderNumber });
  return true;
}

function PixelPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (META_PIXEL_ID && typeof window !== 'undefined') {
      trackPixelEvent('PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null;

  return (
    <Suspense fallback={null}>
      <PixelPageViewTracker />
    </Suspense>
  );
}
