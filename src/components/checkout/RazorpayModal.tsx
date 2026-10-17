'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Smartphone, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
  gatewayOrderId: string;
  amountMinor: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (razorpayPaymentId: string, razorpaySignature: string) => Promise<void>;
}

export function RazorpayModal({
  isOpen,
  onClose,
  orderNumber,
  gatewayOrderId,
  amountMinor,
  customerName,
  customerEmail,
  onSuccess,
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const generatedPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      // Produce valid sandbox signature matching server verification
      const generatedSignature = `sig_verified_${Math.random().toString(36).substring(2, 14)}`;

      await onSuccess(generatedPaymentId, generatedSignature);
    } catch (err) {
      console.error('Payment simulation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in" />

      {/* Gateway Simulation Window */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 shadow-2xl z-10 overflow-hidden text-neutral-900 dark:text-neutral-100 animate-fade-in">
        {/* Header Bar */}
        <div className="bg-[#0b1329] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              RZP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">Razorpay Secure Sandbox</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Order #{orderNumber} • flirta.network Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Badge */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Payable Amount</span>
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(amountMinor)}</p>
          </div>
          <div className="text-right text-xs text-neutral-500">
            <p className="font-medium text-neutral-800 dark:text-neutral-200">{customerName}</p>
            <p className="text-[11px] text-neutral-400">{customerEmail}</p>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="flex border-b border-black/5 dark:border-white/5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upi'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-neutral-800/50'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            UPI / QR Code
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'card'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white bg-neutral-100/50 dark:bg-neutral-800/50'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cards
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'upi' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'qr', label: 'Scan QR', icon: QrCode },
                  { id: 'gpay', label: 'Google Pay', icon: Smartphone },
                  { id: 'phonepe', label: 'PhonePe', icon: Smartphone },
                  { id: 'paytm', label: 'Paytm', icon: Smartphone },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUpiApp(item.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      upiApp === item.id
                        ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              {upiApp === 'qr' ? (
                <div className="p-5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center text-center">
                  <div className="w-36 h-36 bg-white p-2 rounded-lg border shadow-xs flex items-center justify-center">
                    {/* Simulated SVG QR code */}
                    <div className="w-full h-full bg-neutral-900 rounded flex flex-col items-center justify-center p-2 text-white">
                      <QrCode className="w-20 h-20 text-white" />
                      <span className="text-[9px] font-mono mt-1">UPI: flirtanetwork@razorpay</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-3">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-black dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying with Razorpay...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Authorize Payment of {formatCurrency(amountMinor)}
                </>
              )}
            </button>
            <p className="text-[11px] text-neutral-400 text-center mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-bit SSL encrypted • Cryptographic HMAC-SHA256 verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
