import { PrismaClient, Role, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding iloothub database with authentic WhiteLayer catalog...");

  // 1. Clear existing data safely
  await prisma.adminAuditLog.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bundleItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const adminPasswordHash = await bcrypt.hash("AdminPassword@2026!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@iloothub.com",
      passwordHash: adminPasswordHash,
      name: "WhiteLayer Operations Lead",
      phone: "+91 98765 43210",
      role: Role.ADMIN,
    },
  });

  const customerPasswordHash = await bcrypt.hash("CustomerPassword@2026!", 10);
  const customer = await prisma.user.create({
    data: {
      email: "customer@iloothub.com",
      passwordHash: customerPasswordHash,
      name: "Arjun Mehta",
      phone: "+91 98200 12345",
      role: Role.CUSTOMER,
      addresses: {
        create: {
          fullName: "Arjun Mehta",
          phone: "+91 98200 12345",
          addressLine1: "402, Lotus Grandeur, 100 Feet Road",
          addressLine2: "Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
          isDefault: true,
        },
      },
    },
  });

  console.log(`Created admin: ${admin.email} and customer: ${customer.email}`);

  // 3. Seed Categories
  const categoriesData = [
  {
    "slug": "lamps",
    "name": "Lamps & Illumination",
    "description": "3D-printed ambient lightboxes, floating lamps, and luminous desk art.",
    "displayOrder": 1
  },
  {
    "slug": "stands",
    "name": "Stands & Docks",
    "description": "Precision controller cradles, weighted laptop risers, and ergonomic device stands.",
    "displayOrder": 2
  },
  {
    "slug": "clocks",
    "name": "Clocks",
    "description": "StandBy mode digital docks, silent sweep timepieces, and mathematical wall clocks.",
    "displayOrder": 3
  },
  {
    "slug": "organizers",
    "name": "Desk Architecture & Organizers",
    "description": "Modular cable routing trays, coin banks, and geometric wall organizers.",
    "displayOrder": 4
  },
  {
    "slug": "keychains",
    "name": "Keychains & Key Holders",
    "description": "Impossible passthrough mechanical key hangers and collectible chibi toys.",
    "displayOrder": 5
  },
  {
    "slug": "games",
    "name": "Board Games & Collectibles",
    "description": "Folding travel chess boards, gaming weapon props, and desk games.",
    "displayOrder": 6
  },
  {
    "slug": "bundles",
    "name": "Studio Pairings & Bundles",
    "description": "Harmonious multi-piece desk sanctuary collections with bundled price advantages.",
    "displayOrder": 7
  }
];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }

  // 4. Products Data (20 Authentic WhiteLayer Pieces + Flagship Editions)
  const products = [
  {
    "slug": "core-reactor-desk-light",
    "sku": "WL-PROD-01",
    "title": "Core Reactor Desk Light – Ambient Geometric Desk Piece",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Futuristic Cyber Core Illumination ⚡ Luminous focal point for modern desks with precision engineered LED.",
    "priceMinor": 179900,
    "originalPriceMinor": null,
    "categorySlug": "lamps",
    "description": "Bring futuristic hero aesthetics to your workspace with this Core Reactor Desk Light. Inspired by iconic cyber energy cores, this decorative ambient piece features an intricate concentric light guide with breathing cyan LED illumination.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 45,
    "badge": "★ BESTSELLER",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IronmanArcReactor.webp?v=1791795990",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/10.webp?v=1791796001"
    ],
    "variants": [
      {
        "sku": "WL-PROD-01-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light",
    "sku": "WL-PROD-02",
    "title": "Levitating Money Stack Lamp – Magnetic Floating RGB Ambient Light",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Floating Currency LED Lamp ⚡ Magnetic levitation ambient lamp with zero-gravity suspension and 360° spin.",
    "priceMinor": 139900,
    "originalPriceMinor": null,
    "categorySlug": "lamps",
    "description": "Upgrade your workstation with the Levitating Money Stack Lamp. Utilizing active electromagnetic balance sensors, the floating currency capsule suspends 15–20mm in mid-air and rotates smoothly with zero motor hum.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 54,
    "badge": "★ BESTSELLER",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8387732713_5nuk.webp?v=1789717192",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/images_12.jpg?v=1791381685",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/H5915a5486df344a890f9b084d75618dej.jpg_720x720q50.avif?v=1791381715"
    ],
    "variants": [
      {
        "sku": "WL-PROD-02-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "premium-foldable-3d-printed-laptop-stand-designer-gaming-desk-setup-lightweight-portable",
    "sku": "WL-PROD-03",
    "title": "Premium Foldable 3D-Printed Laptop Stand | Designer Gaming Desk Setup | Lightweight & Portable",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Elevate Your Desk Setup with Premium 3D-Printed Engineering Introducing the ultimate gaming and creator workspace essent",
    "priceMinor": 59900,
    "originalPriceMinor": null,
    "categorySlug": "lamps",
    "description": "Elevate Your Desk Setup with Premium 3D-Printed Engineering Introducing the ultimate gaming and creator workspace essential — a lightweight, fully foldable 3D-printed laptop stand designed by NekoJima and handcrafted for professionals who refuse to compromise. WHY THIS STAND? ✓ Premium 3D-Printed Design Engineered with precision using PLA filament at 0.2mm layer height for maximum durability. Each",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 63,
    "badge": "★ BESTSELLER",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-12-20_0fe4919eafa55.webp?v=1789648086",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-12-20_7c54fa1fa0438.webp?v=1789648086",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-12-20_d3decacba150e.webp?v=1789648086",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-04-20_c10aea25387408.webp?v=1789648086",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/70193fd0-cfc3-11ef-b212-01ea09e03d61.webp?v=1789648086",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/70198df0-cfc3-11ef-b212-01ea09e03d61.webp?v=1789648086"
    ],
    "variants": [
      {
        "sku": "WL-PROD-03-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-12-20_0fe4919eafa55.webp?v=1789648086",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "-customizable-3d-printed-coin-bank",
    "sku": "WL-PROD-04",
    "title": "💭 Customizable — 3D Printed Coin Bank",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Save a Little. Dream a Lot. 💫 Turn saving money into something you’ll actually enjoy with the Dreams 3D Printed Coin Ba",
    "priceMinor": 69900,
    "originalPriceMinor": 99900,
    "categorySlug": "organizers",
    "description": "Save a Little. Dream a Lot. 💫 Turn saving money into something you’ll actually enjoy with the Dreams 3D Printed Coin Bank by White Layer . Designed with a unique wave-inspired silhouette and bold “DREAMS” lettering, this isn't your ordinary piggy bank. It’s a stylish desk accessory that gives your savings a dedicated place while adding personality to your room, workspace, or bedside table. Whethe",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 72,
    "badge": "30% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPTImageSep16_2026_10_39_18PM.png?v=1789579296",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPTImageSep16_2026_10_40_27PM.png?v=1789579296",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/3c0ccbdc1c1dd209.webp?v=1789579295",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/20260421_144245.webp?v=1789579295",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/20260421_144457.webp?v=1789579295"
    ],
    "variants": [
      {
        "sku": "WL-PROD-04-V1",
        "name": "Black",
        "colorHex": "#18181B",
        "colorName": "Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPTImageSep16_2026_10_39_18PM.png?v=1789579296",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-04-V2",
        "name": "Beige",
        "colorHex": "#F5F2EB",
        "colorName": "Beige",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPTImageSep16_2026_10_40_27PM.png?v=1789579296",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-04-V3",
        "name": "Gray",
        "colorHex": "#DC2626",
        "colorName": "Gray",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/3c0ccbdc1c1dd209.webp?v=1789579295",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-04-V4",
        "name": "Red",
        "colorHex": "#DC2626",
        "colorName": "Red",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/20260421_144245.webp?v=1789579295",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-04-V5",
        "name": "Pink",
        "colorHex": "#DC2626",
        "colorName": "Pink",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/20260421_144457.webp?v=1789579295",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "spiderman-chibi-toy-keychain",
    "sku": "WL-PROD-05",
    "title": "Spiderman Chibi Toy - Keychain",
    "tagline": "WhiteLayer Bench",
    "subtitle": "🕷️ Spider-Man Chibi Toy Keychain Bring some web-slinging fun to your everyday essentials with our 3D Printed Spider-Man",
    "priceMinor": 29900,
    "originalPriceMinor": 89900,
    "categorySlug": "keychains",
    "description": "🕷️ Spider-Man Chibi Toy Keychain Bring some web-slinging fun to your everyday essentials with our 3D Printed Spider-Man Chibi Keychain , exclusively from White Layer . Made using high-quality 3D printing, this adorable chibi-style Spider-Man features a detailed web design and a playful, collectible look. Its compact size makes it perfect for your keys, backpack, laptop bag, or even as a fun desk ",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 81,
    "badge": "67% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_fadp7zfadp7zfadp.png?v=1788959148",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_ovsrgqovsrgqovsr.png?v=1788959149",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_svnxhdsvnxhdsvnx.png?v=1788959148",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_lbunpvlbunpvlbun.png?v=1788959148",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_rkpgl4rkpgl4rkpg.png?v=1788959149"
    ],
    "variants": [
      {
        "sku": "WL-PROD-05-V1",
        "name": "Only Spiderman",
        "colorHex": "#18181B",
        "colorName": "Only Spiderman",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_fadp7zfadp7zfadp.png?v=1788959148",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-05-V2",
        "name": "Venom & Spiderman",
        "colorHex": "#F5F2EB",
        "colorName": "Venom & Spiderman",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_ovsrgqovsrgqovsr.png?v=1788959149",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-05-V3",
        "name": "All 3 Spidermodels",
        "colorHex": "#DC2626",
        "colorName": "All 3 Spidermodels",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Gemini_Generated_Image_svnxhdsvnxhdsvnx.png?v=1788959148",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "clockdock-digital-clock-for-iphone",
    "sku": "WL-PROD-06",
    "title": "ClockDock Digital Clock For IPhone",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Turn your iPhone into a sleek, glowing bedside clock — clean cables, premium feel, zero clutter. Use Cases &amp; Lifesty",
    "priceMinor": 149900,
    "originalPriceMinor": 299900,
    "categorySlug": "clocks",
    "description": "Turn your iPhone into a sleek, glowing bedside clock — clean cables, premium feel, zero clutter. Use Cases &amp; Lifestyle Turns your iPhone into a sleek bedside clock and alarm — always upright, always ready. A smart desk companion that turns your iPhone into a mini display for time, tasks, and widgets. Your travel-friendly dock that turns any hotel room into a familiar, elegant bedside setup. A ",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 90,
    "badge": "50% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Scott-Yu-Jan-x-OVERWERK-iPhone-Standy-Mode-Dock-1024x576.jpg?v=1788855764",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i8-1024x1024-2-300x300.jpg?v=1788855764",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i6-300x300.jpg?v=1788855764",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i5-300x300.jpg?v=1788855764",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i3-600x600.jpg?v=1788855764"
    ],
    "variants": [
      {
        "sku": "WL-PROD-06-V1",
        "name": "White / 12/13/14/15 STD/PRO / With Charger (iPhone Only)",
        "colorHex": "#18181B",
        "colorName": "White / 12/13/14/15 STD/PRO / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V2",
        "name": "White / 12/13/14/15 STD/PRO / Without Charger",
        "colorHex": "#F5F2EB",
        "colorName": "White / 12/13/14/15 STD/PRO / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Scott-Yu-Jan-x-OVERWERK-iPhone-Standy-Mode-Dock-1024x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V3",
        "name": "White / 12/13/14/15 PLUS/PRO MAX / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "White / 12/13/14/15 PLUS/PRO MAX / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i8-1024x1024-2-300x300.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V4",
        "name": "White / 12/13/14/15 PLUS/PRO MAX / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "White / 12/13/14/15 PLUS/PRO MAX / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i6-300x300.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V5",
        "name": "White / 16/17 STD/PRO / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "White / 16/17 STD/PRO / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i5-300x300.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V6",
        "name": "White / 16/17 STD/PRO / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "White / 16/17 STD/PRO / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/i3-600x600.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V7",
        "name": "White / 16/17 PLUS/PRO MAX / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "White / 16/17 PLUS/PRO MAX / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V8",
        "name": "White / 16/17 PLUS/PRO MAX / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "White / 16/17 PLUS/PRO MAX / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V9",
        "name": "Black / 12/13/14/15 STD/PRO / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "Black / 12/13/14/15 STD/PRO / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V10",
        "name": "Black / 12/13/14/15 STD/PRO / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "Black / 12/13/14/15 STD/PRO / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V11",
        "name": "Black / 12/13/14/15 PLUS/PRO MAX / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "Black / 12/13/14/15 PLUS/PRO MAX / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V12",
        "name": "Black / 12/13/14/15 PLUS/PRO MAX / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "Black / 12/13/14/15 PLUS/PRO MAX / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V13",
        "name": "Black / 16/17 STD/PRO / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "Black / 16/17 STD/PRO / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V14",
        "name": "Black / 16/17 STD/PRO / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "Black / 16/17 STD/PRO / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V15",
        "name": "Black / 16/17 PLUS/PRO MAX / With Charger (iPhone Only)",
        "colorHex": "#DC2626",
        "colorName": "Black / 16/17 PLUS/PRO MAX / With Charger (iPhone Only)",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-06-V16",
        "name": "Black / 16/17 PLUS/PRO MAX / Without Charger",
        "colorHex": "#DC2626",
        "colorName": "Black / 16/17 PLUS/PRO MAX / Without Charger",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "worby-wall-organizer-with-red-blue-and-yellow",
    "sku": "WL-PROD-07",
    "title": "WORBY - Wall Organizer with Red, Blue, and Yellow",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Turn Empty Wall Space Into Something Beautiful. Meet WORBY , a colorful and versatile wall organizer designed to bring o",
    "priceMinor": 59900,
    "originalPriceMinor": null,
    "categorySlug": "organizers",
    "description": "Turn Empty Wall Space Into Something Beautiful. Meet WORBY , a colorful and versatile wall organizer designed to bring order, personality, and functionality to your everyday space. With its clean geometric layout, bold color-blocking, storage pockets, and dedicated hooks, WORBY transforms an otherwise empty wall into a practical organization station — without looking like a boring storage rack. Wh",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 99,
    "badge": null,
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_2.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_3.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_6.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_5.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_4.jpg?v=1788783031",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_1.jpg?v=1788783031"
    ],
    "variants": [
      {
        "sku": "WL-PROD-07-V1",
        "name": "1x3",
        "colorHex": "#18181B",
        "colorName": "1x3",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi.jpg?v=1788783031",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-07-V2",
        "name": "2x3",
        "colorHex": "#F5F2EB",
        "colorName": "2x3",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_2.jpg?v=1788783031",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-07-V3",
        "name": "3x3",
        "colorHex": "#DC2626",
        "colorName": "3x3",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/WORBY_WallOrganizerwithRed_Blue_andYellow_fromthelatestvideo_fullvideo_projectfi_3.jpg?v=1788783031",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "hero-emblem-led-lamp",
    "sku": "WL-PROD-08",
    "title": "Hero Emblem LED Lamp – Premium Room Lighting",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Transform your space with our premium Hero Emblem LED Lamp. Features bold illumination and crisp lines.",
    "priceMinor": 84900,
    "originalPriceMinor": 209900,
    "categorySlug": "lamps",
    "description": "Transform your space into a luminous sanctuary with our premium Hero Emblem LED Lamp. Combining energy-efficient LED modules with high-contrast acrylic diffuser lenses, perfect for gaming rooms, creative desks, and ambient living room lighting.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 108,
    "badge": "60% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.7800210730_enye.webp?v=1789630077",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Q75025s2.webp?v=1788868651",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iap_1200x1200.4549082751_dd01ojne.webp?v=1789630151",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iap_1200x1200.3646426716_r54dj5v7.webp?v=1789630152",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iap_1200x1200.4109376136_lalwazlc.webp?v=1789630152",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Sep_8_2026_05_30_15_PM.png?v=1788868845",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Sep_8_2026_05_34_33_PM.png?v=1788869092",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Sep_8_2026_05_36_16_PM.png?v=1788869193",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/Q75025s.webp?v=1788868652"
    ],
    "variants": [
      {
        "sku": "WL-PROD-08-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.7800210730_enye.webp?v=1789630077",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "iskrem-lamp-by-white-layer-studio",
    "sku": "WL-PROD-09",
    "title": "ISKREM LAMP by White Layer Studio",
    "tagline": "WhiteLayer Bench",
    "subtitle": "A Soft Glow, Sculpted Like a Dream. Meet ISKREM — a beautifully sculptural 3D-printed table lamp inspired by the soft, f",
    "priceMinor": 129900,
    "originalPriceMinor": 189900,
    "categorySlug": "lamps",
    "description": "A Soft Glow, Sculpted Like a Dream. Meet ISKREM — a beautifully sculptural 3D-printed table lamp inspired by the soft, flowing form of a swirl of ice cream. Its distinctive spiral-textured shade creates an organic, almost hypnotic silhouette while gently diffusing the light to produce a warm and inviting glow. Paired with a sleek ribbed base, ISKREM effortlessly blends modern design, cozy lighting",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 117,
    "badge": "32% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-01-24_e3d5b1652938.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-01-24_af56bd51ba932.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-17_381122a658046.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/9a20c570-db6a-11ef-b3ea-19b45abdd57a.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-07-07_064c7b04acead.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-01-05_a3485e175d82f.webp?v=1788522980",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-01-05_49a00b6304956.webp?v=1788522980"
    ],
    "variants": [
      {
        "sku": "WL-PROD-09-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-01-24_e3d5b1652938.webp?v=1788522980",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "valorant-prime-vandal-prop",
    "sku": "WL-PROD-10",
    "title": "Valorant - Prime Vandal ( Prop )",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Bring the Prime Arsenal to Your Collection. Step into the world of VALORANT with the Prime Vandal Prop — a striking 3D-p",
    "priceMinor": 499900,
    "originalPriceMinor": 799900,
    "categorySlug": "games",
    "description": "Bring the Prime Arsenal to Your Collection. Step into the world of VALORANT with the Prime Vandal Prop — a striking 3D-printed replica inspired by one of the game's most recognizable weapon skins. With its signature black, gold, white, and purple color palette , angular futuristic body, distinctive Prime styling, and detailed multi-part construction, this prop is made to look like it came straight",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 126,
    "badge": "38% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/5b684c50-8a64-11f0-983d-e727e880e6f2.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-07-08_9cc084c1719a9.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/5b684c51-8a64-11f0-983d-e727e880e6f2.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-07-08_4704463d2b8ef8.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/5b67d720-8a64-11f0-983d-e727e880e6f2.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-07-04_edd5999898f218.webp?v=1788522567",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-07-08_bb7c71a4294df8.webp?v=1788522567"
    ],
    "variants": [
      {
        "sku": "WL-PROD-10-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/5b684c50-8a64-11f0-983d-e727e880e6f2.webp?v=1788522567",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "prestige-chess-foldable",
    "sku": "WL-PROD-11",
    "title": "Prestige Chess ( Foldable )",
    "tagline": "WhiteLayer Bench",
    "subtitle": "A Chess Set Worth Putting on Display. Step beyond ordinary chess with Prestige Chess — Foldable , a beautifully designed",
    "priceMinor": 219900,
    "originalPriceMinor": 499900,
    "categorySlug": "games",
    "description": "A Chess Set Worth Putting on Display. Step beyond ordinary chess with Prestige Chess — Foldable , a beautifully designed 3D-printed chess set that combines classic strategy with modern, sculptural design . With its distinctive board, detailed chess pieces, and clever foldable construction , Prestige Chess is made for players who want their game to look just as impressive as it feels. Whether you'r",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 135,
    "badge": "56% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-24_b0bb11e8cf6ea8_1.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_5de8df09675218.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-24_93ab1300b17a48.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_dd5953774a313.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_4b09ced3dbd96.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_500a67af4aedf.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_263d94f1fd80b.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_a5f6db069d22e.webp?v=1788518307",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_81570704cc0258.webp?v=1788518307"
    ],
    "variants": [
      {
        "sku": "WL-PROD-11-V1",
        "name": "Beige",
        "colorHex": "#18181B",
        "colorName": "Beige",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-24_b0bb11e8cf6ea8_1.webp?v=1788518307",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-11-V2",
        "name": "Black",
        "colorHex": "#F5F2EB",
        "colorName": "Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-16_5de8df09675218.webp?v=1788518307",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-11-V3",
        "name": "Gray",
        "colorHex": "#DC2626",
        "colorName": "Gray",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-02-24_93ab1300b17a48.webp?v=1788518307",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "key-hanger-impossible-passthrough",
    "sku": "WL-PROD-12",
    "title": "Key Hanger Impossible Passthrough",
    "tagline": "WhiteLayer Bench",
    "subtitle": "A Key Holder That Defies Expectations. Tired of ordinary key hooks? Meet the Impossible Passthrough Key Hanger — a cleve",
    "priceMinor": 49900,
    "originalPriceMinor": 99900,
    "categorySlug": "keychains",
    "description": "A Key Holder That Defies Expectations. Tired of ordinary key hooks? Meet the Impossible Passthrough Key Hanger — a clever little piece of 3D-printed design that combines optical illusion, functionality, and modern décor into one eye-catching accessory. Its unique caged-cylinder design creates the illusion that the colored holders somehow pass straight through the outer frame. Attach your keys to t",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 144,
    "badge": "50% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-09-05_89fc5290a0339.webp?v=1788518045",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-11-14_96dded03f68e5.webp?v=1788518045",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/16f01a50-805e-11ef-b42a-9d1b6a3504c0.webp?v=1788518045",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-09-09_19f6e93548707.webp?v=1788518045",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-09-05_053504fe1137b.webp?v=1788518045",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-09-05_8359792cac95.webp?v=1788518045"
    ],
    "variants": [
      {
        "sku": "WL-PROD-12-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-09-05_89fc5290a0339.webp?v=1788518045",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "neon-city-lightbox",
    "sku": "WL-PROD-13",
    "title": "Neon City Lightbox – Ambient Cyberpunk Room Illumination",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Bring Neon City Energy to Life 🔥 Take your gaming setup to the next level with our vibrant ambient light.",
    "priceMinor": 139900,
    "originalPriceMinor": 209900,
    "categorySlug": "lamps",
    "description": "Bring the aesthetic of vibrant neon city streets to life. Featuring neon tropical artwork and crisp edge diffusion, this lightbox transforms beautifully from a stylish shelf decoration by day into a vibrant gaming-room statement piece by night.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 153,
    "badge": "33% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-06_55e9bad1b1ffb.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-14_35f3cb322392c.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-11_b20af5ca5ea91.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-11_835e317f27d3d.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/d71756daf73060e0.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2a0d27694df10748.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/1aab45d0-9828-11ee-99e2-3bc757f07ff0.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/1a616b90-9828-11ee-99e2-3bc757f07ff0.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/1a7fa1f0-9828-11ee-99e2-3bc757f07ff0.webp?v=1788513602",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/1a63dc90-9828-11ee-99e2-3bc757f07ff0.webp?v=1788513602"
    ],
    "variants": [
      {
        "sku": "WL-PROD-13-V1",
        "name": "Pink",
        "colorHex": "#18181B",
        "colorName": "Pink",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-06_55e9bad1b1ffb.webp?v=1788513602",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-13-V2",
        "name": "Blue",
        "colorHex": "#F5F2EB",
        "colorName": "Blue",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-14_35f3cb322392c.webp?v=1788513602",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-13-V3",
        "name": "Red",
        "colorHex": "#DC2626",
        "colorName": "Red",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-11_b20af5ca5ea91.webp?v=1788513602",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-13-V4",
        "name": "Purple",
        "colorHex": "#DC2626",
        "colorName": "Purple",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2023-12-11_835e317f27d3d.webp?v=1788513602",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "wave-parametric-device-stand",
    "sku": "WL-PROD-14",
    "title": "Wave • Parametric Device Stand",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Where Function Meets Fluid Design. Give your desk a cleaner, more organized look with Wave — a beautifully sculpted para",
    "priceMinor": 49900,
    "originalPriceMinor": 99900,
    "categorySlug": "stands",
    "description": "Where Function Meets Fluid Design. Give your desk a cleaner, more organized look with Wave — a beautifully sculpted parametric device stand designed to hold your everyday tech while adding a touch of modern architectural style. Inspired by flowing waves and organic curves, its ribbed parametric structure creates a striking visual effect from every angle. Despite its artistic appearance, Wave is ma",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 162,
    "badge": "50% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/66ad526b01047be4.webp?v=1788510509",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/dd8741916a322821.webp?v=1788510509",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/148694eb67c06de6.webp?v=1788510508",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/bba41eb072d4d67d.webp?v=1788510509"
    ],
    "variants": [
      {
        "sku": "WL-PROD-14-V1",
        "name": "White",
        "colorHex": "#18181B",
        "colorName": "White",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/66ad526b01047be4.webp?v=1788510509",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-14-V2",
        "name": "Red",
        "colorHex": "#F5F2EB",
        "colorName": "Red",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/dd8741916a322821.webp?v=1788510509",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-14-V3",
        "name": "Green",
        "colorHex": "#DC2626",
        "colorName": "Green",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/148694eb67c06de6.webp?v=1788510508",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-14-V4",
        "name": "Beige",
        "colorHex": "#DC2626",
        "colorName": "Beige",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/bba41eb072d4d67d.webp?v=1788510509",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-14-V5",
        "name": "Black",
        "colorHex": "#DC2626",
        "colorName": "Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/66ad526b01047be4.webp?v=1788510509",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "perch-wall-clock-dubbel",
    "sku": "WL-PROD-15",
    "title": "Perch Wall Clock - DUBBEL",
    "tagline": "WhiteLayer Bench",
    "subtitle": "A timeless classic, reimagined for modern spaces. Meet DUBBEL — a stylish dual-sided wall clock designed to bring a touch of retro character.",
    "priceMinor": 99900,
    "originalPriceMinor": 399900,
    "categorySlug": "clocks",
    "description": "A timeless classic, reimagined for modern spaces. Meet DUBBEL — a stylish dual-sided wall clock designed to bring a touch of retro character and modern minimalism to your space. Inspired by classic station and street-corner clocks, its unique two-sided design lets you check the time from different angles without needing to turn your head or walk across the room. With its smooth rounded face, bold ",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 171,
    "badge": "75% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG-9760.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2776DFF8-558B-4644-9D22-B867B5C46A54.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG_0361.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG_0359.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/86A8C875-AE8C-402E-A501-2136DF50D0A2.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG-0410.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG_0362.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG-0114.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/68EC7EFE-07BC-4EE3-8D64-64E18D9244DB.webp?v=1788091115",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/FullSizeRender_bd569d11-0ef4-4eba-b5a0-6ee0af3ec749.webp?v=1788091115"
    ],
    "variants": [
      {
        "sku": "WL-PROD-15-V1",
        "name": "Red",
        "colorHex": "#18181B",
        "colorName": "Red",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG-9760.webp?v=1788091115",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-15-V2",
        "name": "Beige",
        "colorHex": "#F5F2EB",
        "colorName": "Beige",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2776DFF8-558B-4644-9D22-B867B5C46A54.webp?v=1788091115",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-15-V3",
        "name": "Black",
        "colorHex": "#DC2626",
        "colorName": "Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG_0361.webp?v=1788091115",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-15-V4",
        "name": "Green",
        "colorHex": "#DC2626",
        "colorName": "Green",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/IMG_0359.webp?v=1788091115",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "aerostand-mini-laptop-stand",
    "sku": "WL-PROD-16",
    "title": "“AeroStand” Mini Laptop Stand",
    "tagline": "WhiteLayer Bench",
    "subtitle": "WhiteLayer AeroStand – The Mini Laptop Stand That Redefines Portability Perfect for desks, bags, and any workspace — Aer",
    "priceMinor": 34900,
    "originalPriceMinor": null,
    "categorySlug": "stands",
    "description": "WhiteLayer AeroStand – The Mini Laptop Stand That Redefines Portability Perfect for desks, bags, and any workspace — AeroStand keeps you elevated wherever you work. AeroStand gives creators the perfect mix of form, function, and freedom — the tiniest upgrade with the biggest impact. Ultra-portable. Ultra-stable. The tiniest stand that makes the biggest difference. Why You’ll Love It Compact &amp; ",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 180,
    "badge": null,
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": true,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_383_AIRFLIA-laptop-stand-2-scaled.jpg?v=1787767778",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_381_AIRFLIA-laptop-stand-3-scaled.jpg?v=1787767778",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_387_AIRFLIA-laptop-stand-scaled.jpg?v=1787767778",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_385_AIRFLIA-laptop-stand-4-300x300.jpg?v=1787767778"
    ],
    "variants": [
      {
        "sku": "WL-PROD-16-V1",
        "name": "White",
        "colorHex": "#18181B",
        "colorName": "White",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_383_AIRFLIA-laptop-stand-2-scaled.jpg?v=1787767778",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-16-V2",
        "name": "Black",
        "colorHex": "#F5F2EB",
        "colorName": "Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_381_AIRFLIA-laptop-stand-3-scaled.jpg?v=1787767778",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-16-V3",
        "name": "Blue",
        "colorHex": "#DC2626",
        "colorName": "Blue",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_387_AIRFLIA-laptop-stand-scaled.jpg?v=1787767778",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-16-V4",
        "name": "Red",
        "colorHex": "#DC2626",
        "colorName": "Red",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_385_AIRFLIA-laptop-stand-4-300x300.jpg?v=1787767778",
        "stockCount": 10
      },
      {
        "sku": "WL-PROD-16-V5",
        "name": "Gray",
        "colorHex": "#DC2626",
        "colorName": "Gray",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/imgi_383_AIRFLIA-laptop-stand-2-scaled.jpg?v=1787767778",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "hero-series-led-lightbox",
    "sku": "WL-PROD-17",
    "title": "Hero Series LED Lightbox – Ambient Studio Glow",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Bring heroic studio energy to life. Turn your desk, shelf, or setup into a vibrant centerpiece.",
    "priceMinor": 89900,
    "originalPriceMinor": 149900,
    "categorySlug": "lamps",
    "description": "Bring iconic hero inspiration to life with crisp LED illumination and high-contrast diffusion acrylic for entertainment rooms and gaming workstations.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 189,
    "badge": "40% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": true,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Aug_24_2026_06_52_17_PM.png?v=1787577750",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Aug_24_2026_06_50_57_PM.png?v=1787577685",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-09-21_d7dec38a432018.webp?v=1787494914",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2025-09-21_a7f1cc74aa01b.webp?v=1787494914",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-03-23_7ab79d397ef0d.webp?v=1787494914",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-03-28_ad4e2da2d00648.webp?v=1787494914"
    ],
    "variants": [
      {
        "sku": "WL-PROD-17-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ChatGPT_Image_Aug_24_2026_06_52_17_PM.png?v=1787577750",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "vertical-laptop-stand",
    "sku": "WL-PROD-18",
    "title": "Vertical laptop stand",
    "tagline": "WhiteLayer Bench",
    "subtitle": "More desk. Less clutter. Give your laptop a dedicated place to live. The WhiteLayer VerticalDock is a sleek vertical lap",
    "priceMinor": 89900,
    "originalPriceMinor": 149900,
    "categorySlug": "stands",
    "description": "More desk. Less clutter. Give your laptop a dedicated place to live. The WhiteLayer VerticalDock is a sleek vertical laptop stand designed to keep your workspace clean, organized, and clutter-free. Instead of letting your laptop take up valuable desk space, store it upright and create more room for your monitor, keyboard, mouse, speakers, and everything else that belongs on a great setup. Its mini",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 5,
    "reviewCount": 198,
    "badge": "40% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": true,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-31_d7a033792a4be.webp?v=1787494502",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-31_41c3ee6a8a4ba.webp?v=1787494502",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-31_d294d151ad87a.webp?v=1787494502",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-31_a612209e07246.webp?v=1787494502",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-29_d620784d6c5df.webp?v=1787494502"
    ],
    "variants": [
      {
        "sku": "WL-PROD-18-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/2024-10-31_d7a033792a4be.webp?v=1787494502",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "anti-hero-controller-stand",
    "sku": "WL-PROD-19",
    "title": "Anti-Hero Universal Controller Stand – Weighted Hand Cradle",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Give your controller the display cradle it deserves.",
    "priceMinor": 274900,
    "originalPriceMinor": 499900,
    "categorySlug": "stands",
    "description": "Give your controller the display cradle it deserves. The Anti-Hero Universal Controller Stand brings a bold, comic-inspired aesthetic to your gaming workstation while keeping your controller safely docked.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8,
    "reviewCount": 207,
    "badge": "45% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": true,
    "isTrending": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/cbd28fc1fd62ba39.webp?v=1787493556",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/732fca9af871b8a8.webp?v=1787493556",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/e71bbc30f3196461.webp?v=1787493556",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/8a279f2f593f9a15.webp?v=1787493556",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/26c9021d9c9ed77c.webp?v=1787493557",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/69b5301973637c27.webp?v=1787493556",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/d0295335a635d68a.webp?v=1787493556"
    ],
    "variants": [
      {
        "sku": "WL-PROD-19-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/cbd28fc1fd62ba39.webp?v=1787493556",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "claw-hero-controller-stand",
    "sku": "WL-PROD-20",
    "title": "Claw Hero PS5 Controller Stand – Weighted Cradle",
    "tagline": "WhiteLayer Bench",
    "subtitle": "Turn your gaming setup into a bold centerpiece with this Claw Hero controller stand.",
    "priceMinor": 249900,
    "originalPriceMinor": 499900,
    "categorySlug": "stands",
    "description": "Turn your gaming setup into a bold centerpiece with this Claw Hero 3D-printed PS5 controller stand. Designed with striking metallic claw contours and high-density weighted base.",
    "story": "Crafted at WhiteLayer Studio with high-density biopolymers and hand-buffed satin finish.",
    "specs": {
      "material": "Eco Biopolymer PLA+",
      "layerHeight": "0.12mm - 0.20mm Precision",
      "craft": "Additive 3D Print",
      "origin": "New Delhi, India"
    },
    "rating": 4.8999999999999995,
    "reviewCount": 216,
    "badge": "50% OFF",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": false,
    "isFreshLaunch": true,
    "isTrending": false,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ac38ce92e8aef59b.webp?v=1786604701",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/e12703e512a238f6.jpg?v=1786604701",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/0c68445540933ea0.webp?v=1786604701",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/3f368669995d91b6.webp?v=1786604701"
    ],
    "variants": [
      {
        "sku": "WL-PROD-20-V1",
        "name": "Standard Studio Edition",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/ac38ce92e8aef59b.webp?v=1786604701",
        "stockCount": 10
      }
    ]
  },
  {
    "slug": "wl-lumi-mood-lamp",
    "sku": "WL-LMP-02",
    "title": "Lumi Studio Ambient Mood Lamp",
    "tagline": "Mood Changer",
    "subtitle": "Generative organic Voronoi lattice with warm 2700K diffusion",
    "priceMinor": 139900,
    "originalPriceMinor": 219900,
    "categorySlug": "lamps",
    "description": "Computed using mathematical Voronoi tessellations, this sculptural ambient lamp casts intricate cellular shadow plays across your walls. Fitted with a dimmable warm 2700K LED module and printed in 38 continuous hours without supports.",
    "story": "Inspired by dragonfly wings and bone trabecular architecture, our generative algorithm computed 1,420 unique cell perforations to optimize light dispersion in warm cream and golden tones.",
    "specs": {
      "material": "Silk Gold & Ivory Biopolymer (Carbon Neutral)",
      "printDuration": "38 Hours 20 Mins",
      "layerHeight": "0.12mm Ultra-Fine Precision",
      "dimensions": "220mm × 220mm × 310mm",
      "weight": "580g",
      "infillDensity": "20% Gyroid Infill",
      "nozzleDiameter": "0.4mm Hardened Micro-Swiss"
    },
    "rating": 4.9,
    "reviewCount": 131,
    "badge": "★ BESTSELLER",
    "inStock": true,
    "stockCount": 15,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "images": [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85"
    ],
    "variants": [
      {
        "sku": "WL-LMP-02-CRM",
        "name": "Ivory Cream",
        "colorHex": "#FDFBF7",
        "colorName": "Ivory Cream Biopolymer",
        "image": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
        "stockCount": 10
      },
      {
        "sku": "WL-LMP-02-GLD",
        "name": "Champagne Silk Gold",
        "colorHex": "#D4AF37",
        "colorName": "Silk Champagne Gold",
        "image": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
        "stockCount": 8
      },
      {
        "sku": "WL-LMP-02-BLK",
        "name": "Matte Obsidian",
        "colorHex": "#18181B",
        "colorName": "Obsidian Black Matte",
        "image": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
        "stockCount": 5
      }
    ]
  },
  {
    "slug": "wl-creator-desk-sanctuary",
    "sku": "WL-BND-01",
    "title": "The Creator Desk Sanctuary Bundle",
    "tagline": "Sanctuary Suite",
    "subtitle": "Hero Emblem Lamp + ClockDock + Claw Hero Stand in curated harmony",
    "priceMinor": 329900,
    "originalPriceMinor": 499900,
    "categorySlug": "bundles",
    "description": "The definitive architectural trio designed to curate a serene workspace. Includes the Hero Emblem LED Lamp, ClockDock Digital Clock, and Claw Hero Stand with bundled savings of ₹1,700.",
    "story": "Hand-picked by our design studio to offer a complete sensory sanctuary: gentle ambient illumination, silent mathematical timekeeping, and weighted controller docking.",
    "specs": {
      "material": "Silk Gold, Alabaster Biopolymer & High-Density Matte Black",
      "printDuration": "92 Combined Hours of Craftsmanship",
      "layerHeight": "0.12mm Ultra-Fine Detail Across All Pieces",
      "dimensions": "Complete Sanctuary Suite (3 Full Pieces)",
      "weight": "1,480g Total Suite Weight",
      "infillDensity": "Gyroid Internal Damping",
      "nozzleDiameter": "0.4mm Precision"
    },
    "rating": 5,
    "reviewCount": 47,
    "badge": "★ PERFECT COMBO",
    "inStock": true,
    "stockCount": 10,
    "isFeatured": true,
    "isFreshLaunch": false,
    "isTrending": true,
    "isBundle": true,
    "images": [
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.7800210730_enye.webp?v=1789630077",
      "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764"
    ],
    "variants": [
      {
        "sku": "WL-BND-01-CRM",
        "name": "Ivory & Gold Suite",
        "colorHex": "#FDFBF7",
        "colorName": "Harmonious Ivory & Gold Finish",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.7800210730_enye.webp?v=1789630077",
        "stockCount": 8
      },
      {
        "sku": "WL-BND-01-BLK",
        "name": "Stealth Obsidian Suite",
        "colorHex": "#18181B",
        "colorName": "Matte Obsidian & Titanium Finish",
        "image": "https://cdn.shopify.com/s/files/1/0992/7816/0178/files/iphone-dn-40-clock-dieter-rams-10-768x576.jpg?v=1788855764",
        "stockCount": 6
      }
    ]
  }
];

  for (const p of products) {
    const { images, variants, categorySlug, ...productData } = p;
    const catId = categoryMap.get(categorySlug) || categoryMap.get("organizers");

    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        categoryId: catId!,
      },
    });

    // Create Images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          altText: `${p.title} - View ${i + 1}`,
          displayOrder: i,
          isPrimary: i === 0,
        },
      });
    }

    // Create Variants
    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          sku: v.sku,
          name: v.name,
          colorHex: v.colorHex,
          colorName: v.colorName,
          image: v.image || images[0] || "",
          stockCount: v.stockCount,
          inStock: true,
        },
      });
    }

    console.log(`Created product: ${p.title} (${variants.length} variants)`);
  }

  // 5. Seed Testimonials & Reviews
  const reviewsData = [
    {
      authorName: "Arjun Mehta",
      city: "Bengaluru, India",
      rating: 5,
      title: "Museum-grade finish with zero defects",
      comment: "The Hero Emblem LED lamp casts incredible geometric shadow plays across my studio walls. Zero layer stringing or defects, and the warm acrylic biopolymer feels exceptionally premium.",
      verifiedPurchase: true,
      productSlug: "hero-emblem-led-lamp",
    },
    {
      authorName: "Devika Sharma",
      city: "Mumbai, India",
      rating: 5,
      title: "Pure kinetic art and silent mechanism",
      comment: "The ClockDock for iPhone is pure aesthetic bliss. Standby mode looks incredible and the 3D printed precision fit is perfection.",
      verifiedPurchase: true,
      productSlug: "clockdock-digital-clock-for-iphone",
    },
    {
      authorName: "Rohan Deshmukh",
      city: "Delhi NCR, India",
      rating: 5,
      title: "Transformed my desk into an architectural centerpiece",
      comment: "The Claw Hero controller stand has solid weighted stability and zero wobble. Handcrafted quality that stands out.",
      verifiedPurchase: true,
      productSlug: "claw-hero-controller-stand",
    },
    {
      authorName: "Ananya Roy",
      city: "Hyderabad, India",
      rating: 5,
      title: "Prestige Chess folding mechanism is incredible",
      comment: "The foldable Prestige Chess set has an ingenious 3D hinge system. Smooth tactile magnetic feel, fast 2-day delivery across India.",
      verifiedPurchase: true,
      productSlug: "prestige-chess-foldable",
    },
  ];

  for (const r of reviewsData) {
    const prod = await prisma.product.findUnique({ where: { slug: r.productSlug } });
    if (prod) {
      await prisma.review.create({
        data: {
          productId: prod.id,
          userId: customer.id,
          authorName: r.authorName,
          city: r.city,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verifiedPurchase: r.verifiedPurchase,
        },
      });
    }
  }

  // 6. Seed Discount Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "LAUNCH10",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrderMinor: 0,
        usageLimit: 1000,
        usageCount: 14,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "SANCTUARY20",
        discountType: DiscountType.FIXED,
        discountValue: 20000, // ₹200 off
        minOrderMinor: 199900, // Minimum ₹1,999
        usageLimit: 500,
        usageCount: 8,
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // 7. Seed Sample Order
  const sampleProduct = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (sampleProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "IL-2026-1001",
        user: { connect: { id: customer.id } },
        guestEmail: customer.email,
        guestPhone: customer.phone!,
        guestName: customer.name,
        subtotalMinor: sampleProduct.priceMinor,
        discountMinor: 0,
        shippingMinor: 0,
        taxMinor: 0,
        totalMinor: sampleProduct.priceMinor,
        status: "PROCESSING",
        shippingAddress: {
          fullName: "Arjun Mehta",
          phone: "+91 98200 12345",
          addressLine1: "402, Lotus Grandeur",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
        },
        items: {
          create: {
            productId: sampleProduct.id,
            variantId: sampleProduct.variants[0]?.id,
            sku: sampleProduct.sku,
            titleSnapshot: sampleProduct.title,
            variantNameSnapshot: sampleProduct.variants[0]?.name || "Standard",
            unitPriceMinor: sampleProduct.priceMinor,
            quantity: 1,
            totalMinor: sampleProduct.priceMinor,
            imageSnapshot: sampleProduct.variants[0]?.image || "",
          },
        },
      },
    });
    console.log("Created sample verified order: IL-2026-1001");
  }

  console.log("WhiteLayer database seeding completed successfully with 22 authentic products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
