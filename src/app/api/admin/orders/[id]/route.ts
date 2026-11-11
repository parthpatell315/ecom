import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { status, trackingNumber, trackingCarrier, trackingUrl, notes, paymentStatus } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { payments: true, items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Auto-restock inventory if order is being cancelled
    if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      for (const item of existingOrder.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stockCount: { increment: item.quantity } },
          });
        } else if (item.productId) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stockCount: { increment: item.quantity } },
          });
        }
      }
    }

    const effectivePaymentStatus =
      paymentStatus || (status === 'CONFIRMED' ? 'SUCCESS' : status === 'CANCELLED' ? 'FAILED' : undefined);

    if (effectivePaymentStatus) {
      await prisma.payment.updateMany({
        where: { orderId: id },
        data: {
          status: effectivePaymentStatus,
          verifiedAt: effectivePaymentStatus === 'SUCCESS' ? new Date() : null,
        },
      });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && Object.values(OrderStatus).includes(status) ? { status } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(trackingCarrier !== undefined ? { trackingCarrier } : {}),
        ...(trackingUrl !== undefined ? { trackingUrl } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        items: true,
        payments: true,
      },
    });

    // Record audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.userId,
        action: 'UPDATE_ORDER_STATUS',
        targetEntity: 'Order',
        targetId: id,
        details: {
          previousStatus: existingOrder.status,
          newStatus: status,
          trackingNumber,
          trackingCarrier,
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin order update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
