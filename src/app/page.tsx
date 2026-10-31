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

  // Find WhiteLayer featured pieces from real database catalog
  const maglevF1 =
    products.find((p) => p.slug === 'magnetic-levitation-f1-racing-car') || products[0];

  const heroEmblem =
    products.find((p) => p.slug === 'hero-emblem-led-lamp');

  const waveStand =
    products.find((p) => p.slug === 'wave-parametric-device-stand');

  const iskremLamp =
    products.find((p) => p.slug === 'iskrem-lamp-by-white-layer-studio');

  const levitatingLamp =
    products.find(
      (p) => p.slug === 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light'
    );

  const coreReactor =
    products.find((p) => p.slug === 'core-reactor-desk-light') || products[1];

  const featuredLineup = products
    .filter(
      (p) =>
        p.slug !== maglevF1?.slug &&
        p.slug !== heroEmblem?.slug &&
        p.slug !== waveStand?.slug
    )
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
    <div className="flex flex-col bg-[#FAFAFA] text-[#111827] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
      {/* 1. WHITELAYER 2-COLUMN HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 border-b border-black/[0.06]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Brand Copy & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center pt-2">
              {/* Eyebrow Pill */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#111827] text-xs font-bold tracking-wide border border-black/10 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#E61E2A] animate-pulse" />
                  <span>FLIRTA BY WHITELAYER • ZERO-GRAVITY FLAGSHIP SERIES</span>
                </span>
              </div>

              {/* Master Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-[#111827] leading-[1.08] mb-5">
                Precision 3D Printed <br />
                <span className="text-[#E61E2A]">Desk Sanctuaries</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#4B5563] font-normal leading-relaxed max-w-lg mb-8">
                Featuring the 360° Magnetic Levitation F1 Racing Car, architectural ambient lightboxes, and weighted workstation docks. Handcrafted in India with 0.12mm precision.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <Link
                  href="/product/magnetic-levitation-f1-racing-car"
                  className="h-12 px-7 rounded-xl bg-[#111827] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Order F1 MagLev • ₹1,899</span>
                  <ArrowRight className="w-4 h-4 text-[#E61E2A]" />
                </Link>

                <Link
                  href="/shop"
                  className="h-12 px-7 rounded-xl bg-white text-[#111827] font-extrabold text-xs uppercase tracking-wider border border-black/15 hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center"
                >
                  <span>Explore Collection</span>
                </Link>
              </div>

              {/* Trust Metrics underneath */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/[0.08] max-w-lg">
                <div>
                  <strong className="block text-sm font-extrabold text-[#111827]">Made in India</strong>
                  <span className="block text-xs text-[#6B7280] mt-0.5">Printed in our studio</span>
                </div>
                <div>
                  <strong className="block text-sm font-extrabold text-[#111827]">0.12mm</strong>
                  <span className="block text-xs text-[#6B7280] mt-0.5">Layer precision, PLA+</span>
                </div>
                <div>
                  <strong className="block text-sm font-extrabold text-[#111827]">₹999+</strong>
                  <span className="block text-xs text-[#6B7280] mt-0.5">Free delivery on prepaid orders</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Stage Card & Quick Showcase */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Studio Flagship Showcase Card: Magnetic Levitation F1 Racing Car */}
              {maglevF1 && (
                <div className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.08] shadow-sm group">
                  <Link
                    href={`/product/${maglevF1.slug}`}
                    className="block relative aspect-[16/10] bg-[#0A0A0A] overflow-hidden"
                    aria-label={`View ${maglevF1.title}`}
                  >
                    <Image
                      src={
                        maglevF1.images?.[0]?.url ||
                        'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/photo_5379765186618664415_x.jpg?v=1793282705'
                      }
                      alt={maglevF1.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 650px"
                    />

                    {/* Floating top badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#111827] text-xs font-bold shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#E61E2A] animate-pulse" />
                        🏎️ Studio Flagship • 360° Floating
                      </span>
                    </div>

                    {/* Floating Prepaid Discount Pill */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                        <Zap className="w-3 h-3 fill-current" />
                        Prepaid ₹1,899
                      </span>
                    </div>
                  </Link>

                  {/* Card Details Bar matching WhiteLayer */}
                  <div className="p-5 bg-white border-t border-black/[0.06] flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] block mb-1">
                        ELECTROMAGNETIC LEVITATION
                      </span>
                      <Link href={`/product/${maglevF1.slug}`} className="block">
                        <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#E61E2A] transition-colors leading-snug line-clamp-1">
                          {maglevF1.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6B7280] mt-1">
                        15mm electromagnetic suspension • 360° perpetual spin • Cyan touch LED halo
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-base sm:text-lg font-extrabold text-[#E61E2A]">
                          Rs. 2,199.00
                        </span>
                        <span className="text-[11px] text-neutral-400 line-through">Rs. 8,999.00</span>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200 mt-0.5">
                        Rs. 1,899 on Prepaid
                      </span>
                      <Link
                        href={`/product/${maglevF1.slug}`}
                        className="text-xs font-semibold text-[#111827] hover:text-[#E61E2A] transition-colors inline-flex items-center gap-0.5 mt-1 block"
                      >
                        <span>View Flagship</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 2 Quick Showcase Cards Below Hero */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Mini Card 1: Hero Emblem LED Lightbox */}
                {heroEmblem && (
                  <Link
                    href={`/product/${heroEmblem.slug}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.08] shadow-xs hover:border-black/20 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                      <Image
                        src={
                          heroEmblem.images?.[0]?.url ||
                          'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.7800210730_enye.webp?v=1789630077'
                        }
                        alt={heroEmblem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block truncate">
                        ICONIC LIGHTBOX
                      </span>
                      <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#E61E2A] transition-colors truncate">
                        {heroEmblem.title}
                      </h4>
                      <span className="text-xs font-extrabold text-[#E61E2A] block mt-0.5">
                        Rs. {Math.round(heroEmblem.priceMinor / 100).toLocaleString('en-IN')}.00
                      </span>
                    </div>
                  </Link>
                )}

                {/* Mini Card 2: Wave Parametric Stand */}
                {waveStand && (
                  <Link
                    href={`/product/${waveStand.slug}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.08] shadow-xs hover:border-black/20 transition-all group"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      <Image
                        src={
                          waveStand.images?.[0]?.url ||
                          'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/66ad526b01047be4.webp?v=1788510509'
                        }
                        alt={waveStand.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block truncate">
                        MINIMAL DOCK
                      </span>
                      <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#E61E2A] transition-colors truncate">
                        Wave • Parametric Stand
                      </h4>
                      <span className="text-xs font-extrabold text-[#E61E2A] block mt-0.5">
                        Rs. 499.00
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhiteLayer 4 Trust Pillars */}
      <section className="border-b border-black/[0.06] bg-[#FAFAFA] py-6" aria-label="Brand Guarantees">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.04] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#E61E2A] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#111827]">Free Pan-India Delivery</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Air courier on all prepaid orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.04] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#E61E2A] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#111827]">0.12mm Micro Precision</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Printed in renewable biopolymer</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.04] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#E61E2A] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#111827]">7-Day Studio Replacement</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">100% transit damage guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.04] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#E61E2A] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#111827]">Partial COD Supported</h4>
              <p className="text-[11px] text-[#6E6E73] mt-0.5">Pay ₹149 advance, balance at door</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SPOTLIGHT: MAGNETIC LEVITATION OR CORE REACTOR */}
      {(maglevF1 || levitatingLamp) && (
        <section className="py-16 md:py-20 bg-white border-b border-black/[0.06]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Media Showcase - Clickable link to product */}
              <div className="lg:col-span-6">
                <Link
                  href={`/product/${(maglevF1 || levitatingLamp).slug}`}
                  className="block relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#0A0A0A] border border-black/[0.06] p-6 shadow-sm group cursor-pointer"
                  aria-label={`View ${(maglevF1 || levitatingLamp).title}`}
                >
                  <Image
                    src={
                      (maglevF1 || levitatingLamp).images?.[0]?.url ||
                      'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/photo_5379765186618664415_x.jpg?v=1793282705'
                    }
                    alt={(maglevF1 || levitatingLamp).title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="py-1 px-3 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-[#111827] shadow-xs">
                      🏎️ Real Magnetic Levitation
                    </span>
                  </div>
                </Link>
              </div>

              {/* Product Information & Highlights */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E61E2A] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> ZERO GRAVITY DESK ART
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827] leading-tight mb-4">
                  {(maglevF1 || levitatingLamp).title}
                </h2>
                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-6">
                  Experience true electromagnetic levitation. Features active sensor coils maintaining a 12–15mm invisible air cushion with continuous 360° frictionless rotation.
                </p>

                {/* Technical highlights */}
                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06]">
                    <span className="text-xs text-[#86868B] block font-medium">Levitation Gap</span>
                    <strong className="text-sm text-[#111827] font-bold">12–15mm Floating Height</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-black/[0.06]">
                    <span className="text-xs text-[#86868B] block font-medium">Base Architecture</span>
                    <strong className="text-sm text-[#111827] font-bold">Touch Ambient LED Ring</strong>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href={`/product/${(maglevF1 || levitatingLamp).slug}`}
                    className="h-12 px-7 rounded-xl bg-[#111827] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#E61E2A] active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer select-none"
                  >
                    <span>Order Flagship • ₹2,199 (₹1,899 Prepaid)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock &amp; Ready for Air Dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CURATED FEATURED LINEUP */}
      <section className="py-16 md:py-24 bg-[#FAFAFA] border-b border-black/[0.06]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E61E2A] block mb-1">
                Studio Bestsellers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
                Featured Architecture &amp; Ambient Lighting
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-[#E61E2A] hover:underline flex items-center gap-1 self-start sm:self-end"
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
                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#E61E2A] transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E61E2A] transition-colors" />
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
