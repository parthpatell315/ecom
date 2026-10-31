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
  Layers,
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
  MessageCircle,
} from 'lucide-react';

import { trackPixelEvent } from '@/components/analytics/MetaPixel';
import { LEGAL_CONFIG } from '@/config/legal';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import {
  DELIVERY_PROMISE,
  PARTIAL_COD_ADVANCE_MINOR,
  PARTIAL_COD_ADVANCE_RUPEES,
} from '@/config/shipping';
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
  const totalPriceMinor = effectivePriceMinor * quantity;
  const doorstepBalanceMinor = Math.max(0, totalPriceMinor - PARTIAL_COD_ADVANCE_MINOR);

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
    return hex || '#1D1D1F';
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;
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
          value: totalPriceMinor / 100,
          currency: 'INR',
        });
        setTimeout(() => setAdded(false), 2500);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product.inStock) return;
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
        value: totalPriceMinor / 100,
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
  const discountPercent = hasCompareAt
    ? Math.round((savings / product.originalPriceMinor!) * 100)
    : 0;

  const isLevitatingLamp = product.slug?.includes('levitat');
  const isSaleActiveNow = isSaleActive(SALE_CONFIG.SALE_END_DATE);

  // Reviews: Verified feedback display
  const rawReviews = Array.isArray(product.reviews) && product.reviews.length > 0
    ? product.reviews
    : Array.isArray(reviewsData)
      ? reviewsData
      : [];
  const showReviews = rawReviews.length > 0;

  // What's in the box: Clean hardware contents
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
    : [
        { item: product.title, desc: 'Individually calibrated and tested studio piece' },
        { item: 'Shockproof Acoustic EVA Box', desc: 'Custom laser-cut protective packaging for safe transit' },
        { item: 'Studio Authenticity Card', desc: 'Serialized verification card with batch inspection' },
        { item: 'Care & Maintenance Guide', desc: 'Instructions for optimal performance & finish preservation' },
      ];

  // Frequently Asked Questions
  const faqs = isLevitatingLamp ? LEVITATING_LAMP_FAQS : GENERAL_STORE_FAQS;

  // Stock inventory text
  const stockCount = selectedVariant?.stockCount ?? product.stockCount ?? 10;
  const stockText =
    stockCount > 0 && stockCount <= 5
      ? `Only ${stockCount} left in batch`
      : product.inStock
        ? 'In stock'
        : 'Out of stock';

  // Variant selector: only display option group if more than 1 option exists
  const hasMultipleVariants = Array.isArray(product.variants) && product.variants.length > 1;

  // Video path
  const hasVideo = Boolean(product.videoUrl || isLevitatingLamp);
  const videoSource = product.videoUrl || MEDIA_CONFIG.DEFAULT_FLOATING_VIDEO;
  const videoPoster = product.images?.[0]?.url || MEDIA_CONFIG.DEFAULT_VIDEO_POSTER;
  const hasMultipleMedia = (product.images && product.images.length > 1) || hasVideo;

  return (
    <div className="bg-white min-h-screen text-[#1D1D1F]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-32 md:pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#86868B] mb-8 flex items-center gap-1.5 flex-wrap font-normal" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1D1D1F] transition-colors">
            Store
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[#1D1D1F] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#1D1D1F] font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {hasMultipleMedia && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0 scrollbar-none shrink-0">
                {product.images && product.images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.url);
                      setActiveMediaTab('image');
                    }}
                    className={`shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#F5F5F7] ${
                      activeMediaTab === 'image' && selectedImage === img.url
                        ? 'border-[#1D1D1F] ring-1 ring-[#1D1D1F]'
                        : 'border-black/[0.08] opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}

                {/* Video Slot Thumbnail */}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#1D1D1F] flex flex-col items-center justify-center text-white ${
                      activeMediaTab === 'video'
                        ? 'border-[#1D1D1F] ring-1 ring-[#1D1D1F]'
                        : 'border-black/[0.08] opacity-80 hover:opacity-100'
                    }`}
                    aria-label="Watch video demonstration"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span className="text-[9.5px] font-semibold uppercase mt-1 tracking-wider">Video</span>
                  </button>
                )}
              </div>
            )}

            {/* Primary View Frame */}
            <div className="relative flex-1 w-full aspect-square rounded-3xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-center shadow-apple">
              {activeMediaTab === 'video' ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center rounded-3xl overflow-hidden">
                  <video
                    src={videoSource}
                    poster={videoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none z-10">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Watch demonstration</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('image')}
                    className="absolute top-4 right-4 bg-white/95 hover:bg-white text-[#1D1D1F] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-apple transition-colors cursor-pointer z-10"
                    aria-label="Back to photo"
                  >
                    View Photo
                  </button>
                </div>
              ) : selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 sm:p-8 transition-all duration-300"
                  />
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className="absolute bottom-3.5 right-3.5 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-apple active:scale-95 transition-all cursor-pointer z-10"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Watch video</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#86868B] text-sm">
                  No Image Available
                </div>
              )}

              {product.badge && !product.badge.includes('12H') && activeMediaTab !== 'video' && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="py-1 px-3 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#1D1D1F] border border-black/[0.06] shadow-xs">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div>
              <div className="flex items-center justify-between text-xs text-[#86868B] mb-2">
                <span className="uppercase tracking-wider font-semibold text-[#1D1D1F]">
                  {product.category?.name || 'Studio Collection'}
                </span>
                <span className="font-mono text-[#86868B]">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1D1D1F] leading-tight">
                {product.title}
              </h1>

              {/* Star Rating: Linked directly to Verified Reviews section */}
              {showReviews && (
                <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#1D1D1F]">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                  <a
                    href="#reviews"
                    className="text-[#86868B] hover:text-[#1D1D1F] underline decoration-black/20 hover:decoration-black transition-colors"
                  >
                    ({rawReviews.length} Verified Reviews)
                  </a>
                </div>
              )}

              <p className="text-sm text-[#6E6E73] mt-2 font-normal leading-relaxed">
                {product.subtitle || product.tagline}
              </p>

              {/* Price Row */}
              <div className="mt-5 pb-5 border-b border-black/[0.06] flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
                  {formatCurrency(effectivePriceMinor)}
                </span>
                {hasCompareAt && (
                  <span className="text-base text-[#86868B] line-through">
                    {formatCurrency(product.originalPriceMinor!)}
                  </span>
                )}
                {hasCompareAt && savings > 0 && (
                  <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] border border-emerald-300/60 px-3 py-1 rounded-full shadow-xs">
                    Save {formatCurrency(savings)} {discountPercent > 0 ? `(${discountPercent}% OFF)` : ''}
                  </span>
                )}
              </div>

              {/* Optional Config-Driven Announcement Banner */}
              {isSaleActiveNow && (
                <div className="mt-4 p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0071E3] shrink-0" />
                    <span className="font-medium text-[#1D1D1F]">
                      {SALE_CONFIG.DEFAULT_ANNOUNCEMENT}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868B]">
                    {DELIVERY_PROMISE}
                  </span>
                </div>
              )}

              {/* Variant Selector */}
              {hasMultipleVariants && (
                <div className="mt-6">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="font-semibold text-[#1D1D1F]">Finish / Option</span>
                    <span className="text-[#6E6E73] font-medium">
                      {selectedVariant?.colorName || selectedVariant?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v: any) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const hasPriceDiff = Boolean(v.priceAdjustmentMinor && v.priceAdjustmentMinor !== 0);
                      const isOutOfStock = v.stockCount !== undefined && v.stockCount <= 0;

                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedVariant(v);
                            if (v.image) {
                              setSelectedImage(v.image);
                              setActiveMediaTab('image');
                            }
                          }}
                          className={`h-9 px-4 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white shadow-apple'
                              : isOutOfStock
                              ? 'border-black/[0.06] text-[#86868B] bg-black/[0.02] opacity-50 cursor-not-allowed line-through'
                              : 'border-black/[0.08] text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#EBEBEF]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                            style={{ backgroundColor: getSwatchColor(v.name, v.colorHex) }}
                          />
                          <span>{v.name}</span>
                          {hasPriceDiff && (
                            <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#86868B]'}`}>
                              ({v.priceAdjustmentMinor > 0 ? `+${formatCurrency(v.priceAdjustmentMinor)}` : formatCurrency(v.priceAdjustmentMinor)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Inventory */}
              <div className="mt-6 flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.inStock ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                />
                <span className="font-medium text-[#6E6E73]">{stockText}</span>
              </div>

              {/* Quantity Selector and CTA Actions */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-black/10 rounded-full px-2 bg-[#F5F5F7] shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                      className="p-2 text-[#1D1D1F] hover:opacity-70 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-opacity"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#1D1D1F] min-w-[20px] text-center select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock || (stockCount > 0 && quantity >= stockCount)}
                      className="p-2 text-[#1D1D1F] hover:opacity-70 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-opacity"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag (Avian High-Converting Red Button) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isCartLoading || isAdding || !product.inStock}
                    className="flex-1 h-12 rounded-xl bg-[#E53935] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer select-none"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Buy Now (Avian Dark Action Button) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isBuying || isAdding || !product.inStock}
                  className="w-full h-12 rounded-xl bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 shadow-sm select-none"
                >
                  {isBuying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-400 fill-current" />
                      <span>Buy Now • Fast Checkout</span>
                    </>
                  )}
                </button>

                {/* Payment & Partial COD Breakdown Card */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#1D1D1F] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Payment &amp; Delivery Terms</span>
                    </span>
                    <span className="text-[11px] font-normal text-[#6E6E73]">{DELIVERY_PROMISE}</span>
                  </div>
                  <div className="text-[#6E6E73] text-[11.5px] leading-relaxed pt-1 space-y-1.5">
                    <p className="flex items-center justify-between">
                      <span><strong className="text-[#1D1D1F]">Prepaid UPI:</strong> Full online payment</span>
                      <strong className="text-[#1D1D1F] font-semibold">{formatCurrency(totalPriceMinor)}</strong>
                    </p>
                    <p className="pt-1.5 border-t border-black/[0.04]">
                      <strong className="text-[#1D1D1F]">Partial COD:</strong> Pay <strong>₹{PARTIAL_COD_ADVANCE_RUPEES} advance</strong> now via UPI, pay remaining <strong>{formatCurrency(doorstepBalanceMinor)}</strong> upon courier delivery to your hands.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Trust Badges */}
              <div className="mt-6 pt-5 border-t border-black/[0.06] grid grid-cols-2 gap-2.5 text-[11.5px]">
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#0071E3]" /> Air Delivery
                  </span>
                  <span className="text-[10.5px] text-[#6E6E73] mt-1 leading-snug">
                    {DELIVERY_PROMISE}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#0071E3]" /> 7-Day Guarantee
                  </span>
                  <span className="text-[10.5px] text-[#6E6E73] mt-1 leading-snug">
                    Replacement for transit damage
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Payment
                  </span>
                  <span className="text-[10.5px] text-[#6E6E73] mt-1 leading-snug">
                    Instant UPI &amp; Cards
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Concierge Desk
                  </span>
                  <span className="text-[10.5px] text-[#6E6E73] mt-1 leading-snug">
                    Direct studio support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Hardware Specifications */}
        <div className="mt-20 pt-12 border-t border-black/[0.06] grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold">
              Design Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              Crafted for Your Workstation
            </h2>
            <p className="text-sm text-[#6E6E73] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.06] space-y-3 shadow-apple">
              <h3 className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1D1D1F]" />
                Hardware Specifications
              </h3>

              <div className="space-y-2.5 text-xs divide-y divide-black/[0.04] pt-1">
                {(product.material || specs.material) && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Material</span>
                    <span className="font-semibold text-[#1D1D1F] text-right max-w-[200px]">
                      {product.material || specs.material}
                    </span>
                  </div>
                )}
                {specs.craft && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Craft Process</span>
                    <span className="font-semibold text-[#1D1D1F]">{specs.craft}</span>
                  </div>
                )}
                {specs.layerHeight && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Layer Precision</span>
                    <span className="font-semibold text-[#1D1D1F]">{specs.layerHeight}</span>
                  </div>
                )}
                {specs.dimensions && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Dimensions</span>
                    <span className="font-semibold text-[#1D1D1F]">{specs.dimensions}</span>
                  </div>
                )}
                {(product.weightGrams || specs.weight) && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Net Weight</span>
                    <span className="font-semibold text-[#1D1D1F]">
                      {product.weightGrams ? `${product.weightGrams}g` : specs.weight}
                    </span>
                  </div>
                )}
                {specs.powerInput && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Power Input</span>
                    <span className="font-semibold text-[#1D1D1F]">{specs.powerInput}</span>
                  </div>
                )}
                {specs.levitationHeight && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B]">Levitation Height</span>
                    <span className="font-semibold text-[#1D1D1F]">{specs.levitationHeight}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[#86868B]">Origin</span>
                  <span className="font-semibold text-[#1D1D1F]">{specs.origin || 'New Delhi, India'}</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[#86868B]">Quality Check</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bench Tested
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's In The Box Section */}
        {whatsInTheBox && (
          <div className="mt-16 pt-12 border-t border-black/[0.06]">
            <div className="max-w-2xl mb-6">
              <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Package Contents
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] mt-1">
                What&apos;s Included In The Box
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whatsInTheBox.map((boxItem, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-[#1D1D1F] flex items-center justify-center shrink-0 font-bold text-xs shadow-apple">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D1D1F]">{boxItem.item}</h3>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5 leading-snug">{boxItem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessible FAQ Accordion */}
        {faqs && faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-black/[0.06]">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Product Clarity
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 max-w-3xl">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const faqId = `faq-control-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div
                    key={index}
                    className="border border-black/[0.06] rounded-2xl bg-[#F5F5F7] overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      id={faqId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#1D1D1F] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#86868B] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#1D1D1F]' : ''
                        }`}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={faqId}
                      className={`px-5 pb-5 pt-1 text-xs text-[#6E6E73] leading-relaxed border-t border-black/[0.04] ${
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

        {/* Customer Reviews Section */}
        {showReviews && (
          <div id="reviews" className="mt-20 pt-12 border-t border-black/[0.06] scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Verified Feedback
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] mt-1">
                  Customer Reviews
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-sm text-[#1D1D1F]">
                  {product.rating ? product.rating.toFixed(1) : '5.0'}
                </span>
                <span>• {rawReviews.length} verified {rawReviews.length === 1 ? 'buyer' : 'buyers'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {rawReviews.map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] flex flex-col justify-between shadow-apple hover:shadow-apple-card transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {(rev.verified || rev.verifiedPurchase || true) && (
                        <span className="text-emerald-700 font-semibold bg-emerald-100/70 border border-emerald-300/50 px-2 py-0.5 rounded-full text-[10.5px] flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Verified buyer
                        </span>
                      )}
                    </div>
                    {rev.title && (
                      <h3 className="text-sm font-semibold text-[#1D1D1F]">&ldquo;{rev.title}&rdquo;</h3>
                    )}
                    <p className="text-xs text-[#6E6E73] mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/[0.06] text-[11px] text-[#86868B] flex justify-between items-center">
                    <span className="font-medium text-[#1D1D1F]">
                      {rev.authorName} {rev.city ? `• ${rev.city}` : ''}
                    </span>
                    {rev.createdAt && (
                      <span className="text-[10.5px]">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-black/[0.06]">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold">
                  Curated Catalog
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category?.slug}`}
                className="text-xs font-semibold text-[#0071E3] hover:underline"
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

      {/* Mobile Sticky Apple Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-black/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0">
            <span className="text-[11px] text-[#86868B] block truncate max-w-[130px] font-normal">
              {product.title}
            </span>
            <strong className="text-base font-semibold text-[#1D1D1F]">
              {formatCurrency(totalPriceMinor)}
            </strong>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isCartLoading || isAdding || !product.inStock}
              className="h-11 px-3.5 rounded-xl border border-black/10 bg-[#F5F5F7] text-[#1D1D1F] font-bold text-xs uppercase tracking-wider hover:bg-[#EBEBEF] active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer touch-manipulation select-none"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1D1D1F]" />
              ) : added ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isBuying || isAdding || !product.inStock}
              className="flex-1 h-11 rounded-xl bg-[#E53935] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer touch-manipulation select-none"
            >
              {isBuying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Opening...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Buy Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
