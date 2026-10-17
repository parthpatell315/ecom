import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin products GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      title,
      slug,
      sku,
      tagline,
      subtitle,
      priceMinor,
      originalPriceMinor,
      categoryId,
      description,
      story,
      specs,
      stockCount,
      isFeatured,
      images,
    } = body;

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        sku,
        tagline: tagline || 'Design Masterpiece',
        subtitle: subtitle || null,
        priceMinor: Number(priceMinor),
        originalPriceMinor: originalPriceMinor ? Number(originalPriceMinor) : null,
        categoryId,
        description,
        story: story || null,
        specs: specs || {},
        stockCount: Number(stockCount) || 10,
        isFeatured: Boolean(isFeatured),
        inStock: Number(stockCount) > 0,
        images: {
          create: (images || []).map((img: string, idx: number) => ({
            url: img,
            displayOrder: idx,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.userId,
        action: 'CREATE_PRODUCT',
        targetEntity: 'Product',
        targetId: created.id,
        details: { title, sku, priceMinor },
      },
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin product create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
