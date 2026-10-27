import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { generateUpiPayload } from '@/lib/upi';
import { cookies } from 'next/headers';
import { DiscountType, PaymentGateway } from '@prisma/client';

const CART_COOKIE = 'flirta_cart_session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      paymentGateway = 'UPI', // Defaults to Direct Merchant UPI
      clientItems,
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

    // 2. Fetch current cart from server session/cookie
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

    // Fallback: Reconstitute order items from verified database products if clientItems passed
    let orderItemsData: any[] = [];
    if (cart && cart.items && cart.items.length > 0) {
      orderItemsData = cart.items;
    } else if (Array.isArray(clientItems) && clientItems.length > 0) {
      for (const ci of clientItems) {
        if (!ci.productId) continue;
        const prod = await prisma.product.findUnique({
          where: { id: ci.productId },
          include: { variants: true },
        });
        if (!prod) continue;
        const variant = ci.variantId ? prod.variants.find((v) => v.id === ci.variantId) || null : null;
        orderItemsData.push({
          productId: prod.id,
          variantId: variant?.id || null,
          quantity: Math.max(1, ci.quantity || 1),
          product: prod,
          variant,
        });
      }
    }

    if (orderItemsData.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    // 3. Compute strict server-validated pricing
    let subtotalMinor = 0;
    for (const item of orderItemsData) {
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

    // 5. Calculate shipping & COD courier fee
    // Flat ₹999 total: ₹0 shipping for both Prepaid UPI and Partial COD (₹249 advance + ₹750 doorstep balance)
    const shippingMinor = 0;
    const totalMinor = Math.max(0, subtotalMinor - discountMinor + shippingMinor);

    // 6. Generate unique order number: FL-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `FL-${year}-${randomHex}`;

    // 7. Branch by Payment Gateway
    if (paymentGateway === 'PARTIAL_COD') {
      const advanceMinor = 24900; // Rs. 249.00 advance via UPI
      const codBalanceMinor = Math.max(0, totalMinor - advanceMinor);

      const upiPayload = await generateUpiPayload({
        orderNumber,
        amountMinor: advanceMinor,
        note: `Advance ₹249 for ${orderNumber}`,
      });

      const partialCodNotes = `Partial COD: ₹249 advance via UPI, ₹${(codBalanceMinor / 100).toFixed(2)} due on Cash on Delivery`;
      const combinedNotes = notes ? `${notes} | ${partialCodNotes}` : partialCodNotes;

      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          ...(session?.userId ? { user: { connect: { id: session.userId } } } : {}),
          guestEmail: email,
          guestPhone: phone,
          guestName: name,
          status: 'PENDING',
          subtotalMinor,
          discountMinor,
          shippingMinor,
          taxMinor: 0,
          totalMinor,
          isPartialCod: true,
          codBalanceMinor,
          couponCode: validatedCoupon,
          shippingAddress,
          notes: combinedNotes,
          items: {
            create: orderItemsData.map((item) => {
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
              gateway: 'PARTIAL_COD',
              gatewayOrderId: orderNumber,
              amountMinor: advanceMinor,
              currency: 'INR',
              status: 'PENDING',
              rawPayload: {
                isPartialCod: true,
                advanceAmountMinor: advanceMinor,
                codBalanceMinor,
                totalOrderMinor: totalMinor,
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        gateway: 'PARTIAL_COD',
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        isPartialCod: true,
        amountMinor: advanceMinor,
        advanceAmountMinor: advanceMinor,
        codBalanceMinor,
        totalOrderMinor: totalMinor,
        upi: upiPayload,
        customerDetails: { name, email, phone },
      });
    }

    if (paymentGateway === 'UPI') {
      const upiPayload = await generateUpiPayload({
        orderNumber,
        amountMinor: totalMinor,
        note: `Order ${orderNumber}`,
      });

      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          ...(session?.userId ? { user: { connect: { id: session.userId } } } : {}),
          guestEmail: email,
          guestPhone: phone,
          guestName: name,
          status: 'PENDING',
          subtotalMinor,
          discountMinor,
          shippingMinor,
          taxMinor: 0,
          totalMinor,
          isPartialCod: false,
          codBalanceMinor: 0,
          couponCode: validatedCoupon,
          shippingAddress,
          notes: notes || null,
          items: {
            create: orderItemsData.map((item) => {
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
              gateway: 'UPI',
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
        gateway: 'UPI',
        orderId: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        isPartialCod: false,
        amountMinor: totalMinor,
        codBalanceMinor: 0,
        totalOrderMinor: totalMinor,
        upi: upiPayload,
        customerDetails: { name, email, phone },
      });
    }

    if (paymentGateway === 'COD') {
      // Cash on Delivery Order Creation
      const createdOrder = await prisma.$transaction(async (tx) => {
        const ord = await tx.order.create({
          data: {
            orderNumber,
            ...(session?.userId ? { user: { connect: { id: session.userId } } } : {}),
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
              create: orderItemsData.map((item) => {
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
        for (const item of orderItemsData) {
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
        ...(session?.userId ? { user: { connect: { id: session.userId } } } : {}),
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
          create: orderItemsData.map((item) => {
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
  } catch (error: any) {
    console.error('Checkout create-order error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Failed to initiate order',
    }, { status: 500 });
  }
}
