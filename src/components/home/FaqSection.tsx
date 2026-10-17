'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'What material is used for flirta.network 3D printed products?',
    answer:
      'We use premium, high-grade eco-friendly PLA+ biopolymers and industrial composite filaments. Our products are made with non-toxic, structurally rigid, lightweight materials and finished with ultra-fine 0.12mm layer precision for a sleek, matte tactile feel.',
  },
  {
    question: 'What payment methods do you accept and what are delivery timelines?',
    answer:
      'We accept all major payment modes through our official PayU gateway, including instant zero-fee UPI (Google Pay, PhonePe, Paytm, BHIM), all debit/credit cards (Visa, Mastercard, RuPay), and 50+ NetBanking options. Most orders are processed in 1–2 business days with express delivery within 2–5 business days. Free delivery applies on orders of ₹999 and above.',
  },
  {
    question: 'Are the LED lamps and stands heat resistant and safe to leave on?',
    answer:
      'Yes! All flirta.network illumination pieces use cool-running high-efficiency LED modules engineered for ambient continuous illumination. They do not generate high heat and are 100% safe to leave on as evening sanctuaries or overnight desk glow.',
  },
  {
    question: 'What is your 7-day replacement guarantee policy?',
    answer:
      'If your piece arrives damaged during transit or has any additive defect, simply share a quick photo with care@flirta.network or our WhatsApp within 7 days of delivery. We will dispatch a brand-new replacement immediately with zero hassle.',
  },
  {
    question: 'Can I request custom 3D printed designs or bulk studio orders?',
    answer:
      'Yes! Our New Delhi 3D print lab handles custom architect commissions, personalized gamer tags on controller stands, custom lightbox designs, and bulk corporate gifts. Reach out via our Contact page or email care@flirta.network.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] border-t border-[#ECE7DE]" aria-label="Frequently Asked Questions">
      <div className="page-width max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white border border-[#E5E0D5] text-[#222225] mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#E61E2A]" />
            <span>HELP &amp; SUPPORT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#222225] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5C554B] max-w-xl mx-auto mt-2">
            Everything you need to know about our precision 3D-printed lifestyle products, shipping, and returns.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#222225]/25"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-medium text-[#222225]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#222225] text-white border-[#222225]' : 'text-[#5C554B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5C554B] leading-relaxed border-t border-[#F5F2EB]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
