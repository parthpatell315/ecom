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
    const isOwner = session && session.userId === order.userId;
    const isEmailMatched = email && order.guestEmail?.toLowerCase() === email.toLowerCase();
    const isAdmin = session && session.role === 'ADMIN';

    if (!isOwner && !isEmailMatched && !isAdmin) {
      // Return redacted info if email verification is pending
      return NextResponse.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          itemCount: order.items.length,
          requiresEmailVerification: true,
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
