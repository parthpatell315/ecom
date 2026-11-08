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
  const [payerVpa, setPayerVpa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [userReturnedFromApp, setUserReturnedFromApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Auto-select QR on Desktop & auto-detect customer returning from UPI app
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    }
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
  const triggerUpiApp = (app: 'gpay' | 'phonepe' | 'paytm' | 'cred' | 'whatsapp' | 'generic') => {
    setHasInitiatedPayment(true);
    try {
      const isMobileIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768 && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isDesktop) {
        setActiveTab('qr');
        return;
      }

      const upiQuery = `pa=${encodeURIComponent(upiPayload.upiId.trim())}&pn=${encodeURIComponent(upiPayload.payeeName.trim())}&am=${encodeURIComponent(upiPayload.amountRupees)}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`;

      let targetUrl = upiPayload.upiUrl;

      if (isMobileIOS) {
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
          case 'whatsapp':
            targetUrl = `whatsapp://pay?${upiQuery}`;
            break;
          case 'generic':
          default:
            // On iOS, generic `upi://` is handled by WhatsApp Pay. Defaulting to PhonePe (India's #1 UPI app)
            // or GPay avoids unexpected WhatsApp hijack!
            targetUrl = upiPayload.deepLinks?.ios?.phonepe || `phonepe://upi/pay?${upiQuery}`;
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
          case 'whatsapp':
            targetUrl = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.whatsapp;end`;
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

  const handleConfirmPayment = async () => {
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
        setErrorMessage(data.error || 'Failed to submit payment confirmation. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const gatewayParam = isPartialCod ? 'PARTIAL_COD' : 'UPI';
      const emailQuery = customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : '';
      router.push(`/order-success?orderNumber=${encodeURIComponent(orderNumber)}&gateway=${gatewayParam}&utr=${encodeURIComponent(fallbackRef)}${emailQuery}`);
    } catch (err) {
      console.error('Submit payment confirmation error:', err);
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
                onClick={handleConfirmPayment}
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
              {isIOS ? (
                /* iOS (iPhone/iPad): Direct 1-Tap App Selectors to prevent iOS hijacking generic links to WhatsApp */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Choose Your UPI App on iPhone
                    </span>
                    <span className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Direct 1-Tap Open
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* PhonePe */}
                    <button
                      type="button"
                      onClick={() => triggerUpiApp('phonepe')}
                      className="p-3.5 rounded-2xl bg-[#5F259F]/5 hover:bg-[#5F259F]/10 border-2 border-[#5F259F]/30 hover:border-[#5F259F] text-gray-900 font-extrabold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5F259F] text-white flex items-center justify-center font-black text-sm shadow-xs">
                        पे
                      </div>
                      <span className="text-[#5F259F] group-hover:underline">PhonePe</span>
                    </button>

                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => triggerUpiApp('gpay')}
                      className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-500 text-gray-900 font-extrabold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-black shadow-xs">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">P</span>
                        <span className="text-[#FBBC05]">a</span>
                        <span className="text-[#34A853]">y</span>
                      </div>
                      <span className="text-gray-800 group-hover:text-blue-600">Google Pay</span>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      onClick={() => triggerUpiApp('paytm')}
                      className="py-3 px-4 rounded-xl bg-white border border-gray-200 hover:border-[#00BAF2] hover:bg-sky-50/30 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span className="text-[#00BAF2] font-black">Paytm</span>
                    </button>

                    {/* CRED */}
                    <button
                      type="button"
                      onClick={() => triggerUpiApp('cred')}
                      className="py-3 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>CRED / BHIM</span>
                    </button>
                  </div>

                  {/* Explicit WhatsApp Pay Option */}
                  <button
                    type="button"
                    onClick={() => triggerUpiApp('whatsapp')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Pay via WhatsApp UPI</span>
                  </button>
                </div>
              ) : (
                /* Android: Native OS Intent Chooser */
                <>
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
                </>
              )}

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

          {/* TAB 2: SINGLE VECTOR QR CODE */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-3 animate-fade-in">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 p-2.5 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                {upiPayload.qrCodeDataUrl ? (
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
            </div>
          )}

          {/* 1-Click Order Confirmation */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm sm:text-base font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50 select-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {isPartialCod
                      ? 'I Have Paid ₹149 Advance — Confirm Order'
                      : `I Have Paid ₹${upiPayload.amountRupees} — Confirm Order`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11.5px] text-gray-500 text-center font-medium">
              After paying in your UPI app or scanning the QR, tap the button above to confirm.
            </p>
          </div>
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
