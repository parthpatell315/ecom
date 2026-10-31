'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, Loader2, SlidersHorizontal, X, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under-1000' | '1000-2000' | 'above-2000'>('all');
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

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
          setCategories(data.categories || []);
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
    if (inStockOnly) {
      params.set('inStock', 'true');
    }
    if (priceRange === 'under-1000') {
      params.set('maxPrice', '99900');
    } else if (priceRange === '1000-2000') {
      params.set('minPrice', '100000');
      params.set('maxPrice', '199900');
    } else if (priceRange === 'above-2000') {
      params.set('minPrice', '200000');
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
  }, [activeCategory, search, sortBy, inStockOnly, priceRange]);

  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setSortBy('featured');
    setInStockOnly(false);
    setPriceRange('all');
    router.push('/shop');
  };

  const hasActiveFilters =
    activeCategory !== 'all' || search.trim() !== '' || inStockOnly || priceRange !== 'all';

  return (
    <div className="bg-white min-h-screen text-[#1D1D1F]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#86868B] mb-8 font-normal" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
          <span className="text-black/20">/</span>
          <span className="text-[#1D1D1F] font-medium">Store</span>
          {activeCategory !== 'all' && (
            <>
              <span className="text-black/20">/</span>
              <span className="text-[#1D1D1F] capitalize font-medium">
                {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E61E2A]" />
            <span>Studio Collection Catalog</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
            Store.
          </h1>
          <p className="text-sm sm:text-base text-[#6E6E73] mt-3 leading-relaxed">
            The flagship destination for kinetic levitation sculptures, ambient mood lighting, and workstation architecture.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Top row: Category pills & Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#F5F5F7] p-3 sm:p-4 rounded-3xl border border-black/[0.04]">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#111827] text-white shadow-apple'
                    : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
                }`}
              >
                All Pieces
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.slug
                      ? 'bg-[#111827] text-white shadow-apple'
                      : 'bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-black/[0.06]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Controls: Search, Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full pl-8 pr-7 py-2 text-xs bg-white border border-black/[0.08] rounded-full focus:outline-none focus:ring-1 focus:ring-[#111827] text-[#111827] placeholder-[#86868B]"
                />
                <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-3 top-2.5" />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-[#86868B] hover:text-[#111827]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-black/[0.08] rounded-full text-[#111827] font-semibold focus:outline-none focus:ring-1 focus:ring-[#111827] cursor-pointer"
                aria-label="Sort products"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button
                type="button"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className={`sm:hidden p-2 rounded-full border text-xs font-semibold flex items-center justify-center transition-colors ${
                  showFiltersMobile
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#111827] border-black/[0.08]'
                }`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub row: Price & Stock Status filters */}
          <div className={`${showFiltersMobile ? 'flex' : 'hidden sm:flex'} flex-wrap items-center justify-between gap-3 px-2 text-xs`}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#86868B] font-medium mr-1">Price Range:</span>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-1000', label: 'Under ₹999' },
                { id: '1000-2000', label: '₹1,000 – ₹1,999' },
                { id: 'above-2000', label: '₹2,000+' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriceRange(p.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    priceRange === p.id
                      ? 'bg-[#111827] text-white font-semibold'
                      : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#111827]'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-black/10 mx-1 hidden sm:block" />

              {/* In Stock toggle */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  inStockOnly
                    ? 'bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300'
                    : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#111827]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                <span>In Stock Only</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-[#E61E2A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Reset Filters</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Product Count Row */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#86868B] font-medium px-1">
          <span>{products.length} {products.length === 1 ? 'Piece' : 'Pieces'} Found</span>
          <span>Free Express Air Delivery • Partial COD Supported</span>
        </div>

        {/* Product Grid State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-[#86868B]">
            <Loader2 className="w-8 h-8 animate-spin text-[#111827] mb-3" />
            <p className="text-xs uppercase tracking-wider font-semibold">Updating Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#F5F5F7] rounded-3xl border border-black/[0.04] p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#111827] flex items-center justify-center mx-auto mb-4 shadow-apple">
              <Search className="w-6 h-6 text-[#86868B]" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">No pieces matched your criteria</h3>
            <p className="text-xs text-[#6E6E73] mt-1.5 leading-relaxed">
              Try broadening your price range, searching another term, or viewing all catalog categories.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#111827] text-white hover:bg-black transition-all shadow-apple cursor-pointer"
            >
              Clear All Filters
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
          <Loader2 className="w-8 h-8 animate-spin text-[#111827]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
