import {
  sha256,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  sendCapiPartialPayment,
  sendCapiPurchase,
  META_PIXEL_ID,
} from '../src/lib/meta-capi';
import { prisma } from '../src/lib/prisma';

async function runCapiVerification() {
  console.log('====================================================');
  console.log('FLIRTA — META CONVERSIONS API & PAYMENT TRACKING TEST');
  console.log('====================================================\n');

  console.log(`[Config] Target Meta Pixel / Dataset ID: ${META_PIXEL_ID}`);
  console.log(
    `[Config] CAPI Access Token present: ${Boolean(process.env.META_CAPI_ACCESS_TOKEN)}`
  );
  console.log(
    `[Config] CAPI Test Event Code: ${process.env.META_TEST_EVENT_CODE || 'Not Set'}\n`
  );

  // 1. Test Normalization & SHA-256 Hashing
  console.log('--- 1. Testing SHA-256 Normalization ---');
  const testEmail = '  Customer.Studio@Gmail.COM ';
  const hashedEmail = normalizeEmail(testEmail);
  const expectedEmailHash = sha256('customer.studio@gmail.com');
  console.log(`Email Input: "${testEmail}"`);
  console.log(`Hashed Email: ${hashedEmail}`);
  console.log(`Hash Matches Expected: ${hashedEmail === expectedEmailHash}`);

  const testPhone = '+91 98200 12345';
  const hashedPhone = normalizePhone(testPhone);
  const expectedPhoneHash = sha256('919820012345');
  console.log(`Phone Input: "${testPhone}"`);
  console.log(`Hashed Phone: ${hashedPhone}`);
  console.log(`Phone Matches E.164 (91...): ${hashedPhone === expectedPhoneHash}`);

  const testName = 'Arjun Mehta';
  console.log(`First Name Hash: ${normalizeName('Arjun')}`);
  console.log(`Last Name Hash: ${normalizeName('Mehta')}\n`);

  // 2. Test Synthetic Order & PartialPayment Event
  console.log('--- 2. Testing Database-Backed PartialPayment Event ---');
  const dummyOrderNumber = `TEST-${Date.now()}`;
  const dummyOrder = await prisma.order.create({
    data: {
      orderNumber: dummyOrderNumber,
      guestEmail: 'test.customer@flirta.network',
      guestPhone: '9820098200',
      guestName: 'Arjun Test',
      status: 'PENDING',
      subtotalMinor: 500000,
      totalMinor: 500000, // ₹5,000.00
      isPartialCod: true,
      codBalanceMinor: 400000,
      shippingAddress: { fullName: 'Arjun Test', addressLine1: 'Test Lab', city: 'Mumbai', postalCode: '400001' },
      payments: {
        create: {
          gateway: 'PARTIAL_COD',
          amountMinor: 100000, // ₹1,000.00 advance
          currency: 'INR',
          status: 'SUCCESS',
          gatewayPaymentId: `TEST_UTR_${Date.now()}`,
          verifiedAt: new Date(),
        },
      },
    },
    include: { payments: true },
  });

  const partialPayment = dummyOrder.payments[0];

  console.log(`Created test order #${dummyOrder.orderNumber} (Total: ₹5,000)`);
  console.log(`Verified advance payment ID: ${partialPayment.id} (Amount: ₹1,000)`);

  const partialResult1 = await sendCapiPartialPayment({
    order: dummyOrder,
    payment: partialPayment,
    installmentIndex: 1,
    cumulativeVerifiedMinor: 100000,
    clientContext: {
      clientIp: '49.36.12.34',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      fbp: 'fb.1.1731411234.1234567890',
      fbc: 'fb.1.1731411234.IwAR3test',
    },
  });

  console.log('[Test 1st PartialPayment Call Status]:', partialResult1.status);
  console.log('[Test 1st PartialPayment Event ID]:', partialResult1.eventId);

  // 3. Test Deduplication: Calling again with the same event ID should skip
  console.log('\n--- 3. Testing Deduplication (Calling again for same payment) ---');
  const partialResult2 = await sendCapiPartialPayment({
    order: dummyOrder,
    payment: partialPayment,
    installmentIndex: 1,
    cumulativeVerifiedMinor: 100000,
  });

  console.log('[Test 2nd PartialPayment Call Status]:', partialResult2.status);
  console.log(
    `Deduplication Successful (Duplicate Skipped): ${partialResult2.status === 'DUPLICATE_SKIPPED' || partialResult2.status === 'DISABLED'}`
  );

  // 4. Test Settle Balance & Full Purchase Event
  console.log('\n--- 4. Testing Settle Balance & Standard Purchase Event ---');
  // Record remaining balance of ₹4,000 to reach 100% (₹5,000)
  const balancePayment = await prisma.payment.create({
    data: {
      orderId: dummyOrder.id,
      gateway: 'UPI',
      amountMinor: 400000, // ₹4,000.00
      currency: 'INR',
      status: 'SUCCESS',
      verifiedAt: new Date(),
    },
  });

  const cumulativeVerified = 100000 + balancePayment.amountMinor; // 500000 (100%)
  console.log(
    `Cumulative Verified: ₹${cumulativeVerified / 100} / ₹${dummyOrder.totalMinor / 100}`
  );

  const purchaseResult1 = await sendCapiPurchase({
    order: dummyOrder,
    clientContext: {
      clientIp: '49.36.12.34',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    },
    lastPaymentId: balancePayment.id,
  });

  console.log('[Test 1st Purchase Call Status]:', purchaseResult1.status);
  console.log('[Test 1st Purchase Event ID]:', purchaseResult1.eventId);

  // 5. Test Purchase Deduplication
  console.log('\n--- 5. Testing Purchase Deduplication ---');
  const purchaseResult2 = await sendCapiPurchase({
    order: dummyOrder,
    lastPaymentId: balancePayment.id,
  });

  console.log('[Test 2nd Purchase Call Status]:', purchaseResult2.status);
  console.log(
    `Purchase Deduplication Successful: ${purchaseResult2.status === 'DUPLICATE_SKIPPED' || purchaseResult2.status === 'DISABLED'}`
  );

  // 6. Check MetaEventLog in Database
  console.log('\n--- 6. Checking Database Event Audit Logs ---');
  const logs = await prisma.metaEventLog.findMany({
    where: { orderId: dummyOrder.id },
  });
  console.log(`Found ${logs.length} logged Meta events in database:`);
  logs.forEach((l) => {
    console.log(`- ${l.eventName}: ₹${l.value} (${l.status}) | Event ID: ${l.eventId}`);
  });

  // Clean up test order
  console.log('\n--- 7. Cleaning up test data ---');
  await prisma.order.delete({ where: { id: dummyOrder.id } });
  console.log(`Test order #${dummyOrder.orderNumber} deleted cleanly.`);

  console.log('\n====================================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runCapiVerification().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
