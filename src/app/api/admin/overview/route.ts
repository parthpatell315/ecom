import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalOrders,
      confirmedOrders,
      pendingOrders,
      shippedOrders,
      productsCount,
      lowStockCount,
      revenueResult,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.product.count(),
      prisma.product.count({ where: { stockCount: { lte: 5 } } }),
      prisma.order.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        _sum: {
          totalMinor: true,
        },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payments: { select: { gateway: true, status: true } },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenueMinor: revenueResult._sum.totalMinor || 0,
        totalOrders,
        confirmedOrders,
        pendingOrders,
        shippedOrders,
        productsCount,
        lowStockCount,
      },
      recentOrders,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin overview error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
