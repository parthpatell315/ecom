'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addItem, openCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <aside
        aria-label="Saved Wishlist"
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out border-l border-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#E61E2A] fill-[#E61E2A]" />
            <h2 className="text-lg font-bold text-[#111827] tracking-tight">Saved Items</h2>
            <span className="text-xs font-bold text-white bg-[#E61E2A] px-2.5 py-0.5 rounded-full shadow-xs">
              {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={closeWishlist}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Tap the heart on any product to save it here for later.
              </p>
              <button
                type="button"
                onClick={closeWishlist}
                className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    fill
                    className="object-contain p-1.5"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeWishlist}
                        className="text-xs font-bold text-[#111827] hover:text-[#E61E2A] transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <strong className="text-sm font-bold text-[#111827] block mt-1">
                      {formatCurrency(item.priceMinor)}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await addItem(item.id, undefined, 1, {
                          title: item.title,
                          unitPriceMinor: item.priceMinor,
                          image: item.image,
                        });
                        closeWishlist();
                        openCart();
                      }}
                      className="flex-1 h-8 rounded-lg bg-[#E61E2A] hover:bg-[#C81420] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={clearWishlist}
              className="w-full py-2.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Clear Entire Wishlist
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

