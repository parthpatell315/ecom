'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';

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
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="page-width py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#78716C] mb-6 font-medium">
          <a href="/" className="hover:text-[#222225] transition-colors">Home</a>
          <span className="text-gray-300">/</span>
          <span className="text-[#222225] font-medium">Products</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[10.5px] uppercase tracking-widest text-[#B45309] font-medium block mb-1">
            flirta.network Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#222225]">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-[#5C554B] mt-2.5 leading-relaxed">
            Discover precision 3D-crafted aesthetic home decor, ambient LED lamps, and modular desk architecture engineered for modern living.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 sm:p-4 rounded-2xl border border-[#E8E2D5] shadow-2xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#222225] text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-[#5C554B] hover:bg-[#F0EAE1]'
              }`}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'bg-[#222225] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#5C554B] hover:bg-[#F0EAE1]'
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
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl focus:outline-none focus:border-[#E61E2A] text-[#222225]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-[#222225] font-medium focus:outline-none focus:border-[#E61E2A]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Count Row */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#78716C] font-medium px-1">
          <span>Showing {products.length} Products</span>
          <span>Pan-India Dispatch within 24–48 Hours</span>
        </div>

        {/* Product Grid State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#E61E2A] mb-3" />
            <p className="text-xs uppercase tracking-wider font-semibold">Loading flirta.network Pieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E2D5]">
            <p className="text-base font-semibold text-[#222225]">No pieces found matching your criteria</p>
            <p className="text-xs text-gray-500 mt-1">Try resetting your filter or searching for another term.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearch('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider bg-[#222225] text-white hover:bg-[#E61E2A] transition-colors"
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
          <Loader2 className="w-8 h-8 animate-spin text-[#E61E2A]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
