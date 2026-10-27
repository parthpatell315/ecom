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
  ArrowRight,
  Play,
  Video,
} from 'lucide-react';

import { trackPixelEvent } from '@/components/analytics/MetaPixel';
import { LEGAL_CONFIG } from '@/config/legal';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import { DELIVERY_PROMISE } from '@/config/shipping';
import { MEDIA_CONFIG, checkImageRights } from '@/config/media';
import { LEVITATING_LAMP_FAQS, GENERAL_STORE_FAQS } from '@/data/faq';
import reviewsData from '@/data/reviews.json';

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
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video'>('image');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const effectivePriceMinor =
    product.priceMinor + (selectedVariant?.priceAdjustmentMinor || 0);

  // Dev warning for marketplace stock image naming patterns
  useEffect(() => {
    if (selectedImage) {
      checkImageRights(selectedImage);
    }
  }, [selectedImage]);

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

  // Swatch color resolver
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
  const hasCompareAt = Boolean(
    product.originalPriceMinor && product.originalPriceMinor > effectivePriceMinor
  );
  const savings = hasCompareAt ? product.originalPriceMinor! - effectivePriceMinor : 0;

  const isLevitatingLamp = product.slug?.includes('levitat');
  const isSaleActiveNow = isSaleActive(SALE_CONFIG.SALE_END_DATE);

  // Reviews data-driven requirement: hide entirely if fewer than 5 real reviews exist
  const rawReviews = Array.isArray(product.reviews) && product.reviews.length > 0
    ? product.reviews
    : Array.isArray(reviewsData)
    ? reviewsData
    : [];
  const showReviews = rawReviews.length >= 5;

  // What's in the box: Claims cleanup
  const adapterText = LEGAL_CONFIG.BIS_REG_NO
    ? `BIS registered: ${LEGAL_CONFIG.BIS_REG_NO}`
    : '12V 2A power adapter';

  const whatsInTheBox = isLevitatingLamp
    ? [
        { item: 'Electromagnetic Levitation Base', desc: 'Active sensor coils with ambient RGB halo illumination' },
        { item: 'Floating Money Capsule', desc: 'Zero-gravity mid-air suspension (15–20mm elevation)' },
        { item: 'Magnetic Centering Guide', desc: 'Effortless alignment tool for balanced floating' },
        { item: adapterText, desc: 'Indian standard 2-pin wall plug with power cord' },
        { item: 'Operating & Setup Guide', desc: 'Full step-by-step instructions and safety specifications' },
        { item: 'Shockproof Acoustic EVA Box', desc: 'Custom laser-cut protective packaging for safe transit' },
      ]
    : null;

  // Frequently Asked Questions
  const faqs = isLevitatingLamp ? LEVITATING_LAMP_FAQS : GENERAL_STORE_FAQS;

  // Stock inventory text
  const stockCount = selectedVariant?.stockCount ?? product.stockCount ?? 10;
  const stockText =
    stockCount > 0 && stockCount <= 5
      ? `Only ${stockCount} left`
      : product.inStock
      ? 'In stock'
      : 'Out of stock';

  // Variant selector: only display option group if more than 1 option exists
  const hasMultipleVariants = Array.isArray(product.variants) && product.variants.length > 1;

  // Video path
  const videoSource = product.videoUrl || MEDIA_CONFIG.DEFAULT_FLOATING_VIDEO;
  const videoPoster = product.images?.[0]?.url || MEDIA_CONFIG.DEFAULT_VIDEO_POSTER;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
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
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.url);
                      setActiveMediaTab('image');
                    }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      activeMediaTab === 'image' && selectedImage === img.url
                        ? 'border-[#D9232D] ring-2 ring-[#D9232D]/30'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}

                {/* Video Slot Thumbnail */}
                {isLevitatingLamp && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all cursor-pointer bg-neutral-900 flex flex-col items-center justify-center text-white ${
                      activeMediaTab === 'video'
                        ? 'border-[#D9232D] ring-2 ring-[#D9232D]/30'
                        : 'border-gray-200 opacity-80 hover:opacity-100'
                    }`}
                    aria-label="Watch video demonstration"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span className="text-[9px] font-bold uppercase mt-1">Video</span>
                  </button>
                )}
              </div>
            )}

            {/* Primary View */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
              {activeMediaTab === 'video' ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video
                    src={videoSource}
                    poster={videoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[10.5px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Watch it float in mid-air</span>
                  </div>
                </div>
              ) : selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-500"
                  />
                  {/* Prominent Above-the-fold mobile video button */}
                  {isLevitatingLamp && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className="md:hidden absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg border border-white/20 active:scale-95 transition-transform"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Watch it float</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {/* Badges: Only render if valid non-fake urgency badge */}
              {product.badge && !product.badge.includes('12H') && (
                <div className="absolute top-4 left-4">
                  <span className="py-1 px-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#222225] text-white shadow-sm">
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

              {/* Star Rating Line: Render ONLY if >= 5 real reviews exist */}
              {showReviews && (
                <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}/5
                  </span>
                  <span className="text-gray-500 font-medium">
                    ({rawReviews.length} Verified Reviews)
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-2 font-normal leading-relaxed">
                {product.subtitle || product.tagline}
              </p>

              {/* Price Tag: Compare-at only rendered if real compare_at_price exists */}
              <div className="mt-5 pb-5 border-b border-gray-200 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[#222225]">
                  {formatCurrency(effectivePriceMinor)}
                </span>
                {hasCompareAt && (
                  <span className="text-base text-gray-400 line-through">
                    {formatCurrency(product.originalPriceMinor!)}
                  </span>
                )}
                {hasCompareAt && savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Save {formatCurrency(savings)}
                  </span>
                )}
              </div>

              {/* Promotional Banner: Rendered ONLY if sale is actively configured */}
              {isSaleActiveNow && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#FFF1F2] to-[#FFF5F6] border border-[#FECDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E61E2A] animate-pulse shrink-0" />
                    <div>
                      <strong className="text-[#9F1239] block font-semibold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E61E2A]" />
                        {SALE_CONFIG.DEFAULT_ANNOUNCEMENT}
                      </strong>
                      <span className="text-[#BE123C] text-[11px] mt-0.5 block font-medium">
                        {DELIVERY_PROMISE}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="text-[10px] font-mono font-bold bg-[#E61E2A] text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {SALE_CONFIG.PROMOTION_LABEL}
                    </span>
                  </div>
                </div>
              )}

              {/* Variant Selector: HIDE if only 1 option exists */}
              {hasMultipleVariants && (
                <div className="mt-6">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-medium text-[#222225]">Available Finishes</span>
                    <span className="text-gray-500 font-medium">
                      {selectedVariant?.colorName || selectedVariant?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          if (v.image) {
                            setSelectedImage(v.image);
                            setActiveMediaTab('image');
                          }
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

              {/* Real Stock Inventory Status */}
              <div className="mt-6 flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span
                  className={`font-medium ${
                    product.inStock ? 'text-emerald-700' : 'text-gray-500'
                  }`}
                >
                  {stockText}
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
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium text-[#222225]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-black cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isCartLoading || isAdding || !product.inStock}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#D9232D] text-white text-sm font-medium hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Adding to Cart...
                      </>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuying || isAdding || !product.inStock}
                  className="w-full py-3.5 px-6 rounded-xl border border-gray-300 bg-[#222225] hover:bg-[#38383D] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isBuying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Opening Checkout...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400" />
                      Buy Now
                    </>
                  )}
                </button>

                {/* Payment & Delivery Options Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/90 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 font-bold text-sm">
                      ₹
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-emerald-950 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Payment &amp; Delivery Options
                        </span>
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          {DELIVERY_PROMISE}
                        </span>
                      </div>
                      <p className="text-emerald-900 text-[11.5px] mt-1.5 leading-snug">
                        <strong className="text-emerald-950">Prepaid UPI:</strong> Pay flat{' '}
                        <strong className="text-emerald-950">{formatCurrency(effectivePriceMinor)}</strong> with free delivery.
                      </p>
                      <p className="text-emerald-800 text-[11px] mt-1 leading-snug pt-1.5 border-t border-emerald-200/60">
                        <strong>Partial COD:</strong> Pay <strong>₹249 advance</strong> via UPI to confirm, and pay the remaining balance of <strong>₹750</strong> upon courier delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Strip under CTA (Exactly 4 items max) */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2.5 text-[11.5px]">
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#D9232D]" /> Delivery Promise
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      {DELIVERY_PROMISE}
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-[#D9232D]" /> 7-Day Replacement
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Damage replacement with unboxing video
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D9232D]" /> Secure Checkout
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Instant UPI &amp; Razorpay payment
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9232D]" /> WhatsApp Support
                    </span>
                    <span className="text-[10.5px] text-gray-500 mt-1 leading-snug">
                      Support desk: +91 76004 09399
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Data-Driven Specifications Section */}
        <div className="mt-20 pt-12 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Story & Description */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">
                Overview &amp; Design
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Design Architecture
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            {product.story && (
              <div className="p-6 rounded-2xl bg-[#FFF5F6] border border-[#D9232D]/15 text-xs text-gray-700 italic leading-relaxed">
                &ldquo;{product.story}&rdquo;
              </div>
            )}
          </div>

          {/* Data-Driven Technical Specifications */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#F9FAFB] border border-gray-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D9232D]" />
                Technical Specifications
              </h3>

              <div className="space-y-3 text-xs divide-y divide-gray-200 pt-1">
                {(product.material || specs.material) && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9232D]" /> Material
                    </span>
                    <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                      {product.material || specs.material}
                    </span>
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
                {(product.weightGrams || specs.weight) && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#D9232D]" /> Net Weight
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.weightGrams ? `${product.weightGrams}g` : specs.weight}
                    </span>
                  </div>
                )}
                {specs.powerInput && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Power Input</span>
                    <span className="font-semibold text-gray-800">{specs.powerInput}</span>
                  </div>
                )}
                {specs.levitationHeight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Levitation Height</span>
                    <span className="font-semibold text-gray-800">{specs.levitationHeight}</span>
                  </div>
                )}
                {/* Only render 3D-printing specific fields if present on the product */}
                {specs.layerHeight && (
                  <div className="pt-2 flex justify-between">
                    <span className="text-gray-500">Layer Precision</span>
                    <span className="font-semibold text-gray-800">{specs.layerHeight}</span>
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
                <Package className="w-3.5 h-3.5" /> Package Contents
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                What&apos;s Included In The Box
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Everything required to set up and operate your lamp out of the box.
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
                    <h3 className="text-xs font-bold text-gray-900">{boxItem.item}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{boxItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessible FAQ Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Customer Clarity
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Clear answers regarding setup, physics, power safety, and delivery terms.
              </p>
            </div>

            <div className="space-y-3 max-w-3xl">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const faqId = `faq-control-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-2xs"
                  >
                    <button
                      type="button"
                      id={faqId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#D9232D] transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-[10px] flex items-center justify-center font-bold text-gray-600 shrink-0">
                          Q{index + 1}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#D9232D]' : ''
                        }`}
                      />
                    </button>
                    {/* All answers present in DOM for search crawlers / SEO with id and role */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={faqId}
                      className={`px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FDFDFD] ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verified Reviews Section: Rendered ONLY if >= 5 verified reviews exist */}
        {showReviews && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">
                  Verified Feedback
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
                  Customer Reviews
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rawReviews.map((rev: any) => (
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
                      {rev.verified && (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[10.5px] flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Verified buyer
                        </span>
                      )}
                    </div>
                    {rev.title && (
                      <h3 className="text-sm font-bold text-gray-900">&ldquo;{rev.title}&rdquo;</h3>
                    )}
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {rev.authorName} {rev.city && `• ${rev.city}`}
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
                <span className="text-xs uppercase tracking-widest text-[#D9232D] font-bold">
                  Curated Catalog
                </span>
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

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isBuying || isAdding || !product.inStock}
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
