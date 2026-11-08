import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCT_SLUG = 'iron-hero-mk5-black-edition-wearable-helmet';
const PRODUCT_SKU = 'WL-MK5-HELMET-BLK';

const IMAGES = [
  { url: '/images/mk5-helmet/helmet-1.webp', altText: 'Iron Hero MK 5 Black Edition Wearable Helmet - Studio View', displayOrder: 0, isPrimary: true },
  { url: '/images/mk5-helmet/helmet-2.jpg', altText: 'MK 5 Black Edition Multi-Segment Motorized Faceplate Opening', displayOrder: 1, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-3.jpg', altText: 'Iron Hero MK 5 Dual Mode Glowing LED Eyes', displayOrder: 2, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-4.webp', altText: 'MK 5 Wearable Helmet 1:1 Scale Cosplay Display', displayOrder: 3, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-5.webp', altText: 'Wireless Remote and Voice Control Demonstration', displayOrder: 4, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-6.webp', altText: 'Bilateral Capacitive Ear Touch Sensor Controls', displayOrder: 5, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-7.jpg', altText: 'Interior Ergonomic Memory Foam and Breathable Airflow Slits', displayOrder: 6, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-8.jpg', altText: 'Stealth Electroplated Matte Black Armor Texture Finish', displayOrder: 7, isPrimary: false },
  { url: '/images/mk5-helmet/helmet-9.webp', altText: 'Complete Unboxing: MK 5 Helmet, 2.4G Remote, Velvet Cover & Manual', displayOrder: 8, isPrimary: false },
];

const REVIEWS = [
  {
    authorName: 'Kabir Singhal',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    title: 'Got it under the Diwali 90% flash sale for ₹2,499 — UNBELIEVABLE!',
    comment: 'I thought ₹2,499 was too good to be true because imported MK5 helmets sell for ₹18,000 to ₹25,000 everywhere else. The voice activation says "Hello Boss" and the multi-segment faceplate splits open smoothly with mechanical servo sounds. Best purchase of 2026 by far!',
    createdAt: new Date('2026-11-04T11:20:00Z'),
  },
  {
    authorName: 'Rohan Deshmukh',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    title: 'The voice command response gave me literal chills!',
    comment: 'Saying "Jarvis, open the mask" or "Combat mode" works instantly. The red combat eye lights look demonic in dark gaming rooms. Fits comfortably over my head without squeezing. Packaging was double-boxed with heavy duty foam.',
    createdAt: new Date('2026-11-04T15:40:00Z'),
  },
  {
    authorName: 'Aryan Varma',
    city: 'Delhi NCR',
    rating: 5,
    title: 'Remote, voice, and side touch controls all work flawlessly',
    comment: 'Tapping the right ear cover opens the mask seamlessly. The dual high-torque servos have genuine segmented plate articulation rather than a cheap single flip. Delivered to Gurugram in 3 days via BlueDart express.',
    createdAt: new Date('2026-11-05T09:15:00Z'),
  },
  {
    authorName: 'Aditya Kulkarni',
    city: 'Pune, Maharashtra',
    rating: 5,
    title: 'Showstopper in my studio battlestation setup',
    comment: 'Every guest who walks into my workspace stops in their tracks. When I use the remote to open it, people lose their minds. Incredible build quality, electroplated stealth black finish looks premium.',
    createdAt: new Date('2026-11-05T14:30:00Z'),
  },
  {
    authorName: 'Varun Teja',
    city: 'Hyderabad, Telangana',
    rating: 5,
    title: 'Opted for Partial COD, arrived safely and paid at doorstep',
    comment: 'Paid ₹149 advance via UPI to lock in the Diwali 90% discount, paid the remaining balance to the courier. Everything tested 100% working out of the box. Highly trusted seller.',
    createdAt: new Date('2026-11-05T18:00:00Z'),
  },
  {
    authorName: 'Siddharth Menon',
    city: 'Chennai, Tamil Nadu',
    rating: 5,
    title: '1:1 true life size — fits perfectly up to 62cm head',
    comment: 'I have a large head (around 60cm) and was worried it wouldn\'t fit. The interior padding is soft memory foam with plenty of breathing room. The eye slits give decent visibility too.',
    createdAt: new Date('2026-11-06T10:10:00Z'),
  },
  {
    authorName: 'Prateek Mehra',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    title: 'The segmented faceplate animation is pure engineering art',
    comment: 'Watching all 6 face plates articulate independently into place feels like real futuristic tech. The servo sounds are crisp and mechanical. For ₹2,499 this is an absolute no-brainer.',
    createdAt: new Date('2026-11-06T13:45:00Z'),
  },
  {
    authorName: 'Neha Chatterjee',
    city: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Ordered for my fiance\'s birthday — he was stunned!',
    comment: 'He is a massive armored hero fan. When he put it on and said the voice command, his reaction was priceless. Quality feels very sturdy and durable, not flimsy plastic.',
    createdAt: new Date('2026-11-06T17:25:00Z'),
  },
  {
    authorName: 'Harshil Patel',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    title: 'Fast air delivery and genuine Indian warranty support',
    comment: 'Arrived within 48 hours of order confirmation. The velvet dust bag and remote controller were neatly packed inside. Customer support on WhatsApp answered my battery setup questions in 2 minutes.',
    createdAt: new Date('2026-11-07T09:50:00Z'),
  },
  {
    authorName: 'Ankit Srivastava',
    city: 'Lucknow, Uttar Pradesh',
    rating: 5,
    title: 'Both cool white and battle red LED modes look stunning',
    comment: 'The eyes have two modes: bright cool white standby and battle red overdrive. Controlled via voice command or remote button. The paint job has zero blemishes. 10/10 recommend!',
    createdAt: new Date('2026-11-07T14:15:00Z'),
  },
];

async function main() {
  console.log('🚀 Seeding Iron Hero MK 5 Black Edition Wearable Helmet...');

  // 1. Find or create category
  let category = await prisma.category.findUnique({
    where: { slug: 'games' },
  });

  if (!category) {
    category = await prisma.category.findFirst();
  }

  if (!category) {
    throw new Error('No category found in database');
  }

  console.log(`Using Category: ${category.name} (${category.id})`);

  // 2. Check if product already exists
  let product = await prisma.product.findUnique({
    where: { slug: PRODUCT_SLUG },
  });

  const productData = {
    slug: PRODUCT_SLUG,
    sku: PRODUCT_SKU,
    title: 'Iron Hero MK 5 Black Edition - 1:1 Wearable Helmet with Voice / Remote / Touch Controls',
    tagline: '1:1 Life-Size Mechanized Helmet with Motorized Multi-Segment Faceplate & Dual LED Eyes',
    subtitle: 'Voice activation, wireless remote, and capacitive touch sensors. Multi-segment motorized opening, authentic AI voice feedback, and dual-mode glowing LED eyes.',
    priceMinor: 249900, // ₹2,499.00
    originalPriceMinor: 2499900, // ₹24,999.00 (90% OFF Diwali Flash Sale!)
    categoryId: category.id,
    description: `## The Ultimate 1:1 Wearable Mechanized Collector's Piece

Experience true movie-grade armor engineering in your hands. The **Iron Hero MK 5 Black Edition** is a wearable 1:1 life-size mechanized helmet featuring motorized multi-segment faceplate opening, responsive bilingual voice commands, 2.4GHz wireless remote control, and capacitive touch activation.

### Key Highlights & Features

- **🗣️ Interactive Voice Command:** Activate the helmet hands-free using clear English commands like *"Jarvis, open the mask"*, *"Combat mode"*, or *"Close the mask"*. The helmet acknowledges with authentic AI vocal responses and mechanical servo sound effects.
- **🎮 2.4GHz Wireless Remote Controller:** Ergonomic pocket remote allows one-touch opening/closing, switching between cool white standby and battle red combat eye lighting modes, and cycling acoustic sounds.
- **👆 Bilateral Ear Touch Sensors:** Built-in capacitive touch plates on both ear caps. Tap the left ear for multi-segment opening, or tap the right ear for synchronized unified closing.
- **⚙️ Motorized Multi-Segment Transformation:** Powered by dual high-torque micro-servos, the front faceplate splits into 6 independent articulating plates that glide open in a fluid, authentic mechanical sequence.
- **👁️ Dual-Mode Glowing LED Eyes:** High-intensity eye optical lenses toggle between cool white standby lighting and combat red overdrive illumination.
- **🎧 Ergonomic 1:1 Wearable Scale:** Designed to fit teenagers and adults comfortably up to 62cm (24.4 inches) head circumference, with interior memory foam lining and ventilation slits for easy breathing.

### Package Contents
1. MK 5 Black Edition 1:1 Wearable Helmet
2. 2.4GHz Wireless Remote Controller
3. Velvet Protective Storage Dust Bag
4. Microfiber Anti-Scratch Cleaning Cloth
5. Quick Start Operation Guide & Voice Command Cheat Sheet`,
    story: 'Engineered with precision aerospace-grade polymers and miniature high-torque servo motors, the MK 5 Black Edition brings movie-grade mechanized cosplay armor to reality. Each piece undergoes 18-point electronic quality control and servo calibration before being boxed in laser-cut protective foam.',
    specs: {
      scale: '1:1 Life-Size Wearable Helmet (Fits head circumference up to 62cm / 24.5 in)',
      finish: 'Stealth Obsidian Electroplated Black with Brushed Metallic Accents',
      controlModes: '3 Activation Modes: English Voice Command, 2.4GHz Wireless Remote, Side Touch Sensors',
      motorSystem: 'Dual High-Torque Micro Servos (Multi-Segment Motorized Opening & Closing)',
      eyeLighting: 'Dual-Color LED Eyes (Cool White Standby & Battle Red Combat Mode)',
      soundSystem: 'Built-In Speaker with Mechanical Servo Sound FX & AI Voice Acknowledgement',
      materials: 'High-Impact Aerospace ABS Polymer & Electronic Servo Components',
      powerSupply: '4x AA Batteries for Helmet + 2x AAA Batteries for Remote (Not Included)',
      origin: 'Studio Calibrated • Shipped Pan-India with Insured Transit',
      warranty: '7-Day Replacement Guarantee if Damaged in Transit',
    },
    rating: 4.9,
    reviewCount: 56,
    badge: '🔥 24H DIWALI SALE • 90% OFF',
    inStock: true,
    stockCount: 4,
    isFeatured: true,
    isFreshLaunch: true,
    isTrending: true,
    isBundle: false,
  };

  if (product) {
    console.log(`Updating existing product ${product.id}...`);
    product = await prisma.product.update({
      where: { id: product.id },
      data: productData,
    });
  } else {
    console.log('Creating new product...');
    product = await prisma.product.create({
      data: productData,
    });
  }

  console.log(`Product created/updated: ${product.title} (ID: ${product.id})`);

  // 3. Upsert Images
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
  console.log(`Added ${IMAGES.length} product images.`);

  // 4. Upsert Reviews
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
  console.log(`Added ${REVIEWS.length} verified customer reviews.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
