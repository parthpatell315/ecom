import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = body.orderNumber || body.orderId || body.txnid;
    const utr = body.utr || body.utrNumber || body.rrn;
    const status = (body.status || '').toUpperCase();
    const secret = req.headers.get('x-youpi-secret') || req.headers.get('x-webhook-secret');
    const configuredSecret = process.env.YOUPI_WEBHOOK_SECRET;

    // Optional secret verification if configured
    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Order reference is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payments: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (status === 'SUCCESS' || status === 'PAID' || status === 'CONFIRMED') {
      await prisma.$transaction(async (tx) => {
        // Update Order to CONFIRMED
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            notes: order.notes
              ? `${order.notes} | YouPI Verified (UTR: ${utr || 'Auto'})`
              : `YouPI Verified (UTR: ${utr || 'Auto'})`,
          },
        });

        // Update Payment to SUCCESS
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: 'SUCCESS',
            gatewayPaymentId: utr || `youpi_${Date.now()}`,
            verifiedAt: new Date(),
            rawPayload: body,
          },
        });

        // Ensure inventory is decremented if not already
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

      return NextResponse.json({ success: true, message: 'Order confirmed via YouPI webhook' });
    }

    if (status === 'FAILED' || status === 'EXPIRED') {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: 'FAILED',
          failureReason: body.reason || 'Payment expired or failed on YouPI gateway',
          rawPayload: body,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('YouPI webhook error:', err);
    return NextResponse.json({ success: false, error: 'Internal webhook error' }, { status: 500 });
  }
}
