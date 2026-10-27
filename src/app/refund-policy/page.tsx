import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Video } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy — flirta.network',
  description: '7-Day damaged or defective transit replacement guarantee, unboxing verification guidelines, and statutory refund procedures.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Buyer Protection</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Refund, Replacement &amp; Returns Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Governed by {LEGAL_CONFIG.LEGAL_ENTITY_NAME}
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {/* 7-Day Replacement Guarantee */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#E61E2A]" />
            1. 7-Day Transit Damage &amp; Defect Replacement Guarantee
          </h2>
          <p className="text-neutral-700">
            At flirta.network, we pack all items in heavy-duty laser-cut EVA acoustic foam. However, in the rare event that an item arrives damaged, defective, or incorrect due to transit handling:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li>
              <strong>Timeframe:</strong> You must notify us within <strong>7 days of delivery</strong> by contacting us on WhatsApp (<span className="font-mono">{LEGAL_CONFIG.CARE_PHONE}</span>) or emailing <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.CARE_EMAIL}</a>.
            </li>
            <li>
              <strong>Mandatory Unboxing Documentation:</strong> Please share clear photographs and an unboxing video showing the outer package condition, courier shipping label, and the specific transit damage or defect.
            </li>
            <li>
              <strong>Replacement First:</strong> We operate a <strong>replacement-first policy</strong>. Upon quick digital verification, our studio ships a brand-new, factory-calibrated replacement piece to your address at absolutely zero additional cost.
            </li>
          </ul>
        </section>

        {/* Refund Policy */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#E61E2A]" />
            2. Refund Process &amp; Settlement Timelines
          </h2>
          <p className="text-neutral-700">
            If a replacement cannot be provided due to out-of-stock inventory, or if the product remains non-functional after replacement:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li>
              <strong>Refund Processing:</strong> The refund will be initiated by our accounts team within 48 hours of approval.
            </li>
            <li>
              <strong>Original Payment Method:</strong> The full purchase amount will be credited back to your original payment mode (UPI, NetBanking, Credit/Debit Card) via our RBI-authorized payment gateway partner (Razorpay) within <strong>7 to 10 working days</strong>.
            </li>
            <li>
              <strong>Partial COD Orders:</strong> For Partial COD orders where the product was delivered damaged and returned, any advance deposit paid (₹149) and doorstep balance paid (₹850) will be refunded directly to your verified UPI ID within 7 to 10 working days.
            </li>
          </ul>
        </section>

        {/* Non-Returnable Scenarios */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E61E2A]" />
            3. Non-Returnable &amp; Ineligible Cases
          </h2>
          <p className="text-neutral-700">
            Returns or replacements cannot be accepted under the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Requests raised after the 7-day post-delivery inspection window has elapsed.</li>
            <li>Physical damage caused by user mishandling, unauthorized disassembly, water exposure, or using an unapproved voltage adapter.</li>
            <li>Items returned without original manufacturer packaging, centering tools, accessories, or power adapters.</li>
            <li>Orders refused at doorstep due to buyer mind-change without genuine product damage.</li>
          </ul>
        </section>

        {/* Grievance Escalation */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E61E2A]" />
            4. Grievance Redressal
          </h2>
          <p className="text-neutral-600">
            If your replacement or refund claim is not resolved to your satisfaction within 7 business days, you may escalate directly to our designated Grievance Officer at <a href={`mailto:${LEGAL_CONFIG.GRIEVANCE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.GRIEVANCE_EMAIL}</a> as detailed on our <Link href="/grievance" className="text-[#E61E2A] underline">Grievance Redressal Portal</Link>.
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
