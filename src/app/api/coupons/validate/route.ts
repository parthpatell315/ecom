import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DiscountType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotalMinor } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive coupon code' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit has been reached' }, { status: 400 });
    }

    if (subtotalMinor < coupon.minOrderMinor) {
      const minRupees = Math.round(coupon.minOrderMinor / 100);
      return NextResponse.json({
        success: false,
        error: `Coupon requires a minimum order value of ₹${minRupees}`,
      }, { status: 400 });
    }

    let discountMinor = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountMinor = Math.round((subtotalMinor * coupon.discountValue) / 100);
      if (coupon.maxDiscountMinor && discountMinor > coupon.maxDiscountMinor) {
        discountMinor = coupon.maxDiscountMinor;
      }
    } else {
      discountMinor = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountMinor,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
