'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1140827711731446';

const PURCHASE_TRACKED_PREFIX = 'flirta_pixel_purchased_';

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
}

export function trackPixelEvent(
  eventName: string,
  params: Record<string, any> = {},
  options?: { eventID?: string }
) {
  if (typeof window === 'undefined') return;

  const tryTrack = (): boolean => {
    if (typeof window.fbq === 'function') {
      try {
        if (options?.eventID) {
          window.fbq('track', eventName, params, { eventID: options.eventID });
        } else {
          window.fbq('track', eventName, params);
        }
        console.log(`[Meta Pixel] Successfully tracked ${eventName}:`, params);
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
  trackPixelEvent('Purchase', payload, { eventID: data.orderNumber });
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
