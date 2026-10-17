import React from 'react';

export const metadata = {
  title: 'Terms of Service — flirta.network',
  description: 'Terms governing product purchases, manufacturing tolerances, and customer usage.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Legal Framework</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-500 mt-2">Effective Date: October 2026</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">1. Introduction & Overview</h2>
          <p>
            Welcome to flirta.network. By accessing our website, browsing pieces, or placing an order, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">2. Additive Manufacturing Tolerances</h2>
          <p>
            Our products are manufactured using computational generative design and high-precision 3D additive manufacturing. Slight natural variations in microscopic layer grain, surface matte texture, and color depth under varying ambient lighting conditions are inherent to the craftsmanship and celebrate the unique identity of each piece.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">3. Pricing & Currency</h2>
          <p>
            All prices are quoted in Indian Rupees (INR ₹) inclusive of all statutory applicable taxes. Prices are server-validated at checkout. In the event of an erroneous technical display of an incorrect price, we reserve the right to correct the order with customer consent.
          </p>
        </section>
      </div>
    </div>
  );
}
