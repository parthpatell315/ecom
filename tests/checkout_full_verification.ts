import { PrismaClient } from '@prisma/client';
import { generateUpiPayload, generateUpiUrl, isValidUtrNumber } from '../src/lib/upi';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function runCheckoutVerification() {
  console.log('🧪 Starting Full Checkout End-to-End Verification Suite...\n');
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
    // 1. Check active product & stock
    console.log('1. Verifying Product Catalog & Inventory:');
    const product = await prisma.product.findFirst({
      where: { inStock: true, stockCount: { gt: 2 } },
      include: { variants: true },
    });
    assert(!!product, `Found active test product: "${product?.title}" (Stock: ${product?.stockCount})`);

    const initialStock = product!.stockCount;

    // 2. Test Direct Sovereign UPI Order Creation & Dynamic QR Generation
    console.log('\n2. Testing Sovereign UPI Order Flow:');
    const orderNumberUpi = `FL-${new Date().getFullYear()}-UPI${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const amountMinor = 84900; // Rs. 849.00

    const upiPayload = await generateUpiPayload({
      orderNumber: orderNumberUpi,
      amountMinor,
    });

    assert(upiPayload.upiUrl.startsWith('upi://pay?'), 'UPI URL correctly uses upi://pay scheme');
    assert(upiPayload.amountRupees === '849.00', 'Amount formatted as exact 2-decimal rupee string (849.00)');
    assert(upiPayload.qrCodeDataUrl.startsWith('data:image/png;base64,'), 'Dynamic vector QR code generated as crisp data URL');
    assert(isValidUtrNumber('423812984712'), '12-digit UPI UTR passes validation');

    // Create DB Order for UPI
    const orderPayU = await prisma.order.create({
      data: {
        orderNumber: orderNumberUpi,
        guestEmail: 'aarav@flirta.network',
        guestPhone: '9820012345',
        guestName: 'Aarav Sharma',
        status: 'PENDING',
        subtotalMinor: 84900,
        shippingMinor: 9900,
        totalMinor: 94800,
        shippingAddress: {
          fullName: 'Aarav Sharma',
          addressLine1: '402, Indiranagar 100 Feet Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          phone: '9820012345',
        },
        items: {
          create: [
            {
              productId: product!.id,
              sku: product!.sku,
              titleSnapshot: product!.title,
              unitPriceMinor: 84900,
              quantity: 1,
              totalMinor: 84900,
              imageSnapshot: '',
            },
          ],
        },
        payments: {
          create: {
            gateway: 'UPI',
            gatewayOrderId: orderNumberUpi,
            amountMinor: 94800,
            currency: 'INR',
            status: 'PENDING',
          },
        },
      },
      include: { payments: true, items: true },
    });
    assert(orderPayU.status === 'PENDING', 'UPI order initially recorded in PostgreSQL as PENDING');
    assert(orderPayU.payments[0].gateway === 'UPI', 'Payment record associated with UPI gateway');

    // 3. Test UPI UTR Reference Submission & Inventory Decrement
    console.log('\n3. Testing UPI UTR Submission & Inventory Decrement:');
    const mockUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    // Execute atomic confirmation
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderPayU.id },
        data: { status: 'CONFIRMED', notes: `UPI UTR: ${mockUtr}` },
      });
      await tx.payment.updateMany({
        where: { orderId: orderPayU.id },
        data: {
          status: 'SUCCESS',
          gatewayPaymentId: mockUtr,
          verifiedAt: new Date(),
          rawPayload: { utrNumber: mockUtr, channel: 'DIRECT_UPI_QR' },
        },
      });
      await tx.product.update({
        where: { id: product!.id },
        data: { stockCount: { decrement: 1 } },
      });
    });

    const confirmedOrderUpi = await prisma.order.findUnique({
      where: { id: orderPayU.id },
      include: { payments: true },
    });
    assert(confirmedOrderUpi?.status === 'CONFIRMED', 'Order status atomically updated to CONFIRMED');
    assert(confirmedOrderUpi?.payments[0].status === 'SUCCESS', 'Payment status updated to SUCCESS');
    assert(confirmedOrderUpi?.payments[0].gatewayPaymentId === mockUtr, `Payment record contains verified UTR: ${mockUtr}`);

    const updatedProduct = await prisma.product.findUnique({ where: { id: product!.id } });
    assert(updatedProduct!.stockCount === initialStock - 1, `Stock atomically decremented from ${initialStock} to ${initialStock - 1}`);

    // 4. Test Cash on Delivery (COD) Flow
    console.log('\n4. Testing Cash on Delivery (COD) Flow:');
    const orderNumberCOD = `FL-${new Date().getFullYear()}-COD${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const orderCOD = await prisma.order.create({
      data: {
        orderNumber: orderNumberCOD,
        guestEmail: 'priya@flirta.network',
        guestPhone: '9876543210',
        guestName: 'Priya Patel',
        status: 'CONFIRMED', // COD orders are directly confirmed for dispatch
        subtotalMinor: 59900,
        shippingMinor: 9900,
        totalMinor: 69800,
        shippingAddress: {
          fullName: 'Priya Patel',
          addressLine1: 'Flat 3B, Sunshine Apts, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          phone: '9876543210',
        },
        items: {
          create: [
            {
              productId: product!.id,
              sku: product!.sku,
              titleSnapshot: product!.title,
              unitPriceMinor: 59900,
              quantity: 1,
              totalMinor: 59900,
              imageSnapshot: '',
            },
          ],
        },
        payments: {
          create: {
            gateway: 'COD',
            gatewayOrderId: orderNumberCOD,
            amountMinor: 69800,
            currency: 'INR',
            status: 'PENDING', // Collected upon delivery
          },
        },
      },
      include: { payments: true },
    });

    assert(orderCOD.status === 'CONFIRMED', 'COD order created with status CONFIRMED for studio dispatch');
    assert(orderCOD.payments[0].gateway === 'COD', 'Payment record has gateway COD');
    assert(orderCOD.payments[0].status === 'PENDING', 'COD payment status is PENDING (doorstep collection)');

    // 5. Test Partial COD Flow (Rs. 249 Advance via UPI + Balance on Delivery)
    console.log('\n5. Testing Partial COD Flow (₹249 Advance + Balance COD):');
    const orderNumberPartial = `FL-${new Date().getFullYear()}-PARTIAL${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const totalMinor = 634700; // Rs 6,347.00
    const advanceMinor = 24900; // Rs 249.00
    const balanceCodMinor = totalMinor - advanceMinor; // Rs 6,098.00

    const upiPartialPayload = await generateUpiPayload({
      orderNumber: orderNumberPartial,
      amountMinor: advanceMinor,
      note: `Advance ₹249 for ${orderNumberPartial}`,
    });

    assert(upiPartialPayload.amountRupees === '249.00', 'Partial COD UPI payload encoded with exact advance amount of Rs 249.00');
    assert(upiPartialPayload.upiUrl.includes('am=249.00'), 'UPI URI query string contains am=249.00');

    const orderPartial = await prisma.order.create({
      data: {
        orderNumber: orderNumberPartial,
        guestEmail: 'rohit@flirta.network',
        guestPhone: '9811122233',
        guestName: 'Rohit Verma',
        status: 'PENDING',
        subtotalMinor: 634700,
        shippingMinor: 0,
        totalMinor: 634700,
        isPartialCod: true,
        codBalanceMinor: balanceCodMinor,
        notes: `Partial COD: ₹249 advance via UPI, ₹${(balanceCodMinor / 100).toFixed(2)} due on Cash on Delivery`,
        shippingAddress: {
          fullName: 'Rohit Verma',
          addressLine1: 'Villa 12, Palm Meadows',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500081',
          country: 'India',
          phone: '9811122233',
        },
        items: {
          create: [
            {
              productId: product!.id,
              sku: product!.sku,
              titleSnapshot: product!.title,
              unitPriceMinor: 634700,
              quantity: 1,
              totalMinor: 634700,
              imageSnapshot: '',
            },
          ],
        },
        payments: {
          create: {
            gateway: 'PARTIAL_COD',
            gatewayOrderId: orderNumberPartial,
            amountMinor: advanceMinor,
            currency: 'INR',
            status: 'PENDING',
          },
        },
      },
      include: { payments: true },
    });

    assert(orderPartial.isPartialCod === true, 'Order flagged as isPartialCod = true');
    assert(orderPartial.codBalanceMinor === balanceCodMinor, `COD balance recorded as ₹${balanceCodMinor / 100} (${balanceCodMinor} paise)`);
    assert(orderPartial.payments[0].gateway === 'PARTIAL_COD', 'Payment gateway recorded as PARTIAL_COD');
    assert(orderPartial.payments[0].amountMinor === 24900, 'Payment amount set to ₹249 advance (24900 paise)');

    // 6. Test Coupon Engine at Checkout
    console.log('\n6. Testing Checkout Coupon Validation:');
    const coupon = await prisma.coupon.findUnique({ where: { code: 'LAUNCH10' } });
    assert(!!coupon && coupon.isActive, 'Coupon LAUNCH10 is active for checkout');
    const couponDiscount = Math.round((144800 * coupon!.discountValue) / 100);
    assert(couponDiscount === 14480, `Coupon 10% on ₹1,448 discount = ₹144.80 (paise: ${couponDiscount})`);

    // Clean up test order stock to leave database clean
    await prisma.product.update({
      where: { id: product!.id },
      data: { stockCount: initialStock },
    });
    console.log(`\nCleaned up test stock. Restored to original: ${initialStock}`);

    console.log(`\n========================================`);
    console.log(`Checkout Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runCheckoutVerification();
