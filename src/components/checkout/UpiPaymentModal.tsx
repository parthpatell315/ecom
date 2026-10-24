'use client';

import React, { useState } from 'react';
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
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface UpiPaymentModalProps {
  orderNumber: string;
  amountMinor: number;
  totalOrderMinor?: number;
  isPartialCod?: boolean;
  codBalanceMinor?: number;
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

  // Fast direct UPI intent trigger for mobile apps
  const triggerUpi = (url: string) => {
    try {
      window.location.href = url;
    } catch (err) {
      console.error('UPI deep link error:', err);
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

      // Route to success page
      const gatewayParam = isPartialCod ? 'PARTIAL_COD' : 'UPI';
      router.push(`/order-success?orderNumber=${encodeURIComponent(orderNumber)}&gateway=${gatewayParam}&utr=${encodeURIComponent(cleanUtr)}`);
    } catch (err) {
      console.error('Submit UTR error:', err);
      setErrorMessage('Network error while submitting payment verification.');
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
              {isPartialCod ? 'Pay ₹249 Advance' : `Pay ₹${upiPayload.amountRupees}`}
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
                  <IndianRupee className="w-4 h-4 text-[#D9232D]" />
                  <span>Advance UPI Payable Now:</span>
                </span>
                <span className="font-mono text-base font-black text-[#D9232D]">₹249.00</span>
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
              <Smartphone className="w-3.5 h-3.5 text-[#D9232D]" />
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
                onClick={() => triggerUpi(upiPayload.upiUrl)}
                className="w-full py-4 px-6 rounded-2xl bg-[#D9232D] text-white font-extrabold text-sm sm:text-base hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Smartphone className="w-5 h-5" />
                <span>Open UPI App to Pay ₹{upiPayload.amountRupees}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block text-center">
                  Or Tap Your Preferred UPI App
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerUpi(upiPayload.deepLinks.gpay || upiPayload.upiUrl)}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#D9232D] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpi(upiPayload.deepLinks.phonepe || upiPayload.upiUrl)}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#D9232D] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <span>PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpi(upiPayload.deepLinks.paytm || upiPayload.upiUrl)}
                    className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:border-[#D9232D] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <span>Paytm</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerUpi(upiPayload.upiUrl)}
                    className="py-3 px-4 rounded-xl bg-[#D9232D]/10 text-[#D9232D] border border-[#D9232D]/20 font-bold text-xs hover:bg-[#D9232D]/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="font-bold text-[#D9232D] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0 ml-2"
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
              <div className="relative w-48 h-48 p-2.5 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
                {upiPayload.qrCodeDataUrl ? (
                  <Image
                    src={upiPayload.qrCodeDataUrl}
                    alt={`UPI QR Code for ${orderNumber}`}
                    width={180}
                    height={180}
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
                  Scan from any bank or UPI app with your other phone
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Form to submit 12-digit UTR */}
          <form onSubmit={handleSubmitUtr} className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <span>Step 2: Enter 12-Digit UPI UTR / Ref No.</span>
                  <span className="text-[#D9232D]">*</span>
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
                className="w-full px-4 py-3 text-base font-mono tracking-widest rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D9232D]"
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
                      ? 'I Have Paid ₹249 — Confirm Order'
                      : 'I Have Paid — Confirm Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
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
