'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GENERAL_STORE_FAQS } from '@/data/faq';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]" aria-label="Frequently Asked Questions">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
            Questions &amp; Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6E6E73] mt-2">
            Everything you need to know about our ambient illumination pieces, shipping, and guarantees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {GENERAL_STORE_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#F5F5F7] rounded-2xl border border-black/[0.04] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-[15px] font-semibold text-[#1D1D1F]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 shadow-apple ${
                      isOpen ? 'rotate-180 text-[#1D1D1F]' : 'text-[#86868B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#6E6E73] leading-relaxed border-t border-black/[0.04]">
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
