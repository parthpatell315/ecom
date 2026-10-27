'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  // Sync with searchParams
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const s = searchParams.get('search');
    if (s !== null) setSearch(s);
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch products with active filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'all') {
      params.set('category', activeCategory);
    }
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (sortBy) {
      params.set('sort', sortBy);
    }

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, search, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <div className="page-width py-8 md:py-14">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#86868B] mb-8 font-medium">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
          <span className="text-black/20">/</span>
          <span className="text-[#1D1D1F]">Store</span>
        </nav>

        {/* Page Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#86868B] font-medium block mb-2">
            The Studio Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
            Store.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] mt-3 leading-relaxed">
            The best way to buy the ambient lights, kinetic desk sculptures, and sanctuary architecture pieces you love.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-[#F5F5F7] p-3 sm:p-4 rounded-2xl border border-black/[0.04]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1D1D1F] text-white shadow-apple'
                  : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
              }`}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'bg-[#1D1D1F] text-white shadow-apple'
                    : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-black/[0.08] rounded-full focus:outline-none focus:border-[#1D1D1F] text-[#1D1D1F] placeholder-[#86868B]"
              />
              <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-black/[0.08] rounded-full text-[#1D1D1F] font-medium focus:outline-none focus:border-[#1D1D1F] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Count Row */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#86868B] font-medium px-1">
          <span>{products.length} {products.length === 1 ? 'Piece' : 'Pieces'} Available</span>
          <span>Free Pan-India Delivery • Partial COD Supported</span>
        </div>

        {/* Product Grid State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#86868B]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1D1D1F] mb-3" />
            <p className="text-xs uppercase tracking-wider font-medium">Loading Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F5F7] rounded-3xl border border-black/[0.04]">
            <p className="text-base font-semibold text-[#1D1D1F]">No pieces found matching your criteria</p>
            <p className="text-xs text-[#6E6E73] mt-1">Try resetting your filter or searching for another term.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearch('');
              }}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-medium bg-[#1D1D1F] text-white hover:bg-black transition-all shadow-apple cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1D1D1F]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
