import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { preparePayUCheckout } from '@/lib/payu';
import { cookies } from 'next/headers';
import { DiscountType, PaymentGateway } from '@prisma/client';

const CART_COOKIE = 'flirta_cart_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      guestEmail,
      guestPhone,
      guestName,
      shippingAddress,
      couponCode,
      notes,
      paymentGateway = 'PAYU', // Defaults to PayU
    } = body;

    // 1. Basic validation
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json({ success: false, error: 'Complete shipping address is required' }, { status: 400 });
    }

    const email = guestEmail || shippingAddress.email;
    const phone = guestPhone || shippingAddress.phone;
    const name = guestName || shippingAddress.fullName;

    if (!email || !phone) {
      return NextResponse.json({ success: false, error: 'Email and phone number are required' }, { status: 400 });
    }

    // 2. Fetch current cart
    const session = await getSession();
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get(CART_COOKIE)?.value;

    let cart = null;
    if (session?.userId) {
      cart = await prisma.cart.findFirst({
        where: { userId: session.userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    } else if (guestSessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId: guestSessionId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    }

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    // 3. Compute strict server-validated pricing
    let subtotalMinor = 0;
    for (const item of cart.items) {
      const stock = item.variant ? item.variant.stockCount : item.product.stockCount;
      if (stock < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Item "${item.product.title}" is out of stock or insufficient inventory`,
        }, { status: 400 });
      }

      const unitPrice = item.product.priceMinor + (item.variant?.priceAdjustmentMinor || 0);
      subtotalMinor += unitPrice * item.quantity;
    }

    // 4. Validate coupon if provided
    let discountMinor = 0;
    let validatedCoupon = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive && (!coupon.expiresAt || new Date() <= coupon.expiresAt)) {
        if (subtotalMinor >= coupon.minOrderMinor) {
          if (coupon.discountType === DiscountType.PERCENTAGE) {
            discountMinor = Math.round((subtotalMinor * coupon.discountValue) / 100);
            if (coupon.maxDiscountMinor && discountMinor > coupon.maxDiscountMinor) {
              discountMinor = coupon.maxDiscountMinor;
            }
          } else {
            discountMinor = coupon.discountValue;
          }
          validatedCoupon = coupon.code;
        }
      }
    }

    // 5. Calculate shipping fee (Free if subtotal >= ₹1,499)
    const shippingMinor = subtotalMinor >= 149900 ? 0 : 9900;
    const totalMinor = Math.max(0, subtotalMinor - discountMinor + shippingMinor);

    // 6. Generate unique order number: FL-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `FL-${year}-${randomHex}`;

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 7. Branch by Payment Gateway
    if (paymentGateway === 'PAYU') {
      const payuPayload = preparePayUCheckout(
        {
          txnid: orderNumber,
          amountMinor: totalMinor,
          productinfo: `flirta.network Order ${orderNumber}`,
          firstname: name.split(' ')[0] || 'Customer',
          email,
          phone,
          udf1: orderNumber,
        },
        appBaseUrl
      );

      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: session?.userId || null,
          guestEmail: email,
          guestPhone: phone,
          guestName: name,
          status: 'PENDING',
          subtotalMinor,
          discountMinor,
          shippingMinor,
          taxMinor: 0,
          totalMinor,
          couponCode: validatedCoupon,
          shippingAddress,
          notes: notes || null,
          items: {
            create: cart.items.map((item) => {
              const unitPrice = item.product.priceMinor + (item.variant?.priceAdjustmentMinor || 0);
              return {
                productId: item.productId,
                variantId: item.variantId,
                sku: item.variant?.sku || item.product.sku,
                titleSnapshot: item.product.title,
                variantNameSnapshot: item.variant?.name || null,
                unitPriceMinor: unitPrice,
                quantity: item.quantity,
                totalMinor: unitPrice * item.quantity,
                imageSnapshot: item.variant?.image || '',
              };
            }),
          },
          payments: {
            create: {
              gateway: 'PAYU',
              gatewayOrderId: orderNumber,
              amountMinor: totalMinor,
              currency: 'INR',
              status: 'PENDING',
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        gateway: 'PAYU',
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        amountMinor: totalMinor,
        payu: payuPayload,
        customerDetails: { name, email, phone },
      });
    }

    if (paymentGateway === 'COD') {
      // Cash on Delivery Order Creation
      const createdOrder = await prisma.$transaction(async (tx) => {
        const ord = await tx.order.create({
          data: {
            orderNumber,
            userId: session?.userId || null,
            guestEmail: email,
            guestPhone: phone,
            guestName: name,
            status: 'CONFIRMED', // Confirmed directly for COD
            subtotalMinor,
            discountMinor,
            shippingMinor,
            taxMinor: 0,
            totalMinor,
            couponCode: validatedCoupon,
            shippingAddress,
            notes: notes || null,
            items: {
              create: cart.items.map((item) => {
                const unitPrice = item.product.priceMinor + (item.variant?.priceAdjustmentMinor || 0);
                return {
                  productId: item.productId,
                  variantId: item.variantId,
                  sku: item.variant?.sku || item.product.sku,
                  titleSnapshot: item.product.title,
                  variantNameSnapshot: item.variant?.name || null,
                  unitPriceMinor: unitPrice,
                  quantity: item.quantity,
                  totalMinor: unitPrice * item.quantity,
                  imageSnapshot: item.variant?.image || '',
                };
              }),
            },
            payments: {
              create: {
                gateway: 'COD',
                gatewayOrderId: orderNumber,
                amountMinor: totalMinor,
                currency: 'INR',
                status: 'PENDING', // Will be collected upon courier delivery
              },
            },
          },
        });

        // Decrement inventory
        for (const item of cart.items) {
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

        return ord;
      });

      // Clear cart
      cookieStore.delete(CART_COOKIE);

      return NextResponse.json({
        success: true,
        gateway: 'COD',
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        amountMinor: totalMinor,
      });
    }

    // Default to RAZORPAY if requested
    const gatewayOrder = await createRazorpayOrder({
      amountMinor: totalMinor,
      currency: 'INR',
      receipt: orderNumber,
      notes: { orderNumber, customerEmail: email },
    });

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.userId || null,
        guestEmail: email,
        guestPhone: phone,
        guestName: name,
        status: 'PENDING',
        subtotalMinor,
        discountMinor,
        shippingMinor,
        taxMinor: 0,
        totalMinor,
        couponCode: validatedCoupon,
        shippingAddress,
        notes: notes || null,
        items: {
          create: cart.items.map((item) => {
            const unitPrice = item.product.priceMinor + (item.variant?.priceAdjustmentMinor || 0);
            return {
              productId: item.productId,
              variantId: item.variantId,
              sku: item.variant?.sku || item.product.sku,
              titleSnapshot: item.product.title,
              variantNameSnapshot: item.variant?.name || null,
              unitPriceMinor: unitPrice,
              quantity: item.quantity,
              totalMinor: unitPrice * item.quantity,
              imageSnapshot: item.variant?.image || '',
            };
          }),
        },
        payments: {
          create: {
            gateway: 'RAZORPAY',
            gatewayOrderId: gatewayOrder.gatewayOrderId,
            amountMinor: totalMinor,
            currency: 'INR',
            status: 'PENDING',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      gateway: 'RAZORPAY',
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      gatewayOrderId: gatewayOrder.gatewayOrderId,
      amountMinor: totalMinor,
      keyId: gatewayOrder.keyId,
      customerDetails: { name, email, phone },
    });
  } catch (error) {
    console.error('Checkout create-order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to initiate order' }, { status: 500 });
  }
}
