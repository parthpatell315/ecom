'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '946508041872382';

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

  // 1. Ensure Meta Pixel fbq stub exists if script hasn't executed yet
  if (!window.fbq) {
    const fbq: any = function () {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
  }

  // 2. Track event immediately (queued or direct)
  try {
    if (options?.eventID) {
      window.fbq('track', eventName, params, { eventID: options.eventID });
    } else {
      window.fbq('track', eventName, params);
    }
    console.log(`[Meta Pixel] Tracked ${eventName}:`, params);
  } catch (err) {
    console.warn(`[Meta Pixel] Error tracking ${eventName}:`, err);
  }
}

/**
 * Standard Meta Purchase Event Tracker
 * Ensures value > 0, currency, content_ids, and contents are strictly formatted for Meta Ads
 */
export function trackPurchaseEvent(data: PixelPurchaseData) {
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

  trackPixelEvent('Purchase', payload, { eventID: data.orderNumber });
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
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <Suspense fallback={null}>
        <PixelPageViewTracker />
      </Suspense>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
