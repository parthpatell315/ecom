'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        onTouchEnd={(e) => {
          e.preventDefault();
          closeCart();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Avian Inspired Slide-Over Cart Drawer */}
      <aside
        aria-label="Shopping Cart"
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out border-l border-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#111827] tracking-tight">
              My Cart
            </h2>
            <span className="text-xs font-bold text-white bg-[#E61E2A] px-2.5 py-0.5 rounded-full shadow-xs">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 rounded-full text-gray-500 hover:text-[#111827] hover:bg-slate-100 active:scale-90 transition-all flex items-center justify-center cursor-pointer touch-manipulation"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#111827]">
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Free Pan-India Delivery Unlocked!
                </span>
              ) : (
                <>Add <strong className="text-[#E61E2A] font-bold">{formatCurrency(amountToFreeShipping)}</strong> more for Free Shipping</>
              )}
            </span>
            <span className="text-xs font-bold text-[#E61E2A]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E61E2A] transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-[#F8FAFC] text-gray-400 flex items-center justify-center mb-4 border border-slate-100">
                <ShoppingBag className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-1">Your cart is empty</h3>
              <p className="text-xs text-[#6B7280] max-w-xs mb-6 leading-relaxed">
                Explore our ambient levitating lamps, desk lights, and aesthetic sanctuary pieces.
              </p>
              <button
                onClick={closeCart}
                className="h-11 px-8 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#E61E2A] text-white hover:bg-[#C81420] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-colors"
              >
                {/* Photo Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
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
                      <h4 className="text-xs sm:text-sm font-bold text-[#111827] line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-[#E61E2A] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantName && (
                      <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
                        {item.variantName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 transition-colors text-gray-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#111827]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 transition-colors text-gray-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-[#111827]">
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
          <div className="p-6 border-t border-slate-100 bg-[#F8FAFC] space-y-4">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
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
                    placeholder="Coupon code (e.g. LAUNCH10)"
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E61E2A]"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#111827] text-white rounded-xl text-xs font-bold hover:bg-[#E61E2A] transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-[#E61E2A] mt-1 font-semibold">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#111827]">{formatCurrency(subtotalMinor)}</span>
              </div>
              {discountMinor > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Savings</span>
                  <span>-{formatCurrency(discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingMinor === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : formatCurrency(shippingMinor)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#111827] pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>{formatCurrency(finalTotalMinor)}</span>
              </div>
            </div>

            {/* Partial COD Notice (WhiteLayer Highlight) */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-snug">
              <strong className="font-bold text-amber-950">Partial COD Available:</strong> Pay ₹149 advance via UPI now to reserve courier; balance {formatCurrency(Math.max(0, finalTotalMinor - 14900))} payable at delivery.
            </div>

            {/* Checkout Action Button (WhiteLayer Red CTA) */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full h-12 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#E61E2A] hover:bg-[#C81420] text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280] font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe Payments • 7-Day Free Replacement</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
