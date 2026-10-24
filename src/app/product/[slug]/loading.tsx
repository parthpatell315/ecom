import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <span className="text-gray-300">/</span>
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <span className="text-gray-300">/</span>
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left: Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: Info & Actions Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-red-100 rounded-full" />
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>

            {/* Price Skeleton */}
            <div className="flex items-baseline gap-3 pt-2">
              <div className="h-8 w-32 bg-gray-200 rounded-lg" />
              <div className="h-5 w-20 bg-gray-100 rounded" />
              <div className="h-5 w-16 bg-red-100 rounded" />
            </div>

            {/* Variant Pills Skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gray-100 rounded-xl border border-gray-200" />
                <div className="h-10 w-24 bg-gray-100 rounded-xl border border-gray-200" />
              </div>
            </div>

            {/* Quantity and Add to Cart Button Skeleton */}
            <div className="pt-4 space-y-3">
              <div className="h-12 w-full bg-[#1D1D20]/80 rounded-xl" />
              <div className="h-12 w-full bg-red-600/80 rounded-xl" />
            </div>

            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl border border-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
