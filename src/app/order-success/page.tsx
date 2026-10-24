'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { formatCurrency } from '@/lib/currency';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import Image from 'next/image';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const utrParam = searchParams.get('utr');
  const gatewayParam = searchParams.get('gateway');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#1d1d1f', '#d4af37'],
      });
    } catch {
      // ignore
    }

    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Success Badge */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">
          {order?.status === 'CONFIRMED' ? 'Order Confirmed & Verified' : 'Order Placed • Payment Submitted'}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Thank you for your order.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2">
          Your commission is queued for studio print calibration and transit packaging.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {orderNumber && (
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-neutral-100 dark:bg-neutral-900 text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5">
              <span>Order Reference:</span>
              <span className="text-[#c5a059] font-bold">{orderNumber}</span>
            </div>
          )}
          {utrParam && (
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-500/10 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span>UPI UTR:</span>
              <span className="font-bold">{utrParam}</span>
            </div>
          )}
        </div>
      </div>

      {order && (
        <div className="space-y-6">
          {/* Order Details Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
              <div>
                <span className="text-neutral-500">Date Placed:</span>
                <span className="ml-1.5 font-medium text-neutral-900 dark:text-neutral-100">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="py-4 space-y-4 divide-y divide-black/5 dark:divide-white/5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                      {item.imageSnapshot && (
                        <Image src={item.imageSnapshot} alt={item.titleSnapshot} fill className="object-cover" sizes="50px" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{item.titleSnapshot}</h4>
                      {item.variantNameSnapshot && (
                        <p className="text-[11px] text-neutral-500">{item.variantNameSnapshot} × {item.quantity}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(item.totalMinor)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotalMinor)}</span>
              </div>
              {order.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promotional Discount</span>
                  <span>-{formatCurrency(order.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Studio Delivery</span>
                <span>{order.shippingMinor === 0 ? 'FREE' : formatCurrency(order.shippingMinor)}</span>
              </div>
              {order.isPartialCod ? (
                <>
                  <div className="flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Advance Paid via UPI</span>
                    <span>₹249.00</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <span>Balance Due on Cash on Delivery</span>
                    <span>{formatCurrency(order.codBalanceMinor)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span>Total Order Value</span>
                    <span>{formatCurrency(order.totalMinor)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span>Total Paid</span>
                  <span>{formatCurrency(order.totalMinor)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Timeline info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] text-xs">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                <Truck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>Delivery Destination</span>
              </div>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">{order.shippingAddress?.fullName}</p>
              <p className="text-neutral-500 mt-0.5">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p className="text-neutral-500">{order.shippingAddress?.addressLine2}</p>
              )}
              <p className="text-neutral-500">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p className="text-neutral-500 mt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] text-xs">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                <Package className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>Fulfillment Status</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Studio dispatch estimate: 24 to 48 hours. Insured transit packaging in custom acoustic foam.
              </p>
              {order.trackingNumber ? (
                <div className="mt-3 p-2 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Consignment Tracking:</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium">{order.trackingNumber}</span>
                </div>
              ) : (
                <p className="text-[11px] text-[#c5a059] mt-3">
                  Tracking number will be sent via SMS / WhatsApp once dispatched.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-medium">
        <Link
          href={`/tracking?orderNumber=${orderNumber || ''}`}
          className="w-full sm:w-auto py-2.5 px-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-neutral-100 transition-colors"
        >
          <span>Track Live Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto py-2.5 px-6 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center gap-2 transition-colors"
        >
          Explore More Pieces
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-neutral-400">Loading receipt...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
