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
  const [utrNumber, setUtrNumber] = useState('');
  const [payerVpa, setPayerVpa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-white dark:bg-[#121214] rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900/60 dark:to-[#121214] border-b border-black/5 dark:border-white/5 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isPartialCod ? 'Partial COD Order Confirmation' : '0% Fee Direct UPI Payment'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {isPartialCod ? 'Scan & Pay Advance ₹249.00' : 'Pay with Any UPI App'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Order <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{orderNumber}</span>
            {isPartialCod ? (
              <span> • Pay <strong className="text-neutral-900 dark:text-white">₹249.00 advance now</strong></span>
            ) : (
              <span> • Pay exactly <strong className="text-neutral-900 dark:text-white">{formatCurrency(amountMinor)}</strong></span>
            )}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Partial COD Breakdown Notice */}
          {isPartialCod && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between text-amber-800 dark:text-amber-200 font-bold">
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-[#D9232D]" />
                  <span>Advance UPI Payment (Now):</span>
                </span>
                <span className="font-mono text-sm text-[#D9232D] font-black">₹249.00</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-300 pt-1.5 border-t border-amber-500/20">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Due on Delivery (Cash / UPI to Courier):</span>
                </span>
                <span className="font-bold font-mono text-neutral-900 dark:text-white">
                  {formatCurrency(codBalanceMinor)}
                </span>
              </div>
              {totalOrderMinor && (
                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                  <span>Total Order Amount:</span>
                  <span className="font-medium">{formatCurrency(totalOrderMinor)}</span>
                </div>
              )}
            </div>
          )}

          {/* Clean Prominent QR Code (Centered without merchant name or UPI ID text) */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-center">
            <div className="relative w-52 h-52 p-3 bg-white rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-center overflow-hidden">
              {upiPayload.qrCodeDataUrl ? (
                <Image
                  src={upiPayload.qrCodeDataUrl}
                  alt={`UPI QR Code for ${orderNumber}`}
                  width={192}
                  height={192}
                  className="rounded-xl object-contain"
                  priority
                />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              )}
            </div>

            <div className="mt-3.5 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
                <span>Scan with Any UPI App • Exact Amount ₹{upiPayload.amountRupees}</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Amount is pre-filled automatically on scan
              </p>
            </div>
          </div>

          {/* 1-Tap Pay with UPI App (Mobile) */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              1-Tap Pay with UPI App (Mobile)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={upiPayload.deepLinks.gpay}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs text-center hover:border-[#D9232D] hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Google Pay</span>
              </a>
              <a
                href={upiPayload.deepLinks.phonepe}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs text-center hover:border-[#D9232D] hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>PhonePe</span>
              </a>
              <a
                href={upiPayload.deepLinks.paytm}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs text-center hover:border-[#D9232D] hover:bg-neutral-50 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Paytm</span>
              </a>
              <a
                href={upiPayload.deepLinks.generic}
                className="py-2.5 px-3 rounded-xl bg-[#D9232D]/10 text-[#D9232D] border border-[#D9232D]/20 font-semibold text-xs text-center hover:bg-[#D9232D]/20 transition-all flex items-center justify-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Any App</span>
              </a>
            </div>
          </div>

          {/* Step 2: Form to submit 12-digit UTR */}
          <form onSubmit={handleSubmitUtr} className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Step 2: Enter 12-Digit UPI Reference / UTR Number *
                </label>
                <span className="text-[10px] text-neutral-400">Found on receipt</span>
              </div>
              <input
                type="text"
                required
                maxLength={22}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="e.g. 423819284712"
                className="w-full px-4 py-2.5 text-sm font-mono tracking-wider rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#D9232D]"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Also known as UPI Ref No., RRN, or Transaction ID in your GPay / PhonePe / Paytm app.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your UPI ID / Mobile Number (Optional, helps instant verification)
              </label>
              <input
                type="text"
                value={payerVpa}
                onChange={(e) => setPayerVpa(e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="w-full px-4 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#D9232D]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !utrNumber.trim()}
              className="w-full py-3.5 px-6 rounded-full bg-[#D9232D] text-white text-xs font-bold hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Payment Reference...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {isPartialCod
                      ? 'I Have Paid ₹249 Advance — Confirm Order'
                      : 'I Have Paid — Confirm Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-neutral-50 dark:bg-neutral-900/60 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Order reference kept active</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
            >
              Change Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
