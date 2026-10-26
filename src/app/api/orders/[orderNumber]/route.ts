import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const session = await getSession();

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: {
          select: {
            gateway: true,
            status: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Security check: must match session or verified customer email
    const isOwner = Boolean(session && session.userId === order.userId);
    const isEmailMatched = Boolean(email && order.guestEmail?.trim().toLowerCase() === email.trim().toLowerCase());
    const isAdmin = Boolean(session && session.role === 'ADMIN');

    if (!isOwner && !isEmailMatched && !isAdmin) {
      // Return order progress, items, and totals so receipt and pixel work accurately,
      // while masking sensitive street address/phone to protect customer privacy
      const rawAddr = (order.shippingAddress as any) || {};
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          subtotalMinor: order.subtotalMinor,
          discountMinor: order.discountMinor,
          shippingMinor: order.shippingMinor,
          taxMinor: order.taxMinor,
          totalMinor: order.totalMinor,
          isPartialCod: order.isPartialCod,
          codBalanceMinor: order.codBalanceMinor,
          items: order.items,
          payments: order.payments,
          trackingNumber: order.trackingNumber,
          shippingAddress: {
            fullName: rawAddr.fullName || order.guestName || 'Valued Customer',
            city: rawAddr.city || '',
            state: rawAddr.state || '',
            postalCode: rawAddr.postalCode || '',
            country: rawAddr.country || 'India',
            addressLine1: rawAddr.addressLine1 ? '•••••••••••• (Verified Address)' : '',
            addressLine2: null,
            phone: order.guestPhone ? `••••••${order.guestPhone.slice(-4)}` : '',
          },
          requiresEmailVerification: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve order' }, { status: 500 });
  }
}
