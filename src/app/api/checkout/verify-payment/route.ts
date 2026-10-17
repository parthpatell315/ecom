import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const CART_COOKIE = 'flirta_cart_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Incomplete payment credentials' }, { status: 400 });
    }

    // 1. Cryptographic Signature Verification
    const isValidSignature = verifyPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      console.warn(`Payment signature verification failed for Order: ${orderNumber}`);
      return NextResponse.json({ success: false, error: 'Cryptographic signature verification failed' }, { status: 400 });
    }

    // 2. Locate order in database
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderNumber },
          { payments: { some: { gatewayOrderId: razorpayOrderId } } },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already confirmed, return success
    if (order.status === 'CONFIRMED' || order.status === 'PROCESSING') {
      return NextResponse.json({
        success: true,
        message: 'Order already confirmed',
        orderNumber: order.orderNumber,
      });
    }

    // 3. Atomic Database Transaction: Update Status, Decrement Stock, Clear Cart
    await prisma.$transaction(async (tx) => {
      // Update Payment Record
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: {
          gatewayPaymentId: razorpayPaymentId,
          gatewaySignature: razorpaySignature,
          status: 'SUCCESS',
          verifiedAt: new Date(),
        },
      });

      // Update Order Status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
        },
      });

      // Decrement Inventory Atomically
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockCount: { decrement: item.quantity },
            },
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
          },
        });
      }

      // Increment Coupon usage if applied
      if (order.couponCode) {
        await tx.coupon.updateMany({
          where: { code: order.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }
    });

    // 4. Clear Customer's Cart
    const session = await getSession();
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get(CART_COOKIE)?.value;

    if (session?.userId) {
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: session.userId } },
      });
    } else if (guestSessionId) {
      await prisma.cartItem.deleteMany({
        where: { cart: { sessionId: guestSessionId } },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, error: 'Server error while verifying payment' }, { status: 500 });
  }
}
