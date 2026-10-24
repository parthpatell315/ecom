import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const CART_COOKIE = 'flirta_cart_session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getOrCreateCartId(): Promise<string> {
  const session = await getSession();
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get(CART_COOKIE)?.value;

  if (session?.userId) {
    let userCart = await prisma.cart.findFirst({
      where: { userId: session.userId },
    });
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId: session.userId },
      });
    }
    return userCart.id;
  }

  if (guestSessionId) {
    let guestCart = await prisma.cart.findUnique({
      where: { sessionId: guestSessionId },
    });
    if (guestCart) return guestCart.id;
  }

  // Create new guest cart
  const newSessionId = `cart_${Math.random().toString(36).substring(2, 15)}`;
  const newCart = await prisma.cart.create({
    data: { sessionId: newSessionId },
  });

  cookieStore.set(CART_COOKIE, newSessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return newCart.id;
}

async function fetchFormattedCart(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    return { items: [], subtotalMinor: 0, totalItems: 0, qualifiesForFreeShipping: false };
  }

  let subtotalMinor = 0;
  let totalItems = 0;

  const formattedItems = cart.items.map((item) => {
    const unitPriceMinor = item.product.priceMinor + (item.variant?.priceAdjustmentMinor || 0);
    const itemTotalMinor = unitPriceMinor * item.quantity;
    subtotalMinor += itemTotalMinor;
    totalItems += item.quantity;

    const image = item.variant?.image || item.product.images[0]?.url || '';

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      title: item.product.title,
      variantName: item.variant?.name || null,
      colorHex: item.variant?.colorHex || null,
      unitPriceMinor,
      quantity: item.quantity,
      totalMinor: itemTotalMinor,
      image,
      inStock: item.variant ? item.variant.inStock : item.product.inStock,
      maxStock: item.variant ? item.variant.stockCount : item.product.stockCount,
    };
  });

  return {
    items: formattedItems,
    subtotalMinor,
    totalItems,
    freeShippingThresholdMinor: 149900,
    qualifiesForFreeShipping: subtotalMinor >= 149900,
  };
}

// GET: Fetch cart items and server-validated totals
export async function GET() {
  try {
    const cartId = await getOrCreateCartId();
    const cartData = await fetchFormattedCart(cartId);
    return NextResponse.json({ success: true, ...cartData });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve cart' }, { status: 500 });
  }
}

// POST: Add item to cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, variantId, quantity = 1 } = body;

    if (!productId || quantity < 1) {
      return NextResponse.json({ success: false, error: 'Invalid product or quantity' }, { status: 400 });
    }

    // Run product check and cart resolution concurrently
    const [product, cartId] = await Promise.all([
      prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      }),
      getOrCreateCartId(),
    ]);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Upsert or check existing
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId || null,
      },
      select: { id: true, quantity: true },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    const cartData = await fetchFormattedCart(cartId);
    return NextResponse.json({ success: true, ...cartData });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PATCH: Update quantity
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity < 0) {
      return NextResponse.json({ success: false, error: 'Invalid item or quantity' }, { status: 400 });
    }

    const cartId = await getOrCreateCartId();

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { id: cartItemId, cartId },
      });
    } else {
      await prisma.cartItem.updateMany({
        where: { id: cartItemId, cartId },
        data: { quantity },
      });
    }

    const cartData = await fetchFormattedCart(cartId);
    return NextResponse.json({ success: true, ...cartData });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    const cartId = await getOrCreateCartId();
    await prisma.cartItem.deleteMany({
      where: { id: cartItemId, cartId },
    });

    const cartData = await fetchFormattedCart(cartId);
    return NextResponse.json({ success: true, ...cartData });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove item' }, { status: 500 });
  }
}

