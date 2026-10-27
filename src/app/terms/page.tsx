import React from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, Scale, AlertTriangle, Layers } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — flirta.network',
  description: 'Terms of service governing product orders, pricing errors, intellectual property rights, and Indian legal jurisdiction.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Legal Framework</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Contract between Buyer and {LEGAL_CONFIG.LEGAL_ENTITY_NAME}
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {/* 1. Introduction */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E61E2A]" />
            1. Agreement to Terms
          </h2>
          <p className="text-neutral-700">
            Welcome to flirta.network. This website is owned and operated by <strong>{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> (GSTIN: {LEGAL_CONFIG.GSTIN}). By accessing our site, browsing collections, or placing an order, you agree to be legally bound by these Terms and Conditions and our referenced policies (including our Shipping Policy, Refund Policy, and Privacy Policy).
          </p>
        </section>

        {/* 2. Product Specifications & Tolerances */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E61E2A]" />
            2. Product Specifications &amp; Additive Craft Tolerances
          </h2>
          <p className="text-neutral-700">
            Our products encompass precision electromagnetic levitation devices, LED ambient lightboxes, and 3D printed desk accessories:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li>Where items are produced via 3D additive manufacturing, minor microscopic surface textures or layer line nuances are inherent to the generative craft process and do not constitute manufacturing defects.</li>
            <li>For levitating lamps, the floating capsule requires manual centering using the provided alignment guide tool as described in the user manual.</li>
            <li>All technical dimensions, operating voltages, and weights are approximate to within commercial manufacturing tolerances.</li>
          </ul>
        </section>

        {/* 3. Pricing Errors & Order Cancellations */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E61E2A]" />
            3. Pricing Accuracy &amp; Technical Errors
          </h2>
          <p className="text-neutral-700">
            All prices listed on flirta.network are in Indian Rupees (INR ₹) inclusive of statutory GST.
          </p>
          <p className="text-neutral-600">
            While we strive for 100% price accuracy, technical glitch or typographical errors may occasionally occur. In the event a product is mistakenly listed at an incorrect price (e.g. ₹0 or unrealistic decimal shift), <strong>{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> reserves the right to cancel or refuse the order. In such events, any amount debited will be refunded in full to your original payment mode within 7 to 10 working days.
          </p>
        </section>

        {/* 4. Intellectual Property */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E61E2A]" />
            4. Intellectual Property Rights &amp; Third-Party Trademarks
          </h2>
          <p className="text-neutral-700">
            All proprietary graphics, product photography, text content, logos, typography, and website code on flirta.network are the exclusive intellectual property of <strong>{LEGAL_CONFIG.LEGAL_ENTITY_NAME}</strong> and protected under Indian and international copyright laws.
          </p>
          <p className="text-neutral-600">
            Any third-party character archetypes, artistic tributes, or pop-culture references featured on original decorative lightboxes are transformative artistic homages. We do not claim any endorsement by or affiliation with third-party entertainment franchises.
          </p>
        </section>

        {/* 5. Governing Law & Jurisdiction */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#E61E2A]" />
            5. Governing Law &amp; Legal Jurisdiction
          </h2>
          <p className="text-neutral-700">
            These Terms of Service and any contractual obligations between you and {LEGAL_CONFIG.LEGAL_ENTITY_NAME} shall be governed by and interpreted under the laws of the Republic of India.
          </p>
          <p className="text-neutral-600">
            In the event of any dispute that cannot be amicably settled via our <Link href="/grievance" className="text-[#E61E2A] underline font-medium">Grievance Officer</Link>, the civil courts situated in <strong>{LEGAL_CONFIG.JURISDICTION}</strong> shall have sole and exclusive jurisdiction over all claims and proceedings.
          </p>
        </section>

        {/* Legal Entity Footer Note */}
        <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
          <p>
            Questions regarding our Terms: Write to our legal team at <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.CARE_EMAIL}</a>.
          </p>
          <p className="mt-1">
            Sold by {LEGAL_CONFIG.LEGAL_ENTITY_NAME} • GSTIN: {LEGAL_CONFIG.GSTIN} • Registered Office: {LEGAL_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  );
}
