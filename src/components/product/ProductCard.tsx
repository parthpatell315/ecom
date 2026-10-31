'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/currency';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Check, ArrowRight, Zap, Heart } from 'lucide-react';

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
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = React.useState(false);

  const primaryImage =
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80';
  const defaultVariantId = product.variants[0]?.id;
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setAdded(true);
    addItem(product.id, defaultVariantId, 1, {
      title: product.title,
      unitPriceMinor: product.priceMinor,
      image: primaryImage,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceMinor: product.priceMinor,
      image: primaryImage,
    });
  };

  const discountPercent =
    product.originalPriceMinor && product.originalPriceMinor > product.priceMinor
      ? Math.round(((product.originalPriceMinor - product.priceMinor) / product.originalPriceMinor) * 100)
      : 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-avian hover:shadow-avian-hover transition-all duration-300 overflow-hidden relative">
      {/* Clickable Image & Stage */}
      <Link href={`/product/${product.slug}`} prefetch={true} className="block relative overflow-hidden bg-[#F8FAFC]">
        <div className="relative aspect-[4/3] w-full overflow-hidden p-3 flex items-center justify-center">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-bold border border-emerald-300/40 shadow-xs">
                Save {discountPercent}%
              </span>
            </div>
          )}

          {/* Top-Right Heart Wishlist Trigger */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-400 hover:text-[#E53935] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? 'fill-[#E53935] text-[#E53935]' : 'stroke-current'
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {product.tagline && (
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
              {product.tagline}
            </span>
          )}

          <Link href={`/product/${product.slug}`} prefetch={true} className="block">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111827] group-hover:text-[#E53935] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          {/* Price Row */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] sm:text-[20px] font-extrabold text-[#111827] tracking-tight">
                {formatCurrency(product.priceMinor)}
              </span>
              {product.originalPriceMinor && (
                <span className="text-xs text-[#9CA3AF] line-through">
                  {formatCurrency(product.originalPriceMinor)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-[#16A34A] bg-[#DCFCE7]/70 px-2 py-0.5 rounded-full">
              Free Delivery
            </span>
          </div>

          {/* Action Button: Avian High-Converting Pill */}
          {hasMultipleVariants ? (
            <Link
              href={`/product/${product.slug}`}
              prefetch={true}
              className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#111827] text-white hover:bg-[#E53935] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation select-none shadow-xs"
            >
              <span>View Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E53935] text-white hover:bg-[#D32F2F] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 touch-manipulation select-none shadow-xs"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          )}

          {/* Partial COD hint */}
          <p className="text-[11px] text-[#6B7280] text-center mt-2 font-medium">
            or <strong className="text-[#111827]">₹149 Advance</strong> + {formatCurrency(Math.max(0, product.priceMinor - 14900))} on Delivery
          </p>
        </div>
      </div>
    </div>
  );
}
