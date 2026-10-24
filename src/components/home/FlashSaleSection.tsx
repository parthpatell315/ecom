'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Zap, Clock, ShieldCheck, Truck, Sparkles, Check, ArrowRight, Flame } from 'lucide-react';
import { formatPriceRs } from '@/lib/currency';

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

  // 12-Hour Countdown Timer State (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 11,
    minutes: 48,
    seconds: 32,
  });

  // Track adding state per product
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  // Selected variant for GTA Lamp (slug: gta-6-vi-lightbox)
  const [selectedGtaVariantId, setSelectedGtaVariantId] = useState<string | null>(null);

  // Stable 12-Hour Timer calculation from a reference timestamp in localStorage or current session
  useEffect(() => {
    const STORAGE_KEY = 'flirta_12h_flash_end_v1';
    let endTime = 0;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        endTime = parseInt(stored, 10);
      }
      if (!endTime || isNaN(endTime) || endTime <= Date.now()) {
        // Reset to 12 hours from now
        endTime = Date.now() + 12 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, endTime.toString());
      }
    } catch {
      endTime = Date.now() + 11 * 3600 * 1000 + 48 * 60 * 1000;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const arcReactor = products.find((p) => p.slug === 'marvel-iron-man-arc-reactor-wireless-charger') || products[0];
  const levitatingLamp = products.find((p) => p.slug === 'levitating-money-stack-lamp-magnetic-floating-rgb-ambient-led-light') || products[1];

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

    setTimeout(() => {
      setAddedSlug(null);
    }, 2200);
  };

  return (
    <section className="relative py-12 md:py-16 bg-[#18181B] text-white overflow-hidden border-y border-[#27272A]" aria-label="12-Hour Flash Sale">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E61E2A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Strip with Live Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#27272A]">
          <div>
            {/* Live Pulsing Badge */}
            <div className="inline-flex items-center gap-2 bg-[#27272A] border border-[#3F3F46] px-3.5 py-1.5 rounded-full shadow-xs mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E61E2A] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#F43F5E] flex items-center gap-1.5">
                <Zap className="w-3 h-3 fill-current" />
                LIMITED 12-HOUR FLASH DROP • FLAT ₹999
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Arc Reactor & Levitating Lamp Drop
              <span className="hidden sm:inline-block text-xs font-medium bg-[#E61E2A] text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                Only 12 Hours
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1.5 max-w-xl font-normal leading-relaxed">
              Studio direct flash pricing. Claim our benchmark illuminated ambient desk pieces at <strong className="text-white">flat ₹999</strong> with free Pan-India delivery & 7-day replacement guarantee.
            </p>
          </div>

          {/* Luxury Digital Countdown Timer */}
          <div className="flex flex-col items-start md:items-end gap-2 bg-[#202024] p-4 rounded-2xl border border-[#3F3F46] shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#E61E2A]" />
              <span>Offer Closes In</span>
            </div>
            <div className="flex items-center gap-2 text-center select-none font-mono">
              {/* Hours */}
              <div className="bg-[#121214] border border-[#3F3F46] rounded-xl px-3 py-1.5 min-w-[54px]">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#71717A]">Hours</span>
              </div>
              <span className="text-lg font-bold text-[#71717A]">:</span>
              {/* Minutes */}
              <div className="bg-[#121214] border border-[#3F3F46] rounded-xl px-3 py-1.5 min-w-[54px]">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#71717A]">Mins</span>
              </div>
              <span className="text-lg font-bold text-[#71717A]">:</span>
              {/* Seconds */}
              <div className="bg-[#121214] border border-[#E61E2A]/40 rounded-xl px-3 py-1.5 min-w-[54px]">
                <span className="text-xl sm:text-2xl font-bold text-[#E61E2A] tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-[#E61E2A]/70">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column High-Impact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Marvel Iron Man Arc Reactor */}
          {arcReactor && (
            <div className="bg-[#202024] rounded-2xl border border-[#3F3F46] hover:border-[#E61E2A]/50 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#E61E2A]/15 border border-[#E61E2A]/30 text-[#FB7185] px-2.5 py-1 rounded-md">
                      <Flame className="w-3 h-3 fill-current text-[#E61E2A]" />
                      60% OFF FLASH DEAL
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mt-2 group-hover:text-[#FB7185] transition-colors">
                      {arcReactor.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-1">
                      Breathing Core LED • Weighted Desk Sanctuary • USB-C Powered
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl sm:text-[26px] font-bold text-[#F43F5E] tracking-tight">
                      {formatPriceRs(arcReactor.priceMinor)}
                    </div>
                    {arcReactor.originalPriceMinor && (
                      <div className="text-xs text-[#71717A] line-through">
                        {formatPriceRs(arcReactor.originalPriceMinor)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Media */}
                <Link href={`/product/${arcReactor.slug}`} className="block relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#121214] border border-[#27272A] mb-5">
                  <Image
                    src={arcReactor.images[0]?.url || 'https://cdn.shopify.com/s/files/1/0992/7816/0178/files/il_fullxfull.8281487299_9aq9.webp?v=1791795990'}
                    alt={arcReactor.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>0.12mm Precision 3D Printed • Breathing Core</span>
                  </div>
                </Link>

                {/* Urgency Progress Bar */}
                <div className="mb-5 bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#E61E2A]" /> Only 4 units remaining in today&apos;s drop
                    </span>
                    <span className="text-[11px] font-semibold text-[#FB7185]">84% Claimed</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#27272A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-[#E61E2A] w-[84%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleClaimDeal(arcReactor)}
                  className="flex-1 h-12 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider bg-[#E61E2A] text-white hover:bg-[#F43F5E] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer touch-manipulation select-none"
                >
                  {addedSlug === arcReactor.slug ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Claimed at ₹999! Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Claim Arc Reactor at ₹999</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${arcReactor.slug}`}
                  className="h-12 px-4 rounded-xl text-xs font-medium bg-[#27272A] text-white hover:bg-[#3F3F46] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-[#3F3F46]"
                  aria-label="View Arc Reactor Details"
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
                      60% OFF FLASH DEAL
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
                      {formatPriceRs(levitatingLamp.priceMinor)}
                    </div>
                    {levitatingLamp.originalPriceMinor && (
                      <div className="text-xs text-[#71717A] line-through">
                        {formatPriceRs(levitatingLamp.originalPriceMinor)}
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

                {/* Key Highlights Pill Box */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-[11px] font-medium text-[#D4D4D8]">
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> 15-20mm Mid-Air Float
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Continuous 360° Spin
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> Alignment Tool Included
                  </div>
                  <div className="bg-[#18181B] p-2 rounded-lg border border-[#27272A] flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span> 12V Power Adapter In Box
                  </div>
                </div>

                {/* Urgency Progress Bar */}
                <div className="mb-5 bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-emerald-400" /> Only 5 units remaining at ₹999
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400">82% Claimed</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#27272A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[82%] rounded-full" />
                  </div>
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
                      <span>Claimed at ₹999! Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Claim Levitating Lamp at ₹999</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${levitatingLamp.slug}`}
                  className="h-12 px-4 rounded-xl text-xs font-medium bg-[#27272A] text-white hover:bg-[#3F3F46] active:scale-95 transition-all flex items-center justify-center shrink-0 border border-[#3F3F46]"
                  aria-label="View Levitating Lamp Details"
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
            <span>Free Express Delivery ₹999+</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>7-Day Transit Replacement</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant UPI & Partial COD (₹249)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FB7185]" />
            <span>Handcrafted in India (0.12mm)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
