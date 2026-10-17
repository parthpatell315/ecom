import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      console.warn('Invalid webhook signature received from Razorpay');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log(`Received Razorpay webhook event: ${event.event}`);

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const gatewayOrderId = paymentEntity.order_id;
      const gatewayPaymentId = paymentEntity.id;

      // Find the payment & order
      const payment = await prisma.payment.findUnique({
        where: { gatewayOrderId },
        include: {
          order: {
            include: { items: true },
          },
        },
      });

      if (payment && payment.order.status !== 'CONFIRMED' && payment.order.status !== 'PROCESSING') {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              gatewayPaymentId,
              status: 'SUCCESS',
              verifiedAt: new Date(),
              rawPayload: paymentEntity,
            },
          });

          await tx.order.update({
            where: { id: payment.order.id },
            data: { status: 'CONFIRMED' },
          });

          // Decrement stock
          for (const item of payment.order.items) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stockCount: { decrement: item.quantity } },
              });
            }
            await tx.product.update({
              where: { id: item.productId },
              data: { stockCount: { decrement: item.quantity } },
            });
          }
        });

        console.log(`Order ${payment.order.orderNumber} confirmed via verified webhook.`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay webhook handler error:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing error' }, { status: 500 });
  }
}
