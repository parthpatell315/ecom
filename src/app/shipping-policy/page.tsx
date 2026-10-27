import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, PackageCheck, IndianRupee, MapPin } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';
import { SHIPPING_CONFIG } from '@/config/shipping';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — flirta.network',
  description: 'Shipping timelines, courier partners, live tracking, and Partial COD delivery terms across all serviceable Indian pin codes.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#E61E2A] font-semibold">Logistics & Delivery</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mt-1">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Operates under {LEGAL_CONFIG.LEGAL_ENTITY_NAME}
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {/* Core Timeline */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E61E2A]" />
            1. Dispatch &amp; Delivery Timelines
          </h2>
          <p className="text-neutral-700">
            Our universal delivery commitment is: <strong>{SHIPPING_CONFIG.DELIVERY_PROMISE}</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>Studio Dispatch:</strong> Orders are verified, bench-tested, and handed over to express couriers within 24 to 48 hours of order confirmation.</li>
            <li><strong>Transit Duration:</strong> Metro cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata, Pune) typically receive delivery in 3 business days; non-metro and tier-2/3 cities deliver within 4 to 5 business days.</li>
            <li><strong>Express Air Courier Partners:</strong> Consignments are routed through premier air express partners including {SHIPPING_CONFIG.PRIMARY_COURIER} and {SHIPPING_CONFIG.SECONDARY_COURIER}.</li>
          </ul>
        </section>

        {/* Shipping Charges */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#E61E2A]" />
            2. Shipping Rates &amp; Coverage
          </h2>
          <p className="text-neutral-700">
            We deliver to over 19,000+ Indian postal PIN codes covering all 28 states and 8 union territories.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600">
            <li><strong>Prepaid Orders:</strong> All prepaid orders (₹999 and above) qualify for 100% Free Express Air Shipping with zero additional handling charges.</li>
            <li><strong>Serviceable Locations:</strong> If your delivery pincode is deemed non-serviceable by our primary courier, our support concierge will contact you within 24 hours to arrange alternate surface priority delivery or issue an immediate full refund.</li>
          </ul>
        </section>

        {/* Partial COD Terms */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#E61E2A]" />
            3. Partial Cash on Delivery (COD) Rules
          </h2>
          <p className="text-neutral-700">
            To combat courier fraud and fake address submissions while keeping your risk zero, we operate a <strong>Partial COD model</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li><strong>Advance Commitment Fee:</strong> You pay a small advance of <strong>₹149</strong> securely via UPI at checkout to confirm your parcel reservation.</li>
            <li><strong>Doorstep Balance:</strong> You pay the remaining balance of <strong>₹850</strong> in cash or via courier UPI QR scan when the package arrives at your doorstep.</li>
            <li><strong>Total Order Cost:</strong> The total order amount remains flat ₹999 with zero additional COD convenience fees.</li>
            <li><strong>Refusal of Delivery:</strong> If an order is cancelled after courier handover or rejected at doorstep without genuine transit damage, the ₹149 advance fee is non-refundable as it offsets the two-way air courier freight.</li>
          </ul>
        </section>

        {/* Protective Packaging */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#E61E2A]" />
            4. Shockproof Packaging Standards
          </h2>
          <p className="text-neutral-600">
            All fragile electromagnetic levitation bases, LED modules, and display stands are cradled inside custom laser-cut shock-absorbing EVA foam inside rigid multi-ply outer cartons. Every consignment is sealed with tamper-evident security tape.
          </p>
        </section>

        {/* Real-Time Tracking */}
        <section className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E61E2A]" />
            5. Consignment Tracking
          </h2>
          <p className="text-neutral-600">
            Upon courier pickup, an automated WhatsApp and SMS notification with your Airway Bill (AWB) number and direct live tracking URL is dispatched to your registered phone number. You can also track your shipment at any time via our <Link href="/tracking" className="text-[#E61E2A] underline font-medium">Tracking Portal</Link>.
          </p>
        </section>

        {/* Legal Entity Footer Note */}
        <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-500">
          <p>
            Logistics questions or address corrections: Contact our studio concierge at <a href={`mailto:${LEGAL_CONFIG.CARE_EMAIL}`} className="text-[#E61E2A] underline">{LEGAL_CONFIG.CARE_EMAIL}</a> or WhatsApp <span className="font-mono">{LEGAL_CONFIG.CARE_PHONE}</span>.
          </p>
          <p className="mt-1">
            Sold by {LEGAL_CONFIG.LEGAL_ENTITY_NAME} • GSTIN: {LEGAL_CONFIG.GSTIN} • Registered Office: {LEGAL_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  );
}
