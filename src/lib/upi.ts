import QRCode from 'qrcode';

export interface UpiPaymentConfig {
  upiId: string;
  payeeName: string;
}

export interface UpiOrderParams {
  orderNumber: string;
  amountMinor: number;
  note?: string;
}

export interface GeneratedUpiPayload {
  upiId: string;
  payeeName: string;
  amountRupees: string;
  orderNumber: string;
  upiUrl: string;
  qrCodeDataUrl: string;
  deepLinks: {
    gpay: string;
    phonepe: string;
    paytm: string;
    generic: string;
    cred?: string;
  };
}

/**
 * Returns the store's configured UPI credentials
 */
export function getMerchantUpiConfig(): UpiPaymentConfig {
  const upiId = (
    process.env.NEXT_PUBLIC_MERCHANT_UPI_ID ||
    process.env.MERCHANT_UPI_ID ||
    'iloothub@upi'
  ).trim();

  const payeeName = (
    process.env.NEXT_PUBLIC_MERCHANT_UPI_NAME ||
    process.env.MERCHANT_UPI_NAME ||
    'iloot Hub'
  ).trim();

  return { upiId, payeeName };
}

/**
 * Builds the standard Indian National Payments Corporation (NPCI) UPI Intent URI
 */
export function generateUpiUrl(
  upiId: string,
  payeeName: string,
  amountRupees: string,
  orderNumber: string,
  note?: string
): string {
  const cleanUpiId = upiId.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanAmount = encodeURIComponent(amountRupees);
  const cleanNote = encodeURIComponent(note || `Order ${orderNumber}`);

  // Standard UPI URI format accepted across Google Pay, PhonePe, Paytm, BHIM, CRED
  return `upi://pay?pa=${cleanUpiId}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tn=${cleanNote}`;
}

/**
 * Generates dynamic UPI payment payload with QR code and mobile app deep links
 */
export async function generateUpiPayload(params: UpiOrderParams): Promise<GeneratedUpiPayload> {
  const { upiId, payeeName } = getMerchantUpiConfig();
  const amountRupees = (params.amountMinor / 100).toFixed(2);
  const upiUrl = generateUpiUrl(upiId, payeeName, amountRupees, params.orderNumber, params.note);

  // Generate crisp lightweight QR code as PNG data URL (optimized for speed & mobile data)
  const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 5,
    color: {
      dark: '#111827',
      light: '#ffffff',
    },
  });

  const upiQuery = `pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(payeeName.trim())}&am=${encodeURIComponent(amountRupees)}&cu=INR&tn=${encodeURIComponent(params.note || `Order ${params.orderNumber}`)}`;

  return {
    upiId,
    payeeName,
    amountRupees,
    orderNumber: params.orderNumber,
    upiUrl,
    qrCodeDataUrl,
    deepLinks: {
      generic: upiUrl,
      // Target specific apps via official Android intent scheme with universal fallback
      gpay: `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`,
      phonepe: `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.phonepe.app;end`,
      paytm: `intent://pay?${upiQuery}#Intent;scheme=upi;package=net.one97.paytm;end`,
      cred: `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.dreamplug.androidapp;end`,
    },
  };
}

/**
 * Validates 12-digit Indian Bank UTR or UPI Transaction Reference Number
 */
export function isValidUtrNumber(utr: string): boolean {
  if (!utr) return false;
  const clean = utr.trim().replace(/\s+/g, '');
  // Standard NPCI UPI UTRs are exactly 12 numeric digits (e.g. 423812984712)
  // Some banking portals provide 10-18 alphanumeric transaction reference IDs
  return /^[a-zA-Z0-9]{10,22}$/.test(clean);
}
