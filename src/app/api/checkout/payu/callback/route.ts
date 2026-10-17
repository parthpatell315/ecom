import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayUResponseHash } from '@/lib/payu';
import { cookies } from 'next/headers';

const CART_COOKIE = 'flirta_cart_session';

export async function POST(req: NextRequest) {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const formData = await req.formData();
    const payload: Record<string, string> = {};

    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    const {
      status,
      txnid,
      amount,
      mihpayid,
      error_Message,
      udf1,
    } = payload;

    const orderNumber = txnid || udf1;

    if (!orderNumber) {
      console.error('[PayU Callback] Missing txnid in response:', payload);
      return NextResponse.redirect(`${appBaseUrl}/checkout?error=Invalid+PayU+transaction+response`, 303);
    }

    // 1. Verify Cryptographic SHA-512 Reverse Hash
    const isHashValid = verifyPayUResponseHash(payload);

    if (!isHashValid) {
      console.error('[PayU Callback] Hash mismatch for transaction:', txnid);
      await prisma.payment.updateMany({
        where: { gatewayOrderId: orderNumber },
        data: {
          status: 'FAILED',
          failureReason: 'PayU Cryptographic reverse hash mismatch',
          rawPayload: payload,
        },
      });
      return NextResponse.redirect(
        `${appBaseUrl}/checkout?error=${encodeURIComponent('Payment security verification failed.')}&orderNumber=${orderNumber}`,
        303
      );
    }

    // 2. Fetch the corresponding Order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      console.error('[PayU Callback] Order not found for txnid:', orderNumber);
      return NextResponse.redirect(`${appBaseUrl}/checkout?error=Order+not+found`, 303);
    }

    // 3. Handle Successful Payment
    if (status === 'success') {
      await prisma.$transaction(async (tx) => {
        // Update Order to CONFIRMED
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
          },
        });

        // Update Payment to SUCCESS
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: 'SUCCESS',
            gatewayPaymentId: mihpayid || `payu_${Date.now()}`,
            rawPayload: payload,
            verifiedAt: new Date(),
          },
        });

        // Atomically decrement inventory
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

      // Clear the cart cookie
      const cookieStore = await cookies();
      cookieStore.delete(CART_COOKIE);

      return NextResponse.redirect(
        `${appBaseUrl}/order-success?orderNumber=${encodeURIComponent(order.orderNumber)}&paymentId=${encodeURIComponent(mihpayid || '')}&gateway=PAYU`,
        303
      );
    }

    // 4. Handle Failed / Cancelled Payment
    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: {
        status: 'FAILED',
        failureReason: error_Message || `Payment was marked as ${status} by PayU`,
        rawPayload: payload,
      },
    });

    return NextResponse.redirect(
      `${appBaseUrl}/checkout?error=${encodeURIComponent(error_Message || 'Payment was declined or cancelled via PayU')}&orderNumber=${encodeURIComponent(order.orderNumber)}`,
      303
    );
  } catch (error) {
    console.error('[PayU Callback] Internal Error:', error);
    return NextResponse.redirect(`${appBaseUrl}/checkout?error=Internal+payment+processing+error`, 303);
  }
}

// In case user is redirected via GET
export async function GET(req: NextRequest) {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = new URL(req.url);
  const orderNumber = url.searchParams.get('orderNumber') || url.searchParams.get('txnid') || '';
  return NextResponse.redirect(`${appBaseUrl}/checkout?orderNumber=${encodeURIComponent(orderNumber)}`, 303);
}
