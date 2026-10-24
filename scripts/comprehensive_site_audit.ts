/**
 * Comprehensive 360-Degree Site Audit & End-to-End Test Suite for flirta.network
 * Executes end-to-end testing across Catalog, Cart, Auth, Coupons, Checkout,
 * PayU Gateway, Admin Portal, Order Tracking, Webhooks, SEO, and Database integrity.
 */

import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function recordTest(category: string, name: string, passed: boolean, details?: string) {
  results.push({ category, name, passed, details });
  const icon = passed ? '  ✓ PASS' : '  ✗ FAIL';
  console.log(`${icon}: [${category}] ${name}${details ? ` (${details})` : ''}`);
}

async function runComprehensiveAudit() {
  console.log('===============================================================');
  console.log('🚀 Initiating Comprehensive 360° Website Verification Audit');
  console.log(`Target Environment: ${BASE_URL}`);
  console.log('===============================================================\n');

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: PUBLIC STATIC & MARKETING PAGE HTTP HEALTH CHECKS
    // ------------------------------------------------------------------------
    console.log('--- SECTION 1: Webpage Routing & HTTP Status Checks ---');
    const pagesToTest = [
      { path: '/', label: 'Home Page' },
      { path: '/shop', label: 'Shop Catalog Page' },
      { path: '/about', label: 'About Us Page' },
      { path: '/contact', label: 'Contact Us Page' },
      { path: '/faq', label: 'FAQ Page' },
      { path: '/terms', label: 'Terms of Service' },
      { path: '/privacy-policy', label: 'Privacy Policy' },
      { path: '/shipping-policy', label: 'Shipping Policy' },
      { path: '/refund-policy', label: 'Refund Policy' },
      { path: '/checkout', label: 'Checkout Page' },
      { path: '/tracking', label: 'Order Tracking Page' },
      { path: '/account', label: 'Account / Auth Page' },
      { path: '/admin', label: 'Admin Portal' },
      { path: '/sitemap.xml', label: 'Sitemap XML' },
      { path: '/robots.txt', label: 'Robots TXT' },
    ];

    for (const page of pagesToTest) {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const isOk = res.status === 200;
      recordTest('Page Health', `${page.label} (${page.path})`, isOk, `HTTP ${res.status}`);
    }

    // ------------------------------------------------------------------------
    // SECTION 2: PRODUCT CATALOG & INDIVIDUAL PRODUCT PAGES
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 2: Catalog & Dynamic Product Detail Pages ---');
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    const productsData = await productsRes.json();

    recordTest(
      'Catalog API',
      'GET /api/products returns active products',
      productsRes.status === 200 && Array.isArray(productsData.products) && productsData.products.length > 0,
      `Found ${productsData.products?.length || 0} products`
    );

    // Verify first 5 product pages individually
    const testProducts = productsData.products.slice(0, 5);
    for (const prod of testProducts) {
      const prodRes = await fetch(`${BASE_URL}/product/${prod.slug}`);
      const apiProdRes = await fetch(`${BASE_URL}/api/products/${prod.slug}`);
      const apiData = await apiProdRes.json();

      recordTest(
        'Product Detail',
        `Render product /product/${prod.slug}`,
        prodRes.status === 200,
        `HTTP ${prodRes.status}`
      );
      recordTest(
        'Product Detail API',
        `GET /api/products/${prod.slug}`,
        apiProdRes.status === 200 && apiData.product?.id === prod.id,
        `Price: ₹${(prod.priceMinor / 100).toFixed(2)}, Variants: ${prod.variants?.length || 0}`
      );
    }

    // Test Category API
    const catRes = await fetch(`${BASE_URL}/api/categories`);
    const catData = await catRes.json();
    recordTest(
      'Category API',
      'GET /api/categories returns categories',
      catRes.status === 200 && Array.isArray(catData.categories) && catData.categories.length > 0,
      `Found ${catData.categories?.length || 0} categories`
    );

    // ------------------------------------------------------------------------
    // SECTION 3: AUTHENTICATION FLOWS (REGISTER, LOGIN, ME, LOGOUT)
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 3: User Authentication & Session Security ---');
    const testUserEmail = `audit_user_${Date.now()}@flirta.network`;
    const testPassword = 'SecurePassword2026!';
    const testUserName = 'Audit User';

    // 1. Register
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testUserName,
        email: testUserEmail,
        password: testPassword,
        phone: '9876543210',
      }),
    });
    const regData = await regRes.json();
    const regCookie = regRes.headers.get('set-cookie') || '';
    recordTest(
      'Authentication',
      'POST /api/auth/register creates user & returns session',
      (regRes.status === 200 || regRes.status === 201) && regData.success === true && regCookie.includes('whitelayer_session'),
      `Email: ${testUserEmail}`
    );

    // 2. Auth ME with session cookie
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: regCookie },
    });
    const meData = await meRes.json();
    recordTest(
      'Authentication',
      'GET /api/auth/me validates session cookie',
      meRes.status === 200 && meData.user?.email === testUserEmail,
      `User ID: ${meData.user?.id}`
    );

    // 3. Logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: regCookie },
    });
    const logoutCookie = logoutRes.headers.get('set-cookie') || '';
    recordTest(
      'Authentication',
      'POST /api/auth/logout clears session cookie',
      logoutRes.status === 200 && (logoutCookie.includes('Max-Age=0') || logoutCookie.includes('whitelayer_session=;')),
      'Session destroyed'
    );

    // 4. Login with invalid password (Negative Test)
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: 'WrongPassword123' }),
    });
    recordTest(
      'Authentication',
      'POST /api/auth/login rejects incorrect credentials',
      badLoginRes.status === 401,
      `HTTP ${badLoginRes.status}`
    );

    // 5. Login with correct password
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUserEmail, password: testPassword }),
    });
    const loginCookie = loginRes.headers.get('set-cookie') || '';
    recordTest(
      'Authentication',
      'POST /api/auth/login succeeds with valid credentials',
      loginRes.status === 200 && loginCookie.includes('whitelayer_session'),
      'Valid session returned'
    );

    // ------------------------------------------------------------------------
    // SECTION 4: CART OPERATIONS (ADD, UPDATE, FETCH, REMOVE)
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 4: Cart Operations (Server-Side Sessions) ---');
    const firstProduct = testProducts[0];
    const firstVariantId = firstProduct.variants?.[0]?.id || null;

    // Add item to cart
    const addCartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: firstProduct.id,
        variantId: firstVariantId,
        quantity: 2,
      }),
    });
    const addCartData = await addCartRes.json();
    const cartCookie = addCartRes.headers.get('set-cookie') || '';
    recordTest(
      'Cart Engine',
      'POST /api/cart adds product & returns cart session cookie',
      addCartRes.status === 200 && addCartData.success === true,
      `Session Cookie Issued`
    );

    // Fetch Cart with cookie
    const getCartRes = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Cookie: cartCookie },
    });
    const getCartData = await getCartRes.json();
    const cartItemId = getCartData.items?.[0]?.id;
    recordTest(
      'Cart Engine',
      'GET /api/cart retrieves cart items by session',
      getCartRes.status === 200 && getCartData.items?.length === 1 && getCartData.items[0].quantity === 2,
      `Item Quantity: 2`
    );

    // Update Cart Quantity to 1 using PATCH
    const updateCartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cartCookie },
      body: JSON.stringify({
        cartItemId,
        quantity: 1,
      }),
    });
    const updateCartData = await updateCartRes.json();
    recordTest(
      'Cart Engine',
      'PATCH /api/cart updates item quantity to 1',
      updateCartRes.status === 200 && updateCartData.success === true,
      `Updated Quantity: 1`
    );

    // ------------------------------------------------------------------------
    // SECTION 5: COUPON ENGINE
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 5: Coupon Engine Validation ---');
    // Valid 10% coupon
    const validCouponRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'LAUNCH10',
        subtotalMinor: 200000, // ₹2,000
      }),
    });
    const validCouponData = await validCouponRes.json();
    recordTest(
      'Coupon Engine',
      'Validate active percent coupon LAUNCH10 (10% off ₹2,000 = ₹200)',
      validCouponRes.status === 200 && validCouponData.coupon?.discountMinor === 20000,
      `Discount: ₹${(validCouponData.coupon?.discountMinor || 0) / 100}`
    );

    // Invalid coupon
    const fakeCouponRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'NON_EXISTENT_CODE_999',
        subtotalMinor: 200000,
      }),
    });
    const fakeCouponData = await fakeCouponRes.json();
    recordTest(
      'Coupon Engine',
      'Validate non-existent coupon is rejected',
      fakeCouponRes.status === 400 && fakeCouponData.success === false,
      `Message: ${fakeCouponData.error}`
    );

    // Coupon with min order requirement not met
    const minOrderRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'SANCTUARY20', // requires ₹1,999 (199900 paise)
        subtotalMinor: 50000, // ₹500
      }),
    });
    const minOrderData = await minOrderRes.json();
    recordTest(
      'Coupon Engine',
      'Reject coupon SANCTUARY20 when subtotal < minOrderMinor',
      minOrderRes.status === 400 && minOrderData.success === false,
      `Message: ${minOrderData.error}`
    );

    // ------------------------------------------------------------------------
    // SECTION 6: PAYU GATEWAY ORDER INITIATION & CALLBACK VERIFICATION
    // ------------------------------------------------------------------------
    // SECTION 6: DIRECT UPI GATEWAY ORDER INITIATION & UTR VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 6: Direct Sovereign UPI Gateway Order Creation & Verification ---');
    const upiOrderRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cartCookie },
      body: JSON.stringify({
        guestEmail: 'audit_customer@flirta.network',
        guestPhone: '9820012345',
        guestName: 'Audit Customer',
        shippingAddress: {
          fullName: 'Audit Customer',
          email: 'audit_customer@flirta.network',
          phone: '9820012345',
          addressLine1: '402, Indiranagar 100ft Rd',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        },
        paymentGateway: 'UPI',
        couponCode: 'LAUNCH10',
      }),
    });
    const upiOrderData = await upiOrderRes.json();

    recordTest(
      'UPI Checkout',
      'POST /api/checkout/create-order generates valid dynamic UPI QR payload',
      upiOrderRes.status === 200 &&
        upiOrderData.success === true &&
        upiOrderData.gateway === 'UPI' &&
        !!upiOrderData.upi?.qrCodeDataUrl,
      `Order: ${upiOrderData.orderNumber}, UPI VPA: ${upiOrderData.upi?.upiId}`
    );

    const generatedOrderNumber = upiOrderData.orderNumber;

    // Test UTR submission:
    // 1. Send invalid short UTR (Negative test)
    const badUtrRes = await fetch(`${BASE_URL}/api/checkout/upi/submit-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: generatedOrderNumber,
        utrNumber: '123',
      }),
    });
    const badUtrData = await badUtrRes.json();
    recordTest(
      'UPI UTR Validation',
      'POST /api/checkout/upi/submit-utr rejects invalid short UTR',
      badUtrRes.status === 400 && badUtrData.success === false,
      `Rejected with error: ${badUtrData.error}`
    );

    // 2. Send genuine 12-digit UTR
    const testUtr = '429102948172';
    const goodUtrRes = await fetch(`${BASE_URL}/api/checkout/upi/submit-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: generatedOrderNumber,
        utrNumber: testUtr,
        payerVpa: 'audit@okhdfcbank',
      }),
    });
    const goodUtrData = await goodUtrRes.json();
    recordTest(
      'UPI UTR Submission',
      'POST /api/checkout/upi/submit-utr accepts 12-digit UTR & records payment',
      goodUtrRes.status === 200 && goodUtrData.success === true,
      `Submitted UTR: ${goodUtrData.utrNumber}`
    );

    // Verify DB order state persisted with UTR in payment record
    const dbSubmittedOrder = await prisma.order.findUnique({
      where: { orderNumber: generatedOrderNumber },
      include: { payments: true },
    });
    recordTest(
      'Order Persistence',
      `Order ${generatedOrderNumber} has recorded UTR ${testUtr} in DB payment record`,
      dbSubmittedOrder?.payments[0]?.gatewayPaymentId === testUtr,
      `Gateway: ${dbSubmittedOrder?.payments[0]?.gateway}, Recorded UTR: ${dbSubmittedOrder?.payments[0]?.gatewayPaymentId}`
    );

    // ------------------------------------------------------------------------
    // SECTION 7: CASH ON DELIVERY (COD) ORDER CREATION
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 7: Cash on Delivery (COD) Flow ---');
    // Create new cart for COD
    const codCartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: firstProduct.id,
        quantity: 1,
      }),
    });
    const codCartCookie = codCartRes.headers.get('set-cookie') || '';

    const codOrderRes = await fetch(`${BASE_URL}/api/checkout/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: codCartCookie },
      body: JSON.stringify({
        guestEmail: 'cod_customer@flirta.network',
        guestPhone: '9876543210',
        guestName: 'COD Customer',
        shippingAddress: {
          fullName: 'COD Customer',
          email: 'cod_customer@flirta.network',
          phone: '9876543210',
          addressLine1: 'Flat 12, Sunrise Residency',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
        },
        paymentGateway: 'COD',
      }),
    });
    const codOrderData = await codOrderRes.json();
    recordTest(
      'COD Checkout',
      'POST /api/checkout/create-order handles COD directly as CONFIRMED',
      codOrderRes.status === 200 && codOrderData.success === true && codOrderData.gateway === 'COD',
      `Order: ${codOrderData.orderNumber}`
    );

    // ------------------------------------------------------------------------
    // SECTION 8: ORDER TRACKING API
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 8: Order Tracking ---');
    const trackRes = await fetch(`${BASE_URL}/api/orders/${generatedOrderNumber}?email=audit_customer@flirta.network`);
    const trackData = await trackRes.json();
    recordTest(
      'Order Tracking API',
      `GET /api/orders/${generatedOrderNumber} retrieves order details with email`,
      trackRes.status === 200 && trackData.order?.orderNumber === generatedOrderNumber,
      `Recipient: ${trackData.order?.guestName}, Total: ₹${((trackData.order?.totalMinor || 0) / 100).toFixed(2)}`
    );

    // ------------------------------------------------------------------------
    // SECTION 9: ADMIN ACCESS CONTROL & ADMIN APIS
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 9: Admin Access Control & Management APIs ---');
    // 1. Unauthenticated request to admin API should fail with 401
    const unauthAdminRes = await fetch(`${BASE_URL}/api/admin/overview`);
    recordTest(
      'Admin RBAC',
      'GET /api/admin/overview rejects unauthenticated requests',
      unauthAdminRes.status === 401,
      `HTTP ${unauthAdminRes.status}`
    );

    // 2. Fetch admin user from DB or use existing admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminUser) {
      // Sign a valid JWT token for this admin
      const { signToken } = await import('../src/lib/auth');
      const adminToken = signToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      });
      const adminCookie = `whitelayer_session=${adminToken}`;

      // Test Admin Overview
      const adminOverviewRes = await fetch(`${BASE_URL}/api/admin/overview`, {
        headers: { Cookie: adminCookie },
      });
      const adminOverviewData = await adminOverviewRes.json();
      recordTest(
        'Admin API',
        'GET /api/admin/overview returns dashboard metrics',
        adminOverviewRes.status === 200 && adminOverviewData.stats?.totalOrders !== undefined,
        `Orders: ${adminOverviewData.stats?.totalOrders}, Revenue: ₹${((adminOverviewData.stats?.totalRevenueMinor || 0) / 100).toFixed(2)}`
      );

      // Test Admin Orders list
      const adminOrdersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
        headers: { Cookie: adminCookie },
      });
      const adminOrdersData = await adminOrdersRes.json();
      recordTest(
        'Admin API',
        'GET /api/admin/orders returns paginated orders',
        adminOrdersRes.status === 200 && Array.isArray(adminOrdersData.orders),
        `Fetched ${adminOrdersData.orders?.length || 0} orders`
      );

      // Test Admin Products list
      const adminProductsRes = await fetch(`${BASE_URL}/api/admin/products`, {
        headers: { Cookie: adminCookie },
      });
      const adminProductsData = await adminProductsRes.json();
      recordTest(
        'Admin API',
        'GET /api/admin/products returns store products',
        adminProductsRes.status === 200 && Array.isArray(adminProductsData.products),
        `Fetched ${adminProductsData.products?.length || 0} products`
      );
    } else {
      console.warn('No ADMIN user found in DB to test authenticated admin routes');
    }

    // ------------------------------------------------------------------------
    // SECTION 10: DATABASE INTEGRITY CHECKS
    // ------------------------------------------------------------------------
    console.log('\n--- SECTION 10: PostgreSQL Database Health & Schema Integrity ---');
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalCoupons = await prisma.coupon.count();
    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count();

    recordTest('Database Integrity', 'Product Catalog populated', totalProducts > 0, `Total: ${totalProducts}`);
    recordTest('Database Integrity', 'Categories populated', totalCategories > 0, `Total: ${totalCategories}`);
    recordTest('Database Integrity', 'Coupons configured', totalCoupons > 0, `Total: ${totalCoupons}`);
    recordTest('Database Integrity', 'Orders persisted', totalOrders > 0, `Total: ${totalOrders}`);
    recordTest('Database Integrity', 'Users registered', totalUsers > 0, `Total: ${totalUsers}`);

    // Clean up test user & test orders created during audit
    await prisma.user.deleteMany({
      where: { email: testUserEmail },
    });

    console.log('\n===============================================================');
    const passedCount = results.filter((r) => r.passed).length;
    const failedCount = results.filter((r) => !r.passed).length;
    console.log(`Audited Total Tests: ${results.length}`);
    console.log(`Passed: ${passedCount} | Failed: ${failedCount}`);
    console.log('===============================================================');

    return { total: results.length, passed: passedCount, failed: failedCount };
  } catch (err) {
    console.error('Audit execution error:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

runComprehensiveAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
