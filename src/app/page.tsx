import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedProducts } from '@/lib/catalog';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { FaqSection } from '@/components/home/FaqSection';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Zap,
  MessageCircle,
  Sparkles,
  Star,
  Check,
  Play,
  Layers,
  Compass,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { DELIVERY_PROMISE } from '@/config/shipping';
import { SOCIALS } from '@/config/social';

export const revalidate = 60;

export default async function HomePage() {
  let products: any[] = [];
  let verifiedReviews: any[] = [];

  try {
    products = await getCachedProducts();
  } catch (error) {
    console.error('HomePage: Failed to fetch products from catalog cache:', error);
  }

  try {
    verifiedReviews = await prisma.review.findMany({
      where: { isApproved: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });
  } catch (error) {
    console.warn('HomePage: Failed to fetch verified reviews from DB:', error);
  }

  // Find flagship pieces from real database catalog
  const levitatingLamp =
    products.find(
      (p) => p.slug === 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light'
    ) || products[0];

  const coreReactor =
    products.find((p) => p.slug === 'core-reactor-desk-light') || products[1];

  const featuredLineup = products
    .filter((p) => p.slug !== levitatingLamp?.slug && p.slug !== coreReactor?.slug)
    .slice(0, 6);

  // Curated category collection cards
  const categoryHighlights = [
    {
      title: 'Lamps & Illumination',
      subtitle: 'Magnetic floating lamps & LED lightboxes',
      href: '/shop?category=lamps',
      image:
        levitatingLamp?.images?.[0]?.url ||
        'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192',
    },
    {
      title: 'Stands & Docks',
      subtitle: 'Weighted controller cradles & laptop risers',
      href: '/shop?category=stands',
      image:
        products.find((p) => p.slug.includes('stand'))?.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Clocks & Timepieces',
      subtitle: 'StandBy mode docks & mathematical clocks',
      href: '/shop?category=clocks',
      image:
        products.find((p) => p.slug.includes('clock'))?.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Collectibles & Games',
      subtitle: 'Tactile chessboards & collectible props',
      href: '/shop?category=games',
      image:
        products.find((p) => p.slug.includes('chess') || p.slug.includes('prop'))?.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="flex flex-col bg-white text-[#1D1D1F]">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F5F7] via-white to-white pt-12 pb-16 md:pt-20 md:pb-24 border-b border-black/[0.06]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Pill Eyebrow */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#1D1D1F] text-xs font-semibold tracking-normal border border-black/[0.08] shadow-apple mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Futuristic Tech &amp; Ambient Architecture</span>
            </span>

            {/* Master Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-[#111827] leading-[1.06] mb-5">
              Discover Products <br className="hidden sm:inline" />
              <span className="text-[#111827]">Beyond Ordinary.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-[#6E6E73] font-normal leading-relaxed max-w-2xl mb-8">
              Unique gadgets. Futuristic designs. Products worth showing off. Engineered to transform your sanctuary.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-12">
              <Link
                href="/shop"
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-[#E53935] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer select-none"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {levitatingLamp && (
                <Link
                  href={`/product/${levitatingLamp.slug}`}
                  className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-white text-[#111827] font-bold text-xs uppercase tracking-wider border border-black/10 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer select-none"
                >
                  <Play className="w-3.5 h-3.5 fill-[#111827]" />
                  <span>See Floating Display</span>
                </Link>
              )}
            </div>

            {/* Flagship Hero Stage - Clickable link to product */}
            {levitatingLamp && (
              <Link
                href={`/product/${levitatingLamp.slug}`}
                className="block relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-white border border-black/[0.08] shadow-apple-card group cursor-pointer"
                aria-label={`View ${levitatingLamp.title}`}
              >
                <Image
                  src={
                    levitatingLamp.images?.[0]?.url ||
                    'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192'
                  }
                  alt={levitatingLamp.title}
                  fill
                  priority
                  className="object-contain p-4 sm:p-10 group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                />

                {/* Overlaid Floating Callout Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#6E6E73] bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-2xl border border-black/[0.06] shadow-apple">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-[#111827]">Magnetic Suspension System</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[#86868B]">15–20mm Elevation</span>
                    <span className="text-[#E53935] font-bold group-hover:underline flex items-center gap-1">
                      <span>View Flagship</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT: CORE REACTOR DESK LIGHT */}
      {coreReactor && (
        <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Media Showcase - Clickable link to product */}
              <div className="lg:col-span-6">
                <Link
                  href={`/product/${coreReactor.slug}`}
                  className="block relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] p-6 shadow-apple group cursor-pointer"
                  aria-label={`View ${coreReactor.title}`}
                >
                  <Image
                    src={
                      coreReactor.images?.[0]?.url ||
                      'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990'
                    }
                    alt={coreReactor.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="py-1 px-3 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#111827] border border-black/[0.06] shadow-xs">
                      Arc Lighting
                    </span>
                  </div>
                </Link>
              </div>

              {/* Product Information & Highlights */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E53935] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Iconic Collectible Illumination
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] leading-tight mb-4">
                  {coreReactor.title}
                </h2>
                <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed mb-6">
                  {coreReactor.description ||
                    'Engineered with a multi-ring breathing LED core, weighted sanctuary display base, and USB-C connectivity. Transforms any desk setup with hypnotic cinematic ambient glow.'}
                </p>

                {/* Technical highlights */}
                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                    <span className="text-xs text-[#86868B] block">Lighting Modes</span>
                    <strong className="text-sm text-[#111827] font-semibold">Pulse &amp; Static Glow</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                    <span className="text-xs text-[#86868B] block">Build Precision</span>
                    <strong className="text-sm text-[#111827] font-semibold">0.12mm Laser Layering</strong>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href={`/product/${coreReactor.slug}`}
                    className="h-12 px-7 rounded-2xl bg-[#111827] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#E53935] active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer select-none"
                  >
                    <span>View Product • {formatCurrency(coreReactor.priceMinor)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock &amp; Ready for Air Dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CURATED FEATURED LINEUP */}
      <section className="py-16 md:py-24 bg-[#F5F5F7] border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
                Curated Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
                Featured Flagship Pieces
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1 self-start sm:self-end"
            >
              <span>Explore All Products ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLineup.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES HUB */}
      <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
              Curated Taxonomy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              Explore by Collection
            </h2>
            <p className="text-sm text-[#6E6E73] mt-2">
              Discover pieces categorized by design discipline, lighting architecture, and workstation utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoryHighlights.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group relative rounded-3xl overflow-hidden border border-black/[0.06] bg-[#F5F5F7] p-5 flex flex-col justify-between hover:shadow-apple-card transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-4 border border-black/[0.04]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#E53935] transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E53935] transition-colors" />
                  </h3>
                  <p className="text-xs text-[#6E6E73] mt-1 leading-snug">{cat.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GENUINE VERIFIED CUSTOMER REVIEWS */}
      {verifiedReviews.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F5F5F7] border-b border-black/[0.06]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
                  Customer Confidence
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
                  Verified Owner Feedback
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#6E6E73]">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-[#111827]">5.0 Average</span>
                <span>• 100% Genuine Verified Purchases</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {verifiedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-black/[0.06] flex flex-col justify-between shadow-apple hover:shadow-apple-card transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-emerald-700 font-semibold bg-emerald-100/70 border border-emerald-300/50 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Verified buyer
                      </span>
                    </div>

                    {rev.title && (
                      <h3 className="text-sm font-bold text-[#111827] mb-1.5">&ldquo;{rev.title}&rdquo;</h3>
                    )}
                    <p className="text-xs text-[#6E6E73] leading-relaxed line-clamp-4">{rev.comment}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] text-[11px] text-[#86868B] flex justify-between items-center">
                    <span className="font-semibold text-[#111827]">
                      {rev.authorName} {rev.city ? `• ${rev.city}` : ''}
                    </span>
                    {rev.product?.slug && (
                      <Link
                        href={`/product/${rev.product.slug}`}
                        className="text-[10.5px] text-[#0071E3] hover:underline truncate max-w-[120px]"
                      >
                        {rev.product.title}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY SHOP WITH FLIRTA: 4 PILLARS */}
      <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
              Store Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              Why Order from Flirta
            </h2>
            <p className="text-sm text-[#6E6E73] mt-2">
              Every detail is engineered for peace of mind, from our studio bench to your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Express Air Delivery */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#111827] flex items-center justify-center shadow-apple mb-4">
                  <Truck className="w-5 h-5 text-[#0071E3]" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">Express Air Delivery</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {DELIVERY_PROMISE}. Shipped via premium air couriers with real-time SMS tracking updates.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-4 block">19,000+ PIN Codes</span>
            </div>

            {/* Pillar 2: Partial COD */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#111827] flex items-center justify-center shadow-apple mb-4">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">Partial COD Option</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Pay only ₹149 advance via UPI to reserve your piece. Pay the remaining balance upon doorstep delivery.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#111827] mt-4 block">Zero Convenience Fees</span>
            </div>

            {/* Pillar 3: 7-Day Replacement Guarantee */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#111827] flex items-center justify-center shadow-apple mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">7-Day Replacement</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Every parcel is cushioned in dense acoustic foam. If transit damage occurs, we dispatch a direct replacement immediately.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-4 block">Hassle-Free Support</span>
            </div>

            {/* Pillar 4: Direct WhatsApp Concierge */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#111827] flex items-center justify-center shadow-apple mb-4">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">Studio Concierge Desk</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Have questions before ordering? Connect directly with our studio support team on WhatsApp.
                </p>
              </div>
              <Link
                href={SOCIALS.whatsapp || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-[#0071E3] hover:underline mt-4 inline-block"
              >
                Chat on WhatsApp →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />
    </div>
  );
}
