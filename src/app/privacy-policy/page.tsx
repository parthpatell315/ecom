import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, EyeOff, Cookie, Database, Mail } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — flirta.network',
  description: 'How flirta.network collects, stores, protects, and handles personal customer data, payment gateway integrations, and statutory compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Data Protection</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Operated by {LEGAL_CONFIG.LEGAL_ENTITY_NAME}
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {/* Zero Payment Storage */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#E61E2A]" />
            1. Payment Security &amp; Zero Card Data Storage
          </h2>
          <p className="text-neutral-700">
            <strong>{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> does not collect, process, or store raw credit/debit card numbers, CVVs, UPI MPINs, or online banking passwords on our servers.
          </p>
          <p className="text-neutral-600">
            All financial transactions are tokenized and processed exclusively through PCI-DSS Level 1 compliant gateway partners (such as Razorpay) and NPCI-authorized Unified Payments Interface (UPI) networks using end-to-end 256-bit SSL encryption.
          </p>
        </section>

        {/* Data We Collect */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E61E2A]" />
            2. Information We Collect
          </h2>
          <p className="text-neutral-700">
            We collect only the minimum necessary personal data required to manufacture, fulfill, and deliver your orders:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>Contact Details:</strong> Full name, email address, and 10-digit mobile phone number for order confirmations, GST invoices, and courier SMS delivery alerts.</li>
            <li><strong>Shipping Coordinates:</strong> Physical address, apartment/suite number, landmark, city, state, and 6-digit postal PIN code.</li>
            <li><strong>Transaction Records:</strong> Order items, payment reference IDs (UTR numbers, Razorpay payment IDs), and invoice records.</li>
            <li><strong>Technical Telemetry:</strong> Device type, IP address, approximate geographical region, and browser user agent for fraud prevention and performance monitoring.</li>
          </ul>
        </section>

        {/* Third-Party Service Providers */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#E61E2A]" />
            3. Third-Party Integrations &amp; Analytics
          </h2>
          <p className="text-neutral-600">
            We partner with trusted third-party providers solely for operational necessity:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>Couriers &amp; Logistics:</strong> Blue Dart Express, Delhivery, and Shiprocket for parcel transit and live tracking.</li>
            <li><strong>Payment Gateways:</strong> Razorpay Software Private Limited for UPI and card processing.</li>
            <li><strong>Analytics &amp; Performance:</strong> First-party analytics and Meta Pixel for anonymous conversion telemetry and ad efficacy measurement.</li>
          </ul>
          <p className="text-neutral-600 pt-1">
            We strictly do not sell, rent, or trade your personal information to third-party data brokers or marketing networks.
          </p>
        </section>

        {/* Cookies */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#E61E2A]" />
            4. Cookies &amp; Local Storage
          </h2>
          <p className="text-neutral-600">
            We utilize essential session cookies and local storage to preserve your shopping cart state, apply discount vouchers, and authenticate customer sessions. You can configure your browser to decline non-essential cookies at any time.
          </p>
        </section>

        {/* Retention & Rights */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E61E2A]" />
            5. Data Retention &amp; Customer Rights
          </h2>
          <p className="text-neutral-600">
            Order and tax transaction data is retained for the statutory period required under Indian taxation laws (GST regulations). You may request access to, correction of, or deletion of your marketing contact data by writing to <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.CARE_EMAIL}</a>.
          </p>
          <p className="text-neutral-600">
            For statutory privacy concerns, please contact our designated Grievance Officer via our <Link href="/grievance" className="text-[#E61E2A] underline">Grievance Portal</Link>.
          </p>
        </section>

        {/* Legal Entity Footer Note */}
        <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
          <p>
            Sold by {LEGAL_CONFIG.LEGAL_ENTITY_NAME} • GSTIN: {LEGAL_CONFIG.GSTIN} • Registered Office: {LEGAL_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  );
}
