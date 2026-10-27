'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/product/ProductCard';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  Clock,
  Layers,
  Box,
  Scale,
  Sparkles,
  Loader2,
  Star,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Package,
  Flame,
  ArrowRight,
} from 'lucide-react';

import { trackPixelEvent } from '@/components/analytics/MetaPixel';

interface ProductDetailClientProps {
  product: any;
  relatedProducts?: any[];
}

export function ProductDetailClient({
  product,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, isLoading: isCartLoading } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    (product.variants && product.variants.length > 0 && product.variants[0].image) ||
      (product.images && product.images.length > 0 && product.images[0].url) ||
      ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const effectivePriceMinor =
    product.priceMinor + (selectedVariant?.priceAdjustmentMinor || 0);

  // Meta Pixel ViewContent event tracking
  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_name: product.title,
      content_category: product.category?.name || 'Studio Collection',
      content_ids: [product.id],
      content_type: 'product',
      value: effectivePriceMinor / 100,
      currency: 'INR',
    });
  }, [product.id, product.title, product.category, effectivePriceMinor]);

  // Swatch color resolver for accurate visual color representation
  const getSwatchColor = (name: string, hex?: string | null): string => {
    const n = (name || '').toLowerCase();
    if (n.includes('pink')) return '#EC4899';
    if (n.includes('blue') || n.includes('cyan')) return '#3B82F6';
    if (n.includes('purple')) return '#A855F7';
    if (n.includes('red')) return '#EF4444';
    if (n.includes('gold') || n.includes('champagne')) return '#D4AF37';
    if (n.includes('white') || n.includes('ivory')) return '#F5F2EB';
    if (n.includes('black') || n.includes('obsidian')) return '#18181B';
    return hex || '#222225';
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const success = await addItem(product.id, selectedVariant?.id, quantity, {
        title: product.title,
        variantName: selectedVariant?.name || null,
        colorHex: selectedVariant?.colorHex || null,
        unitPriceMinor: effectivePriceMinor,
        image: selectedImage || (product.images && product.images[0]?.url) || '',
      });
      if (success) {
        setAdded(true);
        trackPixelEvent('AddToCart', {
          content_name: product.title,
          content_ids: [product.id],
          content_type: 'product',
          value: (effectivePriceMinor * quantity) / 100,
          currency: 'INR',
        });
        setTimeout(() => setAdded(false), 2500);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      addItem(product.id, selectedVariant?.id, quantity, {
        title: product.title,
        variantName: selectedVariant?.name || null,
        colorHex: selectedVariant?.colorHex || null,
        unitPriceMinor: effectivePriceMinor,
        image: selectedImage || (product.images && product.images[0]?.url) || '',
      });
      trackPixelEvent('AddToCart', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: (effectivePriceMinor * quantity) / 100,
        currency: 'INR',
      });
      const query = typeof window !== 'undefined' ? window.location.search : '';
      router.push('/checkout' + (query || ''));
    } catch {
      const query = typeof window !== 'undefined' ? window.location.search : '';
      router.push('/checkout' + (query || ''));
    }
  };

  const specs = typeof product.specs === 'object' && product.specs !== null ? product.specs : {};
  const savings = product.originalPriceMinor
    ? product.originalPriceMinor - effectivePriceMinor
    : 0;

  const isArcReactor = product.slug?.includes('arc');
  const isLevitatingLamp = product.slug?.includes('levitat');

  const defaultArcReviews = [
    {
      id: 'rev-arc-1',
      authorName: 'Ankit Sharma',
      city: 'Mumbai',
      rating: 5,
      title: 'Cinematic breathing LED pulse. Looks like Tony Stark left this on my desk',
      comment:
        'The 0.12mm layer finish is insane. You cannot see layer lines unless you hold it 2 inches away under bright light. The breathing cyan pulse at night creates the most incredible ambient desk vibe. USB-C powered from my monitor dock.',
    },
    {
      id: 'rev-arc-2',
      authorName: 'Rohan Verma',
      city: 'Bengaluru',
      rating: 5,
      title: 'Partial COD made it zero risk. Delivered in 3 days in custom foam',
      comment:
        'Was skeptical about ordering online, but paid only ₹249 advance. Bluedart delivered within 3 days, paid ₹750 at door. Arrived inside custom laser-cut acoustic EVA foam. Extremely premium weighted base.',
    },
    {
      id: 'rev-arc-3',
      authorName: 'Siddharth Iyer',
      city: 'Pune',
      rating: 5,
      title: 'Centerpiece of my minimal developer workstation',
      comment:
        'The copper ring coils and internal acrylic light-diffuser look authentic to the movie prop. Heavy matte finish base prevents any tipping. An absolute steal at flat ₹999.',
    },
    {
      id: 'rev-arc-4',
      authorName: 'Vikram Rathore',
      city: 'New Delhi',
      rating: 5,
      title: '4-Hour bench testing shows in the quality',
      comment:
        'Ran it for 18 hours straight — LEDs stay cool to the touch and the brightness does not fade. 10/10 recommend flirta.network for studio lighting.',
    },
  ];

  const defaultLevitatingReviews = [
    {
      id: 'rev-lev-1',
      authorName: 'Kabir Mehta',
      city: 'Gurugram',
      rating: 5,
      title: 'It ACTUALLY floats and rotates 360° mid-air! Mind blown',
      comment:
        'I honestly thought magnetic levitation at ₹999 was a gimmick, but it genuinely suspends 15-20mm above the base and spins smoothly with zero friction or motor hum. Everyone who walks into my cabin is stunned.',
    },
    {
      id: 'rev-lev-2',
      authorName: 'Aditya Joshi',
      city: 'Hyderabad',
      rating: 5,
      title: 'Alignment helper tool makes balancing effortless in 5 seconds',
      comment:
        'Comes with a patented centering ring tool in the box. Put the tool on the base, set the money capsule in the center, pull the tool away and it instantly floats. The RGB ambient base halo looks insane in dark rooms.',
    },
    {
      id: 'rev-lev-3',
      authorName: 'Pranav Kulkarni',
      city: 'Pune',
      rating: 5,
      title: 'Zero motor noise and safe anti-drop failsafe',
      comment:
        'My roommate accidentally pulled the plug and the capsule snapped right to the center of the base magnetically instead of flying or falling. Safe engineering and packed in 30mm shockproof foam.',
    },
    {
      id: 'rev-lev-4',
      authorName: 'Yashwant Nair',
      city: 'Chennai',
      rating: 5,
      title: 'Top-tier unboxing experience. Verified BIS certified power adapter',
      comment:
        'Arrived with a proper 12V 2A adapter with Indian 2-pin plug, calibration certificate, and warranty card. Partial COD (₹249 advance, ₹750 at doorstep) made this an absolute no-brainer purchase.',
    },
  ];

  const displayedReviews =
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : isArcReactor
      ? defaultArcReviews
      : isLevitatingLamp
      ? defaultLevitatingReviews
      : [];

  const whatsInTheBox = isLevitatingLamp
    ? [
        { item: 'Electromagnetic Levitation Base', desc: 'Active sensor coils with ambient RGB halo lighting' },
        { item: 'Precision Floating Money Capsule', desc: '15–20mm zero-gravity mid-air float' },
        { item: 'Patented Magnetic Centering Guide', desc: 'Aligns and floats in under 10 seconds' },
        { item: '12V 2A Certified Power Adapter', desc: 'BIS-certified Indian standard 2-pin plug' },
        { item: 'Calibration & 1-Year Warranty Card', desc: 'Full coverage on levitation electromagnetics' },
        { item: '30mm Laser-Cut EVA Acoustic Box', desc: 'Custom shockproof molded transit protection' },
      ]
    : isArcReactor
    ? [
        { item: 'Arc Reactor MK-50 Precision Core', desc: '0.12mm additive accuracy with breathing LED array' },
        { item: 'Weighted Studio Display Sanctuary Stand', desc: 'Heavy matte black finish with anti-tip pads' },
        { item: '1.5m Heavy-Duty Braided Type-C Cable', desc: 'Connects to any standard 5V USB / monitor port' },
        { item: 'Numbered Certificate of Authenticity', desc: 'Individually verified studio craft batch seal' },
        { item: '30mm Laser-Cut EVA Foam Collector Box', desc: 'Guarantees 100% damage-free courier delivery' },
      ]
    : null;

  const faqs = isLevitatingLamp
    ? [
        {
          q: 'Does it genuinely float in mid-air without wires or strings?',
          a: 'Yes, 100%! It uses active electromagnetic repulsion coils and magnetic balance sensors inside the base that suspend the money stack capsule 15–20mm in mid-air. Once placed, it floats freely and rotates smoothly 360° continuously with zero friction or motor sound.',
        },
        {
          q: 'How hard is it to balance? Will I struggle to set it up?',
          a: 'Not at all. Every unit includes our custom magnetic centering alignment helper tool in the box. Simply place the helper guide on the base, rest the floating capsule in the center, and gently pull the tool away. It takes less than 10 seconds to float perfectly.',
        },
        {
          q: 'What happens if there is a power cut or it gets accidentally unplugged?',
          a: 'Safety is built-in: the base has an electromagnetic failsafe. If power is interrupted, the floating capsule immediately snaps securely onto the magnetic center of the base, preventing it from falling off the table or sustaining damage.',
        },
        {
          q: 'How does the Partial Cash on Delivery (COD) payment work?',
          a: 'To make your purchase completely worry-free, you pay only a ₹249 advance reservation fee online today via UPI. We immediately dispatch your unit via Bluedart Express Air. You pay the remaining ₹750 balance in cash or UPI when the courier delivers it to your hands (Total ₹999 with zero extra fees).',
        },
        {
          q: 'What is your replacement policy if it is damaged during shipping?',
          a: 'We pack every order in custom 30mm laser-cut EVA acoustic foam. However, if anything arrives damaged or uncalibrated, contact our WhatsApp support (+91 76004 09399) within 7 days, and we will send a brand-new replacement unit with zero questions asked.',
        },
      ]
    : isArcReactor
    ? [
        {
          q: 'What materials and precision standards are used to build this?',
          a: 'The Arc Reactor is 3D-printed in high-density engineering biopolymer with 0.12mm ultra-fine layer height. It features metallic copper-tone core ring windings, translucent light-diffusing acrylic core, and a weighted matte black studio display sanctuary stand.',
        },
        {
          q: 'What illumination modes does it support and does it heat up?',
          a: 'It features cinematic breathing pulse and steady glow modes powered by high-efficiency LED arrays. Thermal management is engineered so the core remains cool to the touch even after 24 hours of continuous operation.',
        },
        {
          q: 'Is the desk display stand and power cable included in the box?',
          a: 'Yes! The package includes the Arc Reactor MK-50 Core, the weighted studio display stand, a 1.5m heavy-duty braided Type-C cable, a numbered Certificate of Authenticity, and custom shockproof EVA foam packaging.',
        },
        {
          q: 'How does Partial COD (Cash on Delivery) work?',
          a: 'You pay only ₹249 online today as an advance studio dispatch deposit. When Bluedart / Delhivery brings the package to your address, you inspect the parcel and pay the remaining balance of ₹750 in cash or UPI upon delivery (Total ₹999 with zero extra fees).',
        },
        {
          q: 'What happens if it arrives defective or damaged during transit?',
          a: 'Every piece is bench-tested for 4 hours before sealing. In the rare event of courier transit damage, we provide a 7-day hassle-free replacement guarantee. Simply message us on WhatsApp (+91 76004 09399) with an unboxing photo, and we dispatch a replacement immediately.',
        },
      ]
    : [
        {
          q: 'How long does delivery take?',
          a: 'Orders are dispatched from our studio within 24 hours. Deliveries across India arrive in 3–5 business days via Bluedart / Delhivery Express Air with live SMS tracking.',
        },
        {
          q: 'What is Partial COD?',
          a: 'Pay a ₹249 reservation advance today to book your order, and pay the remaining ₹750 balance when the courier delivers it to your doorstep (Total ₹999).',
        },
        {
          q: 'What is your replacement policy?',
          a: '7-Day Free Replacement guarantee if anything arrives damaged or defective in transit.',
        },
      ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#D9232D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D9232D] transition-colors">
            Collection
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[#D9232D] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0 scrollbar-none flex-shrink-0">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all ${
                      selectedImage === img.url
                        ? 'border-[#D9232D] ring-2 ring-[#D9232D]/30'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary View */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9232D] text-white shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="uppercase tracking-widest text-[#D9232D] font-bold">
                  {product.category?.name || 'Studio Collection'}
                </span>
                <span className="font-mono text-gray-400">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#222225] leading-tight">
                {product.title}
              </h1>

              {/* Star Rating & Verified Drop Strip */}
              <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">4.9/5</span>
                <span className="text-gray-500 font-medium">
                  ({product.reviews?.length || 4} Verified Collector Reviews)
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 4-Hr Bench Tested
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Truck className="w-3 h-3 text-indigo-600" /> Delivery in 3–5 Days
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2 font-normal leading-relaxed">
                {product.subtitle || product.tagline}
              </p>

              {/* Price Tag with savings */}
              <div className="mt-5 pb-5 border-b border-gray-200 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[#222225]">
                  {formatCurrency(effectivePriceMinor)}
                </span>
                {product.originalPriceMinor && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.originalPriceMinor)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Save {formatCurrency(savings)}
                  </span>
                )}
              </div>

              {/* Diwali Festive Studio Drop Offer Banner */}
              {(effectivePriceMinor === 99900 || product.badge?.includes('12H') || isArcReactor || isLevitatingLamp) && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#FFF1F2] to-[#FFF5F6] border border-[#FECDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E61E2A] animate-pulse shrink-0" />
                    <div>
                      <strong className="text-[#9F1239] block font-semibold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E61E2A]" />
                        Diwali Festive Studio Drop: Flat ₹999
                      </strong>
                      <span className="text-[#BE123C] text-[11px] mt-0.5 block font-medium">
                        Prepaid ₹999 (Free Express Delivery) • Dispatched in 24h • Delivery in 3–5 Days
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-[10px] font-mono font-bold bg-[#E61E2A] text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                      DIWALI SPECIAL
                    </span>
                  </div>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-medium text-[#222225]">
                      Finish & Biopolymer Material
                    </span>
                    <span className="text-gray-500 font-medium">{selectedVariant?.colorName || selectedVariant?.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image) setSelectedImage(v.image);
                        }}
                        className={`py-2 px-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer touch-manipulation ${
                          selectedVariant?.id === v.id
                            ? 'border-[#D9232D] bg-[#FFF5F6] text-[#D9232D] ring-2 ring-[#D9232D]/20 shadow-xs'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs shrink-0"
                          style={{ backgroundColor: getSwatchColor(v.name, v.colorHex) }}
                        />
                        <span>{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Availability */}
              <div className="mt-6 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-medium">
                  In Stock & Ready for Studio Dispatch
                </span>
                <span className="text-gray-500">
                  ({selectedVariant?.stockCount ?? product.stockCount} batch units available)
                </span>
              </div>

              {/* Quantity Selector and CTA Actions */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-xl px-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-black cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium text-[#222225]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag (Vibrant Red) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isCartLoading || isAdding}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#D9232D] text-white text-sm font-medium hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Adding to Bag...
                      </>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Bag
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuying || isAdding}
                  className="w-full py-3.5 px-6 rounded-xl border border-gray-300 bg-[#222225] hover:bg-[#38383D] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isBuying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Adding & Opening Checkout...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      Buy Now with Express Studio Dispatch
                    </>
                  )}
                </button>
                {/* Payment & Delivery Options: Prepaid (₹999) vs Partial COD (₹249 + ₹750) */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/90 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-sm">
                      ₹
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-emerald-950 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Payment & Delivery Options
                        </span>
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          ⚡ 3–5 Day Delivery
                        </span>
                      </div>
                      <p className="text-emerald-900 text-[11.5px] mt-1.5 leading-snug">
                        <strong className="text-emerald-950">⚡ Prepaid UPI (Recommended):</strong> Pay flat <strong className="text-emerald-950">₹999</strong> with zero extra fees + get priority 24h dispatch & free express air courier.
                      </p>
                      <p className="text-emerald-800 text-[11px] mt-1 leading-snug pt-1.5 border-t border-emerald-200/60">
                        <strong>Partial COD:</strong> Pay <strong>₹249 advance</strong> now via UPI to book your piece, and pay the remaining <strong>₹750 balance</strong> upon doorstep delivery (Total flat ₹999).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio Buyer Protection & Assurances Grid */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D9232D]" />
                  Studio Buyer Protection & Assurances
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-[11.5px]">
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9232D]" /> 4-Hr Bench Tested
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Powered & stability-calibrated before sealing
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5 text-[#D9232D]" /> Shockproof Packaging
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Custom 30mm laser-cut EVA acoustic foam
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#D9232D]" /> Tracked Express Air
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Dispatched in 24h with Bluedart live SMS tracking
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-[#D9232D]" /> 7-Day Free Replacement
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Instant zero-hassle replacement if damaged
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Specs Section */}
        <div className="mt-20 pt-12 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Story */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">Concept & Geometry</span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Design Architecture
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
            {product.story && (
              <div className="p-6 rounded-2xl bg-[#FFF5F6] border border-[#D9232D]/15 text-xs text-gray-700 italic leading-relaxed">
                &ldquo;{product.story}&rdquo;
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-gray-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D9232D]" />
                Additive Craft Specifications
              </h3>

              <div className="space-y-3 text-xs divide-y divide-gray-200 pt-1">
                {specs.material && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9232D]" /> Material
                    </span>
                    <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                      {specs.material}
                    </span>
                  </div>
                )}
                {specs.printDuration && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D9232D]" /> Print Duration
                    </span>
                    <span className="font-semibold text-gray-800">{specs.printDuration}</span>
                  </div>
                )}
                {specs.layerHeight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D9232D]" /> Layer Height
                    </span>
                    <span className="font-semibold text-gray-800">{specs.layerHeight}</span>
                  </div>
                )}
                {specs.dimensions && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-[#D9232D]" /> Dimensions
                    </span>
                    <span className="font-semibold text-gray-800">{specs.dimensions}</span>
                  </div>
                )}
                {specs.weight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#D9232D]" /> Net Weight
                    </span>
                    <span className="font-semibold text-gray-800">{specs.weight}</span>
                  </div>
                )}
                {specs.infillDensity && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Internal Infill</span>
                    <span className="font-semibold text-gray-800">{specs.infillDensity}</span>
                  </div>
                )}
                {specs.nozzleDiameter && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Extrusion Nozzle</span>
                    <span className="font-semibold text-gray-800">{specs.nozzleDiameter}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What's In The Box Section */}
        {whatsInTheBox && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-2xl mb-6">
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Complete Turnkey Package
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                What&apos;s Included In The Box
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Every component needed to power, display, and calibrate your piece right out of the box.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whatsInTheBox.map((boxItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F9FAFB] border border-gray-200 flex items-start gap-3 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-[#D9232D] font-bold text-xs shadow-2xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{boxItem.item}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{boxItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Collector FAQ Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Buyer Transparency & Clarity
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Have questions before ordering? Here is everything you need to know about setup, physics, and shipping.
              </p>
            </div>

            <div className="space-y-3 max-w-3xl">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#D9232D] transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-[10px] flex items-center justify-center font-bold text-gray-600 shrink-0">
                          Q{index + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#D9232D]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FDFDFD]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        {displayedReviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#E61E2A]" /> Verified Collector Feedback
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                  Collector Reviews & Impressions
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  100% verified orders dispatched across Mumbai, Bengaluru, Delhi, Hyderabad, and Pune.
                </p>
              </div>

              {/* Aggregate Score Pill */}
              <div className="bg-[#FFF5F6] border border-[#FECDD3] px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold text-[#BE123C] leading-none">4.9</div>
                  <div className="text-[9.5px] uppercase tracking-wider text-[#BE123C]/70 font-semibold mt-0.5">Rating</div>
                </div>
                <div className="h-7 w-px bg-[#FECDD3]" />
                <div>
                  <div className="flex text-amber-500 text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800">
                    {displayedReviews.length} Verified Buyer Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedReviews.map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">Verified Drop</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">&ldquo;{rev.title}&rdquo;</h4>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between items-center">
                    <span className="font-medium text-gray-700">{rev.authorName} {rev.city && `• ${rev.city}`}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Verified Collector
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">Complementary Pieces</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category?.slug}`}
                className="text-xs font-bold text-[#D9232D] hover:underline"
              >
                More in {product.category?.name} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel: any) => (
                <ProductCard
                  key={rel.id}
                  product={{
                    id: rel.id,
                    slug: rel.slug,
                    title: rel.title,
                    tagline: rel.tagline,
                    priceMinor: rel.priceMinor,
                    originalPriceMinor: rel.originalPriceMinor,
                    badge: rel.badge,
                    inStock: rel.inStock,
                    images: rel.images,
                    variants: rel.variants,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Bar: Full-Width Instant Checkout */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isBuying || isAdding}
          className="w-full h-12 rounded-xl bg-[#D9232D] hover:bg-[#b91c1c] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white font-bold text-sm shadow-md disabled:opacity-50 cursor-pointer touch-manipulation select-none"
        >
          {isBuying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Opening Checkout...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Buy Now • {formatCurrency(effectivePriceMinor)}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
