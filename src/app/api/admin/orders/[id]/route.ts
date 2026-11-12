import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { sendCapiPartialPayment, sendCapiPurchase } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const {
      status,
      trackingNumber,
      trackingCarrier,
      trackingUrl,
      notes,
      paymentStatus,
      paymentId,
      newInstallment, // Optional: { amountMinor: number, gateway?: PaymentGateway, gatewayPaymentId?: string, note?: string }
    } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        payments: { orderBy: { createdAt: 'asc' } },
        items: true,
        metaEvents: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 1. Auto-restock inventory if order is being cancelled
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

      // Mark pending payments as FAILED
      await prisma.payment.updateMany({
        where: { orderId: id, status: 'PENDING' },
        data: { status: 'FAILED' },
      });
    }

    // 2. Handle New Payment Installment Creation (if admin recorded an additional payment)
    let createdInstallmentPayment: any = null;
    if (newInstallment && Number(newInstallment.amountMinor) > 0) {
      const installmentAmountMinor = Math.round(Number(newInstallment.amountMinor));
      createdInstallmentPayment = await prisma.payment.create({
        data: {
          orderId: id,
          gateway: newInstallment.gateway || 'UPI',
          gatewayPaymentId:
            newInstallment.gatewayPaymentId?.trim() ||
            `MANUAL_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          amountMinor: installmentAmountMinor,
          currency: 'INR',
          status: 'SUCCESS',
          verifiedAt: new Date(),
          rawPayload: {
            channel: 'ADMIN_MANUAL_INSTALLMENT',
            verifiedByAdminId: admin.userId,
            adminNote: newInstallment.note || 'Verified payment installment',
            verifiedAt: new Date().toISOString(),
          },
        },
      });
    }

    // 3. Handle Status Updates for Existing Payment Records
    let verifiedPaymentRecord: any = createdInstallmentPayment || null;

    const effectivePaymentStatus =
      paymentStatus || (status === 'CONFIRMED' ? 'SUCCESS' : status === 'CANCELLED' ? 'FAILED' : undefined);

    if (effectivePaymentStatus && !createdInstallmentPayment) {
      if (paymentId) {
        // Specific payment targeted
        verifiedPaymentRecord = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: effectivePaymentStatus,
            verifiedAt: effectivePaymentStatus === 'SUCCESS' ? new Date() : null,
          },
        });
      } else {
        // Update first pending payment or all payments
        const pendingPayment = existingOrder.payments.find((p) => p.status === 'PENDING') || existingOrder.payments[0];
        if (pendingPayment) {
          verifiedPaymentRecord = await prisma.payment.update({
            where: { id: pendingPayment.id },
            data: {
              status: effectivePaymentStatus,
              verifiedAt: effectivePaymentStatus === 'SUCCESS' ? new Date() : null,
            },
          });
        }
      }
    }

    // 4. Mathematical Payment State Engine: Calculate Cumulative Verified Amount
    const allPaymentsForOrder = await prisma.payment.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'asc' },
    });

    const verifiedPayments = allPaymentsForOrder.filter((p) => p.status === 'SUCCESS');
    const cumulativeVerifiedMinor = verifiedPayments.reduce((sum, p) => sum + p.amountMinor, 0);

    const isFullyPaid =
      existingOrder.totalMinor > 0 && cumulativeVerifiedMinor >= existingOrder.totalMinor;
    const isPartiallyPaid =
      cumulativeVerifiedMinor > 0 && cumulativeVerifiedMinor < existingOrder.totalMinor;

    // 5. Meta Conversions API (CAPI) Dispatch Logic
    let capiResult: any = null;

    // Only dispatch CAPI when a payment was genuinely verified as SUCCESS
    if (effectivePaymentStatus === 'SUCCESS' && verifiedPaymentRecord) {
      const rawMeta = (verifiedPaymentRecord.rawPayload as any) || {};
      const clientContext = {
        clientIp: rawMeta.clientIp || null,
        userAgent: rawMeta.userAgent || null,
        fbp: rawMeta.fbp || null,
        fbc: rawMeta.fbc || null,
      };

      if (isPartiallyPaid) {
        // --- CUSTOM EVENT: PartialPayment ---
        // Fires strictly once for this verified installment transaction
        const installmentIndex = verifiedPayments.findIndex((p) => p.id === verifiedPaymentRecord.id) + 1 || 1;

        console.log(
          `[Admin Verification] Verified PARTIAL payment of ₹${verifiedPaymentRecord.amountMinor / 100} for Order #${existingOrder.orderNumber} (Cumulative: ₹${cumulativeVerifiedMinor / 100} / ₹${existingOrder.totalMinor / 100}). Dispatching Meta PartialPayment custom event.`
        );

        capiResult = await sendCapiPartialPayment({
          order: existingOrder,
          payment: verifiedPaymentRecord,
          installmentIndex,
          cumulativeVerifiedMinor,
          clientContext,
        });
      } else if (isFullyPaid) {
        // --- STANDARD EVENT: Purchase ---
        // Fires ONLY when cumulative verified payments satisfy 100% of the order total.
        // Value represents the COMPLETE order amount, NOT the installment amount.
        // Idempotency: Fires strictly once per order lifetime.
        console.log(
          `[Admin Verification] Verified FULL payment satisfaction for Order #${existingOrder.orderNumber} (Total: ₹${existingOrder.totalMinor / 100}). Dispatching Meta Purchase standard event.`
        );

        capiResult = await sendCapiPurchase({
          order: existingOrder,
          clientContext,
          lastPaymentId: verifiedPaymentRecord.id,
        });
      }
    }

    // 6. Update Order Status and Tracking
    // If order was partially paid, keep status CONFIRMED or as requested
    const targetOrderStatus = status && Object.values(OrderStatus).includes(status)
      ? status
      : isFullyPaid
      ? (existingOrder.status === 'PENDING' ? 'CONFIRMED' : existingOrder.status)
      : (status || existingOrder.status);

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: targetOrderStatus,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(trackingCarrier !== undefined ? { trackingCarrier } : {}),
        ...(trackingUrl !== undefined ? { trackingUrl } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: {
        items: true,
        payments: { orderBy: { createdAt: 'asc' } },
        metaEvents: true,
      },
    });

    // 7. Record Admin Audit Log
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.userId,
        action: 'UPDATE_ORDER_PAYMENT_VERIFICATION',
        targetEntity: 'Order',
        targetId: id,
        details: {
          previousStatus: existingOrder.status,
          newStatus: targetOrderStatus,
          cumulativeVerifiedPaise: cumulativeVerifiedMinor,
          totalOrderPaise: existingOrder.totalMinor,
          isFullyPaid,
          isPartiallyPaid,
          verifiedPaymentId: verifiedPaymentRecord?.id || null,
          capiDispatched: capiResult?.eventName || null,
          capiStatus: capiResult?.status || null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
      paymentState: {
        cumulativeVerifiedMinor,
        totalOrderMinor: existingOrder.totalMinor,
        remainingBalanceMinor: Math.max(0, existingOrder.totalMinor - cumulativeVerifiedMinor),
        isFullyPaid,
        isPartiallyPaid,
      },
      capi: capiResult,
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
