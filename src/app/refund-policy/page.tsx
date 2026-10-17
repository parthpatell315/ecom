import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Returns & Refund Policy — flirta.network',
  description: 'Verified transit replacement guarantee, 1-year mechanism warranty, and refund procedure.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Collector Guarantee</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Returns & Refund Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Direct Studio Care
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#c5a059]" />
            1. Zero-Friction Transit Replacement Guarantee
          </h2>
          <p>
            In the rare event that an architectural piece arrives damaged during transit, please notify our studio team within <strong>48 hours of delivery</strong> by emailing <span className="font-mono text-neutral-900 dark:text-neutral-100">care@flirta.network</span> with an unboxing photo or video.
          </p>
          <p>
            We will immediately initiate a priority replacement print and dispatch a fresh piece at zero additional cost to you.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            2. 1-Year Studio Mechanism Warranty
          </h2>
          <p>
            All kinetic clocks and ambient lighting components (German quartz sweep movement, 2700K LED modules, touch-dimming circuits) are covered by our <strong>1-Year Studio Warranty</strong> against operational defects. If any mechanical component fails during normal usage, we replace the core assembly promptly.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
            3. Refund Process
          </h2>
          <p>
            Approved refunds are credited directly back to the original source payment method (UPI, NetBanking, or Credit/Debit Card) via our payment gateway within <strong>5 to 7 business days</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
