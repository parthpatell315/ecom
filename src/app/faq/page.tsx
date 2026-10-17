import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Frequently Asked Questions — flirta.network',
  description: 'Common questions regarding 3D printing materials, silent clocks, lighting safety, and shipping.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'What material is used to print the architectural pieces?',
      a: 'We use high-grade European carbon-neutral biopolymers derived from renewable corn and sugarcane starches. The material offers the tactile weight and silky matte finish of handcrafted ceramic while remaining durable, lightweight, and shatter-resistant.',
    },
    {
      q: 'Are the clocks completely silent?',
      a: 'Yes. All our wall clocks (such as the Fibonacci Spiral Shadow Clock and Mr Wise Clock) are equipped with high-torque continuous sweeping quartz mechanisms imported from Germany. They produce zero audible clicking or ticking sounds, making them ideal for creative studios, bedrooms, and quiet offices.',
    },
    {
      q: 'What kind of bulbs do the lamps use?',
      a: 'Our ambient mood lamps (including the Lumi Studio Ambient Mood Lamp and Aura Divine Light) are pre-fitted with custom dimmable 2700K warm LED illumination modules. They produce virtually zero heat, ensuring the internal biopolymer structure remains pristine indefinitely.',
    },
    {
      q: 'How long does a piece take to produce?',
      a: 'Each piece is individually printed for 20 to 44 continuous hours on ultra-fine 0.12mm hardened steel nozzles. We maintain a small batch of pre-calibrated stock in our Bengaluru studio so orders dispatch within 24 to 48 hours.',
    },
    {
      q: 'How are packages protected during courier transit?',
      a: 'Each order is cushioned in custom-cut, high-density acoustic foam that prevents movement or impact shock during transit. In the rare case of transit damage, we provide a 100% free immediate replacement.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We support all major Indian payment methods through our secure Razorpay gateway integration: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), and Net Banking across 50+ Indian banks.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-neutral-800 dark:text-neutral-200">
      <div className="mb-12 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Knowledge Base</span>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Everything you need to know about our additive craft, silent movements, and logistics.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-2"
          >
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {faq.q}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-xs text-neutral-500">
        Still have a question? Reach out to our design concierge at{' '}
        <Link href="/contact" className="text-neutral-900 dark:text-white underline">
          care@flirta.network
        </Link>
      </div>
    </div>
  );
}
