'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Menu, X, Search, ShoppingBag, Clock } from 'lucide-react';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import { DELIVERY_PROMISE } from '@/config/shipping';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Real Countdown calculation only when SALE_END_DATE is active in the future
  useEffect(() => {
    if (!SALE_CONFIG.SALE_END_DATE || !isSaleActive(SALE_CONFIG.SALE_END_DATE)) {
      setTimeLeft(null);
      return;
    }

    const targetTime = new Date(SALE_CONFIG.SALE_END_DATE).getTime();

    const updateTimer = () => {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const saleActive = isSaleActive(SALE_CONFIG.SALE_END_DATE) && timeLeft !== null;
  const announcementText = saleActive
    ? `Sale ends in ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
    : 'Free Pan-India Delivery • Partial COD Available (₹149 Advance, ₹850 at Doorstep)';

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* 1. Avian-Inspired High-Converting Top Utility Strip */}
      <div className="bg-[#E53935] text-white text-[12px] font-semibold tracking-wide py-2 px-4 text-center shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          {saleActive && <Clock className="w-3.5 h-3.5 text-white animate-pulse" />}
          <span>{announcementText}</span>
        </div>
      </div>

      {/* 2. Frosted Glass Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[58px] flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 -ml-1.5 text-[#111827] hover:opacity-70 transition-opacity"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Avian / Modern Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="flirta.network">
              <span className="w-7 h-7 rounded-lg bg-[#E53935] text-white flex items-center justify-center text-[12px] font-black tracking-tight shadow-xs">
                fn
              </span>
              <span className="text-[19px] font-bold tracking-tight text-[#111827]">
                flirta<span className="text-[#E53935]">.network</span>
              </span>
            </Link>
          </div>

          {/* Center: Apple-style Minimal Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-normal tracking-tight">
            <Link
              href="/shop"
              className={`transition-opacity hover:opacity-100 ${
                pathname === '/shop' ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              Store
            </Link>
            <Link
              href="/shop?category=lamps"
              className={`transition-opacity hover:opacity-100 ${
                pathname.includes('lamps') ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              Lamps
            </Link>
            <Link
              href="/shop?category=stands"
              className={`transition-opacity hover:opacity-100 ${
                pathname.includes('stands') ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              Stands &amp; Docks
            </Link>
            <Link
              href="/shop?category=clocks"
              className={`transition-opacity hover:opacity-100 ${
                pathname.includes('clocks') ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              Clocks
            </Link>
            <Link
              href="/about"
              className={`transition-opacity hover:opacity-100 ${
                pathname === '/about' ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-opacity hover:opacity-100 ${
                pathname === '/contact' ? 'text-[#1D1D1F] font-semibold opacity-100' : 'text-[#1D1D1F] opacity-75'
              }`}
            >
              Support
            </Link>
          </nav>

          {/* Right: Search Toggle & Bag */}
          <div className="flex items-center gap-3">
            {/* Inline expandable search or popover */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-fadeIn">
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 sm:w-60 h-8 pl-3 pr-8 text-xs bg-[#F5F5F7] border border-black/10 rounded-full text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2.5 text-[#86868B] hover:text-[#1D1D1F]"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full text-[#1D1D1F] opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Apple Shopping Bag Trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openCart();
              }}
              className="relative w-9 h-9 rounded-full text-[#1D1D1F] opacity-90 hover:opacity-100 active:scale-95 transition-all flex items-center justify-center cursor-pointer touch-manipulation"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center pointer-events-none shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/10 px-5 py-4 space-y-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-[#F5F5F7] border border-black/10 rounded-xl text-[#1D1D1F] placeholder:text-[#86868B]"
            />
            <button type="submit" className="absolute right-3 top-3 text-[#86868B]" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#1D1D1F] border-b border-gray-100"
          >
            Store
          </Link>
          <Link
            href="/shop?category=lamps"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#1D1D1F] border-b border-gray-100"
          >
            Lamps &amp; Illumination
          </Link>
          <Link
            href="/shop?category=stands"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#1D1D1F] border-b border-gray-100"
          >
            Stands &amp; Docks
          </Link>
          <Link
            href="/shop?category=clocks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#1D1D1F] border-b border-gray-100"
          >
            Clocks
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#1D1D1F] border-b border-gray-100"
          >
            About Studio
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#1D1D1F]"
          >
            Support &amp; Concierge
          </Link>
        </div>
      )}
    </header>
  );
}
