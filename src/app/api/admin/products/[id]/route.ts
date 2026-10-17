import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { priceMinor, originalPriceMinor, stockCount, inStock, isFeatured } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(priceMinor !== undefined ? { priceMinor: Number(priceMinor) } : {}),
        ...(originalPriceMinor !== undefined ? { originalPriceMinor: Number(originalPriceMinor) } : {}),
        ...(stockCount !== undefined ? {
          stockCount: Number(stockCount),
          inStock: Number(stockCount) > 0,
        } : {}),
        ...(inStock !== undefined ? { inStock: Boolean(inStock) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.userId,
        action: 'UPDATE_PRODUCT',
        targetEntity: 'Product',
        targetId: id,
        details: body,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin product PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}
