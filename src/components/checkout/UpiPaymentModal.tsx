'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
  Check,
  Truck,
  IndianRupee,
  QrCode,
  X,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface UpiPaymentModalProps {
  orderNumber: string;
  amountMinor: number;
  totalOrderMinor?: number;
  isPartialCod?: boolean;
  codBalanceMinor?: number;
  customerEmail?: string;
  customerPhone?: string;
  upiPayload: {
    upiId: string;
    payeeName: string;
    amountRupees: string;
    upiUrl: string;
    qrCodeDataUrl: string;
    deepLinks: {
      generic: string;
      gpay: string;
      phonepe: string;
      paytm: string;
      cred?: string;
      ios?: {
        gpay: string;
        phonepe: string;
        paytm: string;
        cred: string;
        generic: string;
      };
    };
  };
  onClose?: () => void;
}

export function UpiPaymentModal({
  orderNumber,
  amountMinor,
  totalOrderMinor,
  isPartialCod = false,
  codBalanceMinor = 0,
  customerEmail,
  customerPhone,
  upiPayload,
  onClose,
}: UpiPaymentModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'1tap' | 'qr'>('1tap');
  const [utrNumber, setUtrNumber] = useState('');
  const [payerVpa, setPayerVpa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [userReturnedFromApp, setUserReturnedFromApp] = useState(false);
  const [selectedQrType, setSelectedQrType] = useState<'dynamic' | 'paytm'>('dynamic');

  // Auto-select QR on Desktop & auto-detect customer returning from UPI app
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 640) {
      setActiveTab('qr');
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && hasInitiatedPayment) {
        setUserReturnedFromApp(true);
      }
    };

    const handleFocus = () => {
      if (hasInitiatedPayment) {
        setUserReturnedFromApp(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [hasInitiatedPayment]);

  // Robust UPI trigger supporting Android intents, iOS direct app schemes, and universal fallback
  const triggerUpiApp = (app: 'gpay' | 'phonepe' | 'paytm' | 'cred' | 'generic') => {
    setHasInitiatedPayment(true);
    try {
      const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768 && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isDesktop) {
        setActiveTab('qr');
        return;
      }

      const upiQuery = `pa=${encodeURIComponent(upiPayload.upiId.trim())}&pn=${encodeURIComponent(upiPayload.payeeName.trim())}&am=${encodeURIComponent(upiPayload.amountRupees)}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`;

      let targetUrl = upiPayload.upiUrl;

      if (isIOS) {
        // Direct iOS URL schemes avoid iOS opening WhatsApp Pay when customer wanted Google Pay/PhonePe/Paytm
        switch (app) {
          case 'gpay':
            targetUrl = upiPayload.deepLinks?.ios?.gpay || `gpay://upi/pay?${upiQuery}`;
            break;
          case 'phonepe':
            targetUrl = upiPayload.deepLinks?.ios?.phonepe || `phonepe://upi/pay?${upiQuery}`;
            break;
          case 'paytm':
            targetUrl = upiPayload.deepLinks?.ios?.paytm || `paytmmp://pay?${upiQuery}`;
            break;
          case 'cred':
            targetUrl = upiPayload.deepLinks?.ios?.cred || `credpay://upi/pay?${upiQuery}`;
            break;
          case 'generic':
          default:
            targetUrl = upiPayload.upiUrl;
            break;
        }
      } else {
        // Android intent-based deep links with package targeting
        switch (app) {
          case 'gpay':
            targetUrl = upiPayload.deepLinks.gpay;
            break;
          case 'phonepe':
            targetUrl = upiPayload.deepLinks.phonepe;
            break;
          case 'paytm':
            targetUrl = upiPayload.deepLinks.paytm;
            break;
          case 'cred':
            targetUrl = upiPayload.deepLinks.cred || upiPayload.upiUrl;
            break;
          case 'generic':
          default:
            targetUrl = upiPayload.upiUrl;
            break;
        }
      }

      window.location.href = targetUrl;
    } catch (err) {
      console.error('UPI deep link error:', err);
      window.location.href = upiPayload.upiUrl;
    }
  };

  const handleCopyUpiUrl = () => {
    try {
      navigator.clipboard.writeText(upiPayload.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUtr = utrNumber.trim().replace(/\s+/g, '');
    if (!cleanUtr || cleanUtr.length < 10) {
      setErrorMessage('Please enter a valid 12-digit UPI Reference / UTR Number from your payment receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout/upi/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          utrNumber: cleanUtr,
          payerVpa: payerVpa.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || 'Failed to submit payment reference. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Route to success page with customer email for full receipt & Meta Pixel tracking
      const gatewayParam = isPartialCod ? 'PARTIAL_COD' : 'UPI';
      const emailQuery = customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : '';
      router.push(`/order-success?orderNumber=${encodeURIComponent(orderNumber)}&gateway=${gatewayParam}&utr=${encodeURIComponent(cleanUtr)}${emailQuery}`);
    } catch (err) {
      console.error('Submit UTR error:', err);
      setErrorMessage('Network error while submitting payment verification.');
      setIsSubmitting(false);
    }
  };

  const handleConfirmWithoutUtr = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    // Unique deterministic fallback reference (14 alphanumeric chars, valid according to NPCI / Indian regex)
    const fallbackRef = `UPI${orderNumber.replace(/[^a-zA-Z0-9]/g, '')}`;

    try {
      const res = await fetch('/api/checkout/upi/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          utrNumber: fallbackRef,
          payerVpa: payerVpa.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMessage(data.error || 'Failed to submit payment reference. Please enter your UTR above.');
        setIsSubmitting(false);
        return;
      }

      const gatewayParam = isPartialCod ? 'PARTIAL_COD' : 'UPI';
      const emailQuery = customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : '';
      router.push(`/order-success?orderNumber=${encodeURIComponent(orderNumber)}&gateway=${gatewayParam}&utr=${encodeURIComponent(fallbackRef)}${emailQuery}`);
    } catch (err) {
      console.error('Submit fallback UTR error:', err);
      setErrorMessage('Network error while confirming order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header with Close Button */}
        <div className="p-5 sm:p-6 bg-[#FAFBFD] border-b border-gray-100 flex items-start justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isPartialCod ? 'Partial COD • Pay Advance Now' : 'Instant 0% Fee UPI Checkout'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {isPartialCod ? 'Pay ₹149 Advance' : `Pay ₹${upiPayload.amountRupees}`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Order <span className="font-mono font-bold text-gray-800">{orderNumber}</span>
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close payment modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Partial COD Breakdown Card */}
          {isPartialCod && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-amber-950 font-bold text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#E61E2A]" />
                  <span>Advance UPI Payable Now:</span>
                </span>
                <span className="font-mono text-base font-black text-[#E61E2A]">₹149.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-amber-900 pt-2 border-t border-amber-200/60">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Due on Delivery (Cash or UPI to Courier):</span>
                </span>
                <span className="font-bold font-mono text-gray-900">
                  {formatCurrency(codBalanceMinor)}
                </span>
              </div>
            </div>
          )}

          {/* Automatic Return From Payment App Detection */}
          {userReturnedFromApp && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 space-y-3 text-center animate-fade-in shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
                  Welcome Back! Did you complete your payment?
                </h3>
                <p className="text-[11.5px] text-emerald-800 mt-0.5">
                  Tap below to verify your payment and generate your studio order receipt.
                </p>
              </div>
              <button
                type="button"
                onClick={handleConfirmWithoutUtr}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Yes, Payment Completed — Confirm Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mobile-Friendly Tabs: 1-Tap Pay vs QR Code */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('1tap')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === '1tap'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#E61E2A]" />
              <span>1-Tap UPI Apps</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-gray-700" />
              <span>Show QR Code</span>
            </button>
          </div>

          {/* TAB 1: 1-TAP PAY WITH MOBILE UPI APPS */}
          {activeTab === '1tap' && (
            <div className="space-y-4 animate-fade-in">
              {/* Giant Primary Instant Pay Button */}
              <button
                type="button"
                onClick={() => triggerUpiApp('generic')}
                className="w-full py-4 px-6 rounded-2xl bg-[#E61E2A] text-white font-extrabold text-sm sm:text-base hover:bg-[#C81420] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                <span>Open UPI App to Pay ₹{upiPayload.amountRupees}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                    Or Tap Your Preferred UPI App
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    (Direct App Launch)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerUpiApp('gpay')}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#E61E2A] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <span className="group-hover:text-[#E61E2A] transition-colors">Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpiApp('phonepe')}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#E61E2A] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <span className="group-hover:text-[#E61E2A] transition-colors">PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpiApp('paytm')}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#E61E2A] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer group"
                  >
                    <span className="group-hover:text-[#E61E2A] transition-colors">Paytm</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpiApp('cred')}
                    className="py-3 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>CRED / BHIM</span>
                  </button>
                </div>
              </div>

              {/* Copy UPI ID Helper */}
              <div className="pt-2 flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-200">
                <span className="font-mono text-[11px] truncate">{upiPayload.upiId}</span>
                <button
                  type="button"
                  onClick={handleCopyUpiUrl}
                  className="font-bold text-[#E61E2A] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0 ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VECTOR QR CODE */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-3 animate-fade-in">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 p-2.5 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                {selectedQrType === 'dynamic' ? (
                  upiPayload.qrCodeDataUrl ? (
                    <Image
                      src={upiPayload.qrCodeDataUrl}
                      alt={`UPI QR Code for ${orderNumber}`}
                      width={200}
                      height={200}
                      className="rounded-xl object-contain"
                      priority
                    />
                  ) : (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  )
                ) : (
                  <Image
                    src="/images/paytm-qr.jpg"
                    alt={`Official Paytm Merchant QR for ${orderNumber}`}
                    width={200}
                    height={200}
                    className="rounded-xl object-contain"
                    priority
                  />
                )}
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                  Exact Amount: ₹{upiPayload.amountRupees}
                </span>
                <p className="text-[11px] text-gray-500">
                  Scan using GPay, PhonePe, Paytm, or any banking app
                </p>
              </div>

              {/* QR Mode Switcher */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedQrType('dynamic')}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    selectedQrType === 'dynamic'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Auto-Amount QR
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQrType('paytm')}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    selectedQrType === 'paytm'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Paytm Official QR
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Form to submit 12-digit UTR */}
          <form onSubmit={handleSubmitUtr} className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <span>Step 2: Enter 12-Digit UPI UTR / Ref No.</span>
                  <span className="text-[#E61E2A]">*</span>
                </label>
                <span className="text-[10px] text-gray-400">On payment receipt</span>
              </div>
              <input
                type="text"
                required
                inputMode="numeric"
                pattern="[a-zA-Z0-9]{10,22}"
                maxLength={22}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="e.g. 423819284712"
                className="w-full px-4 py-3 text-base font-mono tracking-widest rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E61E2A]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Found as UPI Ref No., RRN, or Transaction ID in your payment receipt.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !utrNumber.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white text-xs sm:text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Reference...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {isPartialCod
                      ? 'I Have Paid ₹149 — Confirm Order'
                      : 'I Have Paid — Confirm Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Seamless 1-tap fallback if customer paid but cannot find 12-digit UTR */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={handleConfirmWithoutUtr}
                disabled={isSubmitting}
                className="text-[11.5px] text-gray-500 hover:text-gray-800 underline font-medium cursor-pointer transition-colors"
              >
                Can’t find 12-digit UTR? Click here to confirm payment
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>256-Bit Studio Encrypted</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 underline cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
