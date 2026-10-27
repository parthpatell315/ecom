import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedProducts, getFlashSaleProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { FaqSection } from '@/components/home/FaqSection';
import { ArrowRight, Truck, ShieldCheck, Zap, MessageCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { DELIVERY_PROMISE } from '@/config/shipping';
import { SOCIALS } from '@/config/social';

export const revalidate = 60;

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await getCachedProducts();
  } catch (error) {
    console.error('HomePage: Failed to fetch products from catalog cache:', error);
  }

  // Find flagship pieces from real database catalog
  const levitatingLamp = products.find(
    (p) => p.slug === 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light'
  ) || products[0];

  const coreReactor = products.find(
    (p) => p.slug === 'core-reactor-desk-light'
  ) || products[1];

  const featuredLineup = products.filter(
    (p) => p.slug !== levitatingLamp?.slug && p.slug !== coreReactor?.slug
  ).slice(0, 6);

  return (
    <div className="flex flex-col bg-white text-[#1D1D1F]">
      {/* 1. APPLE-STYLE HERO STAGE: LEVITATING MONEY STACK LAMP */}
      <section className="relative overflow-hidden bg-[#F5F5F7] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Apple Eyebrow Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#1D1D1F] text-xs font-semibold tracking-normal border border-black/[0.08] shadow-apple mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Flagship Illumination</span>
            </span>

            {/* Apple Big Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] text-[#1D1D1F] leading-[1.08] mb-4">
              Defy Gravity.
            </h1>

            {/* Benefit-Led Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#6E6E73] font-normal leading-relaxed max-w-2xl mb-6">
              Magnetic levitation meets ambient studio illumination. Rotates 360° mid-air with touch-controlled RGB lighting for your sanctuary.
            </p>

            {/* Price Pill & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link
                href="/product/levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light"
                className="h-12 px-8 rounded-xl bg-[#E53935] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#D32F2F] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Shop Now • {formatCurrency(levitatingLamp?.priceMinor || 99900)}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="h-12 px-7 rounded-xl bg-white text-[#111827] font-bold text-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center shadow-xs"
              >
                <span>Explore All Pieces</span>
              </Link>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-white border border-black/[0.06] shadow-apple-card group">
              <Image
                src={
                  levitatingLamp?.images?.[0]?.url ||
                  'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192'
                }
                alt="Levitating Money Stack Lamp in ambient illumination"
                fill
                priority
                className="object-contain p-4 sm:p-8 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#6E6E73] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/[0.06]">
                <span>Magnetic Suspension System</span>
                <span className="font-semibold text-[#1D1D1F]">360° Frictionless Float</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE REACTOR FEATURE HIGHLIGHT */}
      {coreReactor && (
        <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Product Media Column */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#F5F5F7] border border-black/[0.06] p-6 shadow-apple">
                  <Image
                    src={
                      coreReactor.images?.[0]?.url ||
                      'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990'
                    }
                    alt={coreReactor.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>
              </div>

              {/* Editorial Value Column */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] mb-2">
                  Studio Engineering
                </span>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F] leading-tight mb-4">
                  {coreReactor.title}
                </h2>
                <p className="text-base text-[#6E6E73] leading-relaxed mb-6">
                  {coreReactor.description ||
                    'Engineered with a luminous multi-ring breathing LED core, weighted sanctuary stand, and integrated Qi charging.'}
                </p>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                    <span className="text-xs text-[#86868B] block">Lighting</span>
                    <strong className="text-sm text-[#1D1D1F] font-semibold">Pulse &amp; Static Modes</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                    <span className="text-xs text-[#86868B] block">Power</span>
                    <strong className="text-sm text-[#1D1D1F] font-semibold">USB-C Core Connector</strong>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/product/${coreReactor.slug}`}
                    className="h-11 px-7 rounded-xl bg-[#111827] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#E53935] active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span>View Product • {formatCurrency(coreReactor.priceMinor)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED CURATED LINEUP */}
      <section className="py-16 md:py-24 bg-[#F5F5F7] border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
                Curated Collection
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]">
                Architectural Workstation Pieces
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1 self-start sm:self-end"
            >
              <span>Explore All Products</span>
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

      {/* 4. WHY SHOP WITH FLIRTA: 4 TRANSPARENT PILLARS */}
      <section className="py-16 md:py-24 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B] block mb-1">
              Store Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]">
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
                <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center shadow-apple mb-4">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1.5">Express Air Delivery</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {DELIVERY_PROMISE}. Shipped via premium air couriers with real-time tracking updates.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-4 block">19,000+ PIN Codes</span>
            </div>

            {/* Pillar 2: Partial COD */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center shadow-apple mb-4">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1.5">Partial COD Option</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Pay only ₹149 advance via UPI to reserve your piece. Pay the remaining ₹850 balance upon doorstep delivery.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#1D1D1F] mt-4 block">Zero Convenience Fees</span>
            </div>

            {/* Pillar 3: 7-Day Replacement Guarantee */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center shadow-apple mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1.5">7-Day Replacement</h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  Every parcel is cushioned in acoustic foam. If transit damage occurs, we dispatch a direct replacement immediately.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-4 block">Hassle-Free Support</span>
            </div>

            {/* Pillar 4: Direct WhatsApp Concierge */}
            <div className="p-6 rounded-3xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white text-[#1D1D1F] flex items-center justify-center shadow-apple mb-4">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-1.5">Direct Studio Concierge</h3>
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

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />
    </div>
  );
}
