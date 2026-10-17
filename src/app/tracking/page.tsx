'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/currency';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = email.trim()
        ? `/api/orders/${orderNumber.trim()}?email=${encodeURIComponent(email.trim())}`
        : `/api/orders/${orderNumber.trim()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order reference not found in our studio registry.');
        setOrder(null);
      }
    } catch {
      setError('Network error while looking up order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack();
    }
  }, [initialOrderNumber]);

  const stages = [
    { title: 'Payment Confirmed', desc: 'Verified via cryptographic gateway check' },
    { title: 'Studio Calibration', desc: 'Biopolymer slice queued on 0.12mm precision setup' },
    { title: 'Quality & Packaging', desc: 'Inspected and cushioned in acoustic foam' },
    { title: 'Dispatched in Transit', desc: 'Handed to express insured carrier' },
    { title: 'Delivered', desc: 'Delivered to your workstation sanctuary' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const currentStage = order ? getStageIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Studio Dispatch</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Track Your Commission
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Enter your order reference number (e.g. FL-2026-8MZHM) to trace calibration and transit.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs mb-10">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-medium text-neutral-500 mb-1">Order Reference *</label>
            <input
              type="text"
              required
              placeholder="e.g. FL-2026-8MZHM"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2 text-sm font-mono uppercase tracking-wider rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <label className="block text-[11px] font-medium text-neutral-500 mb-1">Customer Email (Optional for full details)</label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="w-full sm:w-auto py-2.5 px-6 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-black dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track Piece
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Results View */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-black/5 dark:border-white/5">
              <div>
                <span className="text-[11px] text-neutral-400">Order Reference</span>
                <h3 className="text-xl font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                  {order.orderNumber}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="py-1 px-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Status: {order.status}
                </span>
                {order.totalMinor && (
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(order.totalMinor)}
                  </span>
                )}
              </div>
            </div>

            {/* Visual Stepper Timeline */}
            <div className="pt-8">
              <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                {stages.map((stg, idx) => {
                  const isDone = idx <= currentStage;
                  const isCurrent = idx === currentStage;
                  return (
                    <div key={stg.title} className="flex-1 flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                          isDone
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-medium ${
                            isCurrent
                              ? 'text-[#c5a059] font-semibold'
                              : isDone
                              ? 'text-neutral-900 dark:text-neutral-100'
                              : 'text-neutral-400'
                          }`}
                        >
                          {stg.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 max-w-[140px] md:mx-auto mt-0.5 hidden sm:block">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking ID Pill */}
            {order.trackingNumber && (
              <div className="mt-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">Express Courier Consignment</span>
                  <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {order.trackingNumber} ({order.trackingCarrier || 'Blue Dart Air Express'})
                  </span>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Estimated Delivery in 2 - 3 Business Days
                </div>
              </div>
            )}
          </div>

          {/* Items In Consignment (If full view permitted) */}
          {order.items && (
            <div className="p-6 rounded-2xl bg-[#fbfbfd] dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Pieces in Consignment
              </h4>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                        {item.imageSnapshot && (
                          <Image src={item.imageSnapshot} alt={item.titleSnapshot} fill className="object-cover" sizes="50px" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.titleSnapshot}</p>
                        {item.variantNameSnapshot && (
                          <p className="text-[11px] text-neutral-400">{item.variantNameSnapshot} × {item.quantity}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                      {formatCurrency(item.totalMinor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-neutral-400">Loading tracking engine...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
