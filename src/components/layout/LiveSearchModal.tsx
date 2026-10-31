'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const popularSearches = [
    'Levitating Lamp',
    'Core Reactor',
    'Controller Stand',
    'ClockDock',
    'Laptop Stand',
    'Foldable Chess',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.06]">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ambient lighting, stands, floating sculptures..."
            className="w-full text-base sm:text-lg text-[#111827] placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            Esc
          </button>
        </form>

        {/* Search Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!query.trim() ? (
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-3">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#EAEAEF] text-xs font-medium text-[#111827] transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#E61E2A]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
                <span>{results.length} Products Found</span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-[#E61E2A] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View all in Store</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {results.map((product) => {
                  const image =
                    product.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80';
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-[#F5F5F7] transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          className="object-contain p-1"
                          sizes="60px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                          {product.category?.name || 'Studio Piece'}
                        </div>
                        <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#E61E2A] transition-colors truncate">
                          {product.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <strong className="text-sm font-bold text-[#111827] block">
                          {formatCurrency(product.priceMinor)}
                        </strong>
                        <span className="text-[10.5px] font-medium text-emerald-600">
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-[#111827]">No products matched &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try another search keyword or browse all catalog pieces.</p>
              <button
                type="button"
                onClick={() => {
                  router.push('/shop');
                  onClose();
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

