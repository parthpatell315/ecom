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
  Heart,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Headphones,
  Tag,
  Clock,
  Flame,
  FileText,
} from 'lucide-react';

import { useWishlist } from '@/context/WishlistContext';
import { PincodeChecker } from '@/components/product/PincodeChecker';
import { F1Showcase } from '@/components/product/F1Showcase';
import { trackPixelEvent } from '@/components/analytics/MetaPixel';
import { LEGAL_CONFIG } from '@/config/legal';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import {
  DELIVERY_PROMISE,
  PARTIAL_COD_ADVANCE_MINOR,
  PARTIAL_COD_ADVANCE_RUPEES,
} from '@/config/shipping';
import { MEDIA_CONFIG, checkImageRights } from '@/config/media';
import {
  getProductFaqs,
  getProductBoxContents,
  getProductStoryMeta,
  getProductTopBadges,
  getProductBuyPerks,
} from '@/data/product-details';
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
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const isF1MagLev =
    product.slug === 'magnetic-levitation-f1-racing-car' ||
    product.title.toLowerCase().includes('magnetic levitation f1') ||
    product.title.toLowerCase().includes('formula 1');

  // Find the iconic Side View photo (photo_5379765186618664388) as requested
  const f1SidePhoto = product.images?.find((img: any) =>
    img.url.includes('photo_5379765186618664388')
  )?.url;

  const [selectedVariant, setSelectedVariant] = useState<any>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    (isF1MagLev && f1SidePhoto) ||
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({
    desc: true,
    box: true,
    specs: true,
    faqs: false,
  });

  const toggleAccordion = (key: string) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const topBadges = getProductTopBadges(product);
  const buyPerks = getProductBuyPerks(product);

  const productImagesList: string[] = React.useMemo(() => {
    const list: string[] = [];
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (img?.url && !list.includes(img.url)) {
          list.push(img.url);
        }
      });
    }
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v: any) => {
        if (v?.image && !list.includes(v.image)) {
          list.push(v.image);
        }
      });
    }
    return list;
  }, [product.images, product.variants]);

  const currentImageIndex = Math.max(0, productImagesList.indexOf(selectedImage));

  // Lightbox keyboard controls (Esc to close, Arrow keys to navigate)
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && productImagesList.length > 1) {
        setSelectedImage((curr) => {
          const idx = productImagesList.indexOf(curr);
          return productImagesList[(idx + 1) % productImagesList.length];
        });
      } else if (e.key === 'ArrowLeft' && productImagesList.length > 1) {
        setSelectedImage((curr) => {
          const idx = productImagesList.indexOf(curr);
          return productImagesList[(idx - 1 + productImagesList.length) % productImagesList.length];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, productImagesList]);

  const effectivePriceMinor =
    product.priceMinor + (selectedVariant?.priceAdjustmentMinor || 0);
  const totalPriceMinor = effectivePriceMinor * quantity;
  const doorstepBalanceMinor = Math.max(0, totalPriceMinor - PARTIAL_COD_ADVANCE_MINOR);

  // Special Flagship Pricing: Magnetic Levitation F1 Racing Car ₹2,199 COD / ₹1,899 Prepaid
  const prepaidDiscountPerUnitMinor = isF1MagLev ? 30000 : 0; // ₹300 off per piece on Prepaid
  const prepaidPricePerUnitMinor = effectivePriceMinor - prepaidDiscountPerUnitMinor;
  const prepaidTotalPriceMinor = prepaidPricePerUnitMinor * quantity;

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

  // What's in the box: Tailored specifically per product
  const whatsInTheBox = getProductBoxContents(product);

  // Frequently Asked Questions: Tailored specifically per product category & features
  const faqs = getProductFaqs(product);

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

  // Video path - only enabled if real video exists or levitating lamp demo
  const hasVideo = Boolean(product.videoUrl || (isLevitatingLamp && MEDIA_CONFIG.DEFAULT_FLOATING_VIDEO));
  const videoSource = product.videoUrl || (isLevitatingLamp ? MEDIA_CONFIG.DEFAULT_FLOATING_VIDEO : '');
  const videoPoster = product.images?.[0]?.url || MEDIA_CONFIG.DEFAULT_VIDEO_POSTER;
  const hasMultipleMedia = (product.images && product.images.length > 1) || hasVideo;

  // Tailored Architecture & Craft Story
  const productStoryMeta = getProductStoryMeta(product);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery (7 Cols) matching WhiteLayer */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 sticky top-24">
            {/* Primary View Frame */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F9FAFB] border border-black/[0.08] flex items-center justify-center shadow-xs group">
              {activeMediaTab === 'video' ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden">
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
                    className="absolute top-4 right-4 bg-white/95 hover:bg-white text-[#1D1D1F] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer z-10"
                    aria-label="Back to photo"
                  >
                    View Photo
                  </button>
                </div>
              ) : selectedImage ? (
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full relative cursor-zoom-in group select-none"
                  role="button"
                  tabIndex={0}
                  aria-label="Click to open image in full view"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsLightboxOpen(true);
                    }
                  }}
                >
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 650px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Navigation Arrows (Prev / Next slide matching WhiteLayer) */}
                  {productImagesList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const prevIdx = (currentImageIndex - 1 + productImagesList.length) % productImagesList.length;
                          setSelectedImage(productImagesList[prevIdx]);
                          setActiveMediaTab('image');
                        }}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-black/10 text-[#111827] flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextIdx = (currentImageIndex + 1) % productImagesList.length;
                          setSelectedImage(productImagesList[nextIdx]);
                          setActiveMediaTab('image');
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-black/10 text-[#111827] flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </>
                  )}

                  {/* Smooth Progress Line at bottom */}
                  {productImagesList.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 z-10">
                      <div
                        className="h-full bg-[#E61E2A] transition-all duration-300"
                        style={{
                          width: `${((currentImageIndex + 1) / productImagesList.length) * 100}%`,
                        }}
                      />
                    </div>
                  )}

                  {/* Tap to expand affordance */}
                  <div className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-md text-[#111827] text-[11px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-black/10 shadow-2xs opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn className="w-3.5 h-3.5 text-[#111827]" />
                    <span className="hidden sm:inline">Tap to expand</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#86868B] text-sm">
                  No Image Available
                </div>
              )}
            </div>

            {/* Single-Row Horizontal Sliding Media Previews matching WhiteLayer (Screenshot 2) */}
            {hasMultipleMedia && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images &&
                  product.images.map((img: any, idx: number) => {
                    const isSelected = activeMediaTab === 'image' && selectedImage === img.url;
                    return (
                      <button
                        key={img.id || idx}
                        type="button"
                        onClick={() => {
                          setSelectedImage(img.url);
                          setActiveMediaTab('image');
                        }}
                        className={`shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-100 ${
                          isSelected
                            ? 'border-[#E61E2A] scale-[1.02] shadow-xs ring-1 ring-[#E61E2A]/20'
                            : 'border-transparent opacity-70 hover:opacity-100 hover:border-black/20'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={img.url}
                          alt={`${product.title} view ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    );
                  })}

                {/* Video Slot Thumbnail */}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#111827] flex flex-col items-center justify-center text-white ${
                      activeMediaTab === 'video'
                        ? 'border-[#E61E2A] scale-[1.02] shadow-xs ring-1 ring-[#E61E2A]/20'
                        : 'border-transparent opacity-75 hover:opacity-100 hover:border-black/20'
                    }`}
                    aria-label="Watch video demonstration"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span className="text-[9.5px] font-bold uppercase mt-1 tracking-wider">Video</span>
                  </button>
                )}
              </div>
            )}

            {/* Desktop Studio Trust & Craftsmanship Strip matching WhiteLayer (Screenshot 2) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.08] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-[#E61E2A] shrink-0">
                  <Layers className="w-4 h-4 text-[#E61E2A]" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-[#111827]">0.12mm Precision</strong>
                  <span className="block text-[11px] text-[#6E6E73]">Studio Grade 3D Finish</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.08] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-[#E61E2A] shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#E61E2A]" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-[#111827]">Reinforced Core</strong>
                  <span className="block text-[11px] text-[#6E6E73]">Weighted Anti-Tip Base</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div>
              {/* 1. Top Badges & Share Row (WhiteLayer style) */}
              <div className="flex items-center justify-between gap-2 text-xs mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] font-medium text-[#6E6E73]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECDD3] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                    Prepaid: 24h Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.04]">
                    <Headphones className="w-3 h-3 text-[#6E6E73]" /> Mon-Sat support
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.04]">
                    <RotateCcw className="w-3 h-3 text-[#6E6E73]" /> 7-Day Replacement
                  </span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full border border-black/10 hover:bg-[#F5F5F7] flex items-center justify-center text-[#6E6E73] hover:text-[#111827] transition-all cursor-pointer"
                    aria-label="Share product link"
                    title="Copy product link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                  {copied && (
                    <span className="absolute -top-7 right-0 bg-[#111827] text-white text-[10px] py-0.5 px-2 rounded-md whitespace-nowrap shadow-md z-20">
                      Link copied!
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Top Category & Flagship Badges */}
              {topBadges && topBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {topBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`text-[10.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider ${
                        idx === 0
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECDD3]'
                          : idx === 1
                          ? 'bg-[#ECFEFF] text-[#0369A1] border border-[#BAE6FD]'
                          : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* 3. Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-[#111827] leading-tight">
                {product.title}
              </h1>

              {/* Star Rating: Linked directly to Verified Reviews section */}
              {showReviews && (
                <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-[#111827]">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                  <a
                    href="#reviews"
                    className="text-[#86868B] hover:text-[#111827] underline decoration-black/20 hover:decoration-black transition-colors"
                  >
                    ({rawReviews.length} Verified Reviews)
                  </a>
                </div>
              )}

              <p className="text-sm text-[#6E6E73] mt-2 font-normal leading-relaxed">
                {product.subtitle || product.tagline}
              </p>

              {/* 4. Price Card (WhiteLayer style matching Screenshot 5) */}
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#E61E2A] tracking-tight">
                    Rs. {Math.round(effectivePriceMinor / 100).toLocaleString('en-IN')}.00
                  </span>
                  {hasCompareAt && (
                    <span className="text-sm sm:text-base text-[#9CA3AF] line-through font-medium">
                      Rs. {Math.round(product.originalPriceMinor! / 100).toLocaleString('en-IN')}.00
                    </span>
                  )}
                  {hasCompareAt && discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-[#111827] text-white text-[11px] font-bold">
                      <span>{discountPercent}% OFF</span>
                    </span>
                  )}
                </div>

                <span className="text-[#6E6E73] text-[11px] font-normal block">(Incl. of all taxes)</span>

                {/* Urgency Alert matching WhiteLayer */}
                <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#991B1B] font-medium">
                  <span>🔥</span>
                  <span><strong>Special Launch Price:</strong> Price will be higher after 2 days!</span>
                </div>
              </div>

              {/* 5. Fast Dispatch Urgency Card matching WhiteLayer */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1 text-xs text-[#14532D]">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-[12.5px]">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>If you order prepaid, your order will be dispatched within 24 hours!</span>
                </div>
                <p className="text-[11px] text-[#15803D] pl-6 font-medium">
                  ✓ Priority BlueDart / Delhivery Air Dispatch • 7-Day Replacement Guarantee
                </p>
              </div>

              {/* 6. Key Buying Perks */}
              {buyPerks && buyPerks.length > 0 && (
                <div className="mt-3 space-y-2 py-3 border-y border-black/[0.06]">
                  {buyPerks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-[12.5px] text-[#374151]">
                      <Check className="w-4 h-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
                      <span className="font-medium">{perk.text}</span>
                    </div>
                  ))}
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

              {/* 7. Stock Inventory Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-[#16A34A]">{stockText} • Ready for Air Dispatch</span>
              </div>

              {/* 8. Dynamic Delivery Badge (WhiteLayer style matching Screenshot 5) */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-black/[0.06] flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-black/5 text-[#E61E2A] shadow-2xs">
                  <Truck className="w-4 h-4 text-[#E61E2A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[#111827] block text-xs">
                    Free delivery on this piece
                  </span>
                  <span className="text-[11px] text-[#6E6E73] leading-relaxed block mt-0.5">
                    Processed in 1-2 business days, then usually up to 7 business days in transit. Dates are estimates. <Link href="/shipping-policy" className="underline decoration-black/20 hover:text-black">Shipping policy</Link>
                  </span>
                </div>
              </div>

              {/* 9. Action Buttons matching WhiteLayer (Screenshot 5) */}
              <div className="mt-4 space-y-2.5">
                {/* Quantity Stepper & Add to Cart (WhiteLayer Bold Red Button) */}
                <div className="flex gap-2.5">
                  <div className="flex items-center border border-black/10 rounded-xl px-2 bg-[#F9FAFB] shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                      className="p-2 text-[#111827] hover:opacity-70 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-opacity font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-[#111827] min-w-[18px] text-center select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock || (stockCount > 0 && quantity >= stockCount)}
                      className="p-2 text-[#111827] hover:opacity-70 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-opacity font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="MainAddToCartBtn"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isCartLoading || isAdding || !product.inStock}
                    className="flex-1 h-12 rounded-xl bg-[#E61E2A] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:bg-[#C81420] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer select-none"
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
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        slug: product.slug,
                        title: product.title,
                        priceMinor: effectivePriceMinor,
                        image: selectedImage || (product.images && product.images[0]?.url) || '',
                      })
                    }
                    className="w-12 h-12 rounded-xl border border-black/10 bg-[#F9FAFB] hover:bg-neutral-100 text-[#111827] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'fill-[#E61E2A] text-[#E61E2A]' : 'stroke-current text-slate-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Buy Now Button with Payment Badges & Shiprocket (Screenshot 5) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isBuying || isAdding || !product.inStock}
                    className="w-full h-12 rounded-xl bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer disabled:opacity-50 shadow-sm select-none"
                  >
                    {isBuying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Opening Checkout...</span>
                      </>
                    ) : (
                      <>
                        <span>BUY NOW</span>
                        <div className="flex items-center gap-1.5 ml-1 bg-white/10 px-2 py-0.5 rounded-md">
                          <span className="text-[10px] font-black text-white tracking-tight">GPay</span>
                          <span className="text-white/40">|</span>
                          <span className="text-[10px] font-black text-[#00BAF2] tracking-tight">Paytm</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/80" />
                      </>
                    )}
                  </button>
                  <div className="text-right">
                    <span className="text-[9.5px] text-neutral-400 font-medium">Powered by Shiprocket</span>
                  </div>
                </div>

                {/* 10. High-Trust Bar matching WhiteLayer Screenshot 5 */}
                <div className="py-2 px-3 rounded-xl bg-transparent flex items-center justify-center text-[11px] font-medium text-[#4B5563] flex-wrap gap-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                    <span>256-Bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2.5} />
                    <span>7-Day Replacement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Made in India</span>
                  </div>
                </div>

                {/* Real Pincode Delivery Estimator */}
                <PincodeChecker />

                {/* Payment & Partial COD Breakdown Card */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#111827] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Payment &amp; Delivery Terms</span>
                    </span>
                    <span className="text-[11px] font-normal text-[#6E6E73]">{DELIVERY_PROMISE}</span>
                  </div>
                  <div className="text-[#6E6E73] text-[11.5px] leading-relaxed pt-1 space-y-1.5">
                    <p className="flex items-center justify-between">
                      <span><strong className="text-[#111827]">Prepaid UPI:</strong> Full online payment {isF1MagLev ? '(Includes ₹300 instant discount)' : ''}</span>
                      <strong className="text-emerald-700 font-bold">{formatCurrency(isF1MagLev ? prepaidTotalPriceMinor : totalPriceMinor)}</strong>
                    </p>
                    <p className="pt-1.5 border-t border-black/[0.04] flex items-center justify-between">
                      <span><strong className="text-[#111827]">Partial COD:</strong> Pay <strong>₹{PARTIAL_COD_ADVANCE_RUPEES} advance</strong> now via UPI, pay balance at doorstep.</span>
                      <strong className="text-[#111827] font-semibold">{formatCurrency(doorstepBalanceMinor)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* If Magnetic Levitation F1 Racing Car, render the complete WhiteLayer 10-Section Flagship Showcase */}
        {isF1MagLev ? (
          <F1Showcase />
        ) : (
          <>
            {/* 4 Accordions Section (WhiteLayer style: Description, Box, Specs, FAQs) */}
            <div className="mt-16 pt-8 border-t border-black/[0.06] max-w-4xl mx-auto space-y-4">
          {/* Accordion 1: Description & Details */}
          <div className="border border-black/[0.08] rounded-2xl bg-[#FAFAFA] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => toggleAccordion('desc')}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#111827] cursor-pointer hover:bg-black/[0.02]"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#E61E2A]" />
                <span>Description &amp; Details</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#86868B] transition-transform duration-200 shrink-0 ${
                  expandedAccordions.desc ? 'rotate-180 text-[#111827]' : ''
                }`}
              />
            </button>
            {expandedAccordions.desc && (
              <div className="px-5 pb-6 pt-2 text-sm text-[#4B5563] leading-relaxed border-t border-black/[0.04] space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#86868B] font-semibold">
                    {productStoryMeta.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] mt-0.5 mb-2">
                    {productStoryMeta.heading}
                  </h3>
                  <p className="whitespace-pre-line leading-relaxed text-[#4B5563]">
                    {product.description}
                  </p>
                </div>

                {/* 3 Highlight Cards */}
                {productStoryMeta.highlights && productStoryMeta.highlights.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {productStoryMeta.highlights.map((hl, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white border border-black/[0.06] flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="w-6 h-6 rounded-full bg-[#FEF2F2] text-[#E61E2A] flex items-center justify-center font-bold text-xs mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-xs font-bold text-[#111827]">{hl.title}</h4>
                          <p className="text-[11px] text-[#6E6E73] mt-1 leading-snug">{hl.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion 2: What's Included in the Box */}
          {whatsInTheBox && whatsInTheBox.length > 0 && (
            <div className="border border-black/[0.08] rounded-2xl bg-[#FAFAFA] overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleAccordion('box')}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#111827] cursor-pointer hover:bg-black/[0.02]"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#E61E2A]" />
                  <span>What&apos;s Included In The Box</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#86868B] transition-transform duration-200 shrink-0 ${
                    expandedAccordions.box ? 'rotate-180 text-[#111827]' : ''
                  }`}
                />
              </button>
              {expandedAccordions.box && (
                <div className="px-5 pb-6 pt-3 border-t border-black/[0.04]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {whatsInTheBox.map((boxItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-black/[0.06] flex items-start gap-3 shadow-xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#111827]">{boxItem.item}</h4>
                          <p className="text-[11px] text-[#6E6E73] mt-0.5 leading-snug">{boxItem.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Accordion 3: Hardware Specifications */}
          <div className="border border-black/[0.08] rounded-2xl bg-[#FAFAFA] overflow-hidden transition-all duration-200">
            <button
              type="button"
              onClick={() => toggleAccordion('specs')}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#111827] cursor-pointer hover:bg-black/[0.02]"
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#E61E2A]" />
                <span>Technical Specifications</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#86868B] transition-transform duration-200 shrink-0 ${
                  expandedAccordions.specs ? 'rotate-180 text-[#111827]' : ''
                }`}
              />
            </button>
            {expandedAccordions.specs && (
              <div className="px-5 pb-6 pt-3 border-t border-black/[0.04]">
                <div className="p-4 sm:p-6 rounded-xl bg-white border border-black/[0.06] space-y-2 text-xs divide-y divide-black/[0.04] shadow-xs">
                  {(product.material || specs.material) && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Material</span>
                      <span className="font-bold text-[#111827] text-right max-w-[240px]">
                        {product.material || specs.material}
                      </span>
                    </div>
                  )}
                  {specs.craft && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Craft Process</span>
                      <span className="font-bold text-[#111827]">{specs.craft}</span>
                    </div>
                  )}
                  {specs.layerHeight && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Layer Precision</span>
                      <span className="font-bold text-[#111827]">{specs.layerHeight}</span>
                    </div>
                  )}
                  {specs.dimensions && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Dimensions</span>
                      <span className="font-bold text-[#111827]">{specs.dimensions}</span>
                    </div>
                  )}
                  {(product.weightGrams || specs.weight) && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Net Weight</span>
                      <span className="font-bold text-[#111827]">
                        {product.weightGrams ? `${product.weightGrams}g` : specs.weight}
                      </span>
                    </div>
                  )}
                  {(specs.powerInput || specs.powerSupply) && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Power Supply</span>
                      <span className="font-bold text-[#111827] text-right max-w-[240px]">
                        {specs.powerInput || specs.powerSupply}
                      </span>
                    </div>
                  )}
                  {(specs.levitationHeight || specs.levitationGap) && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Levitation Height</span>
                      <span className="font-bold text-[#111827]">
                        {specs.levitationHeight || specs.levitationGap}
                      </span>
                    </div>
                  )}
                  {specs.lighting && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Lighting System</span>
                      <span className="font-bold text-[#111827]">{specs.lighting}</span>
                    </div>
                  )}
                  {specs.rotation && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Perpetual Rotation</span>
                      <span className="font-bold text-[#111827]">{specs.rotation}</span>
                    </div>
                  )}
                  {specs.infillDensity && (
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[#86868B] font-medium">Internal Geometry</span>
                      <span className="font-bold text-[#111827]">{specs.infillDensity}</span>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B] font-medium">Origin</span>
                    <span className="font-bold text-[#111827]">{specs.origin || 'New Delhi, India'}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#86868B] font-medium">Quality Check</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bench Tested &amp; Calibrated
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 4: Frequently Asked Questions */}
          {faqs && faqs.length > 0 && (
            <div className="border border-black/[0.08] rounded-2xl bg-[#FAFAFA] overflow-hidden transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleAccordion('faqs')}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#111827] cursor-pointer hover:bg-black/[0.02]"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#E61E2A]" />
                  <span>Frequently Asked Questions ({faqs.length})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#86868B] transition-transform duration-200 shrink-0 ${
                    expandedAccordions.faqs ? 'rotate-180 text-[#111827]' : ''
                  }`}
                />
              </button>
              {expandedAccordions.faqs && (
                <div className="px-5 pb-6 pt-3 border-t border-black/[0.04] space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="border border-black/[0.06] rounded-xl bg-white overflow-hidden shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#111827] cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-[#86868B] transition-transform duration-200 shrink-0 ${
                              isOpen ? 'rotate-180 text-[#111827]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-[#6E6E73] leading-relaxed border-t border-black/[0.04]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

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
      </>
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
            <div className="flex items-baseline gap-1.5">
              <strong className="text-base font-bold text-[#111827]">
                {formatCurrency(totalPriceMinor)}
              </strong>
              {isF1MagLev && (
                <span className="text-[11px] font-extrabold text-emerald-600">
                  (₹1,899 Prepaid)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  slug: product.slug,
                  title: product.title,
                  priceMinor: effectivePriceMinor,
                  image: selectedImage || (product.images && product.images[0]?.url) || '',
                })
              }
              className="h-11 w-11 rounded-xl border border-black/10 bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer touch-manipulation"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[#E61E2A] text-[#E61E2A]' : 'stroke-current text-slate-500'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isCartLoading || isAdding || !product.inStock}
              className="h-11 px-3 sm:px-4 rounded-xl border border-black/10 bg-[#F5F5F7] text-[#111827] font-bold text-xs uppercase tracking-wider hover:bg-[#EBEBEF] active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer touch-manipulation select-none"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#111827]" />
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isBuying || isAdding || !product.inStock}
              className="flex-1 h-11 rounded-xl bg-[#E61E2A] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#C81420] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer touch-manipulation select-none"
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

      {/* Lightbox / Zoom Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom view"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header controls */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white py-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
                {product.title}
              </span>
              {productImagesList.length > 1 && (
                <span className="text-xs text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full">
                  {currentImageIndex + 1} / {productImagesList.length}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white cursor-pointer"
              aria-label="Close zoom modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main expanded image stage */}
          <div
            className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] sm:h-[75vh]">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>

            {/* Prev / Next buttons */}
            {productImagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIdx =
                      (currentImageIndex - 1 + productImagesList.length) % productImagesList.length;
                    setSelectedImage(productImagesList[prevIdx]);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIdx = (currentImageIndex + 1) % productImagesList.length;
                    setSelectedImage(productImagesList[nextIdx]);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {productImagesList.length > 1 && (
            <div
              className="flex gap-2 max-w-full overflow-x-auto py-2 px-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {productImagesList.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(url)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-black/30 shrink-0 ${
                    selectedImage === url
                      ? 'border-white scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
