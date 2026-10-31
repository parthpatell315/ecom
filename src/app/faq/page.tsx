import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions — flirta.network',
  description: 'Everything you need to know regarding 3D printing materials, levitation mechanisms, Partial COD, and 7-day replacement.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does the magnetic levitation floating mechanism work?',
      a: 'Our levitating pieces (such as the Magnetic Levitation F1 Racing Car and Floating Money Stack Lamp) utilize genuine active electromagnetic suspension coils located inside the base. When plugged into power, opposing magnetic fields create a real 12–15mm invisible air cushion that allows the model to hover and spin freely in 360 degrees with zero physical strings or transparent props.',
    },
    {
      q: 'How does Partial Cash on Delivery (COD) work?',
      a: 'To prevent frivolous courier bookings while keeping cash on delivery convenient, we support Partial COD. You pay a small advance deposit of ₹149 securely via UPI at checkout to confirm your package reservation. The courier then delivers the parcel to your doorstep, where you pay the remaining balance in cash or UPI.',
    },
    {
      q: 'What is your 7-Day Replacement Guarantee?',
      a: 'All pieces are packed in heavy-duty laser-cut EVA acoustic foam. In the rare event that an item arrives damaged, defective, or incorrect during shipping, notify us within 7 days of delivery with your unboxing video or photos. Our studio will dispatch a brand-new factory-calibrated replacement immediately at zero extra cost.',
    },
    {
      q: 'What materials are used to 3D print each piece?',
      a: 'We use high-grade, carbon-neutral biopolymers (PLA+) synthesized from renewable sugarcane and corn starches. Deposited layer-by-layer at 0.12mm precision, the pieces exhibit a tactile ceramic-like weight, porcelain-smooth contours, and an ultra-matte non-reflective surface.',
    },
    {
      q: 'Are the LED lamps safe to leave on 24/7?',
      a: 'Yes. Our ambient lamps and lightboxes operate on low-voltage 5V USB-C or 12V 2A power systems. They remain completely cool to the touch and consume minimal electricity, making them perfectly safe to leave illuminated as nightstands or continuous workstation lights.',
    },
    {
      q: 'Are the clocks silent or do they tick?',
      a: 'All our desk docks and wall timepieces feature silent continuous-sweep quartz movements with zero audible ticking sound, making them ideal for quiet studios, bedrooms, and focused workstations.',
    },
    {
      q: 'How long does shipping and delivery take?',
      a: 'Orders are bench-tested and dispatched within 24 to 48 hours via fast air couriers (BlueDart, Delhivery, DTDC). Standard transit takes 2 to 4 business days for major metro cities and 3 to 6 days for all other pin codes across India.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We support instant zero-fee Direct UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across all Indian banks, and Partial COD.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-[#111827]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#E61E2A] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer Knowledge Base</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-2 leading-relaxed">
            Everything you need to know about our levitation tech, 3D printing craft, Partial COD, and logistics.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#F9FAFB] border border-black/[0.06] shadow-xs space-y-2 hover:border-black/10 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-[#111827] flex items-start gap-2.5">
                <span className="text-[#E61E2A] font-black">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-[#FAFAFA] border border-black/[0.08] text-center">
          <h4 className="text-base font-bold text-[#111827]">Still have questions?</h4>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1 mb-4">
            Our support concierge is available Monday to Saturday, 10:00 AM – 6:00 PM IST.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#E61E2A] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#C81420] transition-colors shadow-xs"
          >
            <span>Contact Customer Support</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
