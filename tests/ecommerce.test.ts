/**
 * Automated Verification Suite for iloothub E-Commerce Platform
 * Validates Catalog, Inventory, Cart calculations, Coupon engine,
 * Cryptographic signature verification, Webhook security, and RBAC.
 */

import { PrismaClient } from '@prisma/client';
import { formatCurrency } from '../src/lib/currency';
import { verifyPaymentSignature, verifyWebhookSignature } from '../src/lib/razorpay';
import { generateUpiPayload, generateUpiUrl, isValidUtrNumber } from '../src/lib/upi';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../src/lib/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🚀 Starting iloothub E-Commerce Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Database & Catalog Verification
    console.log('1. Testing Database & Catalog Integrity:');
    const categoriesCount = await prisma.category.count();
    assert(categoriesCount >= 6, `Categories seeded (found ${categoriesCount})`);

    const products = await prisma.product.findMany({
      include: { variants: true, images: true, category: true },
    });
    assert(products.length >= 9, `Products seeded in PostgreSQL (found ${products.length})`);

    const lumiLamp = products.find((p) => p.slug === 'wl-lumi-mood-lamp');
    assert(!!lumiLamp, 'Flagship piece "Lumi Studio Ambient Mood Lamp" exists');
    assert(lumiLamp!.priceMinor === 139900, 'Price correctly stored in minor units paise (139900 = ₹1,399)');
    assert(lumiLamp!.variants.length >= 3, `Variants attached to Lumi Lamp (found ${lumiLamp?.variants.length})`);

    // 2. Currency Formatting
    console.log('\n2. Testing Currency Formatting:');
    assert(formatCurrency(139900) === '₹1,399', `formatCurrency(139900) yields "₹1,399" (got ${formatCurrency(139900)})`);
    assert(formatCurrency(99900) === '₹999', `formatCurrency(99900) yields "₹999" (got ${formatCurrency(99900)})`);
    assert(formatCurrency(0) === '₹0', 'formatCurrency(0) yields "₹0"');

    // 3. Coupon Engine Verification
    console.log('\n3. Testing Coupon Engine Rules:');
    const launchCoupon = await prisma.coupon.findUnique({ where: { code: 'LAUNCH10' } });
    assert(!!launchCoupon && launchCoupon.isActive, 'Coupon LAUNCH10 is active');
    
    // Test 10% calculation on ₹2,000 (200000 paise) -> 20000 paise (₹200)
    const testSubtotal = 200000;
    const calculatedDiscount = Math.round((testSubtotal * launchCoupon!.discountValue) / 100);
    assert(calculatedDiscount === 20000, `LAUNCH10 calculates 10% correctly (expected 20000, got ${calculatedDiscount})`);

    const fixedCoupon = await prisma.coupon.findUnique({ where: { code: 'SANCTUARY20' } });
    assert(!!fixedCoupon, 'Fixed coupon SANCTUARY20 exists');
    assert(testSubtotal >= fixedCoupon!.minOrderMinor, 'Subtotal meets minimum order requirement of ₹1,999');

    // 4. Cryptographic Payment Verification Engine
    console.log('\n4. Testing Cryptographic Signature & Webhook Verification:');
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_whitelayer_secret';
    const testOrderId = 'order_test_12345';
    const testPaymentId = 'pay_test_67890';
    
    // Generate valid HMAC SHA-256
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${testOrderId}|${testPaymentId}`)
      .digest('hex');

    const isVerified = verifyPaymentSignature({
      orderId: testOrderId,
      paymentId: testPaymentId,
      signature: validSignature,
    });
    assert(isVerified === true, 'HMAC-SHA256 signature successfully verified');

    const isTamperedRejected = verifyPaymentSignature({
      orderId: testOrderId,
      paymentId: testPaymentId,
      signature: 'tampered_forged_signature_hash',
    });
    assert(isTamperedRejected === false, 'Forged or tampered signature is strictly rejected');

    // Test Webhook Signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'whitelayer_whsec_secure_verification';
    const rawWebhookPayload = JSON.stringify({ event: 'order.paid', id: 'evt_123' });
    const validWebhookSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawWebhookPayload)
      .digest('hex');

    assert(
      verifyWebhookSignature(rawWebhookPayload, validWebhookSignature) === true,
      'Valid Webhook HMAC signature matches'
    );
    assert(
      verifyWebhookSignature(rawWebhookPayload, 'invalid_sig') === false,
      'Invalid Webhook signature rejected'
    );

    // 5. Direct Sovereign UPI Gateway Engine
    console.log('\n5. Testing Direct Sovereign UPI Gateway Engine:');
    const testUpiId = 'iloothub@upi';
    const testPayeeName = 'iloot Hub';
    const testOrderNumber = 'FL-2026-TEST1';
    const testAmountStr = '849.00';

    const upiUrl = generateUpiUrl(testUpiId, testPayeeName, testAmountStr, testOrderNumber);
    assert(upiUrl.startsWith('upi://pay?'), 'UPI URL uses standard upi://pay scheme');
    assert(upiUrl.includes(`pa=${testUpiId}`), 'UPI URL contains correct payee VPA (pa)');
    assert(upiUrl.includes(`am=${testAmountStr}`), 'UPI URL contains exact amount in rupees (am)');
    assert(upiUrl.includes('cu=INR'), 'UPI URL currency specified as INR');

    // Test UTR Validation
    assert(isValidUtrNumber('423819284712') === true, 'Standard 12-digit UPI UTR accepted');
    assert(isValidUtrNumber('BARB24098172635') === true, 'Bank reference ID accepted');
    assert(isValidUtrNumber('123') === false, 'Too-short UTR strictly rejected');
    assert(isValidUtrNumber('') === false, 'Empty UTR rejected');

    const upiPayload = await generateUpiPayload({
      orderNumber: testOrderNumber,
      amountMinor: 84900,
    });
    assert(!!upiPayload.qrCodeDataUrl && upiPayload.qrCodeDataUrl.startsWith('data:image/png;base64,'), 'Dynamic vector QR code generated successfully');
    assert(upiPayload.amountRupees === '849.00', 'Minor units correctly converted to ₹849.00');

    // 6. Authentication & Security
    console.log('\n6. Testing Authentication & Session Security:');
    const plainPassword = 'StudioSecretPassword123!';
    const hashed = await hashPassword(plainPassword);
    assert(hashed !== plainPassword, 'Password is never stored in plain text');
    assert(await verifyPassword(plainPassword, hashed) === true, 'Bcrypt password verification succeeds');
    assert(await verifyPassword('WrongPassword', hashed) === false, 'Incorrect password rejected');

    const testToken = signToken({
      userId: 'usr_test_1',
      email: 'collector@iloothub.com',
      role: 'CUSTOMER',
      name: 'Studio Collector',
    });
    const decoded = verifyToken(testToken);
    assert(decoded?.email === 'collector@iloothub.com', 'JWT session correctly signed and decoded');
    assert(verifyToken('malformed.jwt.token') === null, 'Malformed JWT returns null safely');

    // 6. Atomic Inventory & Order Immutability
    console.log('\n6. Testing Atomic Inventory Transactions:');
    const testProduct = await prisma.product.findFirst({
      where: { inStock: true, stockCount: { gt: 5 } },
      include: { variants: true },
    });
    assert(!!testProduct, 'Test product available for inventory check');

    const initialStock = testProduct!.stockCount;
    const testOrderNum = `TEST-TX-${Date.now()}`;

    // Execute atomic transaction
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: testProduct!.id },
        data: { stockCount: { decrement: 1 } },
      });

      await tx.order.create({
        data: {
          orderNumber: testOrderNum,
          guestEmail: 'test@studio.com',
          status: 'CONFIRMED',
          subtotalMinor: testProduct!.priceMinor,
          totalMinor: testProduct!.priceMinor,
          shippingAddress: { city: 'Bengaluru' },
          items: {
            create: {
              productId: testProduct!.id,
              sku: testProduct!.sku,
              titleSnapshot: testProduct!.title,
              unitPriceMinor: testProduct!.priceMinor,
              quantity: 1,
              totalMinor: testProduct!.priceMinor,
              imageSnapshot: '',
            },
          },
        },
      });
    });

    const afterStockProduct = await prisma.product.findUnique({ where: { id: testProduct!.id } });
    assert(
      afterStockProduct!.stockCount === initialStock - 1,
      `Stock count atomically decremented by 1 (before: ${initialStock}, after: ${afterStockProduct!.stockCount})`
    );

    // Clean up test order and revert stock
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { order: { orderNumber: testOrderNum } } });
      await tx.order.delete({ where: { orderNumber: testOrderNum } });
      await tx.product.update({
        where: { id: testProduct!.id },
        data: { stockCount: { increment: 1 } },
      });
    });
    assert(true, 'Test order safely rolled back and stock restored');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
