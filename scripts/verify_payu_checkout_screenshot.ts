import { prisma } from '../src/lib/prisma';
import { execSync } from 'child_process';
import path from 'path';

async function main() {
  const product = await prisma.product.findFirst({
    where: { inStock: true },
    include: { variants: true },
  });

  if (!product) {
    console.error('No active product found');
    process.exit(1);
  }

  const testSessionId = 'visual_checkout_test_session';
  
  // Clean old test cart
  const existingCart = await prisma.cart.findUnique({
    where: { sessionId: testSessionId },
    include: { items: true },
  });

  if (existingCart) {
    await prisma.cartItem.deleteMany({ where: { cartId: existingCart.id } });
    await prisma.cart.delete({ where: { id: existingCart.id } });
  }

  // Create fresh cart with product
  const cart = await prisma.cart.create({
    data: {
      sessionId: testSessionId,
      items: {
        create: {
          productId: product.id,
          variantId: product.variants[0]?.id || null,
          quantity: 1,
        },
      },
    },
  });

  console.log(`Created test cart ${cart.id} for session ${testSessionId} with product: ${product.title}`);

  const screenshotPath = '/Users/parthpatel/.gemini/antigravity-ide/brain/ef8890db-a1ff-461d-af44-a49234dbe87b/checkout_payu_exclusive.png';

  // Using Chrome with headless and cookie
  // Note: Chrome CLI --screenshot doesn't support --set-cookie easily without DevTools protocol,
  // but we can pass a script or use curl / simple fetch or puppeteer / cdp if available.
  // Let's check if we can run Chrome with a local user profile or use CDP.
  console.log('Test cart ready in database!');
}

main().catch(console.error);
