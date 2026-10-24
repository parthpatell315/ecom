import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidUtrNumber } from '@/lib/upi';
import { cookies } from 'next/headers';

const CART_COOKIE = 'flirta_cart_session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, utrNumber, payerVpa } = body;

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
    }

    if (!utrNumber || !isValidUtrNumber(utrNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid 12-digit UPI Reference / UTR Number (found on your GPay/PhonePe/Paytm payment receipt).',
        },
        { status: 400 }
      );
    }

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');

    // 1. Fetch Order and items
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Check if UTR is already used on another order to prevent fraud
    const existingPaymentWithUtr = await prisma.payment.findFirst({
      where: {
        gatewayPaymentId: cleanUtr,
        orderId: { not: order.id },
      },
    });

    if (existingPaymentWithUtr) {
      return NextResponse.json(
        {
          success: false,
          error: 'This UPI Reference / UTR Number has already been submitted for another transaction.',
        },
        { status: 400 }
      );
    }

    // 2. Atomically record payment submission and reserve inventory
    await prisma.$transaction(async (tx) => {
      // Update Payment record with UTR
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: {
          gatewayPaymentId: cleanUtr,
          status: 'PENDING',
          rawPayload: {
            utrNumber: cleanUtr,
            payerVpa: payerVpa?.trim() || null,
            submittedAt: new Date().toISOString(),
            channel: 'DIRECT_UPI_QR',
          },
        },
      });

      // Update Order notes with UTR
      const currentNotes = order.notes ? `${order.notes} | ` : '';
      await tx.order.update({
        where: { id: order.id },
        data: {
          notes: `${currentNotes}UPI UTR: ${cleanUtr}${payerVpa ? ` (from ${payerVpa})` : ''}`,
        },
      });

      // Decrement inventory stock
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

    // 3. Clear customer's cart
    const cookieStore = await cookies();
    cookieStore.delete(CART_COOKIE);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      utrNumber: cleanUtr,
      message: 'UPI payment submitted successfully. Awaiting merchant confirmation.',
    });
  } catch (error) {
    console.error('Submit UTR error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while processing UPI reference' }, { status: 500 });
  }
}
