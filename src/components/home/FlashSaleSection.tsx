'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Zap, Truck, Sparkles, Check, ArrowRight, Flame, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { trackPixelEvent } from '@/components/analytics/MetaPixel';
import { DELIVERY_PROMISE } from '@/config/shipping';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';

interface FlashSaleProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  priceMinor: number;
  originalPriceMinor: number | null;
  badge?: string | null;
  images: { url: string; altText?: string | null }[];
  variants: { id: string; name: string; colorHex: string; image?: string }[];
}

interface FlashSaleSectionProps {
  products: FlashSaleProduct[];
}

export function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const { addItem } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const coreReactor =
    products.find((p) => p.slug === 'core-reactor-desk-light' || p.slug.includes('reactor')) ||
    products[0];
  const levitatingLamp =
    products.find((p) => p.slug === 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light') ||
    products[1];

  const saleActive = isSaleActive(SALE_CONFIG.SALE_END_DATE);

  const handleClaimDeal = (product: FlashSaleProduct, variantId?: string) => {
    const selectedVariant = product.variants?.find((v) => v.id === variantId) || product.variants?.[0];
    const image = selectedVariant?.image || product.images?.[0]?.url || '';

    setAddedSlug(product.slug);
    addItem(product.id, selectedVariant?.id, 1, {
      title: product.title,
      variantName: selectedVariant?.name || null,
      colorHex: selectedVariant?.colorHex || null,
      unitPriceMinor: product.priceMinor,
      image,
    });

    trackPixelEvent('AddToCart', {
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: product.priceMinor / 100,
      currency: 'INR',
    });

    setTimeout(() => {
      setAddedSlug(null);
    }, 2200);
  };

  return (
    <section className="relative py-12 md:py-16 bg-[#18181B] text-white overflow-hidden border-y border-[#27272A]" aria-label="Featured Illumination Collection">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E61E2A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#27272A]">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#27272A] border border-[#3F3F46] px-3.5 py-1.5 rounded-full shadow-xs mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E61E2A] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#F43F5E] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 fill-current text-amber-400" />
                FEATURED STUDIO DROP • FLAT ₹999
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Core Reactor &amp; Levitating Lamp
              {saleActive && (
                <span className="hidden sm:inline-block text-xs font-medium bg-[#E61E2A] text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {SALE_CONFIG.PROMOTION_LABEL}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 max-w-xl font-normal leading-relaxed">
              Studio direct pricing. Elevate your desk sanctuary with benchmark ambient lighting at <strong className="text-white">flat ₹999</strong> with {DELIVERY_PROMISE.toLowerCase()}.
            </p>
          </div>

          {/* Delivery & Dispatch Badge */}
          <div className="flex flex-col items-start md:items-end gap-1.5 bg-[#202024] p-4 rounded-2xl border border-[#3F3F46] shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>{DELIVERY_PROMISE}</span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-semibold text-white block">Priority Air Dispatch</span>
              <span className="text-[10.5px] text-[#A1A1AA]">Bluedart Express Air • Live SMS Tracking</span>
            </div>
          </div>
        </div>

        {/* 2-Column High-Impact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Core Reactor Desk Light */}
          {coreReactor && (
            <div className="bg-[#202024] rounded-2xl border border-[#3F3F46] hover:border-[#E61E2A]/50 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#E61E2A]/15 border border-[#E61E2A]/30 text-[#FB7185] px-2.5 py-1 rounded-md">
                      <Flame className="w-3 h-3 fill-current text-[#E61E2A]" />
                      FEATURED PIECE
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mt-2 group-hover:text-[#FB7185] transition-colors">
                      {coreReactor.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-1">
                      Breathing Core LED • Weighted Desk Stand • USB-C Powered
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl sm:text-[26px] font-bold text-[#F43F5E] tracking-tight">
                      {formatCurrency(coreReactor.priceMinor)}
                    </div>
                    {coreReactor.originalPriceMinor && coreReactor.originalPriceMinor > coreReactor.priceMinor && (
                      <div className="text-xs text-[#71717A] line-through">
                        {formatCurrency(coreReactor.originalPriceMinor)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Media */}
                <Link href={`/product/${coreReactor.slug}`} className="block relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#121214] border border-[#27272A] mb-5">
                  <Image
                    src={coreReactor.images[0]?.url || 'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990'}
                    alt={coreReactor.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Ambient Light Diffusion • Breathing Core</span>
                  </div>
                </Link>

                {/* Delivery & Payment Assurance */}
                <div className="mb-5 bg-[#18181B] p-3 rounded-xl border border-[#27272A] text-xs">
                  <div className="flex items-center justify-between text-[#E4E4E7] font-medium mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Truck className="w-3.5 h-3.5" /> {DELIVERY_PROMISE}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] leading-snug">
                    <strong className="text-white">Prepaid UPI:</strong> Flat {formatCurrency(coreReactor.priceMinor)} (Free Delivery) • <strong className="text-white">Partial COD:</strong> ₹249 advance + ₹750 at delivery
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleClaimDeal(coreReactor)}
                  className="flex-1 h-12 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-[#E61E2A] text-white hover:bg-[#F43F5E] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer touch-manipulation select-none"
                >
                  {addedSlug === coreReactor.slug ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Add to Cart • {formatCurrency(coreReactor.priceMinor)}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${coreReactor.slug}`}
                  className="h-12 px-4 rounded-xl text-xs font-medium bg-[#27272A] text-white hover:bg-[#3F3F46] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-[#3F3F46]"
                  aria-label="View Product Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Card 2: Levitating Money Stack Lamp */}
          {levitatingLamp && (
            <div className="bg-[#202024] rounded-2xl border border-[#3F3F46] hover:border-emerald-500/50 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md">
                      <Flame className="w-3 h-3 fill-current text-emerald-400" />
                      FLAGSHIP PIECE
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                      {levitatingLamp.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-1">
                      Magnetic Zero-Gravity Suspension • 360° Free Float • RGB Mood Lighting Base
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl sm:text-[26px] font-bold text-emerald-400 tracking-tight">
                      {formatCurrency(levitatingLamp.priceMinor)}
                    </div>
                    {levitatingLamp.originalPriceMinor && levitatingLamp.originalPriceMinor > levitatingLamp.priceMinor && (
                      <div className="text-xs text-[#71717A] line-through">
                        {formatCurrency(levitatingLamp.originalPriceMinor)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Media */}
                <Link href={`/product/${levitatingLamp.slug}`} className="block relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#121214] border border-[#27272A] mb-4">
                  <Image
                    src={
                      levitatingLamp.images[0]?.url ||
                      'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_1588xN.8339847604_sfk4.webp?v=1789717192'
                    }
                    alt={levitatingLamp.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Active Magnetic Zero-Gravity Levitation</span>
                  </div>
                </Link>

                {/* Key Highlights */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-[11px] font-medium text-[#D4D4D8]">
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> 15-20mm Mid-Air Float
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Continuous 360° Spin
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Magnetic Centering Guide
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> 12V 2A Power Adapter
                  </div>
                </div>

                {/* Delivery & Payment Assurance */}
                <div className="mb-5 bg-[#18181B] p-3 rounded-xl border border-[#27272A] text-xs">
                  <div className="flex items-center justify-between text-[#E4E4E7] font-medium mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Truck className="w-3.5 h-3.5" /> {DELIVERY_PROMISE}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] leading-snug">
                    <strong className="text-white">Prepaid UPI:</strong> Flat {formatCurrency(levitatingLamp.priceMinor)} (Free Delivery) • <strong className="text-white">Partial COD:</strong> ₹249 advance + ₹750 at delivery
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleClaimDeal(levitatingLamp)}
                  className="flex-1 h-12 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer touch-manipulation select-none"
                >
                  {addedSlug === levitatingLamp.slug ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Add to Cart • {formatCurrency(levitatingLamp.priceMinor)}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${levitatingLamp.slug}`}
                  className="h-12 px-4 rounded-xl text-xs font-medium bg-[#27272A] text-white hover:bg-[#3F3F46] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-[#3F3F46]"
                  aria-label="View Product Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-8 pt-6 border-t border-[#27272A] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-[#A1A1AA] select-none">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>{DELIVERY_PROMISE}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>7-Day Replacement Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant UPI &amp; Partial COD (₹249)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FB7185]" />
            <span>Bench Tested &amp; Calibrated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
