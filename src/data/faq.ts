/**
 * Single source of truth for Product FAQs on Levitating Lamp and Core Desk Lighting.
 * Powers the interactive accordion component and FAQPage JSON-LD schema.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LEVITATING_LAMP_FAQS: readonly FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Does it genuinely float in mid-air without wires or strings?',
    answer:
      'The lamp uses electromagnetic levitation coils and magnetic balance sensors inside the base that suspend the capsule 15–20mm in mid-air. Once placed, it floats freely and rotates smoothly 360° continuously with zero friction or motor sound.',
  },
  {
    id: 'faq-2',
    question: 'How do I set up and balance the floating capsule?',
    answer:
      'Place the magnetic centering guide on the base, set the capsule on it, and slowly lift the guide away. It floats within about 10 seconds. Full instructions and a setup video are on this page.',
  },
  {
    id: 'faq-3',
    question: 'What happens if there is a power cut or it gets unplugged?',
    answer:
      'If power is lost or unplugged, the capsule drops gently onto the base. Plug back in and repeat the placement step. No damage occurs.',
  },
  {
    id: 'faq-4',
    question: 'How does Partial Cash on Delivery (COD) payment work?',
    answer:
      'Pay ₹249 advance via UPI at checkout to confirm your order. Pay the remaining ₹750 in cash or UPI to the courier at delivery. Total stays ₹999.',
  },
  {
    id: 'faq-5',
    question: 'What is your replacement policy if the piece arrives damaged?',
    answer:
      'If your item arrives damaged, send an unboxing video/photos within 7 days of delivery on WhatsApp or care@flirta.network and we will ship a replacement at no cost. See Refund & Returns policy.',
  },
] as const;

export const GENERAL_STORE_FAQS: readonly FaqItem[] = [
  {
    id: 'store-faq-1',
    question: 'What material is used for flirta.network products?',
    answer:
      'We use high-grade, durable materials tailored to each design. Illumination pieces use custom light diffusion optics with cool-running LED modules, while stands and desk docks are produced with precision engineering biopolymers.',
  },
  {
    id: 'store-faq-2',
    question: 'What payment methods do you accept?',
    answer:
      'We accept instant UPI (Google Pay, PhonePe, Paytm, CRED), NetBanking, cards via Razorpay, and Partial COD (₹249 advance via UPI, remaining ₹750 at delivery).',
  },
  {
    id: 'store-faq-3',
    question: 'How long does delivery take?',
    answer:
      'Orders are dispatched in 24-48h, delivered in 3-5 business days via Bluedart Express Air with real-time SMS tracking.',
  },
  {
    id: 'store-faq-4',
    question: 'What is the replacement guarantee?',
    answer:
      'Every item is backed by a 7-day transit damage replacement guarantee. Share unboxing photos/video within 7 days and we ship a free replacement.',
  },
] as const;
