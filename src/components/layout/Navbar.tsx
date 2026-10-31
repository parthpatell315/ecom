'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Search, ShoppingBag, Heart, User, Clock, PackageCheck } from 'lucide-react';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import { LiveSearchModal } from '@/components/layout/LiveSearchModal';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { totalWishlist, openWishlist } = useWishlist();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  // Countdown timer if SALE_END_DATE is active
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

  // Keyboard shortcut '/' to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const saleActive = isSaleActive(SALE_CONFIG.SALE_END_DATE) && timeLeft !== null;
  const announcementText = saleActive
    ? `Sale ends in ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
    : 'Free Pan-India Air Delivery • Partial COD Available (₹149 Advance Deposit)';

  return (
    <>
      <header className="sticky top-0 z-50 w-full select-none">
        {/* Top Running Marquee Strip matching WhiteLayer */}
        <div className="bg-[#111827] text-white text-[11px] font-bold tracking-wider py-2 overflow-hidden border-b border-white/10 uppercase select-none">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-6">
            <span>CASH ON DELIVERY AVAILABLE</span>
            <span className="text-white/40">•</span>
            <span>MADE IN INDIA</span>
            <span className="text-white/40">•</span>
            <span>FREE DELIVERY ON ORDERS ₹999+</span>
            <span className="text-white/40">•</span>
            <span>7-DAY REPLACEMENT IF DAMAGED</span>
            <span className="text-white/40">•</span>
            <span>CASH ON DELIVERY AVAILABLE</span>
            <span className="text-white/40">•</span>
            <span>MADE IN INDIA</span>
            <span className="text-white/40">•</span>
            <span>FREE DELIVERY ON ORDERS ₹999+</span>
            <span className="text-white/40">•</span>
            <span>7-DAY REPLACEMENT IF DAMAGED</span>
            <span className="text-white/40">•</span>
            <span>CASH ON DELIVERY AVAILABLE</span>
            <span className="text-white/40">•</span>
            <span>MADE IN INDIA</span>
            <span className="text-white/40">•</span>
            <span>FREE DELIVERY ON ORDERS ₹999+</span>
            <span className="text-white/40">•</span>
            <span>7-DAY REPLACEMENT IF DAMAGED</span>
          </div>
        </div>

        {/* WhiteLayer Modern Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-black/[0.06] transition-all">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[66px] flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 -ml-1.5 text-[#111827] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group" aria-label="White Layer">
                <span className="w-8 h-8 rounded-full border border-black/70 flex items-center justify-center text-[12px] font-black tracking-tight text-[#111827]">
                  WL
                </span>
                <span className="text-[17px] font-black tracking-wider text-[#111827] uppercase">
                  WHITE LAYER
                </span>
              </Link>
            </div>

            {/* Center: Search input bar matching WhiteLayer */}
            <form onSubmit={handleHeaderSearch} className="hidden md:flex flex-1 max-w-sm mx-4 relative">
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 pl-4 pr-9 text-xs bg-white border border-black/15 rounded-full text-[#111827] placeholder-neutral-400 focus:outline-none focus:border-black/50 transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111827] cursor-pointer" aria-label="Search">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Right: WhiteLayer Navigation links & Cart Bag */}
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold tracking-tight">
                <Link
                  href="/"
                  className={`transition-colors ${
                    pathname === '/' ? 'text-[#E61E2A] font-bold' : 'text-[#111827] hover:text-[#E61E2A]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className={`transition-colors ${
                    pathname === '/shop' ? 'text-[#E61E2A] font-bold' : 'text-[#111827] hover:text-[#E61E2A]'
                  }`}
                >
                  Shop
                </Link>
                <Link
                  href="/contact"
                  className={`transition-colors ${
                    pathname === '/contact' ? 'text-[#E61E2A] font-bold' : 'text-[#111827] hover:text-[#E61E2A]'
                  }`}
                >
                  Contact
                </Link>
                <Link
                  href="/about"
                  className={`transition-colors ${
                    pathname === '/about' ? 'text-[#E61E2A] font-bold' : 'text-[#111827] hover:text-[#E61E2A]'
                  }`}
                >
                  About Us
                </Link>
              </nav>

              {/* Shopping Bag Trigger Button matching WhiteLayer rounded circle */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                className="relative w-9 h-9 rounded-full border border-black/15 hover:border-black/40 flex items-center justify-center text-[#111827] transition-all cursor-pointer select-none"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E61E2A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-black/10 px-5 py-5 space-y-3 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full h-10 px-3.5 text-xs bg-[#F5F5F7] border border-black/10 rounded-xl text-[#86868B] flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#86868B]" />
              <span>Search ambient lighting, stands, docks...</span>
            </button>

            <div className="pt-2 divide-y divide-black/[0.06]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-[#111827]"
              >
                All Products
              </Link>
              <Link
                href="/shop?category=lamps"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm text-[#6E6E73] hover:text-[#111827]"
              >
                Lamps &amp; Illumination
              </Link>
              <Link
                href="/shop?category=stands"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm text-[#6E6E73] hover:text-[#111827]"
              >
                Stands &amp; Docks
              </Link>
              <Link
                href="/shop?category=clocks"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm text-[#6E6E73] hover:text-[#111827]"
              >
                Clocks &amp; Timepieces
              </Link>
              <Link
                href="/shop?category=games"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm text-[#6E6E73] hover:text-[#111827]"
              >
                Collectibles &amp; Games
              </Link>
              <Link
                href="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold text-[#E61E2A] hover:underline"
              >
                Track Your Order
              </Link>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="flex-1 h-10 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#E61E2A]" />
                  <span>Wishlist ({totalWishlist})</span>
                </button>
                <Link
                  href="/tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Track Order</span>
                </Link>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-[#86868B]">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
                  {user ? `Account (${user.name})` : 'Customer Sign In'}
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:underline">
                  Support &amp; Concierge
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Live Search Modal */}
      <LiveSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
