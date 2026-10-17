import crypto from 'crypto';

/**
 * PayU India Gateway Integration Library
 * Supports SHA-512 cryptographic request & reverse response hash calculation,
 * Live / Test environment switching, and payment callback verification.
 */

const KEY = process.env.PAYU_MERCHANT_KEY || 'R1a2pd';
const SALT = process.env.PAYU_MERCHANT_SALT || 'yu2jdeAMzR2hlbx8lnMlJcgECB2enbj3';
const ENV = process.env.PAYU_ENV || 'prod';

export const PAYU_PAYMENT_URL =
  ENV === 'prod' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment';

export interface PayUOrderParams {
  txnid: string;
  amountMinor: number; // in paise
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl?: string;
  furl?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PreparedPayUPayload {
  actionUrl: string;
  params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    service_provider: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
  };
}

/**
 * Calculates PayU SHA-512 Request Hash:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export function generatePayURequestHash(
  txnid: string,
  amountInRupees: string,
  productinfo: string,
  firstname: string,
  email: string,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = '',
  key = KEY,
  salt = SALT
): string {
  const hashSequence = `${key}|${txnid}|${amountInRupees}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();
}

/**
 * Verifies PayU Response (Reverse Hash):
 * With additional charges:
 * sha512(additionalCharges|salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 *
 * Without additional charges:
 * sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  payload: Record<string, any>,
  salt = SALT,
  key = KEY
): boolean {
  const {
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    additionalCharges,
    hash: receivedHash,
  } = payload;

  if (!receivedHash || !status || !txnid || !amount) {
    return false;
  }

  let hashSequence = '';
  if (additionalCharges) {
    hashSequence = `${additionalCharges}|${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    hashSequence = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }

  const calculatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex').toLowerCase();
  return calculatedHash === String(receivedHash).toLowerCase();
}

/**
 * Prepares the complete PayU submission payload including cryptographic hash and URLs.
 */
export function preparePayUCheckout(
  params: PayUOrderParams,
  appBaseUrl: string
): PreparedPayUPayload {
  const amountInRupees = (params.amountMinor / 100).toFixed(2);
  const cleanFirstname = params.firstname.trim().replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50) || 'Customer';
  const cleanEmail = params.email.trim();
  const cleanPhone = params.phone.replace(/[^0-9]/g, '').slice(-10);
  const cleanProductInfo = params.productinfo.replace(/[^a-zA-Z0-9 -]/g, '').substring(0, 100);

  const defaultCallback = `${appBaseUrl}/api/checkout/payu/callback`;
  const surl = params.surl || defaultCallback;
  const furl = params.furl || defaultCallback;

  const udf1 = params.udf1 || '';
  const udf2 = params.udf2 || '';
  const udf3 = params.udf3 || '';
  const udf4 = params.udf4 || '';
  const udf5 = params.udf5 || '';

  const hash = generatePayURequestHash(
    params.txnid,
    amountInRupees,
    cleanProductInfo,
    cleanFirstname,
    cleanEmail,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    KEY,
    SALT
  );

  return {
    actionUrl: PAYU_PAYMENT_URL,
    params: {
      key: KEY,
      txnid: params.txnid,
      amount: amountInRupees,
      productinfo: cleanProductInfo,
      firstname: cleanFirstname,
      email: cleanEmail,
      phone: cleanPhone,
      surl,
      furl,
      hash,
      service_provider: 'payu_paisa',
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    },
  };
}
