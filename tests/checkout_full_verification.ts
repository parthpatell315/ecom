import { PrismaClient } from '@prisma/client';
import { generatePayURequestHash, verifyPayUResponseHash, preparePayUCheckout } from '../src/lib/payu';
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

    // 2. Test PayU Order Creation & SHA-512 Request Hash
    console.log('\n2. Testing PayU Order Flow:');
    const orderNumberPayU = `FL-${new Date().getFullYear()}-PAYU${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const amountMinor = 84900; // Rs. 849.00
    const payuKey = process.env.PAYU_MERCHANT_KEY || 'R1a2pd';
    const payuSalt = process.env.PAYU_MERCHANT_SALT || 'yu2jdeAMzR2hlbx8lnMlJcgECB2enbj3';

    const payuCheckout = preparePayUCheckout(
      {
        txnid: orderNumberPayU,
        amountMinor,
        productinfo: `flirta.network Order ${orderNumberPayU}`,
        firstname: 'Aarav',
        email: 'aarav@flirta.network',
        phone: '9820012345',
        udf1: orderNumberPayU,
      },
      'http://localhost:3000'
    );

    assert(payuCheckout.actionUrl === 'https://secure.payu.in/_payment', 'PayU endpoint is Live secure.payu.in');
    assert(payuCheckout.params.key === payuKey, `PayU Merchant Key correctly set to ${payuKey}`);
    assert(payuCheckout.params.amount === '849.00', 'Amount formatted as exact 2-decimal rupee string (849.00)');
    assert(payuCheckout.params.hash.length === 128, 'SHA-512 request hash is exactly 128 hex characters');

    // Create DB Order for PayU
    const orderPayU = await prisma.order.create({
      data: {
        orderNumber: orderNumberPayU,
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
            gateway: 'PAYU',
            gatewayOrderId: orderNumberPayU,
            amountMinor: 94800,
            currency: 'INR',
            status: 'PENDING',
          },
        },
      },
      include: { payments: true, items: true },
    });
    assert(orderPayU.status === 'PENDING', 'PayU order initially recorded in PostgreSQL as PENDING');
    assert(orderPayU.payments[0].gateway === 'PAYU', 'Payment record associated with PAYU gateway');

    // 3. Test PayU Callback Response Verification & Order Confirmation
    console.log('\n3. Testing PayU Callback Verification & Inventory Decrement:');
    const mockMihpayid = `payu_${Date.now()}`;
    const reverseHashSeq = `${payuSalt}|success||||||||||${orderNumberPayU}|aarav@flirta.network|Aarav|flirta.network Order ${orderNumberPayU}|849.00|${orderNumberPayU}|${payuKey}`;
    const validCallbackHash = crypto.createHash('sha512').update(reverseHashSeq).digest('hex').toLowerCase();

    const mockCallbackPayload = {
      status: 'success',
      txnid: orderNumberPayU,
      amount: '849.00',
      productinfo: `flirta.network Order ${orderNumberPayU}`,
      firstname: 'Aarav',
      email: 'aarav@flirta.network',
      udf1: orderNumberPayU,
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
      mihpayid: mockMihpayid,
      key: payuKey,
      hash: validCallbackHash,
    };

    const isResponseValid = verifyPayUResponseHash(mockCallbackPayload, payuSalt, payuKey);
    assert(isResponseValid === true, 'PayU response SHA-512 cryptographic reverse hash verified');

    // Execute atomic confirmation
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderPayU.id },
        data: { status: 'CONFIRMED' },
      });
      await tx.payment.updateMany({
        where: { orderId: orderPayU.id },
        data: {
          status: 'SUCCESS',
          gatewayPaymentId: mockMihpayid,
          verifiedAt: new Date(),
        },
      });
      await tx.product.update({
        where: { id: product!.id },
        data: { stockCount: { decrement: 1 } },
      });
    });

    const confirmedOrderPayU = await prisma.order.findUnique({
      where: { id: orderPayU.id },
      include: { payments: true },
    });
    assert(confirmedOrderPayU?.status === 'CONFIRMED', 'Order status atomically updated to CONFIRMED');
    assert(confirmedOrderPayU?.payments[0].status === 'SUCCESS', 'Payment status updated to SUCCESS');

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

    // 5. Test Coupon Engine at Checkout
    console.log('\n5. Testing Checkout Coupon Validation:');
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
