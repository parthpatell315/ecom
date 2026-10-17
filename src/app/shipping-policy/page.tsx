import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, PackageCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy — flirta.network',
  description: 'Verified studio dispatch, transit times, and acoustic foam packaging policies across India.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Studio Logistics</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: October 2026 • Direct Studio Dispatch from Bengaluru
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#c5a059]" />
            1. Complimentary Studio Shipping
          </h2>
          <p>
            We offer <strong>Free Insured Express Delivery</strong> across all serviceable pin codes in India on orders with a subtotal of <strong>₹1,499 or higher</strong>.
          </p>
          <p>
            For orders under ₹1,499, a nominal studio packaging and express air freight fee of <strong>₹99</strong> is applied at checkout.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c5a059]" />
            2. Dispatch & Print Calibration Timeline
          </h2>
          <p>
            Because each piece is an architectural commission manufactured with 20 to 44 hours of additive precision, orders are dispatched within <strong>24 to 48 business hours</strong> following print bed inspection.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Metro Cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai): <strong>2 - 3 business days</strong></li>
            <li>Rest of India: <strong>4 - 6 business days</strong></li>
            <li>Remote / Hill Stations: <strong>5 - 7 business days</strong></li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#c5a059]" />
            3. Acoustic Protective Packaging
          </h2>
          <p>
            Our packaging utilizes custom-cut recyclable acoustic foam cradles engineered to absorb transit vibration, ensuring fragile cellular lattices and kinetic clock hands arrive in immaculate museum condition.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            4. Live Courier Tracking
          </h2>
          <p>
            Immediately upon courier pickup (via Blue Dart or Delhivery Air), you will receive an SMS and email notification with your Airway Bill (AWB) tracking number. You can also monitor real-time consignment progress via our <Link href="/tracking" className="text-[#c5a059] underline">Track Commission</Link> tool.
          </p>
        </section>
      </div>
    </div>
  );
}
