import React from 'react';
import { Lock, ShieldCheck, EyeOff } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — flirta.network',
  description: 'How flirta.network protects customer privacy, handles sessions, and ensures zero card data storage.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Privacy Architecture</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Certified Data Privacy Standards
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#c5a059]" />
            1. Zero Payment Card Storage
          </h2>
          <p>
            flirta.network never collects, processes, or stores your raw credit card numbers, CVVs, or net banking passwords on our servers. All transactions are securely routed through PCI-DSS Level 1 compliant gateway infrastructure (Razorpay) using end-to-end 256-bit SSL encryption.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#c5a059]" />
            2. Information We Collect
          </h2>
          <p>
            We strictly collect only the information essential to manufacture, fulfill, and deliver your architectural commissions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Customer Name, Email Address, and Phone Number (for delivery communication)</li>
            <li>Physical Delivery Address and Postal PIN Code</li>
            <li>Order history, item preferences, and optional studio delivery notes</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            3. No Data Selling or Telemarketing
          </h2>
          <p>
            We adhere to Apple-inspired strict privacy standards: we never sell, rent, or trade your personal data to third-party ad brokers or spam networks. Your phone number is strictly shared with express courier partners (e.g. Blue Dart, Delhivery) exclusively for delivery updates.
          </p>
        </section>
      </div>
    </div>
  );
}
