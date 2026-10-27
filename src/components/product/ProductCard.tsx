'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import { Check } from 'lucide-react';

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    priceMinor: number;
    originalPriceMinor?: number | null;
    badge?: string | null;
    inStock: boolean;
    images: { url: string; altText?: string | null }[];
    variants: { id: string; name: string; colorHex: string }[];
  };
}

export function ProductCard({ product }: { product: ProductCardProps['product'] }) {
  const { addItem, isLoading } = useCart();
  const [added, setAdded] = React.useState(false);

  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80';
  const defaultVariantId = product.variants[0]?.id;
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addItem(product.id, defaultVariantId, 1, {
      title: product.title,
      unitPriceMinor: product.priceMinor,
      image: primaryImage,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.originalPriceMinor && product.originalPriceMinor > product.priceMinor
    ? Math.round(((product.originalPriceMinor - product.priceMinor) / product.originalPriceMinor) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-[#EBEBEB] shadow-luxury shadow-luxury-hover transition-all duration-300 overflow-hidden">
      {/* Clickable Image & Header Link with Prefetch */}
      <Link href={`/product/${product.slug}`} prefetch={true} className="block active:opacity-90 transition-opacity">
        {/* Media Frame (Clean 1:1 Square) */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#F9FAFB]">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Authentic Black Discount Tag */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block py-1 px-2.5 rounded bg-[#222225] text-white text-[10.5px] font-medium tracking-wider uppercase shadow-xs">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <Link href={`/product/${product.slug}`} prefetch={true} className="block">
          {/* Title */}
          <h3 className="text-[14px] sm:text-[14.5px] font-medium text-[#222225] group-hover:text-[#E61E2A] transition-colors line-clamp-2 min-h-[44px] leading-snug">
            {product.title}
          </h3>
        </Link>

        <div className="mt-3 pt-2">
          {/* Price Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] sm:text-[17px] font-semibold text-[#222225] tracking-tight">
                {formatCurrency(product.priceMinor)}
              </span>
              {product.originalPriceMinor && (
                <span className="text-xs text-[#9CA3AF] line-through">
                  {formatCurrency(product.originalPriceMinor)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] font-medium bg-[#222225] text-white px-2 py-0.5 rounded tracking-wide">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Action Button: Choose Options for multi-variant or Add to Cart for single */}
          {hasMultipleVariants ? (
            <Link
              href={`/product/${product.slug}`}
              prefetch={true}
              className="w-full h-[44px] rounded-lg text-xs font-medium uppercase tracking-[0.06em] bg-[#222225] text-white hover:bg-[#38383D] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-sm touch-manipulation select-none"
            >
              Choose Options
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="w-full h-[44px] rounded-lg text-xs font-medium uppercase tracking-[0.06em] bg-[#222225] text-white hover:bg-[#38383D] active:scale-[0.98] active:bg-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 touch-manipulation select-none"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
