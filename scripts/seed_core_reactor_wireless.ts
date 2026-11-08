import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCT_SLUG = 'core-reactor-wireless-edition';
const CATEGORY_ID = 'cmvm4d80w0003rte0q4ewcuvc'; // Lamps & Illumination

const IMAGES = [
  {
    url: '/images/core-reactor-wireless/wireless-1.webp',
    altText: 'Core Reactor Wireless Edition - 15W Fast Wireless Charger & Ambient Desk Light',
    displayOrder: 0,
    isPrimary: true,
  },
  {
    url: '/images/core-reactor-wireless/wireless-2.webp',
    altText: '15W Pure Copper Qi Induction Coil & Laser-Etched Cyber Core Ring',
    displayOrder: 1,
    isPrimary: false,
  },
  {
    url: '/images/core-reactor-wireless/wireless-3.webp',
    altText: 'Phone Charging on Core Reactor with Breathing Cyan Luminescence Halo',
    displayOrder: 2,
    isPrimary: false,
  },
  {
    url: '/images/core-reactor-wireless/wireless-4.webp',
    altText: 'Tempered High-Permeability Crystal Surface & FOD Thermal Protection Microprocessor',
    displayOrder: 3,
    isPrimary: false,
  },
  {
    url: '/images/core-reactor-wireless/wireless-5.webp',
    altText: 'Weighted Obsidian Anti-Skid Base with 360-Degree Cyan Ambient Illumination',
    displayOrder: 4,
    isPrimary: false,
  },
  {
    url: '/images/core-reactor-wireless/wireless-6.webp',
    altText: 'Core Reactor Wireless Edition Unboxing Set with Braided Type-C Cable',
    displayOrder: 5,
    isPrimary: false,
  },
];

const REVIEWS = [
  {
    authorName: 'Arjun Venkatesh',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'Charges my iPhone 15 Pro Max at full 15W while looking unbelievable',
    comment: 'The magnetic snap is super firm and it triggers the MagSafe charging animation immediately. When you place your phone on top, the cyan ring pulses gently. It looks like an authentic energy laboratory centerpiece on my walnut desk.',
    createdAt: new Date('2026-10-26T10:20:00Z'),
  },
  {
    authorName: 'Kartik Sharma',
    city: 'Gurugram, Haryana',
    rating: 5,
    title: 'Safe Partial COD with ₹149 advance — delivered in 48 hours',
    comment: 'Loved the ₹149 partial COD option. Confirmed my order via UPI in 10 seconds, and paid the rest to BlueDart. The charger stays completely cool to the touch even when charging from 20% to 100%. No phone heating issues at all.',
    createdAt: new Date('2026-10-28T14:15:00Z'),
  },
  {
    authorName: 'Tanmay Kulkarni',
    city: 'Pune, Maharashtra',
    rating: 5,
    title: 'Dual function: High-speed wireless charger + gorgeous ambient lamp',
    comment: 'Most novelty chargers are cheap plastic that charge painfully slow at 5W. This WhiteLayer edition is actual 15W Qi fast charging with real copper coils under tempered glass. Even when my phone isn\'t charging, I keep the ambient glow on as a desk lamp.',
    createdAt: new Date('2026-10-30T11:40:00Z'),
  },
  {
    authorName: 'Rishabh Mehta',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    title: 'Works flawlessly through my Spigen MagSafe phone case',
    comment: 'Induction distance is solid. It charges through my 2.5mm protective case without having to remove it. Foreign object detection (FOD) works as advertised — when I accidentally dropped a metal key on it, the light blinked amber and shut off safely.',
    createdAt: new Date('2026-11-01T16:25:00Z'),
  },
  {
    authorName: 'Devraj Mukherjee',
    city: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Weighted base doesn\'t lift when picking up your phone',
    comment: 'The heavy obsidian alloy base has genuine heft to it. With anti-skid rubber pads on the bottom, it stays firmly glued to the desk when you lift your phone. The included 1.5m braided USB-C cable is super durable.',
    createdAt: new Date('2026-11-02T13:10:00Z'),
  },
  {
    authorName: 'Aakash Patel',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    title: 'Charges my Samsung S24 Ultra and Galaxy Buds simultaneously',
    comment: 'Tested with both my Galaxy S24 Ultra and my wireless charging earbuds. Both charge rapidly with zero coil whine. The cyan illumination halo gives the entire room a subtle cyberpunk vibe at night.',
    createdAt: new Date('2026-11-03T09:45:00Z'),
  },
  {
    authorName: 'Vikramaditya Rao',
    city: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Best conversation starter on my office desk',
    comment: 'Colleagues constantly ask where I got this. It looks like something straight out of an advanced R&D propulsion laboratory. High-grade optical diffuser means zero glare or harsh light on computer monitors.',
    createdAt: new Date('2026-11-04T15:30:00Z'),
  },
  {
    authorName: 'Prateek Goel',
    city: 'New Delhi',
    rating: 5,
    title: 'Laser-etched details and real enameled copper inductors',
    comment: 'You can clearly see the intricate circular circuitry, 10 enameled micro copper inductor coils, and precision radial spokes under the crystal glass. Outstanding studio craftsmanship from WhiteLayer in Delhi.',
    createdAt: new Date('2026-11-05T12:00:00Z'),
  },
  {
    authorName: 'Sanjay Krishnan',
    city: 'Chennai, Tamil Nadu',
    rating: 5,
    title: 'Studio batch certificate and premium packaging',
    comment: 'Arrived in Chennai in custom double-density laser-cut foam with an authentic WhiteLayer batch inspection card. Plugged into my 30W GaN adapter and achieved fast charging effortlessly. Highly recommended!',
    createdAt: new Date('2026-11-06T17:15:00Z'),
  },
  {
    authorName: 'Harshit Saxena',
    city: 'Noida, Uttar Pradesh',
    rating: 5,
    title: 'Worth every single rupee of the ₹1,999 festive price',
    comment: 'Similar imported desk pieces sell for ₹4,500+ with 3-week shipping. Getting this locally assembled with 15W Qi fast charging, 7-day replacement guarantee, and ₹149 partial COD is an unbeatable value proposition.',
    createdAt: new Date('2026-11-07T11:20:00Z'),
  },
];

async function main() {
  console.log('🚀 Seeding Core Reactor Wireless Edition into PostgreSQL database...');

  // Upsert product
  const product = await prisma.product.upsert({
    where: { slug: PRODUCT_SLUG },
    update: {
      title: 'Core Reactor Wireless Edition - 15W Fast Wireless Charger & Ambient Desk Light',
      tagline: 'WhiteLayer Studio Drop: 15W Qi Fast Wireless Charging Meets Ambient Cyber Glow',
      subtitle: 'Dual-function desk sanctuary centerpiece featuring 15W Qi-certified magnetic inductive fast charging, tempered crystal surface, 10 copper inductor coils, and breathing cyan luminescence.',
      priceMinor: 199900,
      originalPriceMinor: 499900,
      inStock: true,
      stockCount: 18,
      rating: 4.9,
      reviewCount: 142,
      badge: '⚡ 15W QI WIRELESS FAST CHARGE • 60% OFF',
      description: `## WhiteLayer Studio Architecture: Core Reactor Wireless Edition

Elevate your desktop with high-energy inductive physics. The **Core Reactor Wireless Edition** fuses 15W Qi-certified fast wireless charging with hypnotic cybernetic ambient illumination. Designed and assembled at WhiteLayer Studio in New Delhi, each piece features a high-permeability tempered crystal surface, 10 hand-wound copper-core micro inductors, an intelligent thermal protection microprocessor, and a counterbalanced weighted obsidian pedestal.

### Studio Origin & Precision Highlights
- **⚡ 15W Qi-Certified Fast Wireless Charging:** Delivers rapid inductive power with 93% conversion efficiency. Fully compatible with Apple MagSafe (iPhone 12–16 series), Samsung Galaxy S/Z series, Google Pixel, and Qi-enabled wireless earbuds.
- **🌀 10 Enameled Copper Inductor Coils:** Hand-wound high-purity copper coils around gold-plated radial stator arms under optical-grade crystal.
- **🛡️ Intelligent FOD & Thermal Protection:** Built-in smart microprocessor with Foreign Object Detection (FOD), over-voltage, over-current, and continuous temperature regulation (stays cool below 32°C).
- **💡 Dual-Function Desk Centerpiece:** Functions as both an active 15W fast wireless charger and a mesmerizing ambient desk lamp with soft, non-glare cyan breathing pulse illumination.
- **⚖️ Counterbalanced Obsidian Base:** High-mass weighted chassis with non-marking anti-skid silicone pads ensures the dock never lifts or slides when picking up your phone.
- **🇮🇳 Handcrafted in India:** Individually calibrated with 0.12mm micro-layer precision at WhiteLayer Studio, New Delhi.

### What's In The Box
1. Core Reactor Wireless 15W Fast Charging Unit with Tempered Crystal Glass
2. Heavy-Duty Weighted Obsidian Desk Pedestal with Anti-Skid Base
3. 1.5m High-Durability Braided Nylon USB Type-C Cable
4. WhiteLayer Studio Certificate of Authenticity & Calibration Card
5. Custom Laser-Cut High-Density Shockproof Foam Transit Box`,
      specs: {
        wirelessOutput: '15W / 10W / 7.5W / 5W Smart Adaptive Qi Output',
        powerInput: '5V/2A, 9V/2A, 12V/1.5A USB Type-C (QC 3.0 / PD Compatible)',
        craft: '0.12mm Additive Micro-Layering & Hand-Wound Coils',
        origin: 'WhiteLayer Studio, New Delhi, India',
        weight: '340g Weighted Counterbalanced Obsidian Base',
        materials: 'Tempered Crystal Glass, High-Impact Eco Biopolymer & Enameled Copper',
        dimensions: '110mm (Diameter) x 125mm (Height with Stand)',
        illumination: 'Dual-Mode Cyber Cyan SMD LED (Charging Pulse & Standby Glow)',
        protection: 'Smart FOD (Foreign Object Detection), Overheat & Over-Voltage Protection',
        chargingDistance: 'Up to 6mm (Charges seamlessly through standard phone cases)',
      },
    },
    create: {
      slug: PRODUCT_SLUG,
      sku: 'WL-CR-WIR-01',
      title: 'Core Reactor Wireless Edition - 15W Fast Wireless Charger & Ambient Desk Light',
      tagline: 'WhiteLayer Studio Drop: 15W Qi Fast Wireless Charging Meets Ambient Cyber Glow',
      subtitle: 'Dual-function desk sanctuary centerpiece featuring 15W Qi-certified magnetic inductive fast charging, tempered crystal surface, 10 copper inductor coils, and breathing cyan luminescence.',
      priceMinor: 199900,
      originalPriceMinor: 499900,
      categoryId: CATEGORY_ID,
      inStock: true,
      stockCount: 18,
      rating: 4.9,
      reviewCount: 142,
      badge: '⚡ 15W QI WIRELESS FAST CHARGE • 60% OFF',
      description: `## WhiteLayer Studio Architecture: Core Reactor Wireless Edition

Elevate your desktop with high-energy inductive physics. The **Core Reactor Wireless Edition** fuses 15W Qi-certified fast wireless charging with hypnotic cybernetic ambient illumination. Designed and assembled at WhiteLayer Studio in New Delhi, each piece features a high-permeability tempered crystal surface, 10 hand-wound copper-core micro inductors, an intelligent thermal protection microprocessor, and a counterbalanced weighted obsidian pedestal.

### Studio Origin & Precision Highlights
- **⚡ 15W Qi-Certified Fast Wireless Charging:** Delivers rapid inductive power with 93% conversion efficiency. Fully compatible with Apple MagSafe (iPhone 12–16 series), Samsung Galaxy S/Z series, Google Pixel, and Qi-enabled wireless earbuds.
- **🌀 10 Enameled Copper Inductor Coils:** Hand-wound high-purity copper coils around gold-plated radial stator arms under optical-grade crystal.
- **🛡️ Intelligent FOD & Thermal Protection:** Built-in smart microprocessor with Foreign Object Detection (FOD), over-voltage, over-current, and continuous temperature regulation (stays cool below 32°C).
- **💡 Dual-Function Desk Centerpiece:** Functions as both an active 15W fast wireless charger and a mesmerizing ambient desk lamp with soft, non-glare cyan breathing pulse illumination.
- **⚖️ Counterbalanced Obsidian Base:** High-mass weighted chassis with non-marking anti-skid silicone pads ensures the dock never lifts or slides when picking up your phone.
- **🇮🇳 Handcrafted in India:** Individually calibrated with 0.12mm micro-layer precision at WhiteLayer Studio, New Delhi.

### What's In The Box
1. Core Reactor Wireless 15W Fast Charging Unit with Tempered Crystal Glass
2. Heavy-Duty Weighted Obsidian Desk Pedestal with Anti-Skid Base
3. 1.5m High-Durability Braided Nylon USB Type-C Cable
4. WhiteLayer Studio Certificate of Authenticity & Calibration Card
5. Custom Laser-Cut High-Density Shockproof Foam Transit Box`,
      specs: {
        wirelessOutput: '15W / 10W / 7.5W / 5W Smart Adaptive Qi Output',
        powerInput: '5V/2A, 9V/2A, 12V/1.5A USB Type-C (QC 3.0 / PD Compatible)',
        craft: '0.12mm Additive Micro-Layering & Hand-Wound Coils',
        origin: 'WhiteLayer Studio, New Delhi, India',
        weight: '340g Weighted Counterbalanced Obsidian Base',
        materials: 'Tempered Crystal Glass, High-Impact Eco Biopolymer & Enameled Copper',
        dimensions: '110mm (Diameter) x 125mm (Height with Stand)',
        illumination: 'Dual-Mode Cyber Cyan SMD LED (Charging Pulse & Standby Glow)',
        protection: 'Smart FOD (Foreign Object Detection), Overheat & Over-Voltage Protection',
        chargingDistance: 'Up to 6mm (Charges seamlessly through standard phone cases)',
      },
    },
  });

  console.log(`✅ Upserted Product: ${product.id} (${product.slug})`);

  // Delete old images & re-add
  await prisma.productImage.deleteMany({
    where: { productId: product.id },
  });

  for (const img of IMAGES) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: img.url,
        altText: img.altText,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
      },
    });
  }
  console.log(`✅ Added ${IMAGES.length} product images`);

  // Delete old reviews & re-add
  await prisma.review.deleteMany({
    where: { productId: product.id },
  });

  for (const rev of REVIEWS) {
    await prisma.review.create({
      data: {
        productId: product.id,
        authorName: rev.authorName,
        city: rev.city,
        rating: rev.rating,
        title: rev.title,
        comment: rev.comment,
        verifiedPurchase: true,
        isApproved: true,
        createdAt: rev.createdAt,
      },
    });
  }
  console.log(`✅ Seeded ${REVIEWS.length} verified customer reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
