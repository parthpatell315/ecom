import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  MetaServerEventPayload,
  MetaUserData,
  MetaCustomData,
  MetaCapiResult,
  MetaCapiResponse,
} from '@/types/meta';

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1429779105956526';
const META_GRAPH_VERSION = 'v22.0';
const DEFAULT_SITE_URL = 'https://www.flirta.network';

/**
 * Generates lowercase SHA-256 hash of a trimmed string
 */
export function sha256(input: string): string {
  if (!input) return '';
  return crypto
    .createHash('sha256')
    .update(input.trim().toLowerCase())
    .digest('hex');
}

/**
 * Normalizes email address according to Meta requirements:
 * lowercase, trimmed, whitespace removed, SHA-256 hashed
 */
export function normalizeEmail(email?: string | null): string | undefined {
  if (!email) return undefined;
  const clean = email.trim().toLowerCase();
  return clean ? sha256(clean) : undefined;
}

/**
 * Normalizes phone number according to Meta requirements:
 * digits only, removes leading zeros/plus/spaces,
 * ensures Indian country code '91' prefix if 10 digits, SHA-256 hashed
 */
export function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;

  // If 10 digits (standard Indian mobile e.g. 9820012345), prepend '91'
  if (digits.length === 10) {
    digits = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    // 09820012345 -> 919820012345
    digits = `91${digits.slice(1)}`;
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  return sha256(digits);
}

/**
 * Normalizes name (first or last)
 */
export function normalizeName(name?: string | null): string | undefined {
  if (!name) return undefined;
  const clean = name.trim().toLowerCase();
  return clean ? sha256(clean) : undefined;
}

/**
 * Core Meta Conversions API (CAPI) Dispatcher
 * Sends server-side event to Meta Graph API v22.0
 * Includes database-level deduplication via MetaEventLog
 */
export async function sendMetaServerEvent(params: {
  eventName: string;
  eventId: string;
  orderId: string;
  paymentId?: string | null;
  value: number;
  currency?: string;
  userData: {
    email?: string | null;
    phone?: string | null;
    fullName?: string | null;
    clientIp?: string | null;
    userAgent?: string | null;
    fbp?: string | null;
    fbc?: string | null;
    externalId?: string | null;
  };
  customData?: MetaCustomData;
  sourceUrl?: string;
}): Promise<MetaCapiResult> {
  const {
    eventName,
    eventId,
    orderId,
    paymentId,
    value,
    currency = 'INR',
    userData,
    customData,
    sourceUrl,
  } = params;

  // 1. Idempotency Check in Database
  try {
    const existingLog = await prisma.metaEventLog.findUnique({
      where: { eventId },
    });

    if (existingLog && existingLog.status === 'SENT') {
      console.log(`[Meta CAPI] Event ${eventName} (${eventId}) already sent. Skipping duplicate.`);
      return {
        success: true,
        eventId,
        eventName,
        status: 'DUPLICATE_SKIPPED',
      };
    }
  } catch (dbErr) {
    console.warn('[Meta CAPI] Idempotency lookup warning:', dbErr);
  }

  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();

  // If no token is provided yet in environment, log safe warning and record gracefully
  if (!accessToken) {
    console.warn(
      `[Meta CAPI] Notice: META_CAPI_ACCESS_TOKEN is not configured in environment. Event ${eventName} (${eventId}) skipped live dispatch.`
    );

    try {
      await prisma.metaEventLog.upsert({
        where: { eventId },
        create: {
          orderId,
          paymentId: paymentId || null,
          eventName,
          eventId,
          value,
          currency,
          status: 'DISABLED',
          metaResponse: { message: 'META_CAPI_ACCESS_TOKEN not configured in environment' },
        },
        update: {},
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      eventId,
      eventName,
      status: 'DISABLED',
      error: 'META_CAPI_ACCESS_TOKEN is not configured',
    };
  }

  // 2. Build User Data with SHA-256 Hashing
  const hashedEmail = normalizeEmail(userData.email);
  const hashedPhone = normalizePhone(userData.phone);

  let hashedFn: string | undefined;
  let hashedLn: string | undefined;
  if (userData.fullName) {
    const parts = userData.fullName.trim().split(/\s+/);
    if (parts[0]) hashedFn = normalizeName(parts[0]);
    if (parts.length > 1) hashedLn = normalizeName(parts.slice(1).join(' '));
  }

  const metaUserData: MetaUserData = {
    ...(hashedEmail ? { em: [hashedEmail] } : {}),
    ...(hashedPhone ? { ph: [hashedPhone] } : {}),
    ...(hashedFn ? { fn: [hashedFn] } : {}),
    ...(hashedLn ? { ln: [hashedLn] } : {}),
    ...(userData.clientIp ? { client_ip_address: userData.clientIp } : {}),
    ...(userData.userAgent ? { client_user_agent: userData.userAgent } : {}),
    ...(userData.fbp ? { fbp: userData.fbp } : {}),
    ...(userData.fbc ? { fbc: userData.fbc } : {}),
    ...(userData.externalId ? { external_id: [sha256(userData.externalId)] } : {}),
    country: [sha256('in')],
  };

  // 3. Assemble Server Event Payload
  const serverPayload: MetaServerEventPayload = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: sourceUrl || `${DEFAULT_SITE_URL}/checkout`,
    action_source: 'website',
    user_data: metaUserData,
    custom_data: {
      value,
      currency,
      ...customData,
    },
  };

  const endpoint = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events`;

  // 4. Dispatch with Exponential Backoff Retry (up to 3 attempts)
  let lastError: any = null;
  let responseData: MetaCapiResponse | null = null;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const bodyPayload: Record<string, any> = {
        data: [serverPayload],
      };

      if (testEventCode) {
        bodyPayload.test_event_code = testEventCode;
      }

      const res = await fetch(`${endpoint}?access_token=${encodeURIComponent(accessToken)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      responseData = (await res.json()) as MetaCapiResponse;

      if (res.ok && responseData.events_received) {
        console.log(
          `[Meta CAPI] Successfully delivered ${eventName} (Event ID: ${eventId}, Value: ₹${value}):`,
          { events_received: responseData.events_received, fbtrace_id: responseData.fbtrace_id }
        );

        // Record successful dispatch in database
        try {
          await prisma.metaEventLog.upsert({
            where: { eventId },
            create: {
              orderId,
              paymentId: paymentId || null,
              eventName,
              eventId,
              value,
              currency,
              status: 'SENT',
              metaResponse: responseData as any,
            },
            update: {
              status: 'SENT',
              metaResponse: responseData as any,
            },
          });
        } catch (dbErr) {
          console.warn('[Meta CAPI] Error saving MetaEventLog:', dbErr);
        }

        return {
          success: true,
          eventId,
          eventName,
          status: 'SENT',
          eventsReceived: responseData.events_received,
          response: responseData,
        };
      } else {
        lastError = responseData?.error || responseData;
        console.warn(`[Meta CAPI] Attempt ${attempt} failed for ${eventName}:`, lastError);
      }
    } catch (netErr) {
      lastError = netErr;
      console.warn(`[Meta CAPI] Network error on attempt ${attempt} for ${eventName}:`, netErr);
    }

    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }

  // 5. If all retries failed, log in DB
  try {
    await prisma.metaEventLog.upsert({
      where: { eventId },
      create: {
        orderId,
        paymentId: paymentId || null,
        eventName,
        eventId,
        value,
        currency,
        status: 'FAILED',
        metaResponse: (lastError ? { error: String(lastError) } : {}) as any,
      },
      update: {
        status: 'FAILED',
        metaResponse: (lastError ? { error: String(lastError) } : {}) as any,
      },
    });
  } catch {
    // ignore
  }

  return {
    success: false,
    eventId,
    eventName,
    status: 'FAILED',
    error: lastError?.message || String(lastError),
    response: responseData,
  };
}

/**
 * Dispatches the Custom Meta Event "PartialPayment"
 * Fires when an admin manually verifies a genuine advance or installment payment.
 * STRICT RULE: Never triggers a Purchase event.
 */
export async function sendCapiPartialPayment(params: {
  order: {
    id: string;
    orderNumber: string;
    totalMinor: number;
    guestEmail?: string | null;
    guestPhone?: string | null;
    guestName?: string | null;
  };
  payment: {
    id: string;
    amountMinor: number;
    currency?: string;
    rawPayload?: any;
  };
  installmentIndex?: number;
  cumulativeVerifiedMinor: number;
  clientContext?: {
    clientIp?: string | null;
    userAgent?: string | null;
    fbp?: string | null;
    fbc?: string | null;
  };
}): Promise<MetaCapiResult> {
  const { order, payment, installmentIndex = 1, cumulativeVerifiedMinor, clientContext } = params;

  const value = payment.amountMinor / 100;
  const eventId = `capi_partial_${payment.id}`;
  const rawMeta = payment.rawPayload || {};

  const clientIp = clientContext?.clientIp || rawMeta.clientIp || null;
  const userAgent = clientContext?.userAgent || rawMeta.userAgent || null;
  const fbp = clientContext?.fbp || rawMeta.fbp || null;
  const fbc = clientContext?.fbc || rawMeta.fbc || null;

  const remainingBalance = Math.max(0, (order.totalMinor - cumulativeVerifiedMinor) / 100);

  return sendMetaServerEvent({
    eventName: 'PartialPayment',
    eventId,
    orderId: order.id,
    paymentId: payment.id,
    value,
    currency: payment.currency || 'INR',
    userData: {
      email: order.guestEmail,
      phone: order.guestPhone,
      fullName: order.guestName,
      clientIp,
      userAgent,
      fbp,
      fbc,
      externalId: order.orderNumber,
    },
    customData: {
      order_id: order.orderNumber,
      payment_type: 'partial',
      payment_id: payment.id,
      installment_number: installmentIndex,
      remaining_balance: remainingBalance,
      total_order_value: order.totalMinor / 100,
    },
    sourceUrl: `${DEFAULT_SITE_URL}/order-success?orderNumber=${order.orderNumber}`,
  });
}

/**
 * Dispatches the Standard Meta Event "Purchase"
 * Fires ONLY when the cumulative verified payments satisfy 100% of the order total.
 * The value must represent the COMPLETE order total, NOT the last installment.
 * Fires strictly ONCE per order.
 */
export async function sendCapiPurchase(params: {
  order: {
    id: string;
    orderNumber: string;
    totalMinor: number;
    guestEmail?: string | null;
    guestPhone?: string | null;
    guestName?: string | null;
    items?: Array<{
      productId: string;
      titleSnapshot?: string;
      quantity?: number;
      unitPriceMinor?: number;
    }>;
  };
  clientContext?: {
    clientIp?: string | null;
    userAgent?: string | null;
    fbp?: string | null;
    fbc?: string | null;
  };
  lastPaymentId?: string | null;
}): Promise<MetaCapiResult> {
  const { order, clientContext, lastPaymentId } = params;

  const fullOrderValue = order.totalMinor / 100;
  const eventId = `capi_purchase_${order.id}`;

  const validItems = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
  const contentIds = validItems.map((it) => it.productId).filter(Boolean);
  const contents = validItems.map((it) => ({
    id: it.productId,
    quantity: it.quantity || 1,
    item_price: (it.unitPriceMinor || order.totalMinor) / 100,
  }));
  const totalNumItems = validItems.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;

  return sendMetaServerEvent({
    eventName: 'Purchase',
    eventId,
    orderId: order.id,
    paymentId: lastPaymentId || null,
    value: fullOrderValue,
    currency: 'INR',
    userData: {
      email: order.guestEmail,
      phone: order.guestPhone,
      fullName: order.guestName,
      clientIp: clientContext?.clientIp || null,
      userAgent: clientContext?.userAgent || null,
      fbp: clientContext?.fbp || null,
      fbc: clientContext?.fbc || null,
      externalId: order.orderNumber,
    },
    customData: {
      order_id: order.orderNumber,
      payment_type: 'full',
      content_type: 'product',
      content_ids: contentIds.length > 0 ? contentIds : [order.orderNumber],
      contents:
        contents.length > 0
          ? contents
          : [{ id: order.orderNumber, quantity: 1, item_price: fullOrderValue }],
      num_items: totalNumItems,
    },
    sourceUrl: `${DEFAULT_SITE_URL}/order-success?orderNumber=${order.orderNumber}`,
  });
}

