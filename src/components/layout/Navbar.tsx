'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Search, ShoppingBag, Heart, User, Clock, PackageCheck } from 'lucide-react';
import { SALE_CONFIG, isSaleActive } from '@/config/sale';
import { LiveSearchModal } from '@/components/layout/LiveSearchModal';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { totalWishlist, openWishlist } = useWishlist();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

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
        {/* Top Announcement Strip */}
        <div className="bg-[#111827] text-white text-[11.5px] font-semibold tracking-wide py-2 px-4 text-center border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            {saleActive ? (
              <Clock className="w-3.5 h-3.5 text-[#E53935] animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span>{announcementText}</span>
          </div>
        </div>

        {/* Frosted Glass Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-black/[0.06] transition-all">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[62px] flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 -ml-1.5 text-[#1D1D1F] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group" aria-label="flirta.network">
                <span className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center text-[13px] font-black tracking-tight shadow-xs group-hover:bg-[#E53935] transition-colors">
                  fn
                </span>
                <span className="text-[19px] font-bold tracking-tight text-[#111827]">
                  flirta<span className="text-[#E53935]">.network</span>
                </span>
              </Link>
            </div>

            {/* Center: Apple-style Minimal Horizontal Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-tight">
              <Link
                href="/shop"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname === '/shop' ? 'text-[#E53935] font-bold' : 'text-[#1D1D1F]'
                }`}
              >
                Store
              </Link>
              <Link
                href="/shop?category=lamps"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname.includes('lamps') ? 'text-[#E53935] font-bold' : 'text-[#6E6E73]'
                }`}
              >
                Lamps &amp; Illumination
              </Link>
              <Link
                href="/shop?category=stands"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname.includes('stands') ? 'text-[#E53935] font-bold' : 'text-[#6E6E73]'
                }`}
              >
                Stands &amp; Docks
              </Link>
              <Link
                href="/shop?category=clocks"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname.includes('clocks') ? 'text-[#E53935] font-bold' : 'text-[#6E6E73]'
                }`}
              >
                Clocks
              </Link>
              <Link
                href="/about"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname === '/about' ? 'text-[#E53935] font-bold' : 'text-[#6E6E73]'
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`transition-colors hover:text-[#E53935] ${
                  pathname === '/contact' ? 'text-[#E53935] font-bold' : 'text-[#6E6E73]'
                }`}
              >
                Support
              </Link>
            </nav>

            {/* Right: Search, Wishlist, Account & Shopping Bag */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full text-[#1D1D1F] hover:bg-black/[0.04] transition-all flex items-center justify-center cursor-pointer"
                aria-label="Search catalog"
                title="Search (Press /)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Trigger */}
              <button
                type="button"
                onClick={openWishlist}
                className="relative w-9 h-9 rounded-full text-[#1D1D1F] hover:bg-black/[0.04] transition-all flex items-center justify-center cursor-pointer"
                aria-label="View saved wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {totalWishlist > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center pointer-events-none shadow-xs">
                    {totalWishlist}
                  </span>
                )}
              </button>

              {/* Account / User Trigger */}
              <Link
                href="/account"
                className="w-9 h-9 rounded-full text-[#1D1D1F] hover:bg-black/[0.04] transition-all flex items-center justify-center cursor-pointer"
                aria-label="Account"
                title={user ? user.name : 'Account'}
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                className="relative h-9 px-3 rounded-full bg-[#111827] text-white hover:bg-black active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation shadow-xs"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                <span className="text-xs font-bold">{totalItems}</span>
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

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="flex-1 h-10 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#E53935]" />
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
