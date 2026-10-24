'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const { items, totalItems, subtotalMinor, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountMinor: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 99900; // ₹999
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalMinor);
  const freeShippingProgress = Math.min(100, Math.round((subtotalMinor / FREE_SHIPPING_THRESHOLD) * 100));

  const discountMinor = appliedCoupon ? appliedCoupon.discountMinor : 0;
  const shippingMinor = subtotalMinor === 0 || subtotalMinor >= FREE_SHIPPING_THRESHOLD ? 0 : 9900;
  const finalTotalMinor = Math.max(0, subtotalMinor - discountMinor + shippingMinor);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotalMinor }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountMinor: data.coupon.discountMinor,
        });
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        onTouchEnd={(e) => {
          e.preventDefault();
          closeCart();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white border-l border-[#E5E0D5] shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="p-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h2 className="text-base font-semibold text-[#222225] flex items-center gap-2">
              Your Bag
              <span className="text-xs font-semibold text-[#E61E2A] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'piece' : 'pieces'}
              </span>
            </h2>
            <p className="text-xs text-[#8C827A] mt-0.5">Complimentary delivery on orders over ₹999</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 rounded-full text-gray-500 hover:text-[#222225] hover:bg-gray-100 active:scale-90 transition-all flex items-center justify-center cursor-pointer touch-manipulation"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-[#FFF5F6] border-b border-[#E61E2A]/15">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#222225]">
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Free Pan-India Delivery Qualified!
                </span>
              ) : (
                <>Add <strong className="text-[#E61E2A]">{formatCurrency(amountToFreeShipping)}</strong> more for Free Shipping</>
              )}
            </span>
            <span className="text-[11px] font-semibold text-[#E61E2A]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E61E2A] transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E0D5] text-[#E61E2A] flex items-center justify-center mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#222225] mb-1">Your bag is empty</h3>
              <p className="text-xs text-[#5C554B] max-w-xs mb-6">
                Explore our ambient lighting, controller stands, and perpetual desk architecture.
              </p>
              <button
                onClick={closeCart}
                className="py-2.5 px-6 text-xs font-medium rounded-xl bg-[#222225] text-white hover:bg-[#E61E2A] transition-colors shadow-sm cursor-pointer"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-[#F0EAE1] last:border-0"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] flex-shrink-0 border border-[#E8E2D5]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-medium text-[#222225] line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-[#E61E2A] transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.variantName && (
                      <span className="text-[11px] text-[#8C827A] font-medium block mt-0.5">
                        {item.variantName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E5E0D5] rounded-lg overflow-hidden bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 transition-colors text-gray-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-medium text-[#222225]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 transition-colors text-gray-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-[#222225]">
                      {formatCurrency(item.totalMinor)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#F0EAE1] bg-[#FAF8F5] space-y-4">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                    <span className="text-emerald-700">(-{formatCurrency(appliedCoupon.discountMinor)})</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-emerald-800 hover:text-red-600 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. LAUNCH10)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#E5E0D5] rounded-xl focus:outline-none focus:border-[#E61E2A]"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#222225] text-white rounded-xl text-xs font-medium hover:bg-[#E61E2A] transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-[#E61E2A] mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#5C554B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#222225]">{formatCurrency(subtotalMinor)}</span>
              </div>
              {discountMinor > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                <span>{shippingMinor === 0 ? <strong className="text-emerald-700">FREE</strong> : formatCurrency(shippingMinor)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#222225] pt-2 border-t border-[#E8E2D5]">
                <span>Total Due</span>
                <span>{formatCurrency(finalTotalMinor)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#E61E2A] text-white hover:bg-[#C81420] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C827A] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Instant UPI Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
