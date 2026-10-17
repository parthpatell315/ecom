import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayUResponseHash } from '@/lib/payu';

/**
 * PayU India Server-to-Server Webhook Handler
 * Idempotently verifies cryptographic hash and updates order & payment records.
 */
export async function POST(req: NextRequest) {
  try {
    let payload: Record<string, any> = {};

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = String(value);
      });
    } else {
      payload = await req.json();
    }

    const { status, txnid, mihpayid, udf1 } = payload;
    const orderNumber = txnid || udf1;

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Missing txnid' }, { status: 400 });
    }

    // Cryptographic hash validation
    const isValid = verifyPayUResponseHash(payload);
    if (!isValid) {
      console.warn('[PayU Webhook] Invalid cryptographic hash received for:', orderNumber);
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (status === 'success' && order.status !== 'CONFIRMED') {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'CONFIRMED' },
        });

        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: 'SUCCESS',
            gatewayPaymentId: mihpayid,
            rawPayload: payload,
            verifiedAt: new Date(),
          },
        });

        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stockCount: { decrement: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockCount: { decrement: item.quantity } },
            });
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('[PayU Webhook] Error:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
