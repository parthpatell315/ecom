import { LEGAL_CONFIG } from '@/config/legal';
import { FaqItem, LEVITATING_LAMP_FAQS, GENERAL_STORE_FAQS } from '@/data/faq';

export interface BoxItem {
  item: string;
  desc: string;
}

export interface ProductHighlight {
  title: string;
  desc: string;
}

export interface ProductStoryMeta {
  badge: string;
  heading: string;
  highlights: ProductHighlight[];
}

export const LIGHTING_FAQS: readonly FaqItem[] = [
  {
    id: 'light-1',
    question: 'What power source does this light require?',
    answer:
      'This illumination piece runs on standard 5V USB-C power. You can plug it into any USB phone wall adapter, laptop port, PC workstation, or portable power bank.',
  },
  {
    id: 'light-2',
    question: 'Can I leave the light on continuously overnight?',
    answer:
      'Yes, absolutely. We use cool-running, energy-efficient high-density LED arrays designed for continuous 24/7 studio ambient illumination with zero heat buildup.',
  },
  {
    id: 'light-3',
    question: 'Can this piece be wall-mounted or placed on a desk?',
    answer:
      'It comes equipped with an integrated weighted display stand for desk setups as well as flush rear keyhole brackets for easy wall mounting.',
  },
  {
    id: 'light-4',
    question: 'How does Partial Cash on Delivery (COD) payment work?',
    answer:
      'Pay ₹149 advance via UPI at checkout to reserve your parcel. Pay the remaining balance in cash or UPI to the courier upon delivery to your hands.',
  },
  {
    id: 'light-5',
    question: 'What is your replacement policy if the piece arrives damaged?',
    answer:
      'Every item is backed by a 7-day transit replacement guarantee. Share unboxing photos or video within 7 days on WhatsApp or care@flirta.network and we ship a replacement immediately.',
  },
] as const;

export const STANDS_AND_DOCKS_FAQS: readonly FaqItem[] = [
  {
    id: 'stand-1',
    question: 'Which controllers and devices are compatible with this stand?',
    answer:
      'Our stands feature universal precision cradles designed to support PS5 DualSense, Xbox Series X/S, Switch Pro controllers, as well as gaming headsets and all standard smartphones.',
  },
  {
    id: 'stand-2',
    question: 'Is the stand weighted so it will not tip or wobble?',
    answer:
      'Yes. The base is engineered with a lowered center of gravity and high-grip non-marking silicone feet that prevent wobbling, sliding, or tipping even under heavier headsets.',
  },
  {
    id: 'stand-3',
    question: 'Will this scratch my desk surface or gaming devices?',
    answer:
      'No. All direct contact points and base plates are fitted with scratch-resistant protective silicone pads to keep your hardware and desk flawless.',
  },
  {
    id: 'stand-4',
    question: 'How does Partial Cash on Delivery (COD) work?',
    answer:
      'Pay ₹149 advance deposit securely via UPI at checkout to confirm your parcel. The remaining balance is payable upon doorstep courier delivery.',
  },
  {
    id: 'stand-5',
    question: 'What is the replacement guarantee?',
    answer:
      'Every item is cushioned in dense protective packaging. In the rare event of transit damage, notify us within 7 days for a 100% free studio replacement.',
  },
] as const;

export const GAMES_AND_COLLECTIBLES_FAQS: readonly FaqItem[] = [
  {
    id: 'game-1',
    question: 'How does the folding mechanism work on the chess board?',
    answer:
      'The board features an ingenious internal 3D magnetic snap-hinge. It opens completely flat with zero seam gap and securely latches shut when folded for travel.',
  },
  {
    id: 'game-2',
    question: 'Are the chess pieces weighted with felt bottoms?',
    answer:
      'Yes, each of the 32 pieces is individually balanced and fitted with a soft acoustic felt base for silent, smooth sliding across the playing surface.',
  },
  {
    id: 'game-3',
    question: 'Is the prop replica full scale?',
    answer:
      'Yes, the display replica is constructed to authentic full 1:1 workstation scale and comes paired with a weighted display stand for studio shelves.',
  },
  {
    id: 'game-4',
    question: 'How does Partial COD payment work?',
    answer:
      'Pay ₹149 advance via UPI at checkout to confirm your reservation. Pay the remaining balance in cash or UPI to the courier upon delivery.',
  },
  {
    id: 'game-5',
    question: 'What is the return and replacement policy?',
    answer:
      'Backed by our 7-day transit replacement guarantee. Share unboxing video or photos within 7 days of delivery for a free immediate replacement.',
  },
] as const;

export const CLOCKS_FAQS: readonly FaqItem[] = [
  {
    id: 'clock-1',
    question: 'How does the ClockDock for iPhone work?',
    answer:
      'The ClockDock holds your iPhone horizontally at the optimal 45° viewing angle, automatically activating Apple iOS StandBy Mode to display dynamic clocks, widgets, and photos.',
  },
  {
    id: 'clock-2',
    question: 'Is the wall clock movement silent or does it tick?',
    answer:
      'Our timepieces feature silent continuous-sweep quartz movements with zero ticking noise, making them ideal for quiet studios, bedrooms, and focused workstations.',
  },
  {
    id: 'clock-3',
    question: 'What power supply does the clock require?',
    answer:
      'StandBy docks utilize your existing MagSafe or braided Lightning/USB-C charging cables with custom cable passthrough channels. Wall clocks run on standard AA batteries.',
  },
  {
    id: 'clock-4',
    question: 'How does Partial COD payment work?',
    answer:
      'Pay ₹149 advance via UPI to confirm order reservation. Pay the remaining balance at your doorstep upon courier handover.',
  },
  {
    id: 'clock-5',
    question: 'What happens if the clock arrives damaged?',
    answer:
      'Packaged in high-density custom EVA foam. If any damage occurs during shipping, contact us within 7 days on WhatsApp for a zero-cost replacement.',
  },
] as const;

/**
 * Resolves product-specific FAQs based on category or slug
 */
export function getProductFaqs(product: any): readonly FaqItem[] {
  const slug = (product.slug || '').toLowerCase();
  const categorySlug = (product.category?.slug || '').toLowerCase();

  if (slug.includes('levitat')) {
    return LEVITATING_LAMP_FAQS;
  }
  if (slug.includes('reactor') || slug.includes('lamp') || slug.includes('lightbox') || categorySlug === 'lamps') {
    return LIGHTING_FAQS;
  }
  if (categorySlug === 'clocks' || slug.includes('clock') || slug.includes('dock')) {
    return CLOCKS_FAQS;
  }
  if (categorySlug === 'stands' || slug.includes('stand') || slug.includes('cradle')) {
    return STANDS_AND_DOCKS_FAQS;
  }
  if (categorySlug === 'games' || slug.includes('chess') || slug.includes('prop') || slug.includes('vandal')) {
    return GAMES_AND_COLLECTIBLES_FAQS;
  }
  return GENERAL_STORE_FAQS;
}

/**
 * Resolves accurate "What's in the Box" package contents for any product
 */
export function getProductBoxContents(product: any): BoxItem[] {
  const slug = (product.slug || '').toLowerCase();
  const categorySlug = (product.category?.slug || '').toLowerCase();

  const adapterText = LEGAL_CONFIG.BIS_REG_NO
    ? `BIS registered: ${LEGAL_CONFIG.BIS_REG_NO}`
    : '12V 2A power adapter';

  // 1. Magnetic Levitating Pieces
  if (slug.includes('levitat')) {
    return [
      { item: 'Electromagnetic Levitation Base', desc: 'Active sensor coils with ambient RGB halo illumination' },
      { item: 'Floating Mid-Air Capsule', desc: 'Zero-gravity mid-air suspension (15–20mm elevation)' },
      { item: 'Magnetic Centering Guide', desc: 'Effortless alignment tool for balanced floating' },
      { item: adapterText, desc: 'Indian standard 2-pin wall plug with power cord' },
      { item: 'Operating & Setup Guide', desc: 'Full step-by-step instructions and safety specifications' },
      { item: 'Shockproof Acoustic EVA Box', desc: 'Custom laser-cut protective packaging for safe transit' },
    ];
  }

  // 2. Core Reactor Desk Light
  if (slug.includes('reactor')) {
    return [
      { item: 'Core Reactor Illumination Ring', desc: 'Multi-ring breathing LED core with optical light diffusion' },
      { item: 'Weighted Desktop Sanctuary Stand', desc: 'High-stability weighted base with non-slip silicone feet' },
      { item: 'Braided USB-C Power Cable (1.5m)', desc: 'High-durability reinforced power cable' },
      { item: 'Dual-Mode Light Switch', desc: 'In-line control for breathing pulse and continuous static glow' },
      { item: 'Studio Authenticity Card', desc: 'Serialized verification card with batch inspection' },
      { item: 'Shockproof Acoustic EVA Box', desc: 'Dense protective custom packaging for transit safety' },
    ];
  }

  // 3. Controller & Headphone Stands
  if (slug.includes('controller') || slug.includes('anti-hero') || slug.includes('claw-hero')) {
    return [
      { item: 'Precision Controller Cradle', desc: 'Custom contoured cradle fitting PS5, Xbox, and Switch controllers' },
      { item: 'Headphone Rest Arch', desc: 'Smooth curved upper hook to protect headphone headband cushion' },
      { item: 'Non-Slip Silicone Grip Pads', desc: 'Pre-installed base pads for zero-wobble desk stability' },
      { item: 'Cable Management Clip', desc: 'Rear passthrough channel for charging cable routing' },
      { item: 'Studio Authenticity Card', desc: 'Serialized verification and quality certificate' },
      { item: 'Custom Protective Transit Box', desc: 'Laser-cut packaging ensuring damage-free delivery' },
    ];
  }

  // 4. Foldable & Ergonomic Laptop Stands
  if (slug.includes('laptop') || slug.includes('stand') || slug.includes('aerostand')) {
    return [
      { item: 'Ergonomic Laptop Riser Stand', desc: 'Lightweight high-strength precision-printed foldable frame' },
      { item: 'Non-Scratch Silicone Surface Pads', desc: 'Protective grips for laptop base and workstation surface' },
      { item: 'Velvet Travel Drawstring Sleeve', desc: 'Compact carrying pouch for easy mobile portability' },
      { item: 'Ergonomic Setup & Angle Guide', desc: 'Recommended posture angles for workstation comfort' },
      { item: 'Quality Guarantee Card', desc: 'Studio warranty and 7-day replacement certificate' },
    ];
  }

  // 5. ClockDock for iPhone
  if (slug.includes('clockdock')) {
    return [
      { item: 'ClockDock StandBy Cradle', desc: '45° angled workstation dock engineered for iPhone StandBy Mode' },
      { item: 'Cable Passthrough Channel', desc: 'Integrated routing for MagSafe or USB-C charging cables' },
      { item: 'Anti-Skid Silicone Base Ring', desc: 'Weighted desk footing for one-handed phone placement' },
      { item: 'Quick-Start StandBy Guide', desc: 'iOS StandBy mode setup tips and widget recommendations' },
      { item: 'Protective Studio Boxing', desc: 'Custom laser-cut transit packaging' },
    ];
  }

  // 6. Prestige Foldable Chess
  if (slug.includes('chess')) {
    return [
      { item: 'Foldable Dual-Tone Chess Board', desc: 'Seamless folding surface with internal magnetic locking hinge' },
      { item: '32 Weighted Chess Pieces', desc: '16 Obsidian Black & 16 Ivory White pieces with acoustic felt bases' },
      { item: 'Internal Piece Storage Compartment', desc: 'Custom-molded foam slots preventing piece movement' },
      { item: 'Velvet Travel Drawstring Pouch', desc: 'Soft storage bag for easy mobile transport' },
      { item: 'Studio Craftsmanship Certificate', desc: 'Inspection sign-off and care guidelines' },
    ];
  }

  // 7. Prop Replica (Prime Vandal)
  if (slug.includes('vandal') || slug.includes('prop')) {
    return [
      { item: 'Prime Vandal Collectible Prop Replica', desc: '1:1 scale precision workstation and wall display prop' },
      { item: 'Weighted Desktop Presentation Stand', desc: 'Custom engraved stand for horizontal shelf showcase' },
      { item: 'Detachable Magazine Attachment', desc: 'Tactile magnetic reload mechanism' },
      { item: 'Collector Authenticity Certificate', desc: 'Numbered collector card and display guide' },
      { item: 'Ultra-Dense Foam Armor Packaging', desc: 'Custom dual-layer protective armor packaging' },
    ];
  }

  // 8. Lightboxes & Ambient LED Lamps
  if (categorySlug === 'lamps' || slug.includes('lightbox') || slug.includes('lamp')) {
    return [
      { item: product.title, desc: 'Dual-tone ambient acrylic LED lightbox art piece' },
      { item: 'USB Power Cord with In-Line Switch', desc: '5V low-voltage cable compatible with all USB ports' },
      { item: 'Integrated Desktop Feet', desc: 'Sturdy freestanding base for desks and shelves' },
      { item: 'Flush Wall-Mounting Bracket', desc: 'Rear mounting slots for seamless wall hanging' },
      { item: 'Studio Lighting Warranty Card', desc: '1-year illumination module guarantee' },
      { item: 'Shockproof Custom Transit Box', desc: 'Laser-cut packaging for transit safety' },
    ];
  }

  // 9. Wall Clocks
  if (categorySlug === 'clocks' || slug.includes('clock')) {
    return [
      { item: product.title, desc: 'Minimalist mathematical wall timepiece' },
      { item: 'Silent Sweep Quartz Mechanism', desc: 'Zero ticking sound for focused quiet workspaces' },
      { item: 'Mounting Hardware Kit', desc: 'Wall anchor and hook for secure installation' },
      { item: 'Studio Authenticity Card', desc: 'Serialized verification card with batch inspection' },
      { item: 'Shockproof Transit Box', desc: 'Custom fitted foam protection' },
    ];
  }

  // 10. Default / Organizers / Keychains
  return [
    { item: product.title, desc: 'Individually calibrated and tested studio craft piece' },
    { item: 'Shockproof Acoustic EVA Box', desc: 'Custom laser-cut protective packaging for safe transit' },
    { item: 'Studio Authenticity Card', desc: 'Serialized verification card with batch inspection' },
    { item: 'Care & Maintenance Guide', desc: 'Instructions for optimal performance & finish preservation' },
  ];
}

/**
 * Resolves narrative badges, headings, and 3 key benefits for any product
 */
export function getProductStoryMeta(product: any): ProductStoryMeta {
  const slug = (product.slug || '').toLowerCase();
  const categorySlug = (product.category?.slug || '').toLowerCase();

  // 1. Magnetic Levitation Pieces (Floating Lamp or Racing Car)
  if (slug.includes('levitat') || slug.includes('car') || slug.includes('racing') || slug.includes('f1')) {
    const isCar = slug.includes('car') || slug.includes('racing') || slug.includes('f1');
    return {
      badge: 'Zero-Gravity Physics',
      heading: isCar ? '360° Magnetic Levitation Racing Display' : 'Magnetic Levitation for Your Workstation',
      highlights: [
        {
          title: '15–20mm Elevation',
          desc: 'Active electromagnetic sensor coils maintain continuous frictionless mid-air float',
        },
        {
          title: '360° Smooth Spin',
          desc: 'Glides continuously with near-zero air friction for mesmerizing kinetic display',
        },
        {
          title: 'BIS-Certified Base',
          desc: 'Low-voltage 12V 2A power supply with failsafe auto-catch magnetic safety',
        },
      ],
    };
  }

  // 2. Core Reactor Desk Light
  if (slug.includes('reactor')) {
    return {
      badge: 'Cinematic Light Architecture',
      heading: 'Hypnotic Ambient Core & Studio Glow',
      highlights: [
        {
          title: 'Breathing Pulse Mode',
          desc: 'Multi-ring rhythmic illumination inspired by futuristic high-energy reactor cores',
        },
        {
          title: 'Cool 5V USB-C Power',
          desc: 'High-density low-voltage LEDs engineered for continuous 24/7 cool-touch desk ambiance',
        },
        {
          title: 'Weighted Studio Stand',
          desc: 'Reinforced desktop sanctuary base with acoustic non-slip silicone feet',
        },
      ],
    };
  }

  // 3. Lumi Lamp
  if (slug.includes('lumi')) {
    return {
      badge: 'Organic Biomimicry',
      heading: 'Sculpted Golden-Ratio Studio Illumination',
      highlights: [
        {
          title: 'Gyroid Light Diffusion',
          desc: 'Parametric internal micro-lattice diffuses warm, glare-free optical luminescence',
        },
        {
          title: '38h Studio Print',
          desc: 'Individually crafted over 38 continuous hours of ultra-fine 0.12mm additive extrusion',
        },
        {
          title: 'Silk & Alabaster Finish',
          desc: 'Carbon-neutral luxury biopolymer with tactile matte satin exterior',
        },
      ],
    };
  }

  // 4. Iskrem Lamp
  if (slug.includes('iskrem')) {
    return {
      badge: 'Nordic Minimalist Geometry',
      heading: 'Layered Light Diffusion for Ambient Desks',
      highlights: [
        {
          title: 'Ambient Soft Glow',
          desc: 'Even, non-flickering light emission perfect for focused evening creative sessions',
        },
        {
          title: 'Dual Placement',
          desc: 'Freestanding desk footing or flush wall-mounting keyhole slots for versatile display',
        },
        {
          title: 'Low Power USB',
          desc: '5V low-draw operation with convenient in-line power switch and braided cable',
        },
      ],
    };
  }

  // 5. Lightboxes (Hero Series, Hero Emblem, Neon City)
  if (slug.includes('lightbox') || slug.includes('emblem') || slug.includes('neon')) {
    return {
      badge: 'Ambient Acrylic Lightbox',
      heading: 'Vibrant Dual-Tone Studio Illumination',
      highlights: [
        {
          title: 'High-Lumen LED Panel',
          desc: 'Uniform optical diffuser eliminates hotspots for vivid, edge-to-edge illumination',
        },
        {
          title: 'Dual-Mount Design',
          desc: 'Freestanding weighted desk base plus rear mounting brackets for wall art display',
        },
        {
          title: 'USB Plug & Play',
          desc: 'Works with any USB port, phone charger, or power bank with in-line switch',
        },
      ],
    };
  }

  // 6. Controller & Headphone Stands (Anti-Hero, Claw-Hero, etc.)
  if (slug.includes('controller') || slug.includes('anti-hero') || slug.includes('claw-hero')) {
    return {
      badge: 'Sculptural Workstation Rest',
      heading: 'Weighted Cradle for Headset & Controllers',
      highlights: [
        {
          title: 'Universal Dual-Cradle',
          desc: 'Custom contoured to support PS5, Xbox, Switch Pro controllers, and studio headsets',
        },
        {
          title: 'Anti-Tip Center of Gravity',
          desc: 'Lowered mass profile and weighted base ensure total stability without wobble',
        },
        {
          title: 'Scratch-Proof Silicone',
          desc: 'Soft contact pads protect device grips, finishes, and premium desktop surfaces',
        },
      ],
    };
  }

  // 7. Foldable Laptop Stands & Risers
  if (slug.includes('laptop') || slug.includes('aerostand') || slug.includes('vertical-laptop')) {
    return {
      badge: 'Ergonomic Precision Riser',
      heading: 'Foldable Posture Support for Any Workstation',
      highlights: [
        {
          title: '25% Better Airflow',
          desc: 'Open elevation lattice promotes natural thermal dissipation for cooler laptop operation',
        },
        {
          title: 'Fold-Flat Portability',
          desc: 'Ultra-slim collapsible profile slips effortlessly into backpacks and laptop sleeves',
        },
        {
          title: 'Ergonomic Viewing Angle',
          desc: 'Raises screen to eye level to alleviate neck stiffness and improve typing posture',
        },
      ],
    };
  }

  // 8. Wave Parametric Device Stand
  if (slug.includes('wave') || slug.includes('parametric')) {
    return {
      badge: 'Parametric Geometry',
      heading: 'Sculptural Phone & Tablet Rest',
      highlights: [
        {
          title: 'Dual-Angle Slots',
          desc: 'Calibrated angles for 45° desk notifications and 60° upright video calls',
        },
        {
          title: 'Monolithic Structure',
          desc: 'Single-piece additive construction with zero moving parts or rattling hinges',
        },
        {
          title: 'Cable Clearance',
          desc: 'Unobstructed bottom passthrough lets you charge vertically while resting',
        },
      ],
    };
  }

  // 9. ClockDock for iPhone
  if (slug.includes('clockdock')) {
    return {
      badge: 'iOS StandBy Architecture',
      heading: 'Engineered for 45° Workstation StandBy Display',
      highlights: [
        {
          title: 'Instant StandBy Mode',
          desc: 'Positions iPhone horizontally at exactly 45° to trigger dynamic clocks & widgets',
        },
        {
          title: 'MagSafe Passthrough',
          desc: 'Concealed internal cable channel keeps charging cords clean and hidden',
        },
        {
          title: 'Weighted Non-Skid Footing',
          desc: 'High-friction silicone ring allows smooth, one-handed phone placement and pickup',
        },
      ],
    };
  }

  // 10. Wall Clocks (Perch Wall Clock)
  if (categorySlug === 'clocks' || slug.includes('clock')) {
    return {
      badge: 'Silent Studio Horology',
      heading: 'Continuous-Sweep Non-Ticking Precision Timepiece',
      highlights: [
        {
          title: '0dB Silent Sweep',
          desc: 'Continuous quartz movement operates with zero audible ticking for quiet focus',
        },
        {
          title: 'Architectural Monolith',
          desc: 'Matte architectural face with high-contrast tactile embossed dimensional markers',
        },
        {
          title: '12+ Month Run Time',
          desc: 'Ultra-low draw quartz engine runs over a year on a single standard AA battery',
        },
      ],
    };
  }

  // 11. Prestige Foldable Chess
  if (slug.includes('chess')) {
    return {
      badge: 'Tactile Kinetic Precision',
      heading: 'Magnetic Dual-Tone Folding Chessboard',
      highlights: [
        {
          title: 'Internal Magnetic Hinge',
          desc: 'Opens 100% seam-flat for play and snaps securely locked for compact travel',
        },
        {
          title: '32 Weighted Pieces',
          desc: 'Balanced obsidian & ivory pieces fitted with acoustic felt for silent moves',
        },
        {
          title: 'Molded Foam Storage',
          desc: 'Interior individual compartments protect every piece from scratches and rattling',
        },
      ],
    };
  }

  // 12. Prime Vandal Prop Replica
  if (slug.includes('vandal') || slug.includes('prop')) {
    return {
      badge: '1:1 Studio Collectible',
      heading: 'Precision Replicated Workstation Display Prop',
      highlights: [
        {
          title: 'Authentic 1:1 Scale',
          desc: 'Full-sized 820mm studio showcase piece recreated in intricate additive layers',
        },
        {
          title: 'Magnetic Detachable Mag',
          desc: 'Tactile magnetic reload mechanism with satisfying mechanical snap',
        },
        {
          title: 'Display Cradle Included',
          desc: 'Weighted desktop cradle engineered for horizontal shelf or desk presentation',
        },
      ],
    };
  }

  // 13. Desk Sanctuary Suite Bundle
  if (slug.includes('sanctuary') || slug.includes('bundle') || categorySlug === 'bundles') {
    return {
      badge: 'Flagship Sanctuary Suite',
      heading: 'Three-Piece Unified Studio Desk Architecture',
      highlights: [
        {
          title: '92 Combined Print Hours',
          desc: 'Flagship master suite combining ambient lamp, organizer, and phone cradle',
        },
        {
          title: 'Harmonized Material Tone',
          desc: 'Silk gold and alabaster biopolymer matched across all three components',
        },
        {
          title: 'Complete Workstation Harmony',
          desc: 'Engineered as a cohesive visual sanctuary for clean, distraction-free workspaces',
        },
      ],
    };
  }

  // 14. Wall Organizers & Coin Banks
  if (slug.includes('worby') || slug.includes('organizer') || slug.includes('bank')) {
    return {
      badge: 'Bauhaus Desk Geometry',
      heading: 'Modular Organization & Cable Management',
      highlights: [
        {
          title: 'Modular Pegboard Grid',
          desc: 'Primary-tone modular anchors organize headphones, keys, pens, and cables',
        },
        {
          title: 'Concealed Mounting',
          desc: 'Rear mounting keyholes allow clean, flush installation with no visible screws',
        },
        {
          title: 'High-Density Biopolymer',
          desc: 'Rigid internal ribbing holds everyday tech accessories with zero sagging',
        },
      ],
    };
  }

  // 15. Keychains & Pass-through Key Docks
  if (slug.includes('key') || slug.includes('pass') || categorySlug === 'keychains') {
    return {
      badge: 'Topological Kinetic Craft',
      heading: 'Magnetic Key Dock & Daily Carry Accessory',
      highlights: [
        {
          title: 'Impossible Geometry',
          desc: 'Interlocking non-Euclidean loop creates a striking tactile optical illusion',
        },
        {
          title: 'Neodymium Magnetic Lock',
          desc: 'Snaps keys securely into docking station with a satisfying mechanical snap',
        },
        {
          title: '3M Wall Mounting Strip',
          desc: 'Includes high-bond adhesive strip for tool-free, damage-free wall mounting',
        },
      ],
    };
  }

  // Fallback
  return {
    badge: 'Design Architecture',
    heading: 'Crafted for Your Workstation',
    highlights: [
      {
        title: '0.12mm Layer Precision',
        desc: 'Additive craftsmanship in eco biopolymer for a refined matte architectural finish',
      },
      {
        title: 'Studio Bench Tested',
        desc: 'Every piece is hand-inspected and tolerance-checked prior to shipping',
      },
      {
        title: 'Acoustic EVA Packaging',
        desc: 'Cushioned in custom laser-cut protective foam for safe, damage-free transit',
      },
    ],
  };
}
